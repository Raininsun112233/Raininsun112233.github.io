(() => {
  const email = 'rain802010@163.com';
  const copyButton = document.getElementById('copy-email');
  const copyStatus = document.getElementById('copy-status');
  const statusButton = document.querySelector('.ask-status');
  const statusOptions = document.getElementById('ask-status-options');
  let resetTimer;

  copyButton.addEventListener('click', async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const input = document.createElement('textarea');
        input.value = email;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.append(input);
        input.select();
        const copied = document.execCommand('copy');
        input.remove();
        if (!copied) throw new Error('Copy failed');
      }
      copyStatus.textContent = 'Copied!';
    } catch {
      copyStatus.textContent = 'Could not copy. Please select the email address above.';
    }
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => { copyStatus.textContent = ''; }, 1400);
  });

  statusButton.addEventListener('click', () => {
    const opening = statusOptions.hidden;
    statusOptions.hidden = !opening;
    statusButton.setAttribute('aria-expanded', String(opening));
  });
  statusOptions.addEventListener('click', event => {
    const option = event.target.closest('[data-status]');
    if (!option) return;
    const value = option.dataset.status;
    statusButton.querySelector('.ask-status-label').textContent = value;
    statusButton.dataset.status = value;
    statusOptions.hidden = true;
    statusButton.setAttribute('aria-expanded', 'false');
  });
  document.addEventListener('click', event => {
    if (!statusButton.contains(event.target) && !statusOptions.contains(event.target)) {
      statusOptions.hidden = true;
      statusButton.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      statusOptions.hidden = true;
      statusButton.setAttribute('aria-expanded', 'false');
    }
  });
})();
