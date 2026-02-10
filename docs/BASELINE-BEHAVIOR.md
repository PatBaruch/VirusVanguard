# Baseline Behavior Snapshot (PR-A1)

This document captures current gameplay behavior before scalability and architecture refactors.
It is used as a regression oracle for all upcoming PRs.

## Runtime and World

- Canvas initializes to full window at startup only (`window.innerWidth/innerHeight`): `src/VirusVanguard.ts`.
- No runtime resize handling is implemented.
- Gameplay bounds are currently defined per-level and per-entity using percentage-based values.

## Level Bounds (Current Values)

- `Level0`
  - Movement bounds: `minX=0.05w`, `maxX=0.73w - playerWidth/2`, `minY=0.22h`, `maxY=0.7h - playerHeight/2`.
  - Exit condition window: `x > 0.72w - playerWidth/2` and `0.4h - playerHeight/2 < y < 0.59h - playerHeight/2`.

- `Level1`, `Level2`, `Level3`, `Level4`, `Level5`
  - Movement bounds: `minX=0.05w`, `maxX=0.91w - playerWidth/2`, `minY=0.1h`, `maxY=0.86h - playerHeight/2`.
  - Exit condition window (L1-L4): `x > 0.9w - playerWidth/2` and `0.4h - playerHeight/2 < y < 0.59h - playerHeight/2`.
  - Exit condition window (L5 victory trigger): `x > 0.89w - playerWidth/2` and `0.4h - playerHeight/2 < y < 0.59h - playerHeight/2`.

## Score Gates and Spawn Cadence

- L1
  - Score gate: `200`
  - Spawn interval: every `500ms` (`FEmail`)

- L2
  - Score gate: `400`
  - Spawn interval: every `1000ms` (`RVirus`)

- L3
  - Score gate: `600`
  - Spawn interval: every `500ms` (`Worm`)
  - Worm duplication mechanic in `Level.update`: every `2000ms` while score < 600.

- L4
  - Score gate: `1000`
  - Spawn interval: every `2000ms` (`Trojan`)
  - Worm duplication mechanic in `Level.update`: every `3000ms` while score < 1000.

- L5
  - Boss spawn: one-time `MrHacker` spawn at level start.
  - Boss-add summon timer in `Level.update`: every `3000ms`.

## Player Input and Movement

- Movement speed
  - Cardinal movement: `6 px` per update call.
  - Diagonal movement: `6 / sqrt(2)` per update call.
- Shooting
  - Triggered on `keyPressed(SPACE)` (tap, not hold) when level != 0.
  - Bullet base speed in `Level.shoot`: `2`.

## Weapons by Level

- L1-L2: single projectile pattern.
- L3: dual-shot pattern.
- L4-L5: triple spread pattern.

## Global Combat/Scoring Rules

- Multiplier starts at `5` and decays every update by `* 0.9999` while game is active.
- Generic enemy removal score award uses `otherItem.getScore()`.
- RVirus special damage-over-time uses `1500ms` tick and applies `5` damage.
- Projectile culling in `Level.update` uses expanded area:
  - `x < minX * 0.9` or `x > maxX * 1.05`
  - `y < minY * 0.9` or `y > maxY * 1.05`

## Transition and Visual State Contracts

- Body classes used for background/scene state include:
  - `startScreen`, `level0`, `level1`, `level2`, `level3`, `level4`, `level5`, `goNextLevel`, `victory`.
- Level completion readiness for L1-L4 requires both score gate reached and `gameItems.length === 0`.

## Known Quirks to Preserve Until Explicitly Changed

- Multiple levels instantiate their own `KeyListener`.
- Level spawn loops use `setInterval` without explicit teardown in level transition path.
- Several constants are duplicated across levels/entities.

These quirks are intentionally documented so later PRs can change them in controlled, reviewable steps.
