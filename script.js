import { initSectionNavigation } from './interactions.mjs';

const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
function applyTheme(theme) {
  root.dataset.theme = theme;
  themeButton.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#101112' : '#fafaf8';
}
try {
  const saved = localStorage.getItem('neev-portfolio-theme');
  if (saved === 'dark' || saved === 'light') applyTheme(saved);
} catch { /* Storage is optional. */ }
themeButton.addEventListener('click', () => {
  const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(theme);
  try { localStorage.setItem('neev-portfolio-theme', theme); } catch { /* Storage is optional. */ }
});

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  nav.classList.remove('is-open');
}
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

document.querySelector('#year').textContent = new Date().getFullYear();

initSectionNavigation();

// Scroll to in-page sections without adding #section to the URL.
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
  const target = document.getElementById(link.hash.slice(1));
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView();
  if (!target.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT)$/.test(target.tagName)) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
});
if (location.hash) history.replaceState(null, '', location.pathname + location.search);
