# Iteration 05 - Wave D Visual Polish

## Scope

Implement visual feedback and transition polish using existing assets and canvas rendering.

## Changes Made

### Combat feedback
- Added player-damage flash overlay in `src/Level.ts`.
- Added score popup feedback (`+score`) at enemy death position in `src/Level.ts`.

### Transition polish
- Added fade transition overlay in `src/VirusVanguard.ts` for:
  - level transitions
  - restart flow

### Configurable visual tuning
- Added visual constants in `src/config/GameConfig.ts`:
  - damage flash duration/color
  - score popup duration/speed
  - transition fade duration

## Behavior Impact

- Core mechanics remain unchanged.
- Game now provides clearer visual response to damage, kills, and level transitions.

## Verification

- Build check passed: `npm run build`.

## Next Wave

Wave E: replayability systems.
