# Iteration 03 - Wave B Maintainability

## Scope

Implement core maintainability improvements from Wave B:
- level lifecycle hooks (`onEnter` / `onExit`)
- single input ownership model
- asset caching foundation

## Changes Made

### Lifecycle hooks
- Added `onEnter()` and `onExit()` in `src/Level.ts` with default no-op behavior.
- Updated level transition/restart logic in `src/VirusVanguard.ts` to call:
  - `currentLevel.onExit()` before switching
  - `nextLevel.onEnter()` after switching

### Input ownership cleanup
- Removed per-level `new KeyListener()` creation from:
  - `src/Level0.ts`
  - `src/Level1.ts`
  - `src/Level2.ts`
  - `src/Level3.ts`
  - `src/Level4.ts`
  - `src/Level5.ts`
- Levels now read dialogue input through shared `Level.inputKeyListener`, set from `Level.processInput(...)`.

### Timer cleanup on level exit
- Added explicit interval teardown in:
  - `src/Level1.ts`
  - `src/Level2.ts`
  - `src/Level3.ts`
  - `src/Level4.ts`
  - `src/Level5.ts`

### Asset cache
- Added image caching in `CanvasRenderer.loadNewImage(...)` using static `Map<string, HTMLImageElement>`.
- This avoids repeated `Image` allocations for identical sprite paths.

## Behavior Impact

- Gameplay rules are preserved.
- Runtime is more stable across level changes due to interval cleanup and centralized input listener ownership.

## Verification

- Build check passed: `npm run build`.

## Next Wave

Wave C: core gameplay loop improvements (firing cadence, pacing, fairness, boss phasing, HUD clarity).
