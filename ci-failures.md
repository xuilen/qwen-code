# CI failures at 01785474

Run: https://github.com/QwenLM/qwen-code/actions/runs/43143938847

Required Linux shards failed; their aggregate is a third failing check, not a sixth failing test.

| Shard | Failing test/file | Observed error |
| --- | --- | --- |
| [1/2](https://github.com/QwenLM/qwen-code/actions/runs/43143938847/job/130944183027) | managed-runtime-bootstrap.process.test.ts — launches once under concurrent requests, survives its launcher, and cleanly retires | ENOENT reading /etc/machine-id |
| 1/2 | provider-extension-local.test.ts — packs an executable that fails fast without provider configuration | Child killed after 5s, code=null and empty stderr, rather than the expected fast configuration error |
| 1/2 | verify-pr-prepare.test.js — resolves the coordinates and reports a container boundary | Expects isolation SANDBOX=docker only; actual banner includes /.dockerenv, SANDBOX=docker |
| [2/2](https://github.com/QwenLM/qwen-code/actions/runs/43143938847/job/130944183015) | managed-workspace-upload.test.ts — returns private terminal receipts after registered SSH storage changes while fencing new filesystem access | ENOENT reading /etc/machine-id |
| 2/2 | proxy.test.ts — rejects a malformed proxy environment value via the real dispatcher | Expected a throw, but no exception occurred |

All eight related test/implementation blobs below match main `41a3b9f5a6bbaad3c9fa98f341d5ae453b0265a0` at the comparison snapshot, and are outside this PR's ten-file diff. This is a file comparison, not a run of main's CI or a proof excluding every runtime interaction.

| File | Identical PR/main blob |
| --- | --- |
| `packages/cli/src/serve/managed-runtime-bootstrap.process.test.ts` | `c355b3b9663bc5d61e408acb08a962af111f5ba7` |
| `packages/cli/src/serve/managed-workspace-upload.test.ts` | `cdbffcee8a53f8b74b8e03dbb988657048426907` |
| `packages/cli/src/serve/managed-runtime-bootstrap.ts` | `5326bcef94ddd860d3144fab3f046d878643c170` |
| `integrations/external-context/src/proxy.test.ts` | `9cb116b9110232229aeb407e24575a82f5134726` |
| `integrations/external-context/src/proxy.ts` | `5ce643cb1c6c418ff392f72bd3c6efb459d42d34` |
| `integrations/external-context/src/provider-extension-local.test.ts` | `a4ccfdef0e0455db1b9e85529b6f9977e929238a` |
| `scripts/tests/verify-pr-prepare.test.js` | `a7e93125c4b4d59aa366b343034a60b3790ed5cb` |
| `scripts/verify-pr-prepare.mjs` | `40c50ffd00d2053c7bb3af0058024fdf5afa3754` |

A separate no-network probe with Undici 7.29.0 and a synthetic case-sensitive environment confirms that a valid lowercase http_proxy can shadow a malformed HTTP_PROXY. This is a possible explanation for the proxy assertion, not a reading of the CI environment. Native Windows environment keys are case-insensitive, so the probe deliberately used a plain object in an isolated process. No product code was changed by this investigation.

The lint freshness step now passes. Both browser smoke shards, both no-AK integration shards, Serve A/B, the managed-host build, TUI parity, Landlock and the Managed Agent gate completed successfully. The review workflow completed, but its latest review comment still flags the required red CI. These results do not make the PR merge-ready.
