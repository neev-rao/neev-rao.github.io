const SECTIONS = [
  { id: 'home', label: 'Neev Rao' }, { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' }, { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Tools' }, { id: 'contact', label: 'Contact' },
];

// Visible area with a small center bias keeps short sections, such as Tools,
// selectable and prevents the score from changing at every heading boundary.
export function chooseSection(rects, viewportHeight, scrollY, pageHeight, previous = 'home') {
  if (scrollY <= 2) return 'home';
  if (scrollY + viewportHeight >= pageHeight - 2) return 'contact';
  const start = Math.min(110, viewportHeight * 0.18);
  const focus = start + (viewportHeight - start) * 0.4;
  const scores = rects.map(rect => ({ id: rect.id,
    score: Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, start))
      + (rect.top <= focus && rect.bottom > focus ? 100 : 0),
  }));
  const best = scores.reduce((a, b) => b.score > a.score ? b : a);
  const current = scores.find(item => item.id === previous);
  return current && current.score > 0 && best.score - current.score < 12 ? previous : best.id;
}

export function initSectionScoreboard({ reducedMotion }) {
  const board = document.querySelector('.scoreboard');
  if (!board) return;
  const label = board.querySelector('.scoreboard-label');
  const oldFlap = board.querySelector('.scoreboard-old');
  const newFlap = board.querySelector('.scoreboard-new');
  const index = board.querySelector('.scoreboard-index');
  const sections = SECTIONS.map(section => ({ ...section, element: document.getElementById(section.id) }));
  const navLinks = Array.from(document.querySelectorAll('.main-nav a'));
  let current = 'home';
  let animations = [];
  let queued = false;
  let revision = 0;

  function finishFlip() {
    revision++;
    animations.forEach(animation => animation.cancel());
    animations = [];
    oldFlap.hidden = newFlap.hidden = true;
  }
  function showSection(id) {
    if (id === current) return;
    const previousLabel = label.textContent;
    const section = sections.find(item => item.id === id);
    finishFlip();
    current = id;
    board.dataset.section = id;
    label.textContent = section.label;
    index.textContent = `${String(sections.indexOf(section) + 1).padStart(2, '0')} / 06`;
    navLinks.forEach(link => {
      if (link.hash === `#${id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (reducedMotion.matches) return;
    oldFlap.textContent = previousLabel;
    newFlap.textContent = section.label;
    oldFlap.hidden = newFlap.hidden = false;
    const version = revision;
    animations = [
      oldFlap.animate([{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(-90deg)' }],
        { duration: 190, easing: 'ease-in', fill: 'forwards' }),
      newFlap.animate([{ transform: 'rotateX(90deg)' }, { transform: 'rotateX(0deg)' }],
        { delay: 190, duration: 220, easing: 'ease-out', fill: 'both' }),
    ];
    Promise.all(animations.map(animation => animation.finished)).then(() => {
      if (version === revision) finishFlip();
    }).catch(() => {}); // A fast scroll cancels the old flip and shows the latest section.
  }
  function update() {
    queued = false;
    const rects = sections.map(section => ({ id: section.id, ...getRect(section.element) }));
    showSection(chooseSection(rects, window.innerHeight, window.scrollY,
      document.documentElement.scrollHeight, current));
  }
  function requestUpdate() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  window.addEventListener('pageshow', requestUpdate);
  reducedMotion.addEventListener('change', () => { finishFlip(); requestUpdate(); });
  document.fonts?.ready.then(requestUpdate);
  update();
}

function getRect(element) {
  const { top, bottom } = element.getBoundingClientRect();
  return { top, bottom };
}

export function initBevo({ reducedMotion }) {
  const trigger = document.querySelector('.ut-trigger');
  const popup = document.querySelector('#bevo-popup');
  if (!trigger || !popup) return;
  let dismissTimer;
  function hide() {
    clearTimeout(dismissTimer);
    popup.hidden = true;
    popup.classList.remove('is-celebrating');
    trigger.setAttribute('aria-expanded', 'false');
  }
  function show() {
    clearTimeout(dismissTimer);
    popup.classList.remove('is-celebrating');
    popup.hidden = false;
    const rect = trigger.getBoundingClientRect();
    const width = popup.offsetWidth;
    const height = popup.offsetHeight;
    popup.style.left = `${Math.max(12, Math.min(window.innerWidth - width - 12, rect.left + rect.width / 2 - width / 2))}px`;
    const above = rect.top - height - 14;
    popup.style.top = `${Math.max(12, above >= 85 ? above : Math.min(window.innerHeight - height - 12, rect.bottom + 14))}px`;
    // Restart a finite celebration on each intentional visit to the UT text.
    void popup.offsetWidth;
    if (!reducedMotion.matches) popup.classList.add('is-celebrating');
    trigger.setAttribute('aria-expanded', 'true');
    dismissTimer = setTimeout(hide, 3800);
  }
  trigger.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') show(); });
  trigger.addEventListener('focus', show);
  trigger.addEventListener('click', show);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') hide(); });
  window.addEventListener('scroll', hide, { passive: true });
  window.addEventListener('resize', hide, { passive: true });
}
