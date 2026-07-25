# WordFinder Build Log

Current prototype version: `v00.00.01`

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

## Current State

- Repository: `https://github.com/tamclaw1000/WordFinder`
- GitHub Pages: `https://tamclaw1000.github.io/WordFinder/`
- Current version: `v00.00.01`
- Latest recorded commit at the time of this log: `a5daaa4`

## Notes

- The current large-grid implementation is generation-based and optimized for prototype speed,
  not final puzzle quality.
- The GitHub Pages deployment is the public-facing version.
- The OpenAI Sites deployment remains useful for internal workspace-hosted iteration.
