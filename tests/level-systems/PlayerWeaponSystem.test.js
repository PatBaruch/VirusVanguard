import test from 'node:test';
import assert from 'node:assert/strict';

import PlayerWeaponSystem from '../../build/level/systems/PlayerWeaponSystem.js';

test('PlayerWeaponSystem creates single shot on early levels', () => {
  const vectors = PlayerWeaponSystem.createBulletVectors(1, 'E', 2);

  assert.equal(vectors.length, 1);
  assert.deepEqual(vectors[0], {
    offsetX: 0,
    offsetY: 0,
    velocityX: 2,
    velocityY: 0,
  });
});

test('PlayerWeaponSystem creates dual shot on level 3', () => {
  const vectors = PlayerWeaponSystem.createBulletVectors(3, 'NE', 2);

  assert.equal(vectors.length, 2);
  assert.equal(vectors[1].offsetY, -30);
});

test('PlayerWeaponSystem creates triple shot on level 4+', () => {
  const vectors = PlayerWeaponSystem.createBulletVectors(5, 'W', 2);

  assert.equal(vectors.length, 3);
  assert.equal(vectors[0].velocityX, -2);
  assert.equal(vectors[1].velocityY, -1);
});

test('PlayerWeaponSystem returns empty vectors for unknown direction', () => {
  const vectors = PlayerWeaponSystem.createBulletVectors(2, 'INVALID', 2);
  assert.equal(vectors.length, 0);
});
