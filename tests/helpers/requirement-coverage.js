const REQUIREMENT_IDS = [
  "REQ-001","REQ-002","REQ-003","REQ-004","REQ-005","REQ-006","REQ-007","REQ-008","REQ-009","REQ-010",
  "REQ-011","REQ-012","REQ-013","REQ-014","REQ-015","REQ-016","REQ-017","REQ-018","REQ-019","REQ-020",
  "REQ-021","REQ-022","REQ-023","REQ-024","REQ-025","REQ-026","REQ-027","REQ-028","REQ-029","REQ-030",
  "REQ-031","REQ-032","REQ-033","REQ-034","REQ-035","REQ-036","REQ-037","REQ-038","REQ-039","REQ-040",
  "REQ-041","REQ-042","REQ-043","REQ-044","REQ-045","REQ-046","REQ-047","REQ-048","REQ-049","REQ-050",
  "REQ-051","REQ-052","REQ-053","REQ-054","REQ-055","REQ-056","REQ-057","REQ-058","REQ-059","REQ-060",
  "REQ-061","REQ-062","REQ-063","REQ-064","REQ-065","REQ-066","REQ-067","REQ-068","REQ-069","REQ-070",
  "REQ-071","REQ-072","REQ-073","REQ-074","REQ-075","REQ-076","REQ-077","REQ-078","REQ-079","REQ-080",
  "REQ-081","REQ-082","REQ-083","REQ-084","REQ-085","REQ-086","REQ-087","REQ-088","REQ-089","REQ-090"
];

const TEST_CASES = [
  {
    file: "ui-components.spec.js",
    title: "Header menu, archived links, and settings dialog tabs render and behave correctly",
    requirements: [
      "REQ-001","REQ-002","REQ-003","REQ-004","REQ-005","REQ-006","REQ-035","REQ-036","REQ-037",
      "REQ-038","REQ-039","REQ-040","REQ-041","REQ-042","REQ-043","REQ-044","REQ-045","REQ-046",
      "REQ-081","REQ-082","REQ-083"
    ]
  },
  {
    file: "ui-components.spec.js",
    title: "Solved-color control, grid size, seed application, and URL sync work from settings",
    requirements: [
      "REQ-017","REQ-018","REQ-019","REQ-020","REQ-021","REQ-022","REQ-023","REQ-024","REQ-025",
      "REQ-047","REQ-048","REQ-049","REQ-050","REQ-051","REQ-052","REQ-053","REQ-054","REQ-084"
    ]
  },
  {
    file: "ui-components.spec.js",
    title: "Word mode and blank layout conditional controls only appear when relevant and sanitize input",
    requirements: [
      "REQ-026","REQ-027","REQ-028","REQ-029","REQ-030","REQ-031","REQ-032","REQ-033","REQ-034",
      "REQ-055","REQ-056","REQ-057","REQ-058","REQ-087"
    ]
  },
  {
    file: "ui-components.spec.js",
    title: "Board actions, drag or tap play, hints, solve, reset, undo, and solved feedback all work",
    requirements: [
      "REQ-007","REQ-008","REQ-009","REQ-010","REQ-011","REQ-012","REQ-013","REQ-014","REQ-015",
      "REQ-016","REQ-059","REQ-060","REQ-061","REQ-062","REQ-063","REQ-064","REQ-065","REQ-066",
      "REQ-067","REQ-068","REQ-069","REQ-070","REQ-071","REQ-072","REQ-073","REQ-074","REQ-075",
      "REQ-076","REQ-078","REQ-079","REQ-080","REQ-085","REQ-086","REQ-088"
    ]
  },
  {
    file: "generation-matrix.spec.js",
    title: "Every board size and every board or word generation combination materializes valid deterministic puzzles",
    requirements: [
      "REQ-003","REQ-004","REQ-005","REQ-006","REQ-011","REQ-016","REQ-018","REQ-019","REQ-020",
      "REQ-021","REQ-024","REQ-026","REQ-027","REQ-028","REQ-029","REQ-030","REQ-031","REQ-032",
      "REQ-033","REQ-034","REQ-047","REQ-048","REQ-049","REQ-050","REQ-052","REQ-054","REQ-055",
      "REQ-056","REQ-057","REQ-058","REQ-066","REQ-067","REQ-068","REQ-069","REQ-070","REQ-071",
      "REQ-072","REQ-073","REQ-074","REQ-075","REQ-076","REQ-077","REQ-078","REQ-079","REQ-080",
      "REQ-089","REQ-090"
    ]
  },
  {
    file: "requirements-traceability.spec.js",
    title: "Requirements and technical specification use numbered requirement IDs and all requirements map to tests",
    requirements: REQUIREMENT_IDS
  }
];

module.exports = {
  REQUIREMENT_IDS,
  TEST_CASES
};

