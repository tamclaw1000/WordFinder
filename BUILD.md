# WordFinder Build Log

Current prototype version: `v00.00.30`

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

### `v00.00.10` requirements-driven rebuild

- Archived the previous prototype implementation as `v1.html`.
- Replaced `index.html` with a fresh single-page build derived from `REQUIREMENTS.md` rather than
  incrementally patching the existing UI.
- Reimplemented deterministic daily/practice generation, blocked cells, exact path validation,
  local progress persistence, scalable grid rendering, and requirements-aligned messaging/layout.
- Kept the implementation static-site friendly and rebuilt the deployment artifact from the new page.

### `v00.00.11` two-stage blocked-region generator

- Replaced the single-path-first blocked-cell model in the new `index.html` build with a two-stage generator.
- Stage 1 now seeds multiple deterministic blocked-cell regions as independent coarse blobs.
- Stage 2 carves the final playable path through the remaining available space instead of treating all
  blocked cells as mere leftover negative space from one walk.
- This produces more intentional dark regions and reduces fallback to the older path-only layout logic.

### `a688fb2` `feat: add path arrows` (`v00.00.12`)

- Added directional path arrows to solved words.
- Added arrow previews for the active in-progress path.
- Scaled arrow overlays for dense boards.

### `5ef2b26` `feat: add sphere wrap toggle` (`v00.00.13`)

- Added a wrapped-board mode that connected opposite edges in generation and validation.
- Separated saved-state identity between flat and wrapped boards.

### `0d3a733` through `faaf703` experimental sphere rendering (`v00.00.14` - `v00.00.16`)

- Added and iterated on multiple sphere-rendering experiments.
- These globe-style rendering attempts were later abandoned.

### `5c1fad5` revert to `v00.00.12`

- Restored the exact pre-sphere flat-board implementation after the sphere experiments were rejected.

### `0e0c2b7` and `c099e4e` geometry experiments (`v00.00.17` - `v00.00.18`)

- Added pentagon/hexagon path geometry experiments and matching tile-shape rendering.
- These experiments were also later reverted.

### `90a416e` revert to `v00.00.12`

- Restored the exact `v00.00.12` baseline again after the geometry experiments were rejected.

### `7a829d8` `feat: add start/end path markers` (`v00.00.19`)

- Added open-circle-plus-arrow markers at the start of a path.
- Added filled-circle markers at the end of a path.
- Applied the markers to both solved words and the active traced path.

### `8c9e346` `feat: connect solved word tiles` (`v00.00.20`)

- Added connector bars so solved words read as continuous paths across adjacent tiles.
- Extended the same connector treatment to the active in-progress path.

### `41373de` through `9f4d549` solved-color experiments (`v00.00.21` - `v00.00.23`)

- Added per-word solved coloring.
- Iterated from hue-based differentiation to saturation-based differentiation and then to alternating
  dark/light shades in the shared blue family.

### `3485a32` `feat: add solve control` (`v00.00.24`)

- Added a `Solve` button that reveals every word and marks the board complete.
- Cleared in-progress path state when solving the board.

### `d318dc3` `feat: add solved-color dropdown` (`v00.00.25`)

- Added solved-color mode selection for hues, saturation, values, and palette-based styles.
- Fixed `New practice board` so it always starts with clean board state.

### `b57bd2e` `feat: add named solved color palettes` (`v00.00.26`)

- Replaced generic numbered palettes with named, more distinct palette families.
- Added sixteen named palette options such as `Citrus Grove`, `Seaside Glass`, and `Midnight Neon`.

### `dc02033` `feat: add visible custom seed controls` (`v00.00.27`)

- Added a visible seed field to the sidebar.
- Added custom seed entry plus `Apply seed`.
- Normalized seeds to include grid size prefixes such as `5x5:...`.

### `2f597f5` `feat: add selectable word generation modes` (`v00.00.28`)

- Added a `Word selection` dropdown.
- Added constrained generation modes for `Z`, `X`, `Q`, `ING`, `MM`, user-chosen starting letter,
  and fixed `N`-letter word generation.
- Added seed encoding for the selected word-generation mode.

### `f81c0f2` `fix: use real words for constrained modes` (`v00.00.29`)

- Replaced fabricated fallback strings in constrained modes with dictionary-backed word pools.
- Added a client-side `word-pools.js` data file derived from system dictionary content.
- Updated the word-length planner to avoid impossible constrained-length combinations.

### `d591437` `fix: hide conditional word controls` (`v00.00.30`)

- Fixed the conditional `Starting letter` and `Word length N` fields so they only render when their
  matching word-selection mode is active.
- Added an explicit `[hidden]` CSS rule to make HTML `hidden` state effective against layout styling.

## Current State

- Repository: `https://github.com/tamclaw1000/WordFinder`
- GitHub Pages: `https://tamclaw1000.github.io/WordFinder/`
- Current version: `v00.00.30`
- Latest recorded commit at the time of this log: `d591437`
- Latest published tag: `v00.00.30`

## Notes

- The current large-grid implementation is still generation-based and optimized for prototype speed,
  but now preserves a real path-partition puzzle structure across generated boards.
- The current build includes custom seeds, named palette modes, connector/marker rendering, a solve
  action, and constrained real-word generation modes backed by embedded dictionary-derived pools.
- The GitHub Pages deployment is the public-facing version.
- The OpenAI Sites deployment remains useful for internal workspace-hosted iteration.
