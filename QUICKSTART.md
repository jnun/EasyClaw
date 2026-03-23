# Quick Start

## Prerequisites

- Node.js 20+
- npm 10+
- Docker running
- OpenShell CLI installed ([releases](https://github.com/NVIDIA/OpenShell/releases))

## Install

```console
$ git clone git@github.com:jnun/EasyClaw.git
$ cd EasyClaw
$ npm install
$ cd nemoclaw && npm install && npm run build && cd ..
```

## Configure ports

Check for port conflicts before building. EasyClaw uses four ports — all configurable via `.env`:

```console
$ cp .env.example .env
$ $EDITOR .env
```

| Port | Default | Env var | Common conflicts |
|------|---------|---------|-----------------|
| Gateway | 8081 | `NEMOCLAW_GATEWAY_PORT` | Jenkins, Tomcat, K8s |
| Dashboard | 18789 | `NEMOCLAW_DASHBOARD_PORT` | SSH forwards |
| vLLM/NIM | 8009 | `NEMOCLAW_VLLM_PORT` | Django, PHP |
| Ollama | 11434 | `NEMOCLAW_OLLAMA_PORT` | — |

Check what's in use:

```console
$ scripts/check-ports.sh
```

## Build and run

```console
$ node bin/nemoclaw.js onboard
```

The onboarding wizard handles the OpenShell gateway, sandbox creation, inference setup, and policy presets.

## Install packages inside the sandbox

The sandbox runs behind a TLS-terminating proxy that enforces network policies. By default, `npm install` will fail with `403 Forbidden` because the proxy checks which **binary** is making the request.

The base policy allows `/usr/local/bin/npm` but npm is a Node.js script — the actual binary making network calls is `/usr/local/bin/node`. You need to add `node` to the allowed binaries list.

### Fix: add node to the npm policy

Dump the live policy, add the `node` binary, and re-apply:

```console
$ openshell policy get <sandbox-name> --full | sed -n '/^version:/,$p' > /tmp/policy.yaml
```

Find the `npm_registry` section and add `node`:

```yaml
  npm_registry:
    name: npm_registry
    endpoints:
    - host: registry.npmjs.org
      port: 443
      access: full
    binaries:
    - path: /usr/local/bin/openclaw
    - path: /usr/local/bin/npm
    - path: /usr/local/bin/node    # <-- add this
```

Apply:

```console
$ openshell policy set <sandbox-name> --policy /tmp/policy.yaml
```

Then reconnect and `npm install` works:

```console
$ node bin/nemoclaw.js <sandbox-name> connect
$ npm install discord.js
```

### Why this happens

The OpenShell sandbox proxy enforces network policies at L4 by checking the calling binary. When you run `npm install`, the process tree is:

```
npm (/usr/local/bin/npm)  →  node script
  └── node (/usr/local/bin/node)  →  makes the HTTPS CONNECT to the proxy
```

The proxy sees `node` as the caller, not `npm`. If `node` isn't in the `binaries` list, the request gets a `403 Forbidden`.

This fix is already applied in the EasyClaw fork's base policy (`nemoclaw-blueprint/policies/openclaw-sandbox.yaml`). If you're running from upstream NemoClaw, you'll need to apply it manually.

## Connect to the sandbox

```console
$ node bin/nemoclaw.js <sandbox-name> connect
```

## Pass credentials into the sandbox

Set tokens before running `onboard` and they'll be auto-detected:

```console
$ export DISCORD_BOT_TOKEN='your-token'
$ export NVIDIA_API_KEY='your-key'
$ node bin/nemoclaw.js onboard
```

If the sandbox already exists, inject the token manually:

```console
$ printf 'echo "export DISCORD_BOT_TOKEN=your-token" >> ~/.bashrc\nexit\n' | node bin/nemoclaw.js <sandbox-name> connect
```
