# WordFinder Technical Specification

## 1. Overview

`WordFinder` is a browser-based word-path puzzle inspired by LinkedIn's Wend.
The application is implemented as a static single-page web app and is designed to run entirely in
the browser without a backend.

Players solve each board by tracing every hidden word path so that all playable letter tiles are
used exactly once.

This document describes the current build as shipped, including:

- product behavior
- UI layout and user interaction
- deterministic board generation
- word-generation modes
- seed handling
- persistence
- deployment model

## 2. Product Goals

- Deliver a fast, static, self-contained puzzle experience.
- Support deterministic daily puzzles and unlimited deterministic practice puzzles.
- Allow advanced replayability through visible/custom seeds.
- Provide enough controls for debugging, exploration, and constrained puzzle variants without
  requiring a server or editorial backend.

## 3. Platform And Runtime

- Runtime: client-side JavaScript in a browser
- Delivery: static hosting
- Primary public deployment: GitHub Pages
- Internal packaging artifact: `dist/index.js`
- Current main application document: `index.html`
- Archived earlier prototype page: `v1.html`

No server process, API, or database is required.

## 4. Core Game Rules

- The board is a square grid.
- Each cell is either:
  - a playable letter tile
  - a blocked cell
- Valid movement is orthogonal only:
  - up
  - down
  - left
  - right
- Diagonal steps are not allowed.
- Each hidden answer word occupies one exact path.
- A tile may belong to only one final word.
- A guessed word only counts if the player traces the exact stored path.
- The puzzle is solved only when every hidden word is found and all playable tiles are consumed.

## 5. Application Structure

The current implementation is centered in `index.html` and contains:

- HTML structure
- CSS styling
- inlined puzzle logic
- rendering logic
- input handling

An additional generated data file, `word-pools.js`, contains dictionary-backed word pools used by
the constrained word-generation modes.

Key supporting files:

- `README.md`
- `REQUIREMENTS.md`
- `BUILD.md`
- `TECHNICAL_SPECIFICATION.md`
- `scripts/build-worker.mjs`
- `dist/index.js`

## 6. High-Level UI Layout

The page is split into two main regions:

### Left Panel

- Title and subtitle
- Mode pills
- Main puzzle board
- Board legend

### Right Panel / Sidebar

- Metrics
  - found count
  - hint count
  - elapsed time
- Mode controls
  - `Daily board`
  - `New practice board`
- Configuration controls
  - grid size
  - seed
  - word selection
  - conditional start-letter field
  - conditional fixed-length field
  - solved-color mode
- Board action controls
  - `Submit path`
  - `Undo`
  - `Hint`
  - `Solve`
  - `Reset`
- Current path display
- status/help message
- solved banner
- hidden-word slot list
- implementation notes panel

## 7. UI Behavior Specification

### 7.1 Metrics

The sidebar metrics display:

- `Found`: solved words out of total words
- `Hints`: total hints consumed
- `Time`: elapsed timer for the active board

### 7.2 Mode Controls

#### Daily Board

- Loads the deterministic daily puzzle for the currently selected grid size.
- Daily puzzles are derived from the current day plus the active grid size and current word mode.

#### New Practice Board

- Generates the next deterministic practice puzzle for the current grid size and word mode.
- Practice boards increment a local practice variant counter.
- Pressing this control must clear any carried-over solved state, hints, invalid state, and active path.

### 7.3 Grid Size

- Supported sizes: `4x4` through `20x20`
- The app uses square boards only.
- Changing the grid size reloads the current mode using the new size.
- The visible seed is rewritten to use the new `NxN:` prefix while preserving the seed body.

### 7.4 Seed Controls

The seed field is both informational and interactive.

#### Requirements

- Always show the current normalized seed.
- Allow the user to type a custom seed.
- Include an `Apply seed` button.
- Support Enter key submission from the seed field.

#### Normalization Rules

- Every seed must start with the selected grid size prefix:
  - example: `5x5:daily-20659|words=any`
  - example: `12x12:hello-world|words=z`
- The seed also encodes the current word-selection mode.

#### Behavior

- Applying a custom seed loads a deterministic practice board from that exact seed.
- The resulting puzzle must be reproducible if the same grid size, seed body, and word mode are used again.

### 7.5 Word Selection Dropdown

The application exposes a `Word selection` dropdown with these modes:

- `Any words`
- `Only words with Z`
- `Only words with X`
- `Only words with Q`
- `Only words with ING`
- `Only words with MM`
- `Words beginning with...`
- `Only N-letter words`

#### Conditional Controls

##### Starting letter

- Only visible for `Words beginning with...`
- Accepts a single alphabetic letter
- Non-letter input is sanitized away

##### Word length N

- Only visible for `Only N-letter words`
- Integer only
- Valid range: `4` through `12`

The controls must be truly hidden from layout when inactive, not merely visually faded.

### 7.6 Solved Colors Dropdown

The application supports multiple solved-word coloring styles:

- Different hues
- Different saturation
- Different values
- Named palettes

Named palettes currently include multiple curated options such as:

- `Citrus Grove`
- `Seaside Glass`
- `Desert Bloom`
- `Forest Canopy`
- `Sunset Drive`
- `Vintage Poster`
- `Aurora Pop`
- `Studio Paint`
- `Midnight Neon`

Each solved word applies its color style to:

- solved tiles
- connector bars
- arrow markers
- end markers

### 7.7 Board Action Controls

#### Submit Path

- Validates the active path against unsolved hidden words.
- Only exact path matches are accepted.

#### Undo

- Removes the last step from the active path.

#### Hint

- Reveals one additional step for the next unsolved word.

#### Solve

- Marks every word as solved immediately.
- Clears the in-progress path.
- Updates solved-state messaging.

#### Reset

- Resets current board progress:
  - found words
  - hints
  - invalid highlight state
  - active path
  - timer start time

### 7.8 Current Path And Status Area

The sidebar displays:

- the letters currently traced by the player
- a helper/status message

Messages should communicate:

- neutral instruction
- success feedback
- invalid submission feedback
- solved-state feedback

### 7.9 Word Slot List

Each hidden word appears as a slot in the sidebar.

Slot content includes:

- word length label
- solved/hidden state
- revealed letters if hinted
- full word if solved

## 8. Board Rendering Rules

### 8.1 Tile Types

Each board cell is rendered as either:

- a playable tile
- a blocked cell

### 8.2 Visual States

Playable tiles may appear in these states:

- idle
- active path
- solved
- hinted
- invalid

### 8.3 Solved Connectors

When a word is solved:

- adjacent tiles in that word are visually connected using path bars
- the solved path should read as one continuous shape

The active in-progress path receives similar connector treatment.

### 8.4 Start And End Markers

Solved and active paths display:

- start marker: open circle plus outgoing arrow
- end marker: filled circle

### 8.5 Scaling

Board rendering must scale based on grid density:

- tile size
- tile font size
- hint index size
- arrow size
- corner radius
- grid gap

This scaling must preserve usability through `20x20`.

## 9. Input And Interaction Model

### 9.1 Pointer Drag

Supported for:

- mouse
- touch
- stylus

Dragging across adjacent tiles extends the active path.

### 9.2 Tap-To-Build

Alternative interaction path:

- tap first tile to start
- tap adjacent tiles to extend
- tap previous tile to backtrack one step
- submit with `Submit path`

### 9.3 Move Rules

- Ignore non-adjacent moves.
- Ignore attempts to reuse a tile already in the current unsolved path.
- Prevent interaction with solved/locked tiles.

### 9.4 Invalid Submission

If a path does not match any unsolved word:

- mark the path temporarily invalid
- clear the active path
- show a short-lived error state

## 10. Puzzle Generation Model

## 10.1 Determinism

Puzzle generation is deterministic from the seed family:

- mode
- grid size
- seed body
- word-selection mode

For equivalent inputs, the app must reproduce:

- blocked layout
- playable path
- word-length partition
- assigned words
- letters on tiles

## 10.2 Board Shape Generation

The current generator is two-stage:

### Stage 1: Blocked Region Generation

- derive a coarse deterministic mask from the seed
- seed multiple blocked regions
- grow them into chunkier blocked clusters

### Stage 2: Path Carving

- find a single contiguous playable path through remaining open space
- prefer bends and less obvious patterns
- reject branches that strand too much unusable space

Fallback logic exists for resilience if the preferred search path fails repeatedly.

## 10.3 Search Strategy

The path-growth algorithm uses depth-first search with heuristics.

Key helper behavior includes:

- neighbor enumeration
- direction tracking
- turn preference
- reachable-space pruning
- backtracking if a branch fails

The goal is to construct one valid hidden path that can later be partitioned into words.

## 10.4 Target Playable Length

The generator computes a target playable cell count from:

- grid dimensions
- density heuristic
- optional fixed-length word mode

For fixed-length mode:

- target playable count must be divisible by the chosen word length

For constrained word modes:

- target playable count must still be partitionable into valid lengths supported by the available word pool

## 11. Word-Length Planning

The hidden path is partitioned into multiple word lengths.

### Default Behavior

- Minimum word length: `4`
- Maximum word length: capped at `12`
- Bias alternates across short/medium/long bands
- Repetition of the same length is penalized

### Fixed-Length Mode

- Every word must use exactly the selected `N`
- The total playable path is chosen so it can be divided cleanly by `N`

### Constrained Modes

The planner must reject length combinations that have no real-word candidates in the active word pool.

## 12. Word Source Strategy

## 12.1 General Word Pools

The build uses embedded client-side word data.

Sources:

- curated built-in legacy bank
- dictionary-derived general pools
- dictionary-derived constrained pools

## 12.2 Constrained Pools

Special pools exist for:

- `contains-z`
- `contains-x`
- `contains-q`
- `contains-ing`
- `contains-mm`

These pools are stored in `word-pools.js`.

## 12.3 Starting-Letter Mode

For `Words beginning with...`:

- draw from general real-word pools
- filter by starting letter

## 12.4 Fixed-Length Mode

For `Only N-letter words`:

- constrain every selected word to the chosen `N`

## 12.5 No Fabricated Filler

The shipped build must not invent fake words for constrained modes simply to fill a board.

If a constrained mode lacks valid words for a given length:

- that length must be excluded from planning

## 13. Seed Model

Every active puzzle has a normalized seed key.

Seed components:

- grid size prefix
- seed body
- encoded word mode suffix

Examples:

- `5x5:daily-20659|words=any`
- `5x5:hello|words=z`
- `8x8:practice-3|words=starts-a`
- `10x10:test-run|words=n-6`

The seed is part of:

- puzzle identity
- reproducibility
- storage key derivation

## 14. Persistence

Persistence uses browser `localStorage` only.

Stored per puzzle id:

- solved word indexes
- hint state
- start time

No remote sync is implemented.

## 15. Daily And Practice Identity

### Daily

- one puzzle per day per grid size per word mode
- deterministic from day number

### Practice

- deterministic from an incrementing practice variant
- user may override using custom seed input

## 16. Data Model

A materialized puzzle object must include:

- `id`
- `name`
- `seedKey`
- `rows`
- `cols`
- `cells`
- `words`
- `playableCount`

Each playable cell must include:

- `type`
- `letter`
- `wordIndex`
- `step`

Each word entry must include:

- `text`
- `path`

## 17. Accessibility

- Use semantic button/select/input controls.
- Preserve visible focus styling.
- Expose tile letter labels for assistive technology.
- Do not rely on color alone to indicate state.
- Maintain a non-drag path-building interaction.

## 18. Performance Expectations

- Boards must generate quickly in-browser.
- The app must remain usable on dense boards up to `20x20`.
- Rendering and input response should remain immediate on modern desktop and mobile browsers.

## 19. Deployment Model

### Public

- GitHub Pages
- URL: `https://tamclaw1000.github.io/WordFinder/`

### Internal / Packaging

- OpenAI Sites packaging artifact via `dist/index.js`
- Build helper script: `scripts/build-worker.mjs`

## 20. Versioning

- The page exposes a visible version chip.
- The document title includes the current version.
- Git tags use the `v00.00.xx` format.

## 21. Current Shipped State

At the time of this specification update:

- latest repo commit: `3cb38cc`
- latest app release line: `v00.00.30`
- latest docs refresh: `3cb38cc`

## 22. Future Extension Areas

- curated or hybrid editorial puzzle sets
- stronger puzzle-uniqueness guarantees
- difficulty scoring
- share/export flow
- keyboard-first board traversal
- formal solver validation
