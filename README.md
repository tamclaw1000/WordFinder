# WordFinder

WordFinder is a prototype repository for a Wend-style word-path puzzle web app.

Current prototype version: `v00.00.43`

## Getting started

Open `index.html` in a browser to play the current single-page prototype locally.

## Project docs

- See `REQUIREMENTS.md` for the current shipped web app product requirements.

## Prototype

- `v1.html` preserves the earlier prototype line through `v00.00.05`.
- `v2.html` preserves the pre-rebuild shipped page.
- `v3.html` preserves the pre-documentation-driven rebuild page through `v00.00.42`.
- `index.html` is the current rebuilt main app.
- The current build supports deterministic daily/practice boards for selectable square grids from `4x4` up to `20x20`.
- Generated boards include blocked cells, exact path validation, local progress persistence, scalable large-grid rendering, and multiple blank-layout strategies.
- The latest generator uses a two-stage layout: seed intentional blocked-cell regions first, then carve the final playable path through the remaining available space.
- Patterned blank modes generate blank structures first, derive straight playable runs, and fill those runs with valid words.
- The main screen is now gameplay-first: configuration lives in a popup settings dialog, while a top-right menu holds `New practice board`, `Settings`, and archived version links.
- The active board configuration is mirrored into the URL as `?seed=...`, and loading that URL restores the encoded setup.
- Tap-only play submits by tapping the current path end tile again instead of using a dedicated submit button.
- `scripts/build-worker.mjs` packages the single-page prototype into `dist/index.js` for Sites deployment.
