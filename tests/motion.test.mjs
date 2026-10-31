import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { rallyAt } from '../pong.mjs';

function boot(reduced) {
  const elements = new Map();
  const element = selector => {
    if (!elements.has(selector)) elements.set(selector, {
      attrs: {}, style: {}, dataset: {}, callbacks: {}, hidden: false,
      setAttribute(key, value) { this.attrs[key] = value; },
      getAttribute(key) { return this.attrs[key]; },
      addEventListener(type, callback) { this.callbacks[type] = callback; },
      querySelectorAll() { return []; },
    });
    return elements.get(selector);
  };
  const frames = [];
  const media = { matches: reduced, addEventListener(type, callback) { this.change = callback; } };
  const win = { scrollY: 720, callbacks: {}, addEventListener(type, callback) { this.callbacks[type] = callback; } };
  const doc = { documentElement: element('root'), querySelector: element, addEventListener() {} };
  const context = vm.createContext({ document: doc, window: win, rallyAt, initSectionScoreboard() {}, matchMedia: () => media,
    localStorage: { getItem() { return null; } }, requestAnimationFrame(callback) { frames.push(callback); } });
  const source = readFileSync(new URL('../script.js', import.meta.url), 'utf8').replace(/^import[^\n]+\n/gm, '');
  vm.runInContext(source, context);
  return { element, win, media, frames, flush() { while (frames.length) frames.shift()(); } };
}

test('reduced motion keeps the scene still and reacts to preference changes', () => {
  const app = boot(true);
  const ball = app.element('#pong-ball');
  const original = { ...ball.attrs };
  app.win.scrollY = 1400;
  app.win.callbacks.scroll();
  assert.equal(app.frames.length, 0);
  assert.deepEqual(ball.attrs, original);
  app.media.matches = false;
  app.media.change();
  assert.notDeepEqual(ball.attrs, original);
});

test('scroll frames coalesce and update the rally at the latest position', () => {
  const app = boot(false);
  app.win.scrollY = 1200;
  for (let i = 0; i < 15; i++) app.win.callbacks.scroll();
  assert.equal(app.frames.length, 1);
  app.flush();
  const ball = app.element('#pong-ball');
  const original = { ...ball.attrs };
  app.win.scrollY = 1900;
  app.win.callbacks.scroll();
  assert.equal(app.frames.length, 1);
  app.flush();
  assert.notDeepEqual(ball.attrs, original);
});
