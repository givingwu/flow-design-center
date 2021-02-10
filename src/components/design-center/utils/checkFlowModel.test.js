/* eslint-disable no-undef */
import { checkBracketPairs } from './checkFlowModel'

/**
a || b
(a && b) || c
a || (b && c)
((a && b) || c) && d || e
(((a && b) || c) && d) || e
((a && b) || c) && (d || e)
 */
test('a || b', () => {
  expect(checkBracketPairs([{}, {}])).toBe(3);
});

test('null', () => {
  const n = null;
  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(n).not.toBeUndefined();
  expect(n).not.toBeTruthy();
  expect(n).toBeFalsy();
});

test('zero', () => {
  const z = 0;
  expect(z).not.toBeNull();
  expect(z).toBeDefined();
  expect(z).not.toBeUndefined();
  expect(z).not.toBeTruthy();
  expect(z).toBeFalsy();
});
