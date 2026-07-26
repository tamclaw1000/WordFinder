#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

function walkSuites(suites, results = []) {
  for (const suite of suites || []) {
    walkSuites(suite.suites || [], results);
    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        const outcome =
          test.results?.some((result) => result.status === "failed") ? "failed" :
          test.results?.some((result) => result.status === "timedOut") ? "timedOut" :
          test.results?.some((result) => result.status === "skipped") ? "skipped" :
          "passed";
        results.push({
          title: spec.title,
          path: spec.file,
          outcome,
          durationMs: test.results?.reduce((sum, result) => sum + (result.duration || 0), 0) || 0,
          annotations: test.annotations || []
        });
      }
    }
  }
  return results;
}

const [jsonPath, summaryPath] = process.argv.slice(2);
if (!jsonPath || !summaryPath) {
  throw new Error("Usage: summarize-playwright-results.mjs <json-report> <summary-output>");
}

const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const tests = walkSuites(report.suites || []);
const total = tests.length;
const passed = tests.filter((test) => test.outcome === "passed").length;
const failed = tests.filter((test) => test.outcome === "failed").length;
const timedOut = tests.filter((test) => test.outcome === "timedOut").length;
const skipped = tests.filter((test) => test.outcome === "skipped").length;
const requirementMap = new Map();

for (const test of tests) {
  const requirementIds = [...new Set(test.title.match(/REQ-\d{3}/g) || [])];
  if (requirementIds.length === 0) continue;
  for (const requirementId of requirementIds) {
    if (!requirementMap.has(requirementId)) requirementMap.set(requirementId, []);
    requirementMap.get(requirementId).push(`${test.path} :: ${test.title}`);
  }
}

const lines = [];
lines.push(`# WordFinder Playwright Test Summary`);
lines.push("");
lines.push(`- Generated: ${new Date().toISOString()}`);
lines.push(`- Total tests: ${total}`);
lines.push(`- Passed: ${passed}`);
lines.push(`- Failed: ${failed}`);
lines.push(`- Timed out: ${timedOut}`);
lines.push(`- Skipped: ${skipped}`);
lines.push("");

lines.push(`## Test Outcomes`);
lines.push("");
for (const test of tests) {
  lines.push(`- [${test.outcome}] ${test.title} (${test.path}, ${test.durationMs}ms)`);
}

lines.push("");
lines.push(`## Requirement Coverage`);
lines.push("");
for (const requirementId of [...requirementMap.keys()].sort()) {
  lines.push(`- ${requirementId}: ${requirementMap.get(requirementId).length} test(s)`);
}

if (failed > 0 || timedOut > 0) {
  lines.push("");
  lines.push(`## Failures`);
  lines.push("");
  for (const test of tests.filter((test) => test.outcome === "failed" || test.outcome === "timedOut")) {
    lines.push(`- ${test.title} (${test.path})`);
  }
}

fs.mkdirSync(path.dirname(summaryPath), { recursive: true });
fs.writeFileSync(summaryPath, `${lines.join("\n")}\n`, "utf8");
