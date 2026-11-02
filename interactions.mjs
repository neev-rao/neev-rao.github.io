const SECTIONS = [
  { id: 'home', label: 'Neev Rao' }, { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' }, { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Tools' }, { id: 'contact', label: 'Contact' },
];

// Visible area with a small center bias keeps short sections, such as Tools,
// selectable and prevents the navigation highlight from changing at every heading boundary.
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

export function initSectionNavigation() {
  const sections = SECTIONS.map(section => ({ ...section, element: document.getElementById(section.id) }));
  const navLinks = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
  let current = null;
  let queued = false;
  function update() {
    queued = false;
    const rects = sections.map(section => ({ id: section.id, ...getRect(section.element) }));
    const next = chooseSection(rects, window.innerHeight, window.scrollY,
      document.documentElement.scrollHeight, current || 'home');
    if (next === current) return;
    current = next;
    navLinks.forEach(link => {
      if (link.hash === `#${current}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function requestUpdate() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  window.addEventListener('pageshow', requestUpdate);
  document.fonts?.ready.then(requestUpdate);
  update();
}

function getRect(element) {
  const { top, bottom } = element.getBoundingClientRect();
  return { top, bottom };
}
