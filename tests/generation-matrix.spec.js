const { expect } = require("@playwright/test");
const { requirementTest } = require("./helpers/requirement-test");
const { gotoApp } = require("./helpers/app-helpers");

requirementTest(
  [
    "REQ-003","REQ-004","REQ-005","REQ-006","REQ-011","REQ-016","REQ-018","REQ-019","REQ-020",
    "REQ-021","REQ-024","REQ-026","REQ-027","REQ-028","REQ-029","REQ-030","REQ-031","REQ-032",
    "REQ-033","REQ-034","REQ-047","REQ-048","REQ-049","REQ-050","REQ-052","REQ-054","REQ-055",
    "REQ-056","REQ-057","REQ-058","REQ-066","REQ-067","REQ-068","REQ-069","REQ-070","REQ-071",
    "REQ-072","REQ-073","REQ-074","REQ-075","REQ-076","REQ-077","REQ-078","REQ-079","REQ-080",
    "REQ-089","REQ-090"
  ],
  "Every board size and every board or word generation combination materializes valid deterministic puzzles",
  async ({ page }) => {
    await gotoApp(page);

    const report = await page.evaluate(() => {
      const sizes = Array.from({ length: GRID_MAX - GRID_MIN + 1 }, (_, index) => GRID_MIN + index);
      const wordModes = [
        { mode: "any", requiredText: "Z", startLetter: "A", fixedLength: 5 },
        { mode: "contains-text", requiredText: "Z", startLetter: "A", fixedLength: 5 },
        { mode: "contains-text", requiredText: "ING", startLetter: "A", fixedLength: 5 },
        { mode: "starts-with", requiredText: "Z", startLetter: "A", fixedLength: 5 },
        { mode: "fixed-length", requiredText: "Z", startLetter: "A", fixedLength: 5 }
      ];
      const blankLayouts = [
        "default",
        "no-blanks",
        "verticals",
        "horizontals",
        "straights",
        "diag-slash",
        "diag-backslash",
        "diag-both"
      ];

      function matchesMode(word, wordMode) {
        switch (wordMode.mode) {
          case "contains-text": return word.includes(wordMode.requiredText);
          case "starts-with": return word.startsWith(wordMode.startLetter);
          case "fixed-length": return word.length === wordMode.fixedLength;
          default: return true;
        }
      }

      const failures = [];
      let combinations = 0;

      for (const size of sizes) {
        for (const wordMode of wordModes) {
          for (const blankLayout of blankLayouts) {
            combinations += 1;
            state.selectedGridSize = `${size}x${size}`;
            state.selectedWordMode = wordMode.mode;
            state.selectedRequiredText = wordMode.requiredText;
            state.selectedStartLetter = wordMode.startLetter;
            state.selectedFixedLength = wordMode.fixedLength;
            state.selectedBlankLayout = blankLayout;
            state.selectedBlankPercent = 22;
            state.selectedBlankCount = 0;
            state.selectedBlankChar = blankLayout === "no-blanks" ? "" : "#";
            const baseSeed = buildPracticeBaseSeed(combinations);
            const fullSeed = buildCurrentSeed(baseSeed);
            const puzzle = materializePuzzle(size, size, "practice", fullSeed);
            const label = `${size}x${size} | ${wordMode.mode}:${wordMode.requiredText || "-"}:${wordMode.startLetter}:${wordMode.fixedLength} | ${blankLayout}`;

            if (puzzle.rows !== size || puzzle.cols !== size) {
              failures.push(`${label}: wrong puzzle dimensions`);
              continue;
            }
            if (puzzle.cells.length !== size * size) {
              failures.push(`${label}: wrong cell count`);
            }
            const playable = new Set();
            let pathCellCount = 0;
            let turningWords = 0;
            for (const word of puzzle.words) {
              if (!matchesMode(word.text, wordMode)) {
                failures.push(`${label}: word ${word.text} violates ${wordMode.mode}`);
              }
              if (word.path.length !== word.text.length) {
                failures.push(`${label}: word/path length mismatch for ${word.text}`);
              }
              if (pathHasTurn(word.path, puzzle.cols)) turningWords += 1;
              for (let idx = 0; idx < word.path.length; idx += 1) {
                const cellIndex = word.path[idx];
                const cell = puzzle.cells[cellIndex];
                if (!cell || cell.type !== "tile") {
                  failures.push(`${label}: path enters non-tile cell`);
                  break;
                }
                if (cell.letter !== word.text[idx]) {
                  failures.push(`${label}: letter mismatch at path step`);
                  break;
                }
                if (playable.has(cellIndex)) {
                  failures.push(`${label}: duplicate playable cell in multiple words`);
                  break;
                }
                playable.add(cellIndex);
                pathCellCount += 1;
                if (idx > 0) {
                  const [r1, c1] = toCoord(word.path[idx - 1], puzzle.cols);
                  const [r2, c2] = toCoord(cellIndex, puzzle.cols);
                  if (Math.abs(r1 - r2) + Math.abs(c1 - c2) !== 1) {
                    failures.push(`${label}: non-orthogonal word path`);
                    break;
                  }
                }
              }
            }

            const tileCount = puzzle.cells.filter((cell) => cell.type === "tile").length;
            const blockCount = puzzle.cells.filter((cell) => cell.type === "block").length;
            if (tileCount !== playable.size || tileCount !== pathCellCount) {
              failures.push(`${label}: tile coverage mismatch`);
            }
            if (tileCount + blockCount !== size * size) {
              failures.push(`${label}: board partition mismatch`);
            }
            if (
              blankLayout !== "default" &&
              blankLayout !== "no-blanks" &&
              state.selectedBlankChar &&
              blockCount > 0 &&
              puzzle.blankChar !== "#"
            ) {
              failures.push(`${label}: blank character was not preserved`);
            }
            if ((blankLayout === "default" || blankLayout === "no-blanks") && wordMode.mode !== "fixed-length") {
              const requiredTurning = requiredTurningWordCount(puzzle.words.map((word) => word.path.length));
              if (turningWords < requiredTurning) {
                failures.push(`${label}: turning-word quota failed (${turningWords}/${requiredTurning})`);
              }
            }
            const replayPuzzle = materializePuzzle(size, size, "practice", fullSeed);
            if (JSON.stringify(replayPuzzle.words) !== JSON.stringify(puzzle.words)) {
              failures.push(`${label}: seed determinism failed on replay`);
            }
          }
        }
      }

      return { combinations, failures };
    });

    expect(report.failures, report.failures.join("\n")).toEqual([]);
    expect(report.combinations).toBe(17 * 5 * 8);
  }
);
