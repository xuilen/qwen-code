const { defineConfig, devices } = require('F:/PR_Workspace/repos/qwen-pr14353-maint-20261108/node_modules/@playwright/test');
module.exports = defineConfig({
  testDir: __dirname,
  testMatch: 'loading-phrases.spec.ts',
  outputDir: 'F:/PR_Workspace/.work/pr-repair/qwen-ui-verify-20261112/results',
  timeout: 120000,
  expect: { timeout: 20000 },
  workers: 1,
  retries: 0,
  reporter: [['line'], ['json', { outputFile: 'F:/PR_Workspace/notes/qwen-ui-verify-20261112/results.json' }]],
  use: { baseURL: 'http://127.0.0.1:5189', locale: 'en-US', viewport: { width: 1280, height: 900 }, screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node ../../node_modules/vite/bin/vite.js --config F:/PR_Workspace/notes/qwen-ui-verify-20261112/vite.config.mts --host 127.0.0.1 --port 5189 --strictPort',
    cwd: 'F:/Antigravity/PR_Workspace/repos/qwen-pr14353-maint-20261108/packages/web-shell',
    url: 'http://127.0.0.1:5189',
    reuseExistingServer: false,
    timeout: 120000,
  },
});
