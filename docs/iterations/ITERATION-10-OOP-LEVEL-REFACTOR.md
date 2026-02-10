# Iteration 10 - OOP Refactor and Systemized Level Logic

## Scope

Apply OOP/code-quality best practices to reduce `Level.ts` complexity and add automated tests for extracted modules.

## Best-practice inputs used

- TypeScript architecture guidance (Context7 `/microsoft/typescript`):
  - prefer interfaces for contracts
  - prefer composition-focused modules over monolithic classes
  - keep strongly typed boundaries between subsystems
- Node test runner guidance (Context7 `/nodejs/node`):
  - use `node:test`
  - support all-tests and single-file test execution

## Refactor changes

### New extracted systems
- `src/level/systems/PlayerMovementSystem.ts`
- `src/level/systems/PlayerWeaponSystem.ts`
- `src/level/systems/BossPhaseSystem.ts`
- `src/level/systems/SpawnCadenceSystem.ts`
- `src/level/systems/TransientUiSystem.ts`
- `src/level/systems/WormDuplicationSystem.ts`
- `src/level/types/Direction.ts`

### `Level.ts` decomposition
- Reduced core class size and moved logic into orchestrated helper methods.
- `processInput()` now delegates movement to `PlayerMovementSystem`.
- `shoot()` now delegates projectile vector generation to `PlayerWeaponSystem`.
- Boss phase logic now delegates to `BossPhaseSystem`.
- popup/timed transient UI updates now delegate to `TransientUiSystem`.
- worm duplication checks now delegate to `WormDuplicationSystem`.

### Spawn cadence cleanup
- Level spawn pacing now uses shared `SpawnCadenceSystem` in:
  - `src/Level1.ts`
  - `src/Level2.ts`
  - `src/Level3.ts`
  - `src/Level4.ts`

### Test command setup
- Added scripts in `package.json`:
  - `npm test`
  - `npm run test:single -- tests/level-systems/PlayerWeaponSystem.test.js`

### AGENTS update
- Updated `AGENTS.md` test section and OOP/system decomposition guidance.

## Tests added

- `tests/level-systems/PlayerMovementSystem.test.js`
- `tests/level-systems/PlayerWeaponSystem.test.js`
- `tests/level-systems/BossPhaseSystem.test.js`
- `tests/level-systems/SpawnCadenceSystem.test.js`
- `tests/level-systems/TransientUiSystem.test.js`
- `tests/level-systems/WormDuplicationSystem.test.js`

## Verification

- `npm run build` passes
- `npm test` passes
- `npm run test:single -- tests/level-systems/PlayerWeaponSystem.test.js` passes
