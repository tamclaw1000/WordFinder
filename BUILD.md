# WordFinder Build Log

Current prototype version: `v00.00.05`

## Summary

This file records the major project actions taken so far for the `WordFinder` prototype,
including repository setup, requirements capture, prototype implementation, publishing,
and follow-up iterations.

## Repository And Documentation Setup

### `d1d807c` `chore: initialize project`

- Created the `WordFinder` Git repository.
- Added an initial `README.md`.
- Added a base `.gitignore`.
- Created the GitHub repository `tamclaw1000/WordFinder`.

### `64c917d` `docs: add web app requirements`

- Wrote `REQUIREMENTS.md` for the web app prototype.
- Defined the core puzzle rules, modes, functional requirements, data expectations,
  accessibility notes, and MVP scope.
- Linked the requirements doc from `README.md`.
- Tagged this documentation milestone as `v00.00.00`.

## Vault Linkage

- Created the vault project folder:
  `TamClawVault/tasks/project/WordFinder/`
- Hard-linked `REQUIREMENTS.md` into the vault project folder.
- Created Shlink for the requirements note:
  `https://sh.tam.net/wordfinder-requirements`

### `fe24cc0` `docs: add build log`

- Created `BUILD.md` in the repository to track the project timeline.
- Soft-linked `BUILD.md` into the vault project folder.
- Created Shlink for the build log:
  `https://sh.tam.net/wordfinder-build`

## Playable Prototype

### `9b14de3` `feat: add playable single-page prototype`

- Built the initial single-page `index.html` prototype.
- Implemented the core game interaction:
  - daily/practice puzzle switching
  - drag and tap path input
  - answer-path validation
  - hint, undo, and reset controls
  - solved-state feedback
  - responsive layout
- Added `.nojekyll` for static hosting compatibility.
- Updated `README.md` to describe the prototype.

### `e0bf67e` `chore: add sites hosting config`

- Added `.openai/hosting.json` to bind the repo to an OpenAI Sites project.

### `4b1074c` `build: package prototype for sites deployment`

- Added `scripts/build-worker.mjs`.
- Generated `dist/index.js` for Sites deployment.
- Deployed the prototype to OpenAI Sites.

## Publishing

### OpenAI Sites

- Provisioned a Sites project for `WordFinder`.
- Successfully deployed a working authenticated Sites version.
- Limitation encountered:
  workspace policy does not allow public internet publishing for Sites.
- Adjusted site access to `workspace_all`, which is the widest allowed setting in
  the current workspace policy.

### GitHub Pages

- Switched the GitHub repository from `private` to `public` so GitHub Pages could be enabled.
- Enabled GitHub Pages from the root of the `main` branch.
- Published the prototype at:
  `https://tamclaw1000.github.io/WordFinder/`

## Prototype Iterations

### `4e3f8bc` `feat: add grid size selector`

- Added a visible `Grid size` selector to the UI.
- Added sample `4x4` and `5x5` boards.
- Updated puzzle loading so the selected size controls the active board.
- Republished GitHub Pages.

### `ee10d8e` `docs: add prototype version label`

- Added the visible version chip to the UI.
- Added the version to the document title.
- Recorded the current prototype version in `README.md`.
- Set the visible prototype version to `v00.00.01`.

### `a5daaa4` `feat: support grid sizes up to 20x20`

- Replaced fixed-size-only puzzle behavior with generated square boards.
- Extended grid-size support from `4x4` up to `20x20`.
- Added generated daily/practice board logic for larger sizes.
- Tightened board spacing for denser large-grid rendering.

### `8c61e56` `fix: generate winding boards and scale large grids` (`v00.00.03`)

- Reworked generated-board construction so each board is partitioned into seeded multi-word
  paths across the full grid instead of trivial row-only strips.
- Added path-length planning that favors bends across row transitions, producing visibly winding
  answer paths on generated boards.
- Added board-dependent tile sizing so letters, hint indices, spacing, and corner radii scale
  down for dense boards including `20x20`.
- Republished the GitHub Pages build with the corrected generator and UI scaling.

### `4307f81` `fix: add blocked cells and varied word lengths` (`v00.00.04`)

- Replaced the full-open square generator with a shaped playable-area generator that inserts
  real black blocked cells into every generated board.
- Broadened word-length distribution so generated boards mix shorter and longer words instead of
  clustering around one repeated length.
- Centered tile letters explicitly by resetting button appearance/padding and rendering the letter
  content in its own centered span.
- Revalidated generated boards across multiple sizes before republishing GitHub Pages.

### `2e9dbf2` `feat: make generated boards more challenging` (`v00.00.05`)

- Replaced the row-band playable-area generator with an irregular self-avoiding path generator.
- This makes blocked-cell silhouettes less artificial and makes the underlying answer path less
  obvious at a glance.
- Kept deterministic seeded generation so daily and practice boards still reproduce cleanly for a
  given size and seed.
- Revalidated representative board sizes locally before republishing GitHub Pages.

## Current State

- Repository: `https://github.com/tamclaw1000/WordFinder`
- GitHub Pages: `https://tamclaw1000.github.io/WordFinder/`
- Current version: `v00.00.05`
- Latest recorded commit at the time of this log: `2e9dbf2`
- Latest published tag: `v00.00.05`

## Notes

- The current large-grid implementation is still generation-based and optimized for prototype speed,
  but now preserves a real path-partition puzzle structure across generated boards.
- The GitHub Pages deployment is the public-facing version.
- The OpenAI Sites deployment remains useful for internal workspace-hosted iteration.
