import test from 'node:test';
import assert from 'node:assert/strict';

import WormDuplicationSystem from '../../build/level/systems/WormDuplicationSystem.js';

test('WormDuplicationSystem decides duplication for level thresholds', () => {
  assert.equal(WormDuplicationSystem.shouldDuplicate(3, 2000, 500), true);
  assert.equal(WormDuplicationSystem.shouldDuplicate(3, 1500, 500), false);
  assert.equal(WormDuplicationSystem.shouldDuplicate(4, 3000, 900), true);
  assert.equal(WormDuplicationSystem.shouldDuplicate(4, 3000, 1000), false);
});

test('WormDuplicationSystem only duplicates worm-like items', () => {
  const items = [{ getPosX: () => 30, getPosY: () => 40 }];
  const duplicates = WormDuplicationSystem.createDuplicates({ width: 100, height: 100 }, items);
  assert.equal(duplicates.length, 0);
});
