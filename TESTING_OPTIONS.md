# WordFinder Testing Options

## Purpose

This document describes the practical testing strategies available for `WordFinder`, ranging from
quick manual verification to stronger automated coverage.

The app is a deterministic, client-side single-page puzzle with:

- seed-driven board generation
- path-partition word generation
- variable grid sizes
- multiple word-selection modes
- multiple blank-layout modes
- responsive rendering and drag/tap interaction

Because of that combination, the best testing approach is layered rather than single-method.

## Testing Levels

## 1. Manual Seed Matrix Testing

This is the fastest and lowest-overhead option.

Use a fixed checklist of:

- grid sizes
- seeds
- word-selection modes
- blank-layout modes
- color modes

This is especially good for catching:

- visual overlap
- blank/tile misalignment
- large-grid rendering drift
- fields that should hide/show
- seed mismatch between controls and generated board

### Strengths

- very fast to start
- no tooling required
- good for reproducing user-reported bugs

### Weaknesses

- easy to miss edge cases
- not scalable for every release
- depends on human consistency

## 2. Deterministic Generator Assertions

This is the first code-level automated layer.

The idea is to run the generator for known seeds and assert stable structural properties.

Useful checks include:

- the same seed always produces the same board
- playable cell count matches the expected board result
- blocked cell count matches the expected board result
- total path length equals the sum of word lengths
- no duplicate cells appear in the final path
- every word path is contiguous and orthogonal
- the generated board honors the chosen blank-layout mode

### Strengths

- ideal for seed-based reproducibility
- catches logic regressions early
- cheap to run

### Weaknesses

- does not catch visual layout bugs by itself
- needs generator code to be testable outside raw DOM flow

## 3. Property Tests For Board Generation

This is the best way to catch “small boards work, large boards fail” generator issues.

Instead of asserting one exact output, property tests generate many seeds and verify invariants.

Good invariant checks:

- every word is a real word from the active pool
- every tile belongs to at most one solved path
- all final word paths together cover every playable cell exactly once
- the blank layout matches the selected blank mode
- blank percentage/count constraints are respected
- constrained word modes only emit words that satisfy the active filter
- full-board modes do not accidentally leave unreachable regions

### Strengths

- broad coverage with relatively little test code
- excellent for layout/generation edge cases
- strong fit for current blank-layout work

### Weaknesses

- failures can take longer to debug
- needs clear invariant definitions

## 4. DOM Or Component Tests In jsdom

This layer tests UI logic without launching a real browser.

Good candidates:

- conditional fields hide/show correctly
- seed text updates when settings change
- URL `?seed=` updates when configuration changes
- loading a `?seed=` URL restores the encoded configuration
- `New practice board` clears transient state
- `Apply seed` regenerates the correct puzzle mode
- blank fill characters only appear on blocked cells
- blank option controls only appear when relevant
- top-right menu opens/closes correctly

### Strengths

- faster than full browser testing
- useful for control and state transitions
- good fit for popup settings and configuration state logic

### Weaknesses

- cannot fully verify pointer drag behavior
- cannot fully verify visual alignment

## 5. Browser End-To-End Tests With Playwright

This is the strongest single option for the current app.

Playwright can test:

- actual browser rendering
- drag/tap interaction
- responsive layout
- large-board visual structure
- visibility of dynamic controls
- blank/tile overlap bugs

Recommended E2E coverage:

- open app and switch board modes
- open the top-right menu and verify menu actions
- change grid size
- change seed and reapply
- switch word-selection modes
- switch blank-layout modes
- verify conditional fields appear only when needed
- submit a valid or invalid path
- use hint, undo, solve, and reset
- verify tap-to-submit by tapping the current path end tile again
- verify archived version links live only in the menu submenu

### Strengths

- closest to real user behavior
- catches UI and layout bugs
- best fit for current reported issues

### Weaknesses

- slower than lower-level tests
- more setup effort

## 6. Visual Regression Or Screenshot Testing

This is a specialized browser-based layer focused on appearance.

Take snapshots of known boards and compare them on every change.

This is especially useful for:

- blank/tile misalignment
- connector overlap
- large-grid spacing drift
- block fill character placement
- responsive layout regressions
- top-right menu placement and overflow behavior

### Strengths

- excellent for subtle rendering regressions
- useful when changing CSS, geometry, or spacing

### Weaknesses

- needs careful snapshot baselines
- can be noisy if layouts are not fully deterministic

## 7. Performance Testing

This layer measures how the app behaves on larger boards.

Suggested focus:

- board generation time
- render time
- interaction responsiveness
- layout stability at `16x16` through `20x20`

This matters because some blank-layout modes can fail only on larger boards or slow down path
construction.

### Strengths

- helps prevent sluggish large-board releases
- useful for regression tracking

### Weaknesses

- usually supplements, not replaces, correctness tests

## Recommended Strategy

The recommended order for `WordFinder` is:

1. `Playwright` for UI and screenshot coverage
2. deterministic generator assertions for seed stability
3. property-style generator tests for broad invariant coverage

That combination gives:

- real browser validation
- reproducibility protection
- broad algorithm coverage

## Suggested First Test Matrix

Start with these grid sizes:

- `5x5`
- `10x10`
- `16x16`
- `20x20`

Start with these blank-layout modes:

- `default`
- `no-blanks`
- `verticals`
- `horizontals`
- `straights`
- `diag-slash`
- `diag-backslash`
- `diag-both`

Start with these blank control variants:

- blank percent only
- blank count override
- blank fill character set
- blank fill character empty

Start with these word-mode variants:

- `any`
- one constrained mode such as `contains-z`
- `starts-with`
- `fixed-length`

Also include these UI/state cases:

- popup settings tabs switch correctly
- URL seed changes when settings change
- reload from a generated `?seed=` URL restores grid/word/layout state
- no `Daily board` button is present
- no `Submit path` button is present

## Immediate Priority Bug Coverage

Given the currently reported issues, the first tests should target:

1. blank cells align exactly with tile grid at all supported board sizes
2. non-default blank layout modes do not break on large boards
3. blank option fields hide when not relevant

## Practical Recommendation

If only one testing investment is made next, it should be:

- `Playwright` plus a small deterministic seed matrix

If a second layer is added after that, it should be:

- generator invariant tests in Node

That gives the best balance of:

- coverage
- setup cost
- debugging value
- protection against the kinds of regressions this app is currently producing
