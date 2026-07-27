const { expect } = require("@playwright/test");

async function gotoApp(page, seed = null) {
  const target = seed ? `/?seed=${encodeURIComponent(seed)}` : "/";
  await page.goto(target, { waitUntil: "networkidle" });
  await expect(page.locator("#board")).toBeVisible();
}

async function openMenu(page) {
  const menu = page.locator("#app-menu");
  await page.locator("#app-menu > summary").click();
  await expect(menu).toHaveAttribute("open", "");
  return menu;
}

async function openSettings(page, tab = null) {
  await openMenu(page);
  await page.locator("#settings-open-btn").click();
  await expect(page.locator("#settings-overlay")).toBeVisible();
  if (tab) {
    await page.locator(`[data-tab="${tab}"]`).click();
  }
}

async function closeSettings(page) {
  await page.locator("#settings-close-btn").click();
  await expect(page.locator("#settings-overlay")).toBeHidden();
}

async function setSelect(page, selector, value) {
  await page.locator(selector).selectOption(value);
}

async function getPuzzleSnapshot(page) {
  return page.evaluate(() => ({
    id: state.puzzle.id,
    seed: state.puzzle.seedKey,
    rows: state.puzzle.rows,
    cols: state.puzzle.cols,
    words: state.puzzle.words.map((word) => ({
      text: word.text,
      path: [...word.path]
    })),
    foundWords: [...state.foundWords],
    hints: { ...state.hints },
    blankChar: state.puzzle.blankChar,
    blockCount: state.puzzle.cells.filter((cell) => cell.type === "block").length,
    tileCount: state.puzzle.cells.filter((cell) => cell.type === "tile").length
  }));
}

async function clickWordPath(page, wordIndex) {
  await page.evaluate((index) => {
    const path = [...state.puzzle.words[index].path];
    const cells = Array.from(document.querySelectorAll("#board .tile, #board .block"));
    path.forEach((cellIndex) => cells[cellIndex].click());
    cells[path[path.length - 1]].click();
  }, wordIndex);
}

async function dragWordPath(page, wordIndex) {
  const path = await page.evaluate((index) => [...state.puzzle.words[index].path], wordIndex);
  const cells = page.locator("#board .tile, #board .block");
  const firstBox = await cells.nth(path[0]).boundingBox();
  if (!firstBox) throw new Error("Could not read first tile bounds");
  await page.mouse.move(firstBox.x + firstBox.width / 2, firstBox.y + firstBox.height / 2);
  await page.mouse.down();
  for (let idx = 1; idx < path.length; idx += 1) {
    const box = await cells.nth(path[idx]).boundingBox();
    if (!box) throw new Error(`Could not read bounds for tile ${path[idx]}`);
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  }
  await page.mouse.up();
}

async function tapWordPath(page, wordIndex) {
  const path = await page.evaluate((index) => [...state.puzzle.words[index].path], wordIndex);
  const cells = page.locator("#board .tile, #board .block");
  for (const cellIndex of path) {
    await cells.nth(cellIndex).tap();
  }
  await cells.nth(path[path.length - 1]).tap();
}

module.exports = {
  gotoApp,
  openMenu,
  openSettings,
  closeSettings,
  setSelect,
  getPuzzleSnapshot,
  clickWordPath,
  dragWordPath,
  tapWordPath
};
