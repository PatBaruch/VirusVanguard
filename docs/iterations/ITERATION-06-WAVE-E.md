# Iteration 06 - Wave E Replayability

## Scope

Implement replayability systems from Wave E:
- seeded runs
- mutator framework
- score attack mode
- endless mode support
- medals and persistence

## Changes Made

### Seeded runs and mode selection
- Added `src/core/RunManager.ts`.
- Supports URL-driven run setup:
  - `?seed=<number>`
  - `?mode=campaign|score-attack|endless`
  - `?mutator=none|rapid-fire|fragile|surge`
- Applies deterministic RNG by seeding `Math.random`.

### Mutator framework
- Added mutator multipliers through `RunManager`:
  - fire cooldown modifier
  - damage-taken modifier
  - spawn-rate modifier
  - multiplier-decay modifier
- Integrated mutator effects into:
  - `src/Level.ts`
  - `src/Level1.ts`
  - `src/Level2.ts`
  - `src/Level3.ts`
  - `src/Level4.ts`

### Score attack mode
- Added score-attack timer and overlay UI in `src/VirusVanguard.ts`.
- Score-attack run starts directly in Level 1.

### Endless mode
- Added endless handling to Level 5 in `src/Level5.ts`:
  - disables win transition
  - auto-spawns additional waves after clears
  - tracks endless wave count

### Persistence and medals
- Added `src/core/Persistence.ts` for localStorage-backed stats.
- Persisted stats include:
  - best final score
  - unlocked medals
  - last seed
- Added medal unlock logic and HUD indicators in `src/VirusVanguard.ts`.

## Behavior Impact

- Campaign remains default mode.
- New replay modes and run modifiers are now available via URL parameters.
- Run outcomes now persist across sessions.

## Verification

- Build check passed: `npm run build`.

## Next Wave

Wave F (optional): renderer abstraction boundary and technology migration evaluation.
