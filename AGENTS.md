# AGENTS Guide for VirusVanguard
This file is for autonomous coding agents working in this repository.
It captures build/test/lint workflows and coding conventions.

## 1) Repository Snapshot
- Language: TypeScript (ES modules).
- Runtime: browser canvas game.
- Entry HTML: `index.html` loading `build/app.js` as a module.
- Source root: `src/`.
- Build output: `build/`.
- Package manager: npm (`package-lock.json` is present).

## 2) External Agent Rules (Cursor/Copilot)
Checked locations:
- `.cursorrules`
- `.cursor/rules/`
- `.github/copilot-instructions.md`

Current status:
- No Cursor rules found.
- No Copilot instructions file found.

## 3) Setup Commands
- Install dependencies: `npm install`
- Verify TypeScript is available: `npx tsc --version`

## 4) Build and Run Commands
- Build once: `npm run build`
- Watch build: `npm run watch`
- Direct compile equivalent: `npx tsc`

Run locally:
- Build first, then open `index.html` in a browser that can load ES modules.
- No dev server script is currently defined in `package.json`.

## 5) Lint Commands
Current state:
- ESLint packages are installed as devDependencies.
- No lint script exists in `package.json`.
- No ESLint config is committed at repository root.

Guidance:
- Treat lint as not fully configured.
- If linting is requested, report config is missing.
- Optional exploratory command (may fail):
  - `npx eslint "src/**/*.ts"`

## 6) Test Commands (including single-test)
Current state:
- Test runner: Node built-in test runner (`node:test`).
- Test scripts in `package.json`:
  - Run all tests: `npm test`
  - Run single test file: `npm run test:single -- tests/level-systems/PlayerWeaponSystem.test.js`
- Current test location: `tests/level-systems/*.test.js`
- `tsconfig.json` excludes `**/*.spec.ts` from build, so tests are currently JS files importing from `build/`.

Practical validation flow:
- Fast compile check: `npm run build`
- Full automated checks: `npm test`
- Manual in-browser gameplay checks after behavior-impacting changes.

## 7) TypeScript Compiler Constraints
From `tsconfig.json`:
- `target`: `es2022`
- `moduleResolution`: `node`
- `outDir`: `build/`
- `removeComments`: `true`
- `noEmitOnError`: `true`
- `noImplicitAny`: `true`
- `noImplicitThis`: `true`
- `noImplicitOverride`: `true`
- `noImplicitReturns`: `true`
- `strict`: `false` (do not assume full strict mode)

Agent implications:
- Keep explicit typing for params/returns/fields.
- Use `override` when subclass methods override base class methods.
- Avoid introducing implicit `any`.

## 8) Imports and Module Style
Observed conventions:
- Relative imports only.
- `.js` suffix in TypeScript imports for emitted ESM compatibility.
- Imports at top of file.
- Default exports are common for class files.

When adding code:
- Match existing `.js` import suffix pattern.
- Prefer one primary class per file.

## 9) Formatting Conventions
Observed in `src/`:
- 2-space indentation.
- Semicolons enabled/expected.
- Single quotes for strings.
- K&R braces (`if (...) {`).
- Trailing commas appear in multiline constructs.

Agent behavior:
- Preserve local style in touched files.
- Avoid unrelated reformatting.

## 10) Naming Conventions
- Class names/files: PascalCase (`Level0`, `CanvasRenderer`, `MrHacker`).
- Methods/variables/fields: camelCase (`processInput`, `playerHealth`).
- Key constants: `KEY_*` static readonly uppercase style.
- Abstract bases include `Game`, `Level`, `GameItem`, `CanvasItem`.

## 11) Types and OOP Patterns
- Prefer class-based design for gameplay entities.
- Use explicit access modifiers (`public`, `protected`, `private`).
- Prefer interfaces for contracts and composition over deep inheritance for system logic.
- Keep systems small and focused (single responsibility): movement, weapon patterns, boss phases, transient UI, spawn cadence, etc.
- Favor readonly/immutable data shapes for value objects and config where possible.
- Keep core loop contracts intact:
  - `processInput()`
  - `update(elapsed: number)`
  - `render()` / `render(canvas)`
- Use typed collections (e.g., `GameItem[]`).
- Use unions where needed (e.g., `Level | null`).

Current decomposition direction:
- `Level.ts` should act as an orchestrator.
- Extracted systems live under `src/level/systems/`.
- Add/refactor logic by extending systems first, then keep `Level.ts` lean.

## 12) Error Handling
Current pattern is minimal and direct:
- Throw on impossible internal states (e.g., missing 2D context).
- Do not swallow exceptions silently.
- Avoid broad `try/catch` without clear recovery.

When adding new logic:
- Fail fast for invalid internal state.
- Keep game-loop behavior deterministic and predictable.

## 13) Rendering and Gameplay Practices
- Use `CanvasRenderer` helper methods for drawing and text.
- Most entities inherit from `CanvasItem` / `GameItem`.
- Image assets are usually loaded via `CanvasRenderer.loadNewImage(...)`.
- Background and scene visuals are switched via `document.body.className`.

When changing gameplay:
- Keep per-frame work bounded.
- Keep collision/spawn code readable; extract helpers if complexity grows.
- Preserve level progression contract through `nextLevel()`.

## 14) Agent Safety Checklist
Before finalizing work:
- Run `npm run build` and resolve TS compile errors.
- Verify import suffixes remain `.js` where required.
- If you introduce tests, document all-tests and single-test commands.
- Do not add new tooling/config unless requested.
- Do not manually edit `build/` artifacts unless explicitly asked.

---
If this guide conflicts with explicit user instructions, follow user instructions.
If new repo configs/scripts are added later, prefer those and update this file.
