# Iteration 08 - Hotfix Asset Paths

## Scope

Fix broken loading/background/dialogue/sprite visibility caused by asset path resolution.

## Changes Made

- Normalized asset paths in source from `../assets/...` and `/assets/...` to `./assets/...`.
- Updated all affected gameplay/image references in:
  - `src/Level0.ts` to `src/Level5.ts`
  - `src/Level.ts`
  - `src/Player.ts`
  - all `src/GameItem/*.ts` files

## Why

- Relative image loading is resolved from `index.html` base location.
- `../assets/...` and `/assets/...` broke in local/file-based runs and caused missing backgrounds/dialogues/sprites.

## Verification

- Build passed: `npm run build`.
