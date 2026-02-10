# Iteration 07 - Wave F Renderer Boundary

## Scope

Implement optional Wave F groundwork:
- renderer abstraction boundary
- migration-readiness foundation

## Changes Made

### Renderer abstraction
- Added renderer interface: `src/render/Renderer.ts`.
- Added canvas implementation: `src/render/CanvasGameRenderer.ts`.
- Updated `src/VirusVanguard.ts` to consume renderer abstraction for:
  - frame clearing
  - overlay drawing
  - HUD and transition text rendering

### Migration readiness
- Rendering calls in root loop now route through a replaceable renderer adapter.
- This creates a clean seam for future renderer migration without changing game-loop orchestration.

## Behavior Impact

- No intended gameplay behavior changes.
- Rendering output remains functionally equivalent while introducing a migration boundary.

## Verification

- Build check passed: `npm run build`.

## Notes

- Future migration prototype can introduce a second renderer implementation while keeping existing level logic intact.
