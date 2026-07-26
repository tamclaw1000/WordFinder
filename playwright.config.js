const { defineConfig } = require("@playwright/test");
const path = require("node:path");

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 120000,
  expect: {
    timeout: 10000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  outputDir: "./playwright-artifacts",
  reporter: process.env.PLAYWRIGHT_REPORTERS
    ? JSON.parse(process.env.PLAYWRIGHT_REPORTERS)
    : [["list"]],
  use: {
    baseURL: process.env.WORDFINDER_BASE_URL || "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  webServer: process.env.WORDFINDER_BASE_URL
    ? undefined
    : {
        command: "python3 -m http.server 4173",
        cwd: path.resolve(__dirname),
        port: 4173,
        reuseExistingServer: true,
        timeout: 30000
      },
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
        viewport: { width: 1440, height: 1200 }
      }
    }
  ]
});
