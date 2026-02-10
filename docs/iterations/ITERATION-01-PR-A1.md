# Iteration 01 - PR-A1 Baseline Behavior Snapshot

## Scope

Start roadmap implementation from the first item (PR-A1): establish a baseline behavior snapshot before code refactors.

## Changes Made

- Added project roadmap file: `docs/ROADMAP.md`.
- Added baseline behavior reference: `docs/BASELINE-BEHAVIOR.md`.
- Captured current gameplay contracts for:
  - level bounds and transition windows
  - score gates and spawn intervals
  - movement and shooting behavior
  - culling/math thresholds
  - scene/background state classes

## Files Added

- `docs/ROADMAP.md`
- `docs/BASELINE-BEHAVIOR.md`
- `docs/iterations/ITERATION-01-PR-A1.md`

## Behavior Impact

- No runtime/gameplay code changed.
- This iteration is documentation-only and behavior-preserving.

## Verification Performed

- Validated values against current source in:
  - `src/VirusVanguard.ts`
  - `src/Level.ts`
  - `src/Level0.ts`
  - `src/Level1.ts`
  - `src/Level2.ts`
  - `src/Level3.ts`
  - `src/Level4.ts`
  - `src/Level5.ts`
  - `src/Player.ts`

## Next Iteration

PR-A2: extract hardcoded gameplay/layout values into typed constants/config with exact value parity.
