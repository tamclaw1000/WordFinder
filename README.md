# WordFinder

WordFinder is a prototype repository for a Wend-style word-path puzzle web app.

Current prototype version: `v00.00.11`

## Getting started

Open `index.html` in a browser to play the current single-page prototype locally.

## Project docs

- See `REQUIREMENTS.md` for the initial web app product requirements.

## Prototype

- `v1.html` preserves the earlier prototype line through `v00.00.05`.
- `index.html` is the current requirements-driven build.
- The current build supports deterministic daily/practice boards for selectable square grids from `4x4` up to `20x20`.
- Generated boards include blocked cells, a contiguous hidden path partitioned into words, exact path validation, local progress persistence, and scalable large-grid rendering.
- The latest generator uses a two-stage layout: seed intentional blocked-cell regions first, then carve the final playable path through the remaining available space.
- `scripts/build-worker.mjs` packages the single-page prototype into `dist/index.js` for Sites deployment.
