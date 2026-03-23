# EasyClaw Fork Delta

## Fork-only files

Files that do not exist in upstream NVIDIA/NemoClaw. These only need
attention if upstream introduces a file with the same name.

| File | Purpose |
|------|---------|
| `FORK_DELTA.md` | This file — fork delta tracker |
| `QUICKSTART.md` | Simplified getting-started guide for EasyClaw |
| `.env.example` | Port configuration template |
| `bin/lib/env.js` | .env/.env.local loader for Node entry points |
| `bin/lib/ports.js` | Central port configuration with env var overrides |

## Modified upstream files

Files that exist upstream and carry EasyClaw changes. These will
conflict during upstream syncs and need manual reconciliation.

| File | Change |
|------|--------|
| `.gitignore` | Added `!.env.example` exception |
| `bin/nemoclaw.js` | Loads `env.js`; uses `DASHBOARD_PORT` from `ports.js` |
| `bin/lib/onboard.js` | All hardcoded ports replaced with `ports.js` constants |
| `bin/lib/local-inference.js` | vLLM/Ollama ports from `ports.js` |
| `bin/lib/nim.js` | vLLM port from `ports.js` |
| `bin/lib/preflight.js` | Dashboard port from `ports.js` |
| `test/local-inference.test.js` | Port expectations match new defaults |
| `docs/reference/network-policies.md` | Added node binary to npm policy; widened to all methods/paths (may be excessive) |
| `nemoclaw-blueprint/policies/openclaw-sandbox.yaml` | Added node binary to npm policy |
