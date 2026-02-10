import test from 'node:test';
import assert from 'node:assert/strict';

import BossPhaseSystem from '../../build/level/systems/BossPhaseSystem.js';

test('BossPhaseSystem health bar image is clamped to valid range', () => {
  const low = BossPhaseSystem.getHealthBarImage(-5);
  const high = BossPhaseSystem.getHealthBarImage(999);

  assert.equal(low.endsWith('bossbar_00.png'), true);
  assert.equal(high.endsWith('bossbar_25.png'), true);
});

test('BossPhaseSystem summon interval uses phase thresholds', () => {
  assert.equal(BossPhaseSystem.getSummonInterval(20, 3000), 3000);
  assert.equal(BossPhaseSystem.getSummonInterval(15, 3000), 2400);
  assert.equal(BossPhaseSystem.getSummonInterval(8, 3000), 1800);
});

test('BossPhaseSystem resolves cardinal direction by dominant axis', () => {
  assert.equal(BossPhaseSystem.resolveDirection(0, 0, 100, 20), 'E');
  assert.equal(BossPhaseSystem.resolveDirection(0, 0, -100, 20), 'W');
  assert.equal(BossPhaseSystem.resolveDirection(0, 0, 20, -100), 'N');
  assert.equal(BossPhaseSystem.resolveDirection(0, 0, 20, 100), 'S');
});

test('BossPhaseSystem creates three-way spread vectors', () => {
  const spread = BossPhaseSystem.createSpreadVectors('E', 2, 1);

  assert.equal(spread.length, 3);
  assert.deepEqual(spread[0], { velocityX: 2, velocityY: 0 });
  assert.deepEqual(spread[2], { velocityX: 2, velocityY: -1 });
});
