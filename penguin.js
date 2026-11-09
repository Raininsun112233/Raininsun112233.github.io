// Edit these lines to change what the penguins say when clicked.
const penguinDialogues = [
  '这个家伙是个好人，有问题可以找他帮忙',
  '这个家伙很怕黑，晚上一直要开着灯，但是还要带眼罩',
  '这个家伙很爱打游戏，几乎每天都能看到他上线',
  '这个家伙每天上学要做两小时车（往返），真的是太惨了',
  '这个家伙手机里有着一堆鼠鼠表情包，真的无语死了',
  '这个家伙不是很擅长处理感情问题',
  '这个家伙完全不喜欢睡觉，最晚4：30才睡',
  '这个家伙每天能在电脑面前坐8个小时',
  '这个家伙经常买一些乱七八糟的东西还不用，还不如给我',
  '这个家伙很喜欢收集各种小东西，包括垃圾',
  '这个家伙嘴上说着不喜欢二次元，其实房间里一堆二次元的东西',
  '这个家伙曾经叱咤CS饰品市场，但是最后铩羽而归',
  '这个家伙在2024年8月配了一台电脑，真是赚翻了',
  '这个家伙非常随和，怎么开玩笑都不会生气的',
  '他身上经常有一包纸，需要可以来找他要',
  '可以找他考激光切割机使用证书，只需要回答1+1=？（bushi）',
  '这个家伙很重，连学校的秤都量不出来',
  '这个家伙的思维可能有些跳脱，记得跟上他的节奏',
  '这个家伙有一书架的书，可他从来没动过',
  '这个家伙情绪很稳定，几乎不用怕他突然暴起发难',
  '坏了，我的午饭忘带了',
  '你好，我是神秘小企鹅',
  '不要摸我啦，很痒的',
  '在摸我我就要琢你了',
  '抓不到气不气',
  '跑路了兄弟们跑路了'
];

(() => {
  const storageKey = 'raininsun-penguins-enabled';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'penguin-toggle';
  document.body.append(toggle);

  const random = (min, max) => min + Math.random() * (max - min);
  const penguins = [];
  let enabled = false;
  let dialogueQueue = [];
  let previousDialogue = null;

  function nextDialogue() {
    if (!dialogueQueue.length) {
      dialogueQueue = [...penguinDialogues];
      for (let i = dialogueQueue.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [dialogueQueue[i], dialogueQueue[j]] = [dialogueQueue[j], dialogueQueue[i]];
      }
      if (dialogueQueue.length > 1 && dialogueQueue.at(-1) === previousDialogue) {
        [dialogueQueue[0], dialogueQueue[dialogueQueue.length - 1]] =
          [dialogueQueue.at(-1), dialogueQueue[0]];
      }
    }
    previousDialogue = dialogueQueue.pop();
    return previousDialogue;
  }

  function addPenguin(index, edge) {
    const penguin = document.createElement('button');
    penguin.type = 'button';
    penguin.className = 'roaming-penguin';
    penguin.setAttribute('aria-label', `Drag or talk to penguin ${index + 1}`);
    const sprite = document.createElement('span');
    sprite.className = 'roaming-penguin-sprite';
    sprite.setAttribute('aria-hidden', 'true');
    const speech = document.createElement('span');
    speech.className = 'roaming-penguin-speech';
    speech.setAttribute('aria-live', 'polite');
    penguin.append(sprite, speech);
    document.body.append(penguin);
    const maxSpeechHeight = Math.max(...penguinDialogues.map(line => {
      speech.textContent = line;
      return speech.offsetHeight;
    }));
    speech.textContent = '';

    let active = true;
    let dragging = false;
    let pointerStart = null;
    let grabOffset = null;
    let lastDragEnd = -Infinity;
    let moveTimer;
    let speechTimer;
    let speechFrame;
    let moveToken = 0;

    const size = () => penguin.offsetWidth;
    const bounds = () => {
      const minY = Math.max(12, maxSpeechHeight + 16);
      return {
        minY,
        maxX: Math.max(12, innerWidth - size() - 12),
        maxY: Math.max(minY, innerHeight - size() - 12)
      };
    };
    const clamp = ({ x, y }) => {
      const { minY, maxX, maxY } = bounds();
      return {
        x: Math.min(maxX, Math.max(12, x)),
        y: Math.min(maxY, Math.max(minY, y))
      };
    };
    const place = ({ x, y }) => {
      penguin.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const currentPoint = () => {
      const rect = penguin.getBoundingClientRect();
      return { x: rect.left, y: rect.top };
    };
    const faceToward = (from, to) => {
      // The source image's beak points down, so down is the zero-degree direction.
      const angle = Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI - 90;
      penguin.style.setProperty('--face-angle', `${angle}deg`);
    };
    const scheduleMove = (callback, delay) => {
      clearTimeout(moveTimer);
      moveTimer = setTimeout(callback, delay);
    };
    const freeze = () => {
      moveToken += 1;
      const point = clamp(currentPoint());
      penguin.style.transition = 'none';
      place(point);
      return point;
    };

    function walk() {
      if (!active || dragging || reducedMotion.matches || document.hidden) return;
      const start = freeze();
      const { minY, maxX, maxY } = bounds();
      let destination = start;
      for (let attempt = 0; attempt < 8; attempt += 1) {
        destination = { x: random(12, maxX), y: random(minY, maxY) };
        if (Math.hypot(destination.x - start.x, destination.y - start.y) > 150) break;
      }
      const distance = Math.hypot(destination.x - start.x, destination.y - start.y);
      const duration = Math.min(7000, Math.max(1800, distance / 90 * 1000));
      const token = ++moveToken;
      faceToward(start, destination);
      penguin.style.transition = `transform ${duration}ms linear`;
      requestAnimationFrame(() => {
        if (active && !dragging && token === moveToken) place(destination);
      });
      scheduleMove(walk, duration);
    }

    function enter() {
      const { minY, maxX, maxY } = bounds();
      const middleX = random(12, maxX);
      const middleY = random(minY, maxY);
      const start = {
        top: { x: middleX, y: -size() - 20 },
        right: { x: innerWidth + 20, y: middleY },
        bottom: { x: middleX, y: innerHeight + 20 },
        left: { x: -size() - 20, y: middleY }
      }[edge];
      const destination = {
        top: { x: middleX, y: minY + 24 },
        right: { x: maxX - 24, y: middleY },
        bottom: { x: middleX, y: maxY - 24 },
        left: { x: 36, y: middleY }
      }[edge];
      penguin.style.transition = 'none';
      place(start);
      faceToward(start, destination);
      if (reducedMotion.matches) {
        place(clamp(destination));
        return;
      }
      const token = ++moveToken;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (!active || token !== moveToken) return;
        penguin.style.transition = 'transform 1100ms cubic-bezier(.2,.8,.2,1)';
        place(clamp(destination));
        scheduleMove(walk, 1100);
      }));
    }

    function positionSpeech() {
      const rect = penguin.getBoundingClientRect();
      const halfWidth = speech.offsetWidth / 2;
      const center = Math.min(innerWidth - halfWidth - 8,
        Math.max(halfWidth + 8, rect.left + rect.width / 2));
      speech.style.left = `${center - rect.left}px`;
      const tailLeft = Math.min(speech.offsetWidth - 16,
        Math.max(16, rect.left + rect.width / 2 - center + halfWidth));
      speech.style.setProperty('--tail-left', `${tailLeft}px`);
    }

    function showDialogue() {
      speech.textContent = nextDialogue();
      penguin.classList.remove('is-speaking');
      positionSpeech();
      penguin.classList.add('is-speaking');
      cancelAnimationFrame(speechFrame);
      const followPenguin = () => {
        positionSpeech();
        speechFrame = requestAnimationFrame(followPenguin);
      };
      speechFrame = requestAnimationFrame(followPenguin);
      clearTimeout(speechTimer);
      speechTimer = setTimeout(() => {
        penguin.classList.remove('is-speaking');
        cancelAnimationFrame(speechFrame);
      }, 5200);
    }

    penguin.addEventListener('click', () => {
      if (performance.now() - lastDragEnd < 400) return;
      showDialogue();
    });
    penguin.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      pointerStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
      penguin.setPointerCapture(event.pointerId);
    });
    penguin.addEventListener('pointermove', event => {
      if (!pointerStart || event.pointerId !== pointerStart.id) return;
      if (!dragging && Math.hypot(event.clientX - pointerStart.x,
        event.clientY - pointerStart.y) > 6) {
        clearTimeout(moveTimer);
        const point = freeze();
        grabOffset = { x: event.clientX - point.x, y: event.clientY - point.y };
        dragging = true;
        penguin.classList.add('is-dragging');
      }
      if (dragging) {
        place(clamp({ x: event.clientX - grabOffset.x,
          y: event.clientY - grabOffset.y }));
      }
    });
    const release = event => {
      if (!pointerStart || event.pointerId !== pointerStart.id) return;
      if (dragging) {
        lastDragEnd = performance.now();
        dragging = false;
        penguin.classList.remove('is-dragging');
        if (!reducedMotion.matches) scheduleMove(walk, 150);
      }
      pointerStart = null;
      grabOffset = null;
      if (penguin.hasPointerCapture(event.pointerId)) {
        penguin.releasePointerCapture(event.pointerId);
      }
    };
    penguin.addEventListener('pointerup', release);
    penguin.addEventListener('pointercancel', release);

    const onResize = () => {
      if (!active || dragging) return;
      freeze();
      if (!reducedMotion.matches) scheduleMove(walk, 300);
    };
    const onMotionChange = () => {
      if (!active || dragging) return;
      freeze();
      clearTimeout(moveTimer);
      if (!reducedMotion.matches) scheduleMove(walk, 300);
    };
    const onVisibilityChange = () => {
      if (!active || dragging) return;
      if (document.hidden) {
        freeze();
        clearTimeout(moveTimer);
      } else if (!reducedMotion.matches) {
        scheduleMove(walk, 300);
      }
    };
    addEventListener('resize', onResize);
    reducedMotion.addEventListener('change', onMotionChange);
    document.addEventListener('visibilitychange', onVisibilityChange);

    enter();
    return () => {
      active = false;
      moveToken += 1;
      clearTimeout(moveTimer);
      clearTimeout(speechTimer);
      cancelAnimationFrame(speechFrame);
      removeEventListener('resize', onResize);
      reducedMotion.removeEventListener('change', onMotionChange);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      penguin.remove();
    };
  }

  function setEnabled(next) {
    enabled = next;
    toggle.textContent = next ? 'Penguins: On' : 'Penguins: Off';
    toggle.setAttribute('aria-pressed', String(next));
    toggle.setAttribute('aria-label', next ? 'Hide penguins' : 'Show penguins');
    try { localStorage.setItem(storageKey, String(next)); } catch {}
    if (next) {
      const edges = innerWidth <= 600 ? ['left', 'right']
        : ['top', 'right', 'bottom', 'left'];
      edges.forEach((edge, index) => penguins.push(addPenguin(index, edge)));
    } else {
      while (penguins.length) penguins.pop()();
    }
  }

  toggle.addEventListener('click', () => setEnabled(!enabled));
  let previouslyEnabled = false;
  try { previouslyEnabled = localStorage.getItem(storageKey) === 'true'; } catch {}
  setEnabled(previouslyEnabled);
})();
