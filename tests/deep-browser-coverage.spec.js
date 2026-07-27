const { expect } = require("@playwright/test");
const { requirementTest } = require("./helpers/requirement-test");
const {
  gotoApp,
  openSettings,
  getPuzzleSnapshot,
  clickWordPath
} = require("./helpers/app-helpers");

function summarizeConfig(config) {
  return JSON.stringify({
    gridSize: config.gridSize,
    wordMode: config.wordMode,
    requiredText: config.requiredText,
    startLetter: config.startLetter,
    fixedLength: config.fixedLength,
    blankLayout: config.blankLayout,
    blankPercent: config.blankPercent,
    blankCount: config.blankCount,
    blankChar: config.blankChar
  });
}

requirementTest(
  [
    "REQ-017","REQ-018","REQ-019","REQ-020","REQ-021","REQ-049","REQ-050","REQ-052","REQ-054",
    "REQ-055","REQ-056","REQ-057","REQ-058"
  ],
  "Current-app configuration round-trips from controls to URL seed to reload without losing visible state",
  async ({ page }) => {
    await gotoApp(page);
    await openSettings(page, "generation");

    await page.locator("#tab-game-btn").click();
    await page.locator("#grid-size").selectOption("8x8");
    await page.locator("#tab-generation-btn").click();
    await page.locator("#word-mode").selectOption("contains-text");
    await page.locator("#required-text-input").fill("qu");
    await page.locator("#blank-layout").selectOption("verticals");
    await page.locator("#blank-percent-input").fill("31");
    await page.locator("#blank-percent-input").press("Tab");
    await page.locator("#blank-char-input").fill("*");

    const beforeReload = await page.evaluate(() => ({
      seed: state.currentSeed,
      config: {
        gridSize: state.selectedGridSize,
        wordMode: state.selectedWordMode,
        requiredText: state.selectedRequiredText,
        startLetter: state.selectedStartLetter,
        fixedLength: state.selectedFixedLength,
        blankLayout: state.selectedBlankLayout,
        blankPercent: state.selectedBlankPercent,
        blankCount: state.selectedBlankCount,
        blankChar: state.selectedBlankChar
      }
    }));

    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator("#board")).toBeVisible();

    const afterReload = await page.evaluate(() => ({
      seed: state.currentSeed,
      config: {
        gridSize: state.selectedGridSize,
        wordMode: state.selectedWordMode,
        requiredText: state.selectedRequiredText,
        startLetter: state.selectedStartLetter,
        fixedLength: state.selectedFixedLength,
        blankLayout: state.selectedBlankLayout,
        blankPercent: state.selectedBlankPercent,
        blankCount: state.selectedBlankCount,
        blankChar: state.selectedBlankChar
      }
    }));

    expect(afterReload.seed).toBe(beforeReload.seed);
    expect(summarizeConfig(afterReload.config)).toBe(summarizeConfig(beforeReload.config));

    await openSettings(page, "generation");
    await page.locator("#tab-game-btn").click();
    await expect(page.locator("#grid-size")).toHaveValue("8x8");
    await page.locator("#tab-generation-btn").click();
    await expect(page.locator("#word-mode")).toHaveValue("contains-text");
    await expect(page.locator("#required-text-input")).toHaveValue("QU");
    await expect(page.locator("#blank-layout")).toHaveValue("verticals");
    await expect(page.locator("#blank-percent-input")).toHaveValue("31");
    await expect(page.locator("#blank-char-input")).toHaveValue("*");
  }
);

requirementTest(
  [
    "REQ-017","REQ-019","REQ-021","REQ-059","REQ-060","REQ-064","REQ-085","REQ-089"
  ],
  "Current-app progress and hints persist across reload for the same puzzle seed",
  async ({ page }) => {
    await gotoApp(page);

    const initial = await getPuzzleSnapshot(page);
    await page.locator("#hint-btn").click();
    await clickWordPath(page, 0);

    const progressed = await getPuzzleSnapshot(page);
    expect(progressed.seed).toBe(initial.seed);
    expect(progressed.foundWords).toEqual([0]);
    expect(Object.keys(progressed.hints).length).toBeGreaterThan(0);

    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator("#board")).toBeVisible();

    const restored = await getPuzzleSnapshot(page);
    expect(restored.seed).toBe(initial.seed);
    expect(restored.foundWords).toEqual([0]);
    expect(restored.hints).toEqual(progressed.hints);
    await expect(page.locator("#slots .slot").first()).toContainText("Solved");
    await expect(page.locator("#hint-count")).not.toHaveText("0");
  }
);

requirementTest(
  [
    "REQ-015","REQ-016","REQ-035","REQ-036","REQ-037","REQ-083","REQ-088"
  ],
  "Current-app remains usable in a mobile viewport with touch interactions and no horizontal scrolling",
  async ({ page }) => {
    const browser = page.context().browser();
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true
    });
    const mobilePage = await mobileContext.newPage();
    await gotoApp(mobilePage);

    const overflow = await mobilePage.evaluate(() => ({
      doc: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      body: document.body.scrollWidth <= document.body.clientWidth
    }));
    expect(overflow.doc).toBe(true);
    expect(overflow.body).toBe(true);

    await mobilePage.locator("#app-menu > summary").tap();
    await expect(mobilePage.locator("#app-menu")).toHaveAttribute("open", "");
    await mobilePage.locator("#settings-open-btn").tap();
    await expect(mobilePage.locator("#settings-overlay")).toBeVisible();
    await mobilePage.locator("#settings-close-btn").tap();
    await expect(mobilePage.locator("#settings-overlay")).toBeHidden();

    await clickWordPath(mobilePage, 0);
    const mobileSnapshot = await getPuzzleSnapshot(mobilePage);
    expect(mobileSnapshot.foundWords).toEqual([0]);

    await mobileContext.close();
  }
);

requirementTest(
  [
    "REQ-008","REQ-009","REQ-010","REQ-011","REQ-015","REQ-016","REQ-065","REQ-088"
  ],
  "Current-app rejects invalid path mutations, supports drag backtracking, and ignores locked tiles",
  async ({ page }) => {
    await gotoApp(page);

    const invalidState = await page.evaluate(() => {
      const words = state.puzzle.words;
      const start = words[0].path[0];
      let far = null;
      for (const word of words) {
        for (const cell of word.path) {
          const [r1, c1] = toCoord(start, state.puzzle.cols);
          const [r2, c2] = toCoord(cell, state.puzzle.cols);
          if (Math.abs(r1 - r2) + Math.abs(c1 - c2) > 1) {
            far = cell;
            break;
          }
        }
        if (far !== null) break;
      }
      const cells = Array.from(document.querySelectorAll("#board .tile, #board .block"));
      cells[start].click();
      cells[far].click();
      return { activePath: [...state.activePath], currentPath: document.getElementById("current-path").textContent };
    });

    expect(invalidState.activePath.length).toBe(1);
    expect(invalidState.currentPath.trim().length).toBe(1);
    await page.locator("#undo-btn").click();

    const dragPath = await page.evaluate(() => [...state.puzzle.words[1].path]);
    const dragCells = page.locator("#board .tile, #board .block");
    const firstBox = await dragCells.nth(dragPath[0]).boundingBox();
    const secondBox = await dragCells.nth(dragPath[1]).boundingBox();
    const thirdBox = await dragCells.nth(dragPath[2]).boundingBox();
    if (!firstBox || !secondBox || !thirdBox) throw new Error("Could not read drag-backtrack bounds");
    await page.mouse.move(firstBox.x + firstBox.width / 2, firstBox.y + firstBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(secondBox.x + secondBox.width / 2, secondBox.y + secondBox.height / 2);
    await page.mouse.move(thirdBox.x + thirdBox.width / 2, thirdBox.y + thirdBox.height / 2);
    await page.mouse.move(secondBox.x + secondBox.width / 2, secondBox.y + secondBox.height / 2);
    const dragState = await page.evaluate(() => ({
      activePath: [...state.activePath],
      currentPath: document.getElementById("current-path").textContent
    }));
    await page.mouse.up();

    expect(dragState.activePath.length).toBe(2);
    expect(dragState.currentPath.trim().length).toBe(2);

    await clickWordPath(page, 0);
    const lockedState = await page.evaluate(() => {
      const solvedPath = state.puzzle.words[0].path;
      const cells = Array.from(document.querySelectorAll("#board .tile, #board .block"));
      cells[solvedPath[0]].click();
      return { activePath: [...state.activePath], foundWords: [...state.foundWords] };
    });

    expect(lockedState.foundWords).toContain(0);
    expect(lockedState.activePath.length).toBe(0);
  }
);

requirementTest(
  [
    "REQ-005","REQ-049","REQ-055","REQ-056","REQ-057","REQ-069","REQ-070","REQ-080"
  ],
  "Current-app tolerates repeated large-board regenerations and control churn without browser-side failures",
  async ({ page }) => {
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(String(error)));

    await gotoApp(page);
    const result = await page.evaluate(() => {
      const start = performance.now();
      const scenarios = [
        { grid: "20x20", wordMode: "any", layout: "default" },
        { grid: "20x20", wordMode: "contains-text", requiredText: "ING", layout: "no-blanks" },
        { grid: "18x18", wordMode: "starts-with", startLetter: "S", layout: "verticals" },
        { grid: "16x16", wordMode: "fixed-length", fixedLength: 6, layout: "diag-both" },
        { grid: "20x20", wordMode: "contains-text", requiredText: "QU", layout: "straights" }
      ];
      const summaries = [];
      for (const scenario of scenarios) {
        state.selectedGridSize = scenario.grid;
        state.selectedWordMode = scenario.wordMode;
        state.selectedRequiredText = scenario.requiredText || "";
        state.selectedStartLetter = scenario.startLetter || "";
        state.selectedFixedLength = scenario.fixedLength || 5;
        state.selectedBlankLayout = scenario.layout;
        state.selectedBlankPercent = 22;
        state.selectedBlankCount = 0;
        state.selectedBlankChar = scenario.layout === "no-blanks" ? "" : "#";
        regenerateCurrentMode();
        summaries.push({
          id: state.puzzle.id,
          seed: state.currentSeed,
          rows: state.puzzle.rows,
          cols: state.puzzle.cols,
          words: state.puzzle.words.length,
          tiles: state.puzzle.cells.filter((cell) => cell.type === "tile").length
        });
      }
      return { elapsedMs: performance.now() - start, summaries };
    });

    expect(pageErrors).toEqual([]);
    expect(result.elapsedMs).toBeLessThan(15000);
    expect(result.summaries).toHaveLength(5);
    result.summaries.forEach((summary) => {
      expect(summary.rows).toBeGreaterThanOrEqual(16);
      expect(summary.cols).toBeGreaterThanOrEqual(16);
      expect(summary.words).toBeGreaterThan(0);
      expect(summary.tiles).toBeGreaterThan(0);
      expect(summary.seed).toContain("~");
    });
  }
);
