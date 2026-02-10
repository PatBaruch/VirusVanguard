# VirusVanguard Implementation Roadmap

This roadmap is the execution source of truth for the project modernization effort.

## Goals

- Keep the game's identity and core flow intact.
- Make the game scalable on any window size using a fixed virtual arena.
- Remove hardcoded gameplay/layout values.
- Improve maintainability and extensibility.
- Improve gameplay feel, visual polish, and replayability.

## Guardrails

- Preserve existing gameplay behavior until behavior-change PRs explicitly start.
- Keep current assets and core enemy/level identity.
- Use small, reviewable PRs with explicit acceptance criteria.
- Add one iteration markdown report after each iteration.

## Wave A: Foundations (Behavior-Preserving)

### PR-A1: Baseline Behavior Snapshot
- Document current movement bounds, transitions, spawn timing, culling, and scoring gates.
- Create a baseline checklist to detect regressions in later PRs.

### PR-A2: Constants and Config Extraction
- Move hardcoded values into typed constants/config files.
- Keep value parity 1:1 with current behavior.

### PR-A3: Fixed Virtual Arena + Viewport + Letterboxing
- Introduce fixed virtual world coordinates and scale-to-window rendering.

### PR-A4: Resize Lifecycle
- Add robust resize handling without gameplay reset.

### PR-A5: Unified Arena Bounds Service
- Single source of truth for play area, culling area, and transition gates.

### PR-A6: Dynamic Border Rendering
- Render borders dynamically from authoritative arena bounds.

### PR-A7: Entity Migration to Shared Bounds
- Enemies and projectiles consume the shared bounds service.

### PR-A8: Cleanup + Naming + Type Safety
- Fix naming/typing debt and add shared geometry/domain types.

## Wave B: Maintainability Architecture

### PR-B1: Level Lifecycle (`onEnter`/`onExit`)
### PR-B2: Single Input Ownership
### PR-B3: Split `Level.ts` into systems
### PR-B4: Asset registry/cache

## Wave C: Core Fun Loop

### PR-C1: Hold-to-fire with cooldown
### PR-C2: Delta-time fairness normalization
### PR-C3: Threat director (adaptive pacing)
### PR-C4: Mechanic-specific timers
### PR-C5: Boss phase design pass
### PR-C6: Objective clarity and HUD updates

## Wave D: Visual Appeal (Current Assets)

### PR-D1: Combat feedback layer
### PR-D2: Transition polish
### PR-D3: Border/arena VFX
### PR-D4: Animation timing and smoothness

## Wave E: Replayability

### PR-E1: Seeded runs
### PR-E2: Mutator framework
### PR-E3: Score attack mode
### PR-E4: Endless mode
### PR-E5: Challenge cards + medals
### PR-E6: Local persistence for records

## Wave F: Optional Tech Evolution

### PR-F1: Renderer abstraction boundary
### PR-F2: Evaluate framework migration path

## Iteration Reporting Rule

- Every implementation iteration must create a markdown report under `docs/iterations/`.
- Naming convention: `ITERATION-XX-<PR-ID>.md`.
- Each report must include: scope, changes made, files touched, behavior impact, tests/verification, and next steps.
