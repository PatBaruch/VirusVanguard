import test from 'node:test';
import assert from 'node:assert/strict';

import KeyListener from '../../build/KeyListener.js';
import PlayerMovementSystem from '../../build/level/systems/PlayerMovementSystem.js';

class FakePlayer {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.moves = [];
  }

  getPosX() { return this.x; }

  getPosY() { return this.y; }

  moveDiagonallyRightUp() { this.moves.push('RU'); }

  moveDiagonallyRightDown() { this.moves.push('RD'); }

  moveDiagonallyLefttUp() { this.moves.push('LU'); }

  moveDiagonallyLeftDown() { this.moves.push('LD'); }

  moveUp() { this.moves.push('U'); }

  moveDown() { this.moves.push('D'); }

  moveLeft() { this.moves.push('L'); }

  moveRight() { this.moves.push('R'); }
}

function makeKeyListener(activeKeys) {
  return {
    isKeyDown(key) {
      return activeKeys.has(key);
    },
  };
}

test('PlayerMovementSystem prefers diagonal movement when two keys are down', () => {
  const player = new FakePlayer(100, 100);
  const keyListener = makeKeyListener(new Set([KeyListener.KEY_W, KeyListener.KEY_D]));

  PlayerMovementSystem.processMovement(player, keyListener, {
    minX: 0,
    minY: 0,
    maxX: 500,
    maxY: 500,
  });

  assert.deepEqual(player.moves, ['RU']);
});

test('PlayerMovementSystem does not move above minY boundary', () => {
  const player = new FakePlayer(100, 0);
  const keyListener = makeKeyListener(new Set([KeyListener.KEY_W]));

  PlayerMovementSystem.processMovement(player, keyListener, {
    minX: 0,
    minY: 0,
    maxX: 500,
    maxY: 500,
  });

  assert.equal(player.moves.length, 0);
});
