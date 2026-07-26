const fs = require("node:fs");
const path = require("node:path");
const { expect } = require("@playwright/test");
const { requirementTest } = require("./helpers/requirement-test");
const { REQUIREMENT_IDS, TEST_CASES } = require("./helpers/requirement-coverage");

requirementTest(
  REQUIREMENT_IDS,
  "Requirements and technical specification use numbered requirement IDs and all requirements map to tests",
  async () => {
    const repoRoot = path.resolve(__dirname, "..");
    const requirementsText = fs.readFileSync(path.join(repoRoot, "REQUIREMENTS.md"), "utf8");
    const technicalText = fs.readFileSync(path.join(repoRoot, "TECHNICAL_SPECIFICATION.md"), "utf8");

    const requirementIdsFromDoc = [...new Set(requirementsText.match(/REQ-\d{3}/g) || [])].sort();
    const specRequirementRefs = [...new Set(technicalText.match(/REQ-\d{3}/g) || [])].sort();

    expect(requirementIdsFromDoc).toEqual(REQUIREMENT_IDS);

    const missingInSpec = REQUIREMENT_IDS.filter((id) => !specRequirementRefs.includes(id));
    expect(missingInSpec).toEqual([]);

    const allMappedRequirements = [...new Set(TEST_CASES.flatMap((testCase) => testCase.requirements))].sort();
    expect(allMappedRequirements).toEqual(REQUIREMENT_IDS);

    const testsWithoutRequirements = TEST_CASES.filter((testCase) => !testCase.requirements || testCase.requirements.length === 0);
    expect(testsWithoutRequirements).toEqual([]);
  }
);

