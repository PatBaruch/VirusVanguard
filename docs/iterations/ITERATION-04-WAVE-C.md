# Iteration 04 - Wave C Core Gameplay Loop

## Scope

Implement core gameplay-loop improvements from Wave C:
- hold-to-fire cadence
- timer separation and fairness updates
- adaptive spawn pacing (threat director lite)
- boss phase escalation
- objective HUD clarity

## Changes Made

### Shooting cadence
- Added continuous fire behavior with cooldown (`PLAYER_FIRE_COOLDOWN_MS`) in `src/Level.ts`.
- Spacebar now supports hold-to-fire rather than tap-only behavior.

### Fairness and timer separation
- Added elapsed-time-based multiplier decay via `MULTIPLIER_DECAY_PER_SECOND`.
- Separated RVirus DOT timer from level duplication timer using `rvirusDamageTimer`.

### Adaptive spawn pacing
- Reworked level spawn loops from fixed `setInterval` to adaptive `setTimeout` chains in:
  - `src/Level1.ts`
  - `src/Level2.ts`
  - `src/Level3.ts`
  - `src/Level4.ts`
- Spawn cadence now tightens gradually based on level score progress.

### Boss phase escalation
- Added boss summon interval phases based on boss HP in `src/Level.ts`.
- Added boss shot phase tuning (spread and speed) based on boss HP.

### Objective clarity
- Added objective HUD text in `src/Level.ts` showing `currentScore / scoreGate`.
- Added new config values in `src/config/GameConfig.ts`.

## Behavior Impact

- Combat flow is more responsive and less repetitive.
- Difficulty ramps more smoothly within each level.
- Boss encounter escalates more clearly by phase.

## Verification

- Build check passed: `npm run build`.

## Next Wave

Wave D: visual polish and feedback layer.
