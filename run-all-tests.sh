#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
TIMESTAMP="$(date +"%Y%m%d-%H%M%S")"
RESULT_DIR="$ROOT_DIR/test-results/$TIMESTAMP"
REPORT_JSON="$RESULT_DIR/playwright-results.json"
REPORT_HTML_DIR="$RESULT_DIR/playwright-report"
SUMMARY_FILE="$RESULT_DIR/${TIMESTAMP}-summary.md"
LOG_FILE="$RESULT_DIR/playwright-output.log"

mkdir -p "$RESULT_DIR"

cd "$ROOT_DIR"

if [ ! -f package-lock.json ]; then
  npm install
else
  npm ci
fi

npx playwright install chromium >/dev/null

REPORTERS='[["list"],["json",{"outputFile":"'"$REPORT_JSON"'"}],["html",{"open":"never","outputFolder":"'"$REPORT_HTML_DIR"'"}]]'

set +e
PLAYWRIGHT_REPORTERS="$REPORTERS" npx playwright test 2>&1 | tee "$LOG_FILE"
TEST_EXIT_CODE=${PIPESTATUS[0]}
set -e

node "$ROOT_DIR/scripts/summarize-playwright-results.mjs" "$REPORT_JSON" "$SUMMARY_FILE"

echo "Summary written to: $SUMMARY_FILE"
echo "Raw log written to: $LOG_FILE"
echo "HTML report written to: $REPORT_HTML_DIR"

exit "$TEST_EXIT_CODE"

