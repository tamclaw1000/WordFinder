# WordFinder Web App Requirements

This document captures the current shipped behavior of `WordFinder` as numbered, testable
requirements. Every requirement is identified by a stable `REQ-XXX` identifier so the Playwright
suite can trace implementation coverage directly back to the product contract.

## 1. Product And Scope Requirements

- `REQ-001` The application shall provide a browser-based word-path puzzle inspired by LinkedIn's Wend.
- `REQ-002` The application shall run as a single-page static web app without requiring a backend service.
- `REQ-003` The application shall support deterministic daily boards.
- `REQ-004` The application shall support unlimited deterministic practice boards.
- `REQ-005` The application shall support square grid sizes from `4x4` through `20x20`.
- `REQ-006` The application shall keep the main screen focused on gameplay while moving configuration into a popup settings dialog.

## 2. Core Gameplay Requirements

- `REQ-007` The board shall contain both playable letter tiles and blocked cells unless `No blanks` mode is active.
- `REQ-008` Valid movement shall be orthogonal only: up, down, left, or right.
- `REQ-009` Diagonal movement shall not be accepted as a valid player path step.
- `REQ-010` A playable tile shall belong to at most one final solution word.
- `REQ-011` A submitted word shall only count when the player traces the exact hidden stored path.
- `REQ-012` The board shall be considered solved only when every hidden word has been found.
- `REQ-013` The board shall also require that every playable tile is consumed by the solved word set.
- `REQ-014` The UI shall expose hidden word lengths without exposing unsolved word text.
- `REQ-015` The app shall support pointer drag submission for mouse, touch, and stylus.
- `REQ-016` The app shall support tap-built path submission by tapping the current end tile again.

## 3. Puzzle Identity, Mode, And Seed Requirements

- `REQ-017` The app shall surface the active normalized seed to the user.
- `REQ-018` The user shall be able to enter a custom seed and apply it.
- `REQ-019` The current seed shall be mirrored into the URL as `?seed=...`.
- `REQ-020` The seed shall encode the active reproducible configuration rather than only a base daily or practice token.
- `REQ-021` Loading a `?seed=...` URL shall restore the encoded configuration before puzzle generation.
- `REQ-022` Daily board identity shall be deterministic per day and grid size.
- `REQ-023` Practice board identity shall be deterministic from a local practice variant counter and the active configuration.
- `REQ-024` Starting a new practice board shall generate a different deterministic practice variant than the previous one.
- `REQ-025` Daily and practice progress shall remain logically distinct.

## 4. Configuration Surface Requirements

- `REQ-026` The settings dialog shall provide a `UI` tab.
- `REQ-027` The settings dialog shall provide a `Game Configuration` tab.
- `REQ-028` The settings dialog shall provide a `Board & Word Mechanics` tab.
- `REQ-029` The `Word selection` control shall provide `Any words`.
- `REQ-030` The `Word selection` control shall provide the constrained modes `Z`, `X`, `Q`, `ING`, and `MM`.
- `REQ-031` The `Word selection` control shall provide a `Words beginning with...` mode.
- `REQ-032` The `Word selection` control shall provide an `Only N-letter words` mode.
- `REQ-033` The `Starting letter` field shall only appear when the `Words beginning with...` mode is active.
- `REQ-034` The `Word length N` field shall only appear when the fixed-length mode is active.

## 5. Main UI And Navigation Requirements

- `REQ-035` The main screen shall include a top-right `Menu`.
- `REQ-036` The main menu shall include `New practice board`.
- `REQ-037` The main menu shall include `Settings`.
- `REQ-038` The main menu shall include an `Archived versions` submenu.
- `REQ-039` The archived submenu shall include a link to `v3.html`.
- `REQ-040` The archived submenu shall include a link to `v2.html`.
- `REQ-041` The archived submenu shall include a link to `v1.html`.
- `REQ-042` The main board surface shall display the current mode label.
- `REQ-043` The main board surface shall display the current puzzle label.
- `REQ-044` The sidebar shall display found-word progress.
- `REQ-045` The sidebar shall display hints used.
- `REQ-046` The sidebar shall display elapsed time.

## 6. UI Control And Replay Requirements

- `REQ-047` The `Solved colors` control shall provide the modes `Different hues`, `Different saturation`, and `Different values`.
- `REQ-048` The `Solved colors` control shall provide named palette options.
- `REQ-049` The `Grid size` control shall reload the active mode using the new grid size.
- `REQ-050` The `Apply seed` control shall regenerate the exact board represented by the entered normalized seed.
- `REQ-051` The seed field shall support Enter-key submission.
- `REQ-052` Changing any relevant configuration shall rewrite the URL seed to the current full reproducible state.
- `REQ-053` The settings dialog shall allow reopening and tab switching without breaking the active puzzle state.
- `REQ-054` The app shall preserve deterministic replay for a given `{seed, grid size, word mode, blank layout}` combination.
- `REQ-055` The `Blank layout` control shall provide `Default` and `No blanks`.
- `REQ-056` The `Blank layout` control shall provide `Verticals`, `Horizontals`, and `Straights`.
- `REQ-057` The `Blank layout` control shall provide `Diagonals /`, `Diagonals \`, and `Diagonals both`.
- `REQ-058` The blank percent, blank count, and blank fill-character fields shall only appear when the selected blank layout requires them.

## 7. Board Actions And Progress Requirements

- `REQ-059` The `Undo` action shall remove the last step in the active unsolved path.
- `REQ-060` The `Hint` action shall reveal the next step count for the next unsolved word.
- `REQ-061` The `Solve` action shall reveal all remaining words.
- `REQ-062` The `Solve` action shall mark the board complete.
- `REQ-063` The `Solve` action shall clear any in-progress path state.
- `REQ-064` The `Reset` action shall clear found words, hints, invalid state, and active path for the current board.
- `REQ-065` The app shall provide temporary visual feedback for invalid submissions.
- `REQ-066` Generated boards shall partition their playable tiles into multiple words.
- `REQ-067` Word paths shall be contiguous and orthogonal.
- `REQ-068` Word paths shall not overlap one another.
- `REQ-069` Generated words in constrained modes shall satisfy the active constraint.
- `REQ-070` Fixed-length generation shall emit only words whose length matches `N`.

## 8. Generation Algorithm Requirements

- `REQ-071` The generator shall be deterministic for a given reproducible seed and configuration.
- `REQ-072` The generator shall support dictionary-backed word pools for both unconstrained and constrained generation.
- `REQ-073` The generator shall avoid selecting word lengths that have no valid dictionary-backed candidates for the active mode.
- `REQ-074` When a remaining fragment cannot satisfy the active word rule, the generator shall be allowed to convert those cells into blanks.
- `REQ-075` Patterned blank modes shall generate the blank pattern first and then fill the remaining valid playable runs with words.
- `REQ-076` `No blanks` mode shall avoid intentionally seeded blank patterns, while still allowing leftover cells to blank out if the active word constraint cannot legally consume them.
- `REQ-077` The default non-patterned generator family shall actively bias toward turning words and target at least 25% corner-turning eligible words where the selected word plan allows it.
- `REQ-078` Blank percent and blank count settings shall influence the number of blocked cells in patterned blank modes.
- `REQ-079` The selected blank fill character shall be rendered only inside blocked cells.
- `REQ-080` Generated boards shall remain stable and finite across all supported board sizes and generation combinations.

## 9. Rendering, Interaction, And Accessibility Requirements

- `REQ-081` The board shall render one cell per logical board coordinate and avoid tile or block overlap.
- `REQ-082` The board shall remain legible across `4x4` through `20x20`.
- `REQ-083` The UI shall remain usable on both desktop and mobile layouts without horizontal scrolling.
- `REQ-084` The active current-path display shall reflect the letters currently traced by the player.
- `REQ-085` Solved words shall remain visible in both the board and slot list.
- `REQ-086` The solved-state banner shall display completion feedback after the puzzle is solved.
- `REQ-087` Conditionally inactive fields shall actually be removed from layout, not merely faded.
- `REQ-088` Tiles and controls shall use semantic interactive elements with visible focus treatment and accessible labels.

## 10. Persistence, Packaging, And Quality Requirements

- `REQ-089` The app shall persist in-progress board state in local storage keyed by puzzle identity and restore it when reopening the same board.
- `REQ-090` The repository shall provide an automated Playwright-based test suite that can be rerun end-to-end from `run-all-tests.sh` with timestamped result summaries.
