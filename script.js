import { rallyAt } from './pong.mjs';
import { initSectionScoreboard, initBevo } from './interactions.mjs';

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

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
initSectionScoreboard({ reducedMotion });
initBevo({ reducedMotion });
const ball = document.querySelector('#pong-ball');
const shadow = document.querySelector('#ball-shadow');
const left = document.querySelector('#paddle-left');
const right = document.querySelector('#paddle-right');
const leftSwing = document.querySelector('#paddle-left-swing');
const rightSwing = document.querySelector('#paddle-right-swing');
const ring = document.querySelector('#hit-ring');
const trails = [document.querySelector('#ball-trail-1'), document.querySelector('#ball-trail-2')];
let queued = false;
let lastDistance = window.scrollY;

function moveCircle(element, position) {
  element.setAttribute('cx', position.x.toFixed(2));
  element.setAttribute('cy', position.y.toFixed(2));
}
function drawRally(distance) {
  const state = rallyAt(distance);
  moveCircle(ball, state.ball);
  moveCircle(shadow, state.surface);
  shadow.setAttribute('rx', (5 + state.height / 6).toFixed(2));
  shadow.style.opacity = String(0.35 - state.height / 200);
  left.setAttribute('transform', `translate(${state.left.x.toFixed(2)} ${state.left.y.toFixed(2)})`);
  right.setAttribute('transform', `translate(${state.right.x.toFixed(2)} ${state.right.y.toFixed(2)})`);
  leftSwing.setAttribute('transform', `rotate(${-12 + state.leftImpact * 24})`);
  rightSwing.setAttribute('transform', `rotate(${12 - state.rightImpact * 24})`);
  const impact = Math.max(state.leftImpact, state.rightImpact);
  moveCircle(ring, state.leftImpact > state.rightImpact ? state.left : state.right);
  ring.setAttribute('r', (14 + (1 - impact) * 18).toFixed(2));
  ring.setAttribute('opacity', (impact * 0.5).toFixed(2));
  const direction = Math.sign(distance - lastDistance) || 1;
  trails.forEach((trail, index) => moveCircle(trail, rallyAt(Math.max(0, distance - direction * (index + 1) * 9)).ball));
  lastDistance = distance;
}
function requestDraw() {
  if (queued || reducedMotion.matches) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    if (!reducedMotion.matches) drawRally(window.scrollY);
  });
}
function syncMotionPreference() {
  if (reducedMotion.matches) drawRally(0);
  else drawRally(window.scrollY);
}
reducedMotion.addEventListener('change', syncMotionPreference);
window.addEventListener('scroll', requestDraw, { passive: true });
window.addEventListener('resize', requestDraw, { passive: true });
window.addEventListener('pageshow', requestDraw);
syncMotionPreference();

