import test from 'node:test';
import assert from 'node:assert/strict';

import TransientUiSystem from '../../build/level/systems/TransientUiSystem.js';

test('TransientUiSystem updates popup ttl and vertical drift', () => {
  const popups = [{ text: '+10', x: 100, y: 200, ttl: 300 }];

  const updated = TransientUiSystem.updatePopups(popups, 100, 0.05);

  assert.equal(updated.length, 1);
  assert.equal(updated[0].ttl, 200);
  assert.equal(updated[0].y, 195);
});

test('TransientUiSystem removes expired popups', () => {
  const popups = [{ text: '+10', x: 100, y: 200, ttl: 80 }];
  const updated = TransientUiSystem.updatePopups(popups, 100, 0.05);
  assert.equal(updated.length, 0);
});
