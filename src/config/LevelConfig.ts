import type { RatioRect } from '../types/Geometry.js';

export interface LevelLayoutConfig {
  playArea: RatioRect;
  exitGate: RatioRect;
  scoreGate: number;
  spawnIntervalMs: number;
}

export const LEVEL_LAYOUTS: Record<number, LevelLayoutConfig> = {
  0: {
    playArea: {
      left: 0.05,
      top: 0.22,
      right: 0.73,
      bottom: 0.7,
    },
    exitGate: {
      left: 0.72,
      top: 0.4,
      right: 1,
      bottom: 0.59,
    },
    scoreGate: 0,
    spawnIntervalMs: 0,
  },
  1: {
    playArea: {
      left: 0.05,
      top: 0.1,
      right: 0.91,
      bottom: 0.86,
    },
    exitGate: {
      left: 0.9,
      top: 0.4,
      right: 1,
      bottom: 0.59,
    },
    scoreGate: 200,
    spawnIntervalMs: 500,
  },
  2: {
    playArea: {
      left: 0.05,
      top: 0.1,
      right: 0.91,
      bottom: 0.86,
    },
    exitGate: {
      left: 0.9,
      top: 0.4,
      right: 1,
      bottom: 0.59,
    },
    scoreGate: 400,
    spawnIntervalMs: 1000,
  },
  3: {
    playArea: {
      left: 0.05,
      top: 0.1,
      right: 0.91,
      bottom: 0.86,
    },
    exitGate: {
      left: 0.9,
      top: 0.4,
      right: 1,
      bottom: 0.59,
    },
    scoreGate: 600,
    spawnIntervalMs: 500,
  },
  4: {
    playArea: {
      left: 0.05,
      top: 0.1,
      right: 0.91,
      bottom: 0.86,
    },
    exitGate: {
      left: 0.9,
      top: 0.4,
      right: 1,
      bottom: 0.59,
    },
    scoreGate: 1000,
    spawnIntervalMs: 2000,
  },
  5: {
    playArea: {
      left: 0.05,
      top: 0.1,
      right: 0.91,
      bottom: 0.86,
    },
    exitGate: {
      left: 0.89,
      top: 0.4,
      right: 1,
      bottom: 0.59,
    },
    scoreGate: 0,
    spawnIntervalMs: 0,
  },
};
