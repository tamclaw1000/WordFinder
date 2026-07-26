const { test } = require("@playwright/test");

function normalizeRequirementIds(requirementIds) {
  if (!Array.isArray(requirementIds) || requirementIds.length === 0) {
    throw new Error("Every test must declare at least one requirement ID.");
  }
  return [...new Set(requirementIds)].sort();
}

function requirementTest(requirementIds, title, fn) {
  const normalized = normalizeRequirementIds(requirementIds);
  const decoratedTitle = `[${normalized.join(", ")}] ${title}`;
  test(decoratedTitle, async ({ page, browserName }, testInfo) => {
    testInfo.annotations.push({
      type: "requirements",
      description: normalized.join(",")
    });
    testInfo.annotations.push({
      type: "browser",
      description: browserName
    });
    await fn({ page, browserName }, testInfo);
  });
}

module.exports = {
  requirementTest,
  normalizeRequirementIds
};

