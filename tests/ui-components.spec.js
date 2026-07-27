const { expect } = require("@playwright/test");
const { requirementTest } = require("./helpers/requirement-test");
const {
  gotoApp,
  openMenu,
  openSettings,
  closeSettings,
  getPuzzleSnapshot,
  clickWordPath,
  dragWordPath
} = require("./helpers/app-helpers");

requirementTest(
  [
    "REQ-001","REQ-002","REQ-003","REQ-004","REQ-005","REQ-006","REQ-035","REQ-036","REQ-037",
    "REQ-038","REQ-039","REQ-040","REQ-041","REQ-042","REQ-043","REQ-044","REQ-045","REQ-046",
    "REQ-081","REQ-082","REQ-083"
  ],
  "Header menu, archived links, and settings dialog tabs render and behave correctly",
  async ({ page }) => {
    await gotoApp(page);

    await expect(page.locator("h1")).toHaveText("WordFinder");
    await expect(page.locator("#app-menu > summary")).toHaveText("Menu");

    await openMenu(page);
    await expect(page.locator("#practice-btn")).toBeVisible();
    await expect(page.locator("#settings-open-btn")).toBeVisible();

    await page.locator(".menu-submenu > summary").click();
    await expect(page.locator('.menu-link[href="./v3.html"]')).toBeVisible();
    await expect(page.locator('.menu-link[href="./v2.html"]')).toBeVisible();
    await expect(page.locator('.menu-link[href="./v1.html"]')).toBeVisible();

    await page.locator("#settings-open-btn").click();
    await expect(page.locator("#settings-title")).toHaveText("Game Settings");
    await expect(page.locator("#settings-panel-game")).toBeVisible();
    await expect(page.locator("#settings-panel-ui")).toBeHidden();
    await expect(page.locator("#settings-panel-generation")).toBeHidden();

    await page.locator('#tab-game-btn').click();
    await expect(page.locator("#settings-panel-game")).toBeVisible();
    await expect(page.locator("#settings-panel-ui")).toBeHidden();

    await page.locator('#tab-generation-btn').click();
    await expect(page.locator("#settings-panel-generation")).toBeVisible();
    await expect(page.locator("#settings-panel-game")).toBeHidden();

    await closeSettings(page);
  }
);

requirementTest(
  [
    "REQ-001","REQ-005","REQ-006","REQ-014","REQ-035","REQ-042","REQ-043","REQ-044","REQ-045",
    "REQ-046","REQ-081","REQ-082","REQ-083","REQ-084","REQ-088"
  ],
  "Hero, board chrome, legend, notes, metrics, actions, and current-path components render completely",
  async ({ page }) => {
    await gotoApp(page);

    await expect(page.locator(".eyebrow")).toHaveText("Doc rebuild");
    await expect(page.locator("#version-chip")).toHaveText("v00.00.48");
    await expect(page.locator(".subtitle")).toContainText("Trace each hidden word as one exact orthogonal path.");

    await expect(page.locator("#mode-pill")).toContainText("Daily");
    await expect(page.locator("#puzzle-pill")).not.toHaveText("Puzzle");
    await expect(page.locator("#board")).toBeVisible();
    await expect(page.locator("#board .tile, #board .block")).toHaveCount(25);

    await expect(page.locator(".legend span")).toHaveCount(4);
    await expect(page.locator(".legend")).toContainText("Active path");
    await expect(page.locator(".legend")).toContainText("Solved word");
    await expect(page.locator(".legend")).toContainText("Hint reveal");
    await expect(page.locator(".legend")).toContainText("Blocked cell");

    await expect(page.locator(".notes-card")).toHaveCount(2);
    await expect(page.locator(".notes-card").first()).toContainText("How to play");
    await expect(page.locator(".notes-card").nth(1)).toContainText("Current build");

    await expect(page.locator(".metric")).toHaveCount(3);
    await expect(page.locator("#found-count")).toHaveText(/0 \/ \d+/);
    await expect(page.locator("#hint-count")).toHaveText("0");
    await expect(page.locator("#timer")).toHaveText(/\d{2}:\d{2}/);

    await expect(page.locator(".actions button")).toHaveCount(4);
    await expect(page.locator("#undo-btn")).toHaveText("Undo");
    await expect(page.locator("#hint-btn")).toHaveText("Hint");
    await expect(page.locator("#solve-btn")).toHaveText("Solve");
    await expect(page.locator("#reset-btn")).toHaveText("Reset");

    await expect(page.locator("#current-path")).toHaveText("—");
    await expect(page.locator("#message-text")).toContainText("Every playable tile must be claimed.");
    await expect(page.locator("#success-banner")).toBeHidden();

    const snapshot = await getPuzzleSnapshot(page);
    await expect(page.locator("#slots .slot")).toHaveCount(snapshot.words.length);
    await expect(page.locator("#slots .slot").first()).toContainText("letters");
    await expect(page.locator("#slots .slot").first()).toContainText("Hidden");
  }
);

requirementTest(
  [
    "REQ-017","REQ-018","REQ-019","REQ-020","REQ-021","REQ-022","REQ-023","REQ-024","REQ-025",
    "REQ-047","REQ-048","REQ-049","REQ-050","REQ-051","REQ-052","REQ-053","REQ-054","REQ-084"
  ],
  "Solved-color control, grid size, seed application, and URL sync work from settings",
  async ({ page }) => {
    await gotoApp(page);

    const originalSnapshot = await getPuzzleSnapshot(page);
    await openSettings(page, "ui");
    await page.locator("#color-mode").selectOption("palette-midnight-neon");
    const colorMode = await page.evaluate(() => state.selectedColorMode);
    expect(colorMode).toBe("palette-midnight-neon");

    await page.locator('#tab-game-btn').click();
    await page.locator("#grid-size").selectOption("7x7");
    await expect(page.locator("#board .tile, #board .block")).toHaveCount(49);
    await expect(page).toHaveURL(/seed=/);

    const resizedSnapshot = await getPuzzleSnapshot(page);
    expect(resizedSnapshot.rows).toBe(7);
    expect(resizedSnapshot.cols).toBe(7);
    expect(resizedSnapshot.seed).not.toBe(originalSnapshot.seed);

    await page.locator("#seed-input").fill("practice-ui-seed");
    await page.locator("#seed-apply-btn").click();
    await expect(page).toHaveURL(/seed=/);

    const appliedSeed = await page.evaluate(() => state.currentSeed);
    const url = new URL(page.url());
    expect(url.searchParams.get("seed")).toBe(appliedSeed);
    expect(appliedSeed).toContain("practice-ui-seed");

    const afterApply = await getPuzzleSnapshot(page);
    expect(afterApply.seed).toBe(appliedSeed);
    expect(afterApply.id).not.toBe(resizedSnapshot.id);
  }
);

requirementTest(
  [
    "REQ-026","REQ-027","REQ-028","REQ-037","REQ-047","REQ-048","REQ-049","REQ-051","REQ-053",
    "REQ-055","REQ-056","REQ-057","REQ-058","REQ-087","REQ-088"
  ],
  "Settings dialog shell, close behaviors, tabs, and control inventories are fully exposed",
  async ({ page }) => {
    await gotoApp(page);

    await openSettings(page, "ui");
    await expect(page.locator("#settings-overlay")).toBeVisible();
    await expect(page.locator("#settings-title")).toHaveText("Game Settings");
    await expect(page.locator(".settings-subtitle")).toContainText("Keep the main screen focused on gameplay");
    await expect(page.locator(".settings-tabs [data-tab]")).toHaveCount(3);
    await expect(page.locator("#tab-ui-btn")).toHaveClass(/is-active/);
    await expect(page.locator("#app-menu")).not.toHaveAttribute("open", "");

    await expect(page.locator("#color-mode option")).toHaveCount(19);

    await page.locator("#tab-game-btn").click();
    await expect(page.locator("#tab-game-btn")).toHaveClass(/is-active/);
    await expect(page.locator("#grid-size option")).toHaveCount(17);
    await expect(page.locator("#grid-size option").first()).toHaveAttribute("value", "4x4");
    await expect(page.locator("#grid-size option").last()).toHaveAttribute("value", "20x20");
    await expect(page.locator(".seed-note")).toContainText("?seed=...");
    await page.locator("#seed-input").fill("practice-enter-seed");
    await page.locator("#seed-input").press("Enter");
    await expect(page).toHaveURL(/practice-enter-seed/);

    await closeSettings(page);
    await openSettings(page, "game");
    await page.locator("#settings-overlay").click({ position: { x: 8, y: 8 } });
    await expect(page.locator("#settings-overlay")).toBeHidden();

    await openSettings(page, "generation");
    await expect(page.locator("#tab-generation-btn")).toHaveClass(/is-active/);
    await expect(page.locator("#word-mode option")).toHaveCount(4);
    await expect(page.locator("#blank-layout option")).toHaveCount(8);
    await page.keyboard.press("Escape");
    await expect(page.locator("#settings-overlay")).toBeHidden();
  }
);

requirementTest(
  [
    "REQ-026","REQ-027","REQ-028","REQ-029","REQ-030","REQ-031","REQ-032","REQ-033","REQ-034",
    "REQ-055","REQ-056","REQ-057","REQ-058","REQ-087"
  ],
  "Word mode and blank layout conditional controls only appear when relevant and sanitize input",
  async ({ page }) => {
    await gotoApp(page);
    await openSettings(page, "generation");

    await expect(page.locator("#required-text-field")).toBeHidden();
    await expect(page.locator("#start-letter-field")).toBeHidden();
    await expect(page.locator("#fixed-length-field")).toBeHidden();
    await expect(page.locator("#blank-percent-field")).toBeHidden();
    await expect(page.locator("#blank-count-field")).toBeHidden();
    await expect(page.locator("#blank-char-field")).toBeHidden();

    await page.locator("#word-mode").selectOption("contains-text");
    await expect(page.locator("#required-text-field")).toBeVisible();
    await expect(page.locator("#required-text-input")).toHaveValue("");
    await page.locator("#required-text-input").fill("iNg!");
    await expect(page.locator("#required-text-input")).toHaveValue("ING");

    await page.locator("#word-mode").selectOption("starts-with");
    await expect(page.locator("#required-text-field")).toBeHidden();
    await expect(page.locator("#start-letter-field")).toBeVisible();
    await expect(page.locator("#start-letter-input")).toHaveValue("");
    await page.locator("#start-letter-input").fill("z");
    await expect(page.locator("#start-letter-input")).toHaveValue("Z");

    await page.locator("#word-mode").selectOption("fixed-length");
    await expect(page.locator("#required-text-field")).toBeHidden();
    await expect(page.locator("#start-letter-field")).toBeHidden();
    await expect(page.locator("#fixed-length-field")).toBeVisible();
    await page.locator("#fixed-length-input").fill("99");
    await page.locator("#fixed-length-input").press("Tab");
    await expect.poll(() => page.evaluate(() => state.selectedFixedLength)).toBe(12);

    await page.locator("#blank-layout").selectOption("verticals");
    await expect(page.locator("#blank-percent-field")).toBeVisible();
    await expect(page.locator("#blank-count-field")).toBeVisible();
    await expect(page.locator("#blank-char-field")).toBeVisible();

    await page.locator("#blank-char-input").fill("AB");
    await expect(page.locator("#blank-char-input")).toHaveValue("A");

    await page.locator("#blank-layout").selectOption("no-blanks");
    await expect(page.locator("#blank-percent-field")).toBeHidden();
    await expect(page.locator("#blank-count-field")).toBeHidden();
    await expect(page.locator("#blank-char-field")).toBeHidden();
  }
);

requirementTest(
  [
    "REQ-014","REQ-044","REQ-045","REQ-046","REQ-059","REQ-060","REQ-061","REQ-062","REQ-063",
    "REQ-064","REQ-065","REQ-084","REQ-085","REQ-086"
  ],
  "Slots, message box, invalid feedback, metrics, and success banner component states update correctly",
  async ({ page }) => {
    await gotoApp(page);

    const firstWordPath = await page.evaluate(() => [...state.puzzle.words[0].path]);
    const boardCells = page.locator("#board .tile, #board .block");

    await page.evaluate((path) => {
      const cells = Array.from(document.querySelectorAll("#board .tile, #board .block"));
      cells[path[0]].click();
      cells[path[1]].click();
    }, firstWordPath);
    await expect(page.locator("#current-path")).not.toHaveText("—");
    await expect(page.locator("#message-text")).toContainText("current end tile again to submit");
    await page.evaluate((path) => {
      const cells = Array.from(document.querySelectorAll("#board .tile, #board .block"));
      cells[path[1]].click();
    }, firstWordPath);
    await expect(page.locator("#message-text")).toContainText("not one of the hidden answers");
    await expect(page.locator("#board .tile.invalid")).toHaveCount(2);
    await expect(page.locator("#current-path")).toHaveText("—");

    await page.locator("#hint-btn").click();
    await expect(page.locator("#hint-count")).not.toHaveText("0");
    await expect(page.locator("#slots .slot").first()).toContainText("Hidden");

    await clickWordPath(page, 0);
    await expect(page.locator("#found-count")).toHaveText(/1 \/ \d+/);
    await expect(page.locator("#slots .slot").first()).toContainText("Solved");
    const solvedValue = await page.locator("#slots .slot").first().locator(".slot-value").textContent();
    expect(solvedValue.trim()).toMatch(/[A-Z](\s+[A-Z])+/);

    await page.locator("#solve-btn").click();
    await expect(page.locator("#success-banner")).toBeVisible();
    await expect(page.locator("#success-text")).toContainText("Solved in");
    await expect(page.locator("#message-text")).toContainText("Puzzle solved");

    await page.locator("#reset-btn").click();
    await expect(page.locator("#success-banner")).toBeHidden();
    await expect(page.locator("#found-count")).toHaveText(/0 \/ \d+/);
    await expect(page.locator("#hint-count")).toHaveText("0");
  }
);

requirementTest(
  [
    "REQ-007","REQ-008","REQ-009","REQ-010","REQ-011","REQ-012","REQ-013","REQ-014","REQ-015",
    "REQ-016","REQ-059","REQ-060","REQ-061","REQ-062","REQ-063","REQ-064","REQ-065","REQ-066",
    "REQ-067","REQ-068","REQ-069","REQ-070","REQ-071","REQ-072","REQ-073","REQ-074","REQ-075",
    "REQ-076","REQ-078","REQ-079","REQ-080","REQ-085","REQ-086","REQ-088"
  ],
  "Board actions, drag or tap play, hints, solve, reset, undo, and solved feedback all work",
  async ({ page }) => {
    await gotoApp(page);

    const initialSlots = page.locator("#slots .slot");
    await expect(initialSlots.first()).toBeVisible();

    await clickWordPath(page, 0);
    let snapshot = await getPuzzleSnapshot(page);
    expect(snapshot.foundWords.length).toBe(1);

    await page.locator("#reset-btn").click();
    snapshot = await getPuzzleSnapshot(page);
    expect(snapshot.foundWords.length).toBe(0);

    await dragWordPath(page, 0);
    snapshot = await getPuzzleSnapshot(page);
    expect(snapshot.foundWords.length).toBe(1);

    const activePathBeforeUndo = await page.evaluate(() => state.activePath.length);
    expect(activePathBeforeUndo).toBe(0);

    const secondWordPath = await page.evaluate(() => [...state.puzzle.words[1].path]);
    const boardCells = page.locator("#board .tile, #board .block");
    await boardCells.nth(secondWordPath[0]).click();
    await boardCells.nth(secondWordPath[1]).click();
    await expect(page.locator("#current-path")).not.toHaveText("—");
    await page.locator("#undo-btn").click();
    const activeLettersAfterUndo = await page.locator("#current-path").textContent();
    expect(activeLettersAfterUndo.trim().length).toBe(1);

    await page.locator("#hint-btn").click();
    snapshot = await getPuzzleSnapshot(page);
    expect(Object.keys(snapshot.hints).length).toBeGreaterThan(0);

    await page.locator("#solve-btn").click();
    await expect(page.locator("#success-banner")).toBeVisible();
    snapshot = await getPuzzleSnapshot(page);
    expect(snapshot.foundWords.length).toBe(snapshot.words.length);

    await page.locator("#reset-btn").click();
    await expect(page.locator("#success-banner")).toBeHidden();
    snapshot = await getPuzzleSnapshot(page);
    expect(snapshot.foundWords.length).toBe(0);

    const beforePractice = snapshot.id;
    await openMenu(page);
    await page.locator("#practice-btn").click();
    const practiceSnapshot = await getPuzzleSnapshot(page);
    expect(practiceSnapshot.id).not.toBe(beforePractice);
    await expect(page.locator("#mode-pill")).toContainText("Practice");
  }
);
