# EasyClaw Fork Delta

Files unique to this fork that do not exist in upstream NVIDIA/NemoClaw.
These need attention during upstream syncs only if upstream introduces a
file with the same name.

| File | Purpose |
|------|---------|
| `QUICKSTART.md` | Simplified getting-started guide for EasyClaw |
| `FORK_DELTA.md` | This file — fork delta tracker |
| `.env.example` | Port configuration template |
| `bin/lib/env.js` | .env/.env.local loader for Node entry points |
| `bin/lib/ports.js` | Central port configuration with env var overrides |
| `scripts/check-ports.sh` | Port conflict diagnostic script |
| `docs/reference/port-configuration.md` | Port configuration reference |
| `test/env.test.js` | Tests for the env loader |

All other files are synced from upstream via `git merge` and do not
require manual reconciliation.
