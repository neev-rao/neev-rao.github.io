import test from 'node:test';
import assert from 'node:assert/strict';
import { chooseSection } from '../interactions.mjs';

const ids = ['home', 'about', 'experience', 'projects', 'skills', 'contact'];
const bounds = [0, 700, 1100, 2000, 3300, 3600, 4050];
const rectsAt = scroll => ids.map((id, i) => ({id, top: bounds[i] - scroll, bottom: bounds[i + 1] - scroll}));

test('the primary section follows forward and backward scrolling', () => {
  const cases = [[0,'home'],[600,'about'],[1100,'experience'],[2100,'projects'],[3210,'skills'],[3350,'contact']];
  for (const [scroll, expected] of [...cases, ...cases.toReversed()]) {
    assert.equal(chooseSection(rectsAt(scroll), 700, scroll, 4050), expected);
  }
});
test('short Tools section wins when it occupies the center of the screen', () => {
  assert.equal(chooseSection(rectsAt(3210), 700, 3210, 4050, 'projects'), 'skills');
});
test('bottom of page always resolves to Contact, including a tall viewport', () => {
  assert.equal(chooseSection(rectsAt(3350),700,3350,4050,'skills'), 'contact');
  assert.equal(chooseSection(rectsAt(3050),1000,3050,4050,'projects'), 'contact');
});
