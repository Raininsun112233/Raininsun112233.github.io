const projects = {
  dig: {
    title: 'Want to dig in?', tag: '01 / FEATURED PROJECT', height: 2952, footer: 2852,
    facts: [['WHEN','Summer 2025'],['FORMAT','WeChat mini program'],['MY ROLE','Research verification & presentation'],['STATUS','Internal testing']],
    cover: { top: 543, type: 'dig', image: 'assets/dig-imgImage3.png', alt: 'Question mark and chopsticks project graphic' },
    rows: [
      [1143,'The starting point','Our team leader lives with chronic kidney disease. They felt that eating the wrong food — and potentially feeling unwell or needing hospital care — was a risk worth addressing. This personal concern became the starting point for our project.'],
      [1319,'The idea','Want to dig in? is a WeChat mini program that offers dietary information for people with chronic kidney disease. The aim is to help users explore food choices with more specific questions.'],
      [1495,'How it works','Users select the condition they want to ask about, then type a food into the input field. When the question is broad, the mini program offers more specific choices. For example, “chicken” leads to options such as legs, wings, skin and organ meats.'],
      [2378,'My contribution','I worked on the project introduction and presentation, and helped check the accuracy of the research. Our information sources included government websites and information provided by professional physicians.'],
      [2547,'Working together','Our team sometimes struggled to turn urgency into action. Communication helped us work through disagreements before they grew into bigger conflicts and keep the project moving.'],
      [2716,'Where it stands','The mini program is currently in internal testing. We have not collected feedback yet, so its impact remains to be evaluated.']
    ],
    evidence: { top: 1661, type: 'dig', image: 'assets/dig-imgProjectEvidenceTeamConversation.png', alt: 'Screenshot of a WeChat team conversation' }
  },
  games: {
    title: 'Mini Games', tag: 'PROJECT DETAILS', height: 2634, footer: 2534,
    facts: [['WHEN','June 2026 - present'],['FORMAT','Small games'],['MY ROLE','AI-assisted creation and testing'],['STATUS','Simple versions']],
    cover: { top: 519, type: 'games', images: [
      ['assets/games-imgChatGpt202610141925131.png','Chinese chess game screenshot'],
      ['assets/games-imgChatGpt202610141924111.png','International chess game screenshot']
    ]},
    rows: [
      [1115,'The starting point','I wanted something to play while waiting for AI tasks to finish. After starting to learn AI-assisted programming in June 2026, I began making small games of my own.'],
      [1245,'The idea','Turn a simple personal need into playable experiments: board games, card games, and a small airplane flying game.'],
      [1378,'How it works','The collection currently contains a few simple versions. I used DSH as the main creation tool and tried the games to identify problems.'],
      [2107,'My contribution','I tested the games and reported problems for DSH to repair. Two pieces could occupy one square, and sometimes two boards overlapped, hiding the pieces. I described these issues and asked DSH to fix them.'],
      [2268,'Why I selected it','These games show me trying new things and turning my own needs into something I can use. They are among my more complete projects so far.'],
      [2401,'Where it stands','A few simple versions exist so far. I plan to complete more projects during 2026.']
    ],
    evidence: { top: 1511, type: 'games', image: 'assets/games-imgImage6.png', alt: 'Pixel art landscape from Mini Games' }
  },
  iris: {
    title: 'IRIS', tag: 'PROJECT DETAILS', height: 2510, footer: 2410,
    facts: [['WHEN','2025'],['FORMAT','EniacXI hackathon'],['MY ROLE','Full software design / Codex'],['STATUS','Built; debugging incomplete']],
    cover: { top: 521, type: 'iris', image: 'assets/iris-imgChatGpt202610141912182.png', alt: 'IRIS eye-shaped communication symbol' },
    rows: [
      [1117,'The starting point','At the 鼎石 EniacXI hackathon in 2025, I worked on software to support communication for people with late-stage ALS.'],
      [1250,'The idea','Use eye-based interaction to let users communicate their needs. IRIS combines Apple’s built-in eye tracking with an interaction based on gaze duration and blinking.'],
      [1383,'How it works','IRIS uses Apple’s built-in eye tracking, with gaze duration and blinking used to interpret the user’s intended selection. In the current version, it can communicate the wrong information or fail to recognize the intended input.'],
      [1957,'My contribution','I designed all software parts of IRIS and used Codex to help create the implementation. I identified interface issues, including the settings button overlapping another button. The deadline left too little time for complete debugging.'],
      [2113,'Why I selected it','This was my first attempt at this kind of project. It taught me how to design a project from scratch, and it is among my more complete projects so far.'],
      [2246,'Where it stands','The software was built, but logic problems and other bugs remained. Eye-based input could be misinterpreted or go unrecognized, and overlapping controls still needed attention.']
    ],
    evidence: { top: 1540, type: 'iris', image: 'assets/iris-imgIrisDevicePhotoDragToPosition.png', alt: 'Photograph of the IRIS eye-tracking device prototype' }
  }
};

const project = projects[document.body.dataset.project];
const root = document.getElementById('project-root');
root.style.height = `${project.height}px`;
const escapeHtml = text => text.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const coverHtml = project.cover.type === 'games'
  ? `<div class="project-cover cover-games" style="top:${project.cover.top}px">${project.cover.images.map(([src,alt]) => `<img src="${src}" alt="${escapeHtml(alt)}">`).join('')}</div>`
  : `<div class="project-cover cover-${project.cover.type}" style="top:${project.cover.top}px"><img src="${project.cover.image}" alt="${escapeHtml(project.cover.alt)}"></div>`;

const renderRow = ([top,title,copy],index) => `<section class="project-row" style="top:${top}px" aria-label="${escapeHtml(title)}"><div class="row-label"><span>${String(index+1).padStart(2,'0')}</span><h2>${escapeHtml(title)}</h2></div><p>${escapeHtml(copy)}</p></section>`;

root.innerHTML = `
  <header class="site-header dark-header"><a class="wordmark" href="index.html">RAININSUN / PROJECT</a><nav aria-label="Site"><a href="index.html">ABOUT ME</a><span>/</span><a href="work.html">MY WORK</a><span>/</span><a href="ask.html">ASK ME</a></nav></header>
  <section class="project-intro"><p class="dark-eyebrow">${escapeHtml(project.tag)}</p><h1>${escapeHtml(project.title)}</h1><a class="back-to-work" href="work.html" aria-label="Back to My Work">← Back to My Work</a></section>
  <dl class="project-facts">${project.facts.map(([label,value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl>
  ${coverHtml}
  ${project.rows.slice(0,3).map(renderRow).join('')}
  <div class="project-evidence evidence-${project.evidence.type}" style="top:${project.evidence.top}px"><img src="${project.evidence.image}" alt="${escapeHtml(project.evidence.alt)}"></div>
  ${project.rows.slice(3).map((row,index) => renderRow(row,index+3)).join('')}
  <footer class="dark-footer" style="top:${project.footer}px"><span>${project.title === 'IRIS' ? 'Show empathy to others' : escapeHtml(project.title)}</span><a href="index.html">RAININSUN</a></footer>
`;
