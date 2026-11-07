import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PORT ?? 4173);
const baseURL = process.env.BASE_URL ?? `http://localhost:${port}`;

/**
 * The suite runs against the production build served by `vite preview`, so the
 * same bundle Vercel deploys is what gets tested. Run `npm run test:e2e` to
 * build first; the webServer entry only starts the preview server.
 *
 * Formspree is mocked in every test: no real messages reach the inbox.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"]],
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run preview -- --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
