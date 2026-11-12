# pr-ui-verify — Qwen Code #14353

Verified source head: `01785474c8affd6d5306cabe47c7dc00249dea28` (source tree `9c521525ed539a00a2ce458377fca143094ca585`).

Date: 2026-11-12. Windows, Node.js 24.20.0, Playwright 1.61.1, real headless Chromium. Final harness run: **4 passed, 0 failed, 0 retries**. Product checkout stayed clean and the source head was rechecked before packaging these artifacts.

The tests load the real Web Shell App from that checkout through the repository's existing Settings harness. The backend is the repository's page-level mock daemon (SSE and JSON); settings POST responses deliberately return `requiresRestart: true`. The source is unchanged. An external Vite wrapper only normalizes the Windows junction root, serving allowlist and cache location. Early harness startup/selector errors were corrected in the external verification scripts before the final successful run.

## Visible claims

| Claim | Result | Evidence |
| --- | --- | --- |
| Configured custom phrase appears during streaming, with blank/non-string entries in the fixture | PASS, light and dark | [light](light-configured-phrase.png), [dark](dark-configured-phrase.png) |
| Settings toggle off hides the configured phrase when returning to chat | PASS, light and dark | [light](light-phrase-disabled.png), [dark](dark-phrase-disabled.png) |
| Re-enabling the setting restores the phrase within the same page document | PASS, light and dark | [light](light-phrase-reenabled.png), [dark](dark-phrase-reenabled.png), observations JSON documentStayedSame |
| Loading-phrase changes show no restart banner despite requiresRestart=true responses | PASS, light and dark | [off/light](light-settings-disabled-no-banner.png), [on/light](light-settings-enabled-no-banner.png), [off/dark](dark-settings-disabled-no-banner.png), [on/dark](dark-settings-enabled-no-banner.png) |
| Other restart-required settings retain their banner | PASS, light and dark | [light control](light-other-setting-restart-control.png), [dark control](dark-other-setting-restart-control.png) |
| Unsupported custom phrase array editor remains absent from Settings | PASS, light and dark | The settings screenshots and explicit label-absence assertions |
| Host-provided resolver takes precedence over configured phrases | PASS | [host precedence](dark-host-precedence.png) |
| Invalid-only custom entries produce a visible built-in phrase | PASS | [fallback](light-invalid-entry-fallback.png) |

## Reproduction and limits

The exact local verification spec and external Playwright/Vite configs are included. They record the verification machine's F: paths; adapt those paths to a checkout of the source head above and existing dependencies when reproducing. The local command was `node node_modules/@playwright/test/cli.js test --config F:/PR_Workspace/notes/qwen-ui-verify-20261112/playwright.config.cjs` from the source repository. No install script is part of this evidence package.

This proves browser interaction/rendering with the stated mock backend. It does not prove a live daemon's filesystem persistence, real-model behavior, terminal interaction, native Linux/Docker behavior, or mobile UI. The shared terminal restart flag was checked separately by source-level tests/probe, not by this browser run. The screenshot set does not establish absence of every transient animation artifact.

AI assistance: Codex prepared and executed the verification scripts and collected the observations. The account owner reviews and authorizes publication of this evidence. No claim of personally rerunning these commands is made on behalf of the owner.

The remaining required CI failures are documented separately in [ci-failures.md](ci-failures.md); screenshots and successful preview workflows are not a replacement for those red checks.
