# Qwen Code #14353 — browser evidence

Source head binding: `af17c6219d5d5286870c043c5ca1ac6073af13da`.

The browser run occurred **before that commit existed**, on the uncommitted prepared merge tree `6eaf1661da0aa9674b2c2e584784a7c4e7a2a691`, based on head `01785474c8affd6d5306cabe47c7dc00249dea28` and main `5e64e2d8a1517939b7c3b30c8e45cf447bde70cd`. A later merge commit may be bound above only after its actual Git tree is verified to equal this prepared tree. The observations retain the execution-time baseHead/preparedTree and are not rewritten to pretend a new head existed during execution.

2026-11-12, Windows, Node.js 24.20.0, Playwright 1.61.1, real headless Chromium: **4 passed, 0 failed, 0 skipped, 0 retries**. Fourteen original PNGs and the exact four executed local scripts/configs are included. No product source was modified by the verifier.

The real Web Shell App was loaded through the repository's Settings harness. Backend SSE/JSON routes were the repository's page-level mock daemon; settings POST responses deliberately returned `requiresRestart: true`. The external Vite config only normalizes the Windows junction root, serving allowlist and F-drive cache.

## Visible claims

| Claim | Result | Evidence |
| --- | --- | --- |
| Configured custom phrase appears during streaming despite blank/non-string fixture entries | PASS, light and dark | [light](light-configured-phrase.png), [dark](dark-configured-phrase.png) |
| Settings off hides the configured phrase on return to chat | PASS, light and dark | [light](light-phrase-disabled.png), [dark](dark-phrase-disabled.png) |
| Settings on restores it within the same page document | PASS, light and dark | [light](light-phrase-reenabled.png), [dark](dark-phrase-reenabled.png), [light nonce](light-observations.json), [dark nonce](dark-observations.json) |
| Loading-phrase changes show no restart banner despite restart-true responses | PASS, light and dark | [off/light](light-settings-disabled-no-banner.png), [on/light](light-settings-enabled-no-banner.png), [off/dark](dark-settings-disabled-no-banner.png), [on/dark](dark-settings-enabled-no-banner.png) |
| Other restart-required settings retain their banner | PASS, light and dark | [light control](light-other-setting-restart-control.png), [dark control](dark-other-setting-restart-control.png) |
| Unsupported custom phrase array editor remains absent | PASS, light and dark | Settings screenshots above and explicit label-absence assertions in [spec](loading-phrases.spec.ts) |
| Host resolver takes precedence over configured phrases | PASS | [host precedence](dark-host-precedence.png) |
| Invalid-only custom entries yield a visible built-in phrase | PASS | [fallback](light-invalid-entry-fallback.png) |

The document nonce was asserted unchanged after the full off/on sequence: light `a75ac718-a11c-46dd-a0a9-f387213baf6d`, dark `e7764900-e461-49c7-aa0c-b2f2aaf54028`. Both observations record the actual before/after values and loading-setting writes `[false, true]`; the successful update did not depend on reload.

## Supporting checks and provenance

The 316 passing unit/component selections, 1493 filtered skips, root build and root typecheck were completed at prepared tree `55d5e2baaa9d8c04e2113e5ba374a64014bf8f23`. The subsequent change to final `6eaf1661` is exactly eleven upstream CI/workflow/docs files, with no product, dependency, type configuration or product-test differences. Those product checks are retained on identical inputs, not claimed as rerun on the eleven gate changes. The four browser cases above **were rerun on final 6eaf1661**. Root captured build/typecheck exit 0; existing VSCode warnings were not repaired. Gate test and CI qualifications are separate in [ci-failures.md](ci-failures.md).

## Reproduction and limits

The actual command, from the source checkout, was `node node_modules/@playwright/test/cli.js test --config F:/PR_Workspace/notes/qwen-ui-verify-20261112-1520-gate-agent/playwright.config.cjs`. The included scripts contain the real verification machine's F: paths; adjust those paths to a checkout with the verified tree and existing dependencies when reproducing. Temporary files, browser APPDATA/LOCALAPPDATA and caches were redirected into the F workspace. No install script or dependency is supplied by this evidence package.

This is real-browser rendering/interaction with a **mock backend**, not live-daemon filesystem persistence, real model calls, terminal interaction, native Linux host admission, mobile behavior, or proof against all transient animation artifacts. The terminal restart contract was checked separately by source-level tests/probe. Local passes do not make earlier required red CI checks green and do not establish CI success for a later pending head.

AI assistance: Codex prepared/executed these checks and collected the observations. Publication remains subject to the account owner's review/authorization; no personal rerun claim is made for the owner. The manifest hashes all other 22 package files; its own hash is external to avoid a self-reference. Head binding changes only this README and manifest sourceHead after tree equality is checked, with the README hash then regenerated; observed PNGs/JSON/scripts remain untouched.
