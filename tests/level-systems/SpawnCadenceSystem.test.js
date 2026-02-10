import test from 'node:test';
import assert from 'node:assert/strict';

import SpawnCadenceSystem from '../../build/level/systems/SpawnCadenceSystem.js';

test('SpawnCadenceSystem keeps base interval at zero progress', () => {
  const interval = SpawnCadenceSystem.calculateAdaptiveInterval(1000, 0, 0.25, 300);
  assert.equal(interval, 1000);
});

test('SpawnCadenceSystem accelerates spawn as progress increases', () => {
  const interval = SpawnCadenceSystem.calculateAdaptiveInterval(1000, 1, 0.25, 300);
  assert.equal(interval, 750);
});

test('SpawnCadenceSystem respects minimum interval and multiplier', () => {
  const interval = SpawnCadenceSystem.calculateAdaptiveInterval(1000, 1, 0.8, 500, 0.5);
  assert.equal(interval, 500);
});
