# WordFinder Technical Specification

This specification describes the current `WordFinder` implementation and explicitly ties each
implementation area back to the numbered product requirements in `REQUIREMENTS.md`.

## 1. Runtime And Delivery

- `TS-001` The app is delivered as a static browser application rooted at `index.html`.
  - Implements: `REQ-001`, `REQ-002`
- `TS-002` The generated deployment artifact is `dist/index.js`, produced from `scripts/build-worker.mjs`.
  - Implements: `REQ-002`
- `TS-003` The archived prior application lines are retained as `v1.html`, `v2.html`, and `v3.html`.
  - Implements: `REQ-038`, `REQ-039`, `REQ-040`, `REQ-041`

## 2. Main Screen Structure

- `TS-004` The visible page is split into a gameplay-first board column and a sidebar column.
  - Implements: `REQ-006`, `REQ-042`, `REQ-043`, `REQ-044`, `REQ-045`, `REQ-046`
- `TS-005` The top-right header menu contains `New practice board`, `Settings`, and an `Archived versions` submenu.
  - Implements: `REQ-035`, `REQ-036`, `REQ-037`, `REQ-038`, `REQ-039`, `REQ-040`, `REQ-041`
- `TS-006` The sidebar exposes the `Undo`, `Hint`, `Solve`, and `Reset` actions plus current-path and solved-state feedback.
  - Implements: `REQ-059`, `REQ-060`, `REQ-061`, `REQ-062`, `REQ-063`, `REQ-064`, `REQ-084`, `REQ-086`

## 3. Settings Dialog Structure

- `TS-007` All configuration lives in the popup settings dialog rather than the main gameplay surface.
  - Implements: `REQ-006`
- `TS-008` The settings dialog is tabbed into `UI`, `Game Configuration`, and `Board & Word Mechanics`.
  - Implements: `REQ-026`, `REQ-027`, `REQ-028`, `REQ-053`
- `TS-009` The `UI` tab currently hosts solved-color controls.
  - Implements: `REQ-047`, `REQ-048`
- `TS-010` The `Game Configuration` tab hosts grid-size and seed controls.
  - Implements: `REQ-017`, `REQ-018`, `REQ-019`, `REQ-020`, `REQ-021`, `REQ-049`, `REQ-050`, `REQ-051`, `REQ-052`
- `TS-011` The `Board & Word Mechanics` tab hosts word-selection controls and blank-layout controls.
  - Implements: `REQ-029`, `REQ-030`, `REQ-031`, `REQ-032`, `REQ-033`, `REQ-034`, `REQ-055`, `REQ-056`, `REQ-057`, `REQ-058`

## 4. Core Board Rules

- `TS-012` Boards are square grids whose cells are either `tile` or `block`.
  - Implements: `REQ-005`, `REQ-007`
- `TS-013` Player paths are orthogonal only and do not permit diagonal steps.
  - Implements: `REQ-008`, `REQ-009`
- `TS-014` Each word is stored as an ordered path of board indices.
  - Implements: `REQ-010`, `REQ-011`, `REQ-067`, `REQ-068`
- `TS-015` Solving the puzzle means every hidden word has been found and every playable tile has been claimed.
  - Implements: `REQ-012`, `REQ-013`

## 5. Input Handling

- `TS-016` Pointer-drag input is supported through pointer events on the board.
  - Implements: `REQ-015`
- `TS-017` Tap-building is supported through tile button clicks, and tap-only submission happens by tapping the current path end tile again.
  - Implements: `REQ-016`
- `TS-018` Undo-aware backtracking is supported by allowing reversal to the immediately previous tile in the active path.
  - Implements: `REQ-059`
- `TS-019` Invalid moves are ignored or rejected without mutating the solved board state.
  - Implements: `REQ-065`

## 6. Seed And Puzzle Identity

- `TS-020` Every generated puzzle has a normalized reproducible seed key.
  - Implements: `REQ-017`, `REQ-020`, `REQ-054`, `REQ-071`
- `TS-021` The URL query parameter `?seed=...` is the externally shareable puzzle identity format.
  - Implements: `REQ-019`, `REQ-021`, `REQ-052`
- `TS-022` Daily boards are derived from the current day token and the selected board configuration.
  - Implements: `REQ-003`, `REQ-022`
- `TS-023` Practice boards are derived from a deterministic local practice variant counter and the selected board configuration.
  - Implements: `REQ-004`, `REQ-023`, `REQ-024`, `REQ-025`

## 7. Word Selection Mechanics

- `TS-024` The word-selection modes are `any`, `contains-z`, `contains-x`, `contains-q`, `contains-ing`, `contains-mm`, `starts-with`, and `fixed-length`.
  - Implements: `REQ-029`, `REQ-030`, `REQ-031`, `REQ-032`
- `TS-025` The `starts-with` mode sanitizes input to one alphabetic character and filters candidate words by prefix.
  - Implements: `REQ-033`, `REQ-069`
- `TS-026` The `fixed-length` mode sanitizes `N` into the supported `4..12` range and filters candidate words by exact length.
  - Implements: `REQ-034`, `REQ-070`
- `TS-027` Constrained word modes only use dictionary-backed words that satisfy the active constraint.
  - Implements: `REQ-069`, `REQ-072`, `REQ-073`

## 8. Blank Layout Mechanics

- `TS-028` The blank-layout modes are `default`, `no-blanks`, `verticals`, `horizontals`, `straights`, `diag-slash`, `diag-backslash`, and `diag-both`.
  - Implements: `REQ-055`, `REQ-056`, `REQ-057`
- `TS-029` Patterned blank modes generate blocked geometry first and then derive playable slots from the remaining runs.
  - Implements: `REQ-075`, `REQ-078`, `REQ-080`
- `TS-030` `No blanks` mode suppresses intentionally seeded blank patterns, but may still blank out leftover cells when the active word constraint cannot legally fill the entire board.
  - Implements: `REQ-076`
- `TS-031` The blank percent, blank count, and blank fill-character controls are only shown for patterned blank modes.
  - Implements: `REQ-058`, `REQ-087`
- `TS-032` The selected blank fill character is rendered only inside blocked cells.
  - Implements: `REQ-079`

## 9. Layout And Path Generation

- `TS-033` Default-layout generation uses randomized non-overlapping word paths across the board.
  - Implements: `REQ-066`, `REQ-067`, `REQ-068`, `REQ-071`, `REQ-080`
- `TS-034` The default non-patterned generator family explicitly reserves turning paths and targets at least 25% corner-turning eligible words when the chosen word plan allows that distribution.
  - Implements: `REQ-077`
- `TS-035` If a fragment cannot satisfy the active word rule, the generator may convert excess cells into blanks instead of forcing an invalid word path.
  - Implements: `REQ-074`
- `TS-036` Deterministic replay is preserved by seeding all generation decisions from the normalized puzzle seed.
  - Implements: `REQ-054`, `REQ-071`

## 10. Board Rendering

- `TS-037` The board renders one visual cell per logical board coordinate using CSS grid.
  - Implements: `REQ-081`
- `TS-038` Tile font size, spacing, radii, and badges scale with board density.
  - Implements: `REQ-082`
- `TS-039` The layout collapses responsively on smaller screens without requiring horizontal scrolling.
  - Implements: `REQ-083`
- `TS-040` Solved words render with persistent tile coloring, connector bars, arrows, and end markers.
  - Implements: `REQ-047`, `REQ-048`, `REQ-085`
- `TS-041` The current path display mirrors the live active path letters.
  - Implements: `REQ-084`

## 11. Progress, Assistance, And Persistence

- `TS-042` `Hint`, `Solve`, `Reset`, and `Undo` mutate only the current board progress state and not the board identity.
  - Implements: `REQ-060`, `REQ-061`, `REQ-062`, `REQ-063`, `REQ-064`
- `TS-043` Invalid submissions apply temporary visual feedback and do not incorrectly advance solved progress.
  - Implements: `REQ-065`
- `TS-044` Solved words persist visually on the board and in the slot list.
  - Implements: `REQ-085`
- `TS-045` Solved-state feedback is presented through the solved banner and sidebar messaging.
  - Implements: `REQ-086`
- `TS-046` In-progress state is stored in local storage under a puzzle-identity key and restored on reload.
  - Implements: `REQ-089`

## 12. Accessibility And Semantics

- `TS-047` Tiles are rendered as buttons with accessible labels, and controls use semantic input, select, button, and details or summary elements.
  - Implements: `REQ-088`
- `TS-048` Hidden conditional configuration fields use real `hidden` layout removal rather than visual-only hiding.
  - Implements: `REQ-087`

## 13. Testability Contract

- `TS-049` The repository contains a Playwright-based test suite that validates UI, generation invariants, document numbering, and requirement traceability.
  - Implements: `REQ-090`
- `TS-050` The test harness is intended to be rerun from `run-all-tests.sh` and to save timestamped outputs under `test-results/`.
  - Implements: `REQ-090`

## 14. Requirement Reference Index

The current implementation references every numbered requirement from `REQUIREMENTS.md`:

`REQ-001`, `REQ-002`, `REQ-003`, `REQ-004`, `REQ-005`, `REQ-006`, `REQ-007`, `REQ-008`, `REQ-009`, `REQ-010`,
`REQ-011`, `REQ-012`, `REQ-013`, `REQ-014`, `REQ-015`, `REQ-016`, `REQ-017`, `REQ-018`, `REQ-019`, `REQ-020`,
`REQ-021`, `REQ-022`, `REQ-023`, `REQ-024`, `REQ-025`, `REQ-026`, `REQ-027`, `REQ-028`, `REQ-029`, `REQ-030`,
`REQ-031`, `REQ-032`, `REQ-033`, `REQ-034`, `REQ-035`, `REQ-036`, `REQ-037`, `REQ-038`, `REQ-039`, `REQ-040`,
`REQ-041`, `REQ-042`, `REQ-043`, `REQ-044`, `REQ-045`, `REQ-046`, `REQ-047`, `REQ-048`, `REQ-049`, `REQ-050`,
`REQ-051`, `REQ-052`, `REQ-053`, `REQ-054`, `REQ-055`, `REQ-056`, `REQ-057`, `REQ-058`, `REQ-059`, `REQ-060`,
`REQ-061`, `REQ-062`, `REQ-063`, `REQ-064`, `REQ-065`, `REQ-066`, `REQ-067`, `REQ-068`, `REQ-069`, `REQ-070`,
`REQ-071`, `REQ-072`, `REQ-073`, `REQ-074`, `REQ-075`, `REQ-076`, `REQ-077`, `REQ-078`, `REQ-079`, `REQ-080`,
`REQ-081`, `REQ-082`, `REQ-083`, `REQ-084`, `REQ-085`, `REQ-086`, `REQ-087`, `REQ-088`, `REQ-089`, `REQ-090`
