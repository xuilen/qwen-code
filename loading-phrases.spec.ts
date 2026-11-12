import { test, expect } from '../../repos/qwen-pr14353-maint-20261108/node_modules/@playwright/test/index.mjs';
import { writeFileSync } from 'node:fs';
import { assistantTextEvent, turnCompleteEvent, createWebShellDaemonScenario, installMockDaemon } from '../../repos/qwen-pr14353-maint-20261108/packages/web-shell/client/e2e/utils/mockDaemon.ts';
import { completeReplay, submitLocalCommand } from '../../repos/qwen-pr14353-maint-20261108/packages/web-shell/client/e2e/visuals/harness.ts';

const HEAD = '01785474c8affd6d5306cabe47c7dc00249dea28';
const OUT = 'F:/PR_Workspace/notes/qwen-ui-verify-20261112';
const PHRASE = 'Configured verification phrase';
const KEY = 'ui.accessibility.enableLoadingPhrases';
const BANNER = 'This change requires a restart to take effect.';

async function boot(page, testInfo, theme, options = {}) {
  const scenario = createWebShellDaemonScenario();
  scenario.settings.settings = [];
  scenario.settings.settings.push(
    { key: KEY, type: 'boolean', label: 'Enable Loading Phrases', category: 'UI', requiresRestart: true, default: true, values: { effective: true } },
    { key: 'ui.customWittyPhrases', type: 'array', label: 'Custom Witty Phrases', category: 'UI', requiresRestart: false, default: [], values: { effective: options.invalidOnly ? [' ', 42] : [PHRASE, ' ', 42] } },
    { key: 'output.showTimestamps', type: 'boolean', label: 'Show Timestamps', category: 'UI', requiresRestart: true, default: false, values: { effective: false } },
  );
  const daemon = await installMockDaemon(page, scenario, { baseURL: String(testInfo.project.use.baseURL) });
  await page.route('**/workspace/models', (route) => route.fulfill({ json: { models: [] } }));
  const writes = [];
  await page.route('**/settings', async (route) => {
    if (route.request().method() !== 'POST') return route.fallback();
    const body = route.request().postDataJSON();
    writes.push(body);
    const setting = scenario.settings.settings.find((s) => s.key === body.key);
    if (setting) setting.values.effective = body.value;
    await route.fulfill({ json: { ...body, requiresRestart: true } });
  });
  const params = new URLSearchParams({ sessionId: scenario.sessionId, theme, sidebar: 'false' });
  if (options.host) params.set('loadingPhrase', 'Host verification phrase');
  await page.goto(`/e2e/settings-harness.html?${params}`);
  await completeReplay(page, daemon, scenario.sessionId, scenario.events.length);
  const documentId = await page.evaluate(() => {
    window.__pr14353DocumentId = crypto.randomUUID();
    return window.__pr14353DocumentId;
  });
  const stream = async () => {
    await daemon.sendEvent(assistantTextEvent('Verification response in progress', { sessionId: scenario.sessionId }));
    await expect(page.locator('span').filter({ hasText: /^\d+s.*esc to cancel$/ })).toBeVisible();
  };
  const finish = () => daemon.sendEvent(turnCompleteEvent({ sessionId: scenario.sessionId }));
  const settings = async () => {
    await submitLocalCommand(page, '/settings');
    await expect(page.getByRole('region', { name: 'Settings', exact: true })).toBeVisible();
    await expect(page.getByRole('switch', { name: /loading phrases/i })).toBeVisible();
  };
  const back = () => page.getByTestId('panel-back').click();
  const shot = (name) => page.screenshot({ path: `${OUT}/${theme}-${name}.png`, fullPage: true, animations: 'disabled' });
  return { scenario, daemon, writes, stream, finish, settings, back, shot, documentId };
}

for (const theme of ['light', 'dark']) {
  test(`configured phrases and Settings toggle/banner (${theme})`, async ({ page }, testInfo) => {
    const ui = await boot(page, testInfo, theme);
    await ui.stream();
    await expect(page.getByText(PHRASE, { exact: true })).toBeVisible();
    await ui.shot('configured-phrase');
    await ui.finish();
    await ui.settings();
    await expect(page.getByText('Custom Witty Phrases', { exact: true })).toHaveCount(0);
    const toggle = page.getByRole('switch', { name: /loading phrases/i });
    await expect(toggle).toBeChecked();
    await toggle.click();
    await expect(toggle).not.toBeChecked();
    await expect.poll(() => ui.writes.filter((x) => x.key === KEY).length).toBe(1);
    await expect(page.getByText(BANNER, { exact: true })).toHaveCount(0);
    await ui.shot('settings-disabled-no-banner');
    await ui.back();
    await ui.stream();
    await expect(page.getByText(PHRASE, { exact: true })).toHaveCount(0);
    await ui.shot('phrase-disabled');
    await ui.finish();
    await ui.settings();
    await toggle.click();
    await expect(toggle).toBeChecked();
    await expect.poll(() => ui.writes.filter((x) => x.key === KEY).length).toBe(2);
    await expect(page.getByText(BANNER, { exact: true })).toHaveCount(0);
    await ui.shot('settings-enabled-no-banner');
    await ui.back();
    await ui.stream();
    await expect(page.getByText(PHRASE, { exact: true })).toBeVisible();
    await ui.shot('phrase-reenabled');
    await ui.finish();
    await ui.settings();
    await page.getByRole('switch', { name: /timestamps/i }).click();
    await expect(page.getByText(BANNER, { exact: true })).toBeVisible();
    await ui.shot('other-setting-restart-control');
    expect(ui.writes.filter((x) => x.key === KEY).map((x) => x.value)).toEqual([false, true]);
    expect(await page.evaluate(() => window.__pr14353DocumentId)).toBe(ui.documentId);
    writeFileSync(`${OUT}/${theme}-observations.json`, JSON.stringify({ head: HEAD, backend: 'repository mock daemon; POST deliberately returns requiresRestart=true', writes: ui.writes, documentStayedSame: true, claims: ['configured phrase visible', 'array editor hidden', 'toggle off/on updates chat without page reload', 'no restart banner for loading-phrase setting', 'unrelated restart-required setting still shows banner'] }, null, 2));
  });
}

test('host resolver keeps precedence over configured phrases', async ({ page }, testInfo) => {
  const ui = await boot(page, testInfo, 'dark', { host: true });
  await ui.stream();
  await expect(page.getByText('Host verification phrase', { exact: true })).toBeVisible();
  await expect(page.getByText(PHRASE, { exact: true })).toHaveCount(0);
  await ui.shot('host-precedence');
});

test('invalid-only custom entries fall back to a visible built-in phrase', async ({ page }, testInfo) => {
  const ui = await boot(page, testInfo, 'light', { invalidOnly: true });
  await ui.stream();
  const meta = page.locator('span').filter({ hasText: /^\d+s.*esc to cancel$/ });
  const label = meta.locator('..').locator('span').first();
  await expect(label).not.toBeEmpty();
  await expect(label).not.toHaveText('42');
  await expect(page.getByText(PHRASE, { exact: true })).toHaveCount(0);
  await ui.shot('invalid-entry-fallback');
});
