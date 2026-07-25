# WordFinder

WordFinder is a prototype repository for a Wend-style word-path puzzle web app.

Current prototype version: `v00.00.05`

## Getting started

Open `index.html` in a browser to play the first single-page prototype locally.

## Project docs

- See `REQUIREMENTS.md` for the initial web app product requirements.

## Prototype

- `index.html` contains the full HTML, CSS, and JavaScript for the first playable prototype.
- The prototype now supports generated daily/practice boards for selectable square grids from `4x4` up to `20x20`.
- Generated boards now include black blocked cells and partition the playable area into winding multi-word paths.
- Word lengths are distributed across a wider range instead of clustering around one size.
- Tile lettering and hint markers scale down with dense boards, and the tile letters are centered correctly.
- Blocked-cell layouts now come from an irregular self-avoiding path generator instead of a simple row-trimmed snake, which makes the boards less predictable and noticeably harder.
- `scripts/build-worker.mjs` packages the single-page prototype into `dist/index.js` for Sites deployment.
