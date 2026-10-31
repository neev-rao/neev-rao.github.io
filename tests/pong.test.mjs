import test from 'node:test';
import assert from 'node:assert/strict';
import { rallyAt, LEG_DISTANCE } from '../pong.mjs';

const at = (leg, t) => rallyAt((leg + t - 0.16) * LEG_DISTANCE);
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

test('every hit meets the receiving paddle without a discontinuity', () => {
  for (let leg = 1; leg <= 24; leg++) {
    const impact = at(leg, 0);
    const paddle = leg % 2 === 0 ? impact.left : impact.right;
    assert.ok(distance(impact.ball, paddle) < 0.001);
    const before = at(leg - 1, 1 - 0.000001);
    assert.ok(distance(before.ball, impact.ball) < 0.002);
    assert.ok(distance(before.left, impact.left) < 0.002);
    assert.ok(distance(before.right, impact.right) < 0.002);
  }
});

test('the ball bounces on both halves and clears the net', () => {
  for (let leg = 1; leg <= 8; leg++) {
    for (const t of [0.25, 0.75]) {
      assert.ok(at(leg, t).height < 0.001);
      assert.ok(distance(at(leg, t).ball, at(leg, t).surface) < 0.001);
    }
    assert.ok(at(leg, 0.5).height - 7 > 30, 'bottom of ball clears net');
    const first = at(leg, 0.2).ball.x;
    const second = at(leg, 0.7).ball.x;
    assert.equal(second > first, leg % 2 === 0, 'alternating direction');
  }
});

test('scrolling backward retraces the same rally', () => {
  const positions = Array.from({ length: 100 }, (_, i) => i * 53);
  const forward = positions.map(rallyAt);
  positions.toReversed().forEach((position, i) => {
    assert.deepEqual(rallyAt(position), forward[forward.length - i - 1]);
  });
  for (const value of [-100, NaN, Infinity]) assert.deepEqual(rallyAt(value), rallyAt(0));
});
