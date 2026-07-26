# WordFinder Web App Requirements

## 1. Purpose

Build a browser-based word-path puzzle inspired by LinkedIn's Wend.
Players solve a board by finding every hidden word path so that every playable letter tile is
used exactly once.

This document is reverse-engineered from the current prototype so the requirements match the app
that is actually shipping, not just the original concept.

## 2. Product Position

- Deliver a fast, self-contained daily puzzle that works as a static website.
- Support unlimited practice boards generated from the same deterministic algorithm as the daily board.
- Keep the MVP small: single page, local state only, no account system, no backend requirement.

## 3. MVP Scope

### In Scope

- Daily and practice modes.
- Square grid sizes from `4x4` through `20x20`.
- Generated boards with blocked cells.
- Drag and tap path entry.
- Hidden word-length slots.
- Hint, undo, reset, solve, timer, and solved-state feedback.
- Visible seed display plus user-entered custom seeds.
- URL-synced reproducible seeds that include active configuration.
- Solved-word color mode selection.
- Word-selection constraints for themed/generated board vocab.
- Multiple blank-layout generation modes and controls.
- Local browser persistence for in-progress boards.
- Static-site deployment to GitHub Pages.

### Out Of Scope

- Multiplayer, leaderboards, or streak services.
- Server-side puzzle storage or accounts.
- User-authored puzzles.
- Dictionary validation of arbitrary user-entered words.
- Native mobile apps.
- Keyboard-first board navigation beyond basic button accessibility.

## 4. Core Gameplay Rules

- The board is a square grid containing playable letter tiles and blocked cells.
- A valid move may only continue orthogonally: up, down, left, or right.
- Diagonal movement is not allowed.
- A tile may appear in at most one answer word.
- The player must trace the exact hidden path for a word; same letters in a different route do not count.
- The board is solved only when every solution word has been found and every playable tile is claimed.
- The UI exposes the length of each hidden word but not the word itself.

## 5. Implemented Modes

### Daily Puzzle

- One deterministic board is generated per grid size per day.
- Daily board identity is based on the current day number and selected grid size.
- The same browser on the same date and size receives the same board layout and word set.

### Practice Puzzle

- Practice boards are deterministic by incrementing a local variant counter per selected grid size.
- Users can request unlimited additional practice boards.
- Practice progress is isolated from daily progress.

### Seeded Puzzle Variants

- Every board exposes its normalized seed in the UI.
- Users may enter a custom seed and regenerate that exact board on demand.
- The active board seed must also be mirrored into the URL as `?seed=...`.
- The shared seed must encode the active reproducible configuration, including:
  - base daily/practice token
  - grid size
  - word-selection mode
  - blank-layout mode and related parameters
- Loading a URL with `?seed=...` must restore that encoded configuration before generating the board.

## 6. User Stories

- As a player, I want to open the page and start immediately.
- As a player, I want to drag through letters naturally on touch and desktop.
- As a player, I want to tap letters as an alternative to dragging.
- As a player, I want to see the pattern of target word lengths so I can reason about the partition.
- As a player, I want blocked cells to shape the puzzle and increase constraint.
- As a player, I want hints, undo, and reset so I can recover from dead ends.
- As a player, I want a solve button so I can reveal the full answer when I am stuck.
- As a player, I want the same board to remain in progress if I refresh the page on the same device.
- As a player, I want to share or replay a board by using its visible seed.
- As a player, I want optional themed word constraints such as `Z`, `Q`, or fixed word length.
- As a player, I want large boards to remain legible on mobile and desktop.
- As a player, I want the main screen to stay focused on gameplay while advanced controls live in a popup.
- As a player, I want a compact top-right menu for non-board actions and archive links.

## 7. Functional Requirements

### Board Rendering

- Render a square board with both playable and blocked cells.
- Render blocked cells as dark wall tiles clearly distinct from playable cells.
- Render current path, solved tiles, hinted tiles, and invalid attempts with distinct visual states.
- Render word slots that show only word length until solved or hinted.

### Input

- Support pointer drag for mouse, touch, and stylus input.
- Support tap-to-build as a fallback interaction.
- Support tap-to-submit by tapping the active path end tile again.
- Allow backtracking by moving to the immediately previous tile in the active path.
- Ignore non-adjacent moves and attempts to reuse tiles already in the active path.

### Validation

- Validate a submission by exact path match against an unsolved hidden word.
- Reject incorrect paths with temporary visual feedback.
- Prevent already solved words from being claimed twice.

### Progress

- Track found word count, hint count, elapsed time, and solved state.
- Persist daily/practice board progress in local storage keyed by puzzle id.
- Restore persisted progress when the same board is reopened.
- Starting a new practice board must clear carried-over solved values, hints, and active-path state.

### Assistance

- `Undo` removes the last step in the active unsolved path.
- `Reset` clears found words, hints, invalid states, and timer progress for the current board.
- `Hint` reveals the next step count for the next unsolved word.
- `Solve` reveals all remaining words, marks the board complete, and clears in-progress path state.

### Configuration

- Move configuration out of the main gameplay surface and into a popup settings dialog.
- Split the settings dialog into these tabs:
  - `UI`
  - `Game Configuration`
  - `Board & Word Mechanics`
- Provide a solved-color dropdown with multiple rendering modes:
  - different hues
  - different saturation
  - different values
  - named palettes
- Provide a word-selection dropdown with the following modes:
  - any words
  - only words containing `Z`
  - only words containing `X`
  - only words containing `Q`
  - only words containing `ING`
  - only words containing `MM`
  - only words beginning with a user-chosen letter
  - only words of user-chosen length `N`
- Show the `Starting letter` field only for the `begins with` mode.
- Show the `Word length N` field only for the fixed-length mode.
- Provide a top-right menu for non-board actions.
- The top-right menu must contain:
  - `New practice board`
  - `Settings`
  - archived version links inside a submenu

### Completion

- Show solved-state messaging with elapsed time and hints used.
- Keep solved words visible on the board and in the slot list.
- Allow the user to switch modes or load another practice puzzle after solving.

## 8. Prototype Generation Algorithm Requirements

The current MVP depends on deterministic procedural puzzle generation instead of hand-authored
puzzle files. Any requirements for the prototype must therefore reflect the current generator.

### Board Shape Generation

- The generator must create a single contiguous final playable path through the board.
- Non-playable cells must be emitted as blocked cells.
- The blocked-cell silhouette should not read as a simple leftover trace around one snake path.
- The current prototype now uses a two-stage deterministic layout:
  - seed a pseudo-random generator from mode, variant/date, and grid size
  - choose a target playable density that decreases as the grid gets larger
  - generate several independent blocked-cell regions on a coarse mask
  - expand those coarse regions into chunkier blocked shapes on the final board
  - carve the final orthogonally contiguous playable path through the remaining available space
- The path-carving phase still prefers turns, avoids prematurely stranded space, and aims to keep
  the final board non-trivial to read at a glance.
- If the blocked-region-first search fails repeatedly, the generator may fall back to a simpler
  deterministic layout, but fallback behavior should be rare and treated as a resilience path.

### Word-Length Planning

- Generated boards must partition the playable path into multiple words.
- Word lengths must currently stay within a bounded prototype-friendly range:
  - minimum `4`
  - maximum based on board size, capped at `12`
- The length planner must avoid collapsing the whole board into nearly uniform word sizes.
- The current prototype biases toward alternating short, medium, and long bands and penalizes repeating
  the same length too often.

### Letter Assignment

- Each word path is assigned a deterministic word string derived from the same seed family.
- Use deterministic dictionary-backed word pools for normal and constrained word modes.
- For constrained modes (`Z`, `X`, `Q`, `ING`, `MM`), only emit real dictionary-backed words that
  satisfy the selected constraint.
- The length planner must avoid selecting word lengths that have no valid real-word candidates for
  the active constraint.
- Letters are written onto the board strictly according to the hidden path order.

### Determinism

- For a given `{rows, cols, mode, variant/date}` input, generated layout, word lengths, and letters
  must be reproducible.
- Daily boards should therefore be stable without server coordination.

## 9. Data Model Requirements

Each materialized puzzle must expose:

- puzzle id
- puzzle name
- normalized seed key
- row count
- column count
- ordered word list
- exact cell path for each word
- cell array describing `tile` or `block`
- letter, word index, and step index for each playable tile
- playable tile count

## 10. UX Requirements

- The board must stay legible from `4x4` through `20x20`.
- Tile letter size, hint badge size, spacing, and corner radius must scale with board density.
- Tile letters must appear visually centered within each tile.
- Solved words must render with connector bars between adjacent tiles so each word reads as one
  continuous claimed path.
- Start-of-word and end-of-word markers must be visually distinct.
- The page should remain usable without horizontal scrolling on common phone widths.
- Invalid actions should be noticeable but brief.
- The presentation should remain calm and uncluttered.
- The primary screen should emphasize gameplay over configuration.
- Archived version links (`v2`, `v1`) should live under the main menu rather than repeated standalone cards.

## 11. Accessibility Requirements

- Controls must have semantic button/select markup.
- Playable tiles must expose letter labels for assistive technology.
- Color must not be the only state signal; solved/active/hinted states should differ by more than hue alone.
- Focus indication must remain visible for interactive controls.
- Tap input must provide a non-drag interaction path.
- Conditionally hidden configuration fields must actually be removed from layout and not merely
  visually obscured.

## 12. Technical Requirements

- The prototype must remain a single-page static web app.
- The current implementation may keep generation and rendering in one file, but puzzle logic must remain
  logically separable from display concerns.
- The app must run in current evergreen desktop and mobile browsers.
- Deployment must work via static hosting, currently GitHub Pages.
- Browser storage is the only persistence layer required for MVP.

## 13. Content And Admin Requirements

- No external admin UI is required for the procedural prototype.
- Future handcrafted daily puzzles remain a valid later extension, but are not required for the current build.
- If handcrafted puzzles are introduced later, they must still conform to the same path, adjacency,
  non-overlap, and full-coverage rules.

## 14. Success Criteria

- A player can load the site and start playing immediately.
- The same daily board is reproduced for the same day and grid size.
- Practice mode can generate multiple distinct deterministic boards.
- Generated boards contain blocked cells, non-trivial path shapes, and varied word lengths.
- Large boards remain visually readable and interactable.
- A board can be fully solved on desktop and touch devices with the provided controls.

## 15. Known Prototype Constraints

- The current shipped build uses embedded dictionary-derived word pools in the client, so vocabulary
  breadth is still finite even though it now covers constrained modes with real words.
- Constrained modes can reduce the available length set, which may produce less varied word-length
  mixes than unrestricted mode.
- Difficulty is heuristic rather than formally rated.
- The current generator is optimized for deterministic prototype speed and puzzle feel, not for formal
  uniqueness proofs or editorial quality guarantees.

## 16. Open Follow-Ups

- Should production boards move from procedural-only to curated or hybrid generation?
- Should the generator add stronger anti-obviousness checks, such as path-visibility scoring?
- Should hints be limited per board?
- Should solved results include share text or emoji summaries?
- Should future versions prove uniqueness of the intended partition rather than relying on heuristic difficulty?
