// Map court coordinates to the oblique SVG table.
export const HIT_U = 1.13;
export const LEG_DISTANCE = 560;
const CONTACTS = [-0.44, 0.38, -0.16, 0.52, -0.37, 0.12, 0.46, -0.28];
const lerp = (a, b, t) => a + (b - a) * t;
const contact = leg => CONTACTS[((leg % CONTACTS.length) + CONTACTS.length) % CONTACTS.length];

export function project(u, v, height = 0) {
  return { x: 390 + 265 * u - 45 * v, y: 307.5 + 30 * u + 97.5 * v - height };
}

// Deterministic: reversing scroll retraces exactly the same rally.
export function rallyAt(scrollDistance) {
  const progress = Math.max(0, Number.isFinite(scrollDistance) ? scrollDistance : 0) / LEG_DISTANCE + 0.16;
  const leg = Math.floor(progress);
  const t = progress - leg;
  const goingRight = leg % 2 === 0;
  const u = lerp(goingRight ? -HIT_U : HIT_U, goingRight ? HIT_U : -HIT_U, t);
  const v = lerp(contact(leg), contact(leg + 1), t);
  // Two bounces per flight; the ball clears the net at the midpoint.
  const height = 42 * Math.abs(Math.cos(2 * Math.PI * t));
  const surface = project(u, v);
  const ball = project(u, v, height);
  const leftV = goingRight ? lerp(contact(leg), contact(leg + 2), t) : contact(leg + 1);
  const rightV = goingRight ? contact(leg + 1) : lerp(contact(leg), contact(leg + 2), t);
  const left = project(-HIT_U, leftV, 42);
  const right = project(HIT_U, rightV, 42);
  const startImpact = Math.max(0, 1 - t / 0.12);
  const endImpact = Math.max(0, 1 - (1 - t) / 0.12);
  const leftImpact = goingRight ? startImpact : endImpact;
  const rightImpact = goingRight ? endImpact : startImpact;
  return { ball, surface, left, right, height, leg, t, leftImpact, rightImpact };
}

