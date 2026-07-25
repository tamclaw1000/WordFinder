# WordFinder

WordFinder is a prototype repository for a Wend-style word-path puzzle web app.

Current prototype version: `v00.00.03`

## Getting started

Open `index.html` in a browser to play the first single-page prototype locally.

## Project docs

- See `REQUIREMENTS.md` for the initial web app product requirements.

## Prototype

- `index.html` contains the full HTML, CSS, and JavaScript for the first playable prototype.
- The prototype now supports generated daily/practice boards for selectable square grids from `4x4` up to `20x20`.
- Generated boards now partition the grid into winding multi-word paths instead of simple row strips.
- Tile lettering and hint markers scale down with dense boards so larger grids remain readable.
- `scripts/build-worker.mjs` packages the single-page prototype into `dist/index.js` for Sites deployment.
