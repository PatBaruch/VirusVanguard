# Iteration 09 - Hotfix Progression and Background

## Scope

Fix two blocking regressions:
- black background after viewport/absolute-canvas changes
- impossible level transitions caused by exit-gate coordinate mismatch

## Changes Made

### Level progression fix
- Updated exit gate bounds in `src/Level.ts` (`applyLayout`) to preserve original player-offset semantics.
- Exit gate `left/top/right/bottom` now subtract half player width/height, matching pre-refactor logic.

### Background rendering fix
- Updated `index.html` CSS to ensure background images render with absolute-positioned canvas:
  - set `html, body` to `width: 100%` and `height: 100%`
  - set `overflow: hidden`
  - added `background-repeat: no-repeat`

## Why this broke

- During bounds refactor, exit-gate `left/top` stopped subtracting player half-size while movement max bounds still did.
- This made gate entry positions unreachable at level edges.
- With canvas moved to absolute positioning, body no longer expanded by canvas flow; background classes were applied but not visible reliably.

## Verification

- Build passed: `npm run build`.
