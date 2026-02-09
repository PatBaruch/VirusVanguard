# Iteration 02 - Wave A Foundations

## Scope

Implement Wave A roadmap items after PR-A1:
- PR-A2 constants/config extraction
- PR-A3 fixed virtual arena + viewport scaling
- PR-A4 resize lifecycle
- PR-A5 shared arena bounds service
- PR-A6 dynamic border rendering
- PR-A7 entity migration to shared bounds
- PR-A8 typing/cleanup groundwork

## Changes Made

### Configuration and typed geometry
- Added shared game constants: `src/config/GameConfig.ts`.
- Added typed level layout configs: `src/config/LevelConfig.ts`.
- Added shared enemy arena ratios: `src/config/ArenaConfig.ts`.
- Added geometry types: `src/types/Geometry.ts`.

### Virtual arena and scaling
- Added viewport calculator: `src/core/Viewport.ts`.
- Updated game root (`src/VirusVanguard.ts`) to:
  - use fixed virtual canvas size (1920x1080)
  - scale and letterbox canvas via CSS sizing
  - handle live `resize` updates without reset

### Bounds unification
- Added ratio->rect converter service: `src/core/ArenaBounds.ts`.
- Updated `src/Level.ts` with:
  - `playArea`/`exitGate` rect state
  - `applyLayout(...)` and `isPlayerInExitGate()` helpers
  - shared culling constants usage

### Dynamic border rendering
- Added per-frame border render in `Level.render(...)` using authoritative `playArea` bounds.

### Level migration to layout config
- Updated:
  - `src/Level0.ts`
  - `src/Level1.ts`
  - `src/Level2.ts`
  - `src/Level3.ts`
  - `src/Level4.ts`
  - `src/Level5.ts`
- Levels now consume `LEVEL_LAYOUTS` for movement bounds, exits, and score/spawn gates.

### Entity migration to shared bounds
- Updated enemy/projectile/death classes to use `ArenaBounds.fromRatioRect(...)` and shared arena ratios:
  - `src/GameItem/FEmail.ts`
  - `src/GameItem/RVirus.ts`
  - `src/GameItem/Worm.ts`
  - `src/GameItem/Trojan.ts`
  - `src/GameItem/MrHacker.ts`
  - `src/GameItem/Bullet.ts`
  - `src/GameItem/EnemyBullet.ts`
  - `src/GameItem/Death.ts`

### Hardcoded value reduction in core loop
- Moved several gameplay literals from `Level.ts`/`Player.ts` to config constants:
  - bullet speed
  - RVirus DOT timing and damage
  - culling multipliers
  - dialogue offsets
  - border color
  - player movement speeds

## Behavior Impact

- Target behavior preserved while enabling fixed virtual arena scaling.
- Visual/interaction bounds now remain consistent across window sizes.

## Verification

- Build check passed: `npm run build`.

## Next Wave

Wave B: maintainability architecture
- lifecycle (`onEnter`/`onExit`)
- single input ownership
- split `Level.ts` systems
- asset registry/cache
