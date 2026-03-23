// SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
//
// Central port configuration — override via environment variables.

function parsePort(envVar, fallback) {
  const raw = process.env[envVar];
  if (raw === undefined || raw === "") return fallback;
  const parsed = parseInt(raw, 10);
  if (Number.isNaN(parsed) || parsed < 1024 || parsed > 65535) {
    throw new Error(
      `Invalid port: ${envVar}="${raw}" — must be an integer between 1024 and 65535`
    );
  }
  return parsed;
}

module.exports = {
  DASHBOARD_PORT: parsePort("NEMOCLAW_DASHBOARD_PORT", 18789),
  GATEWAY_PORT: parsePort("NEMOCLAW_GATEWAY_PORT", 8081),
  VLLM_PORT: parsePort("NEMOCLAW_VLLM_PORT", 8009),
  OLLAMA_PORT: parsePort("NEMOCLAW_OLLAMA_PORT", 11434),
};
