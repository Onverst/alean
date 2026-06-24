import { defineConfig } from "@playwright/test";

/**
 * Отдельный конфиг для runtime visual/diagnostic тестов ScrollStage-слайдов.
 * Не смешивается с будущими e2e/unit-тестами Playwright.
 */
export default defineConfig({
  testDir: "./tests/visual",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report/visual", open: "never" }],
  ],
  outputDir: "test-results/visual",
  use: {
    baseURL: "http://127.0.0.1:3000",
    browserName: "chromium",
    headless: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3000",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    gracefulShutdown: { signal: "SIGTERM", timeout: 500 },
    stdout: "ignore",
    stderr: "pipe",
  },
});
