(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const applyTheme = theme => {
    root.dataset.theme = theme;
    themeButton.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#141917' : '#f6f5ef';
  };
  try {
    const saved = localStorage.getItem('neev-portfolio-theme');
    if (saved === 'dark' || saved === 'light') applyTheme(saved);
  } catch { /* The site also works when browser storage is unavailable. */ }
  themeButton.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
    try { localStorage.setItem('neev-portfolio-theme', theme); } catch { /* Optional preference. */ }
  });

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('is-open');
  };
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('is-open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });

  const filterGroup = document.querySelector('.project-filters');
  const cards = Array.from(document.querySelectorAll('.project-card'));
  filterGroup.hidden = false;
  filterGroup.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterGroup.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    cards.forEach(card => { card.hidden = filter !== 'all' && card.dataset.category !== filter; });
    const count = cards.filter(card => !card.hidden).length;
    document.querySelector('#project-count').textContent = `${count} projects shown.`;
  }));

  if ('IntersectionObserver' in window) {
    const links = Array.from(nav.querySelectorAll('a'));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -65% 0px' });
    links.forEach(link => observer.observe(document.querySelector(link.hash)));
  }
  document.querySelector('#year').textContent = new Date().getFullYear();
})();
