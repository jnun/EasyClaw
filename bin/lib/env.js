// SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
//
// Lightweight .env loader — reads .env files from the project root and populates
// process.env. Existing environment variables are never overwritten, so shell
// exports always take precedence over file values.
//
// Supports:
//   - Multiple files (loaded in order; first file's values win over later files)
//   - Comments (#) and blank lines
//   - KEY=VALUE, KEY="VALUE", KEY='VALUE'
//   - Inline comments after unquoted values

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");

/**
 * Parse a .env file and populate process.env with its values.
 * Existing environment variables are never overwritten.
 * @param {string} filePath - Absolute path to the .env file.
 */
function parseEnvFile(filePath) {
  let content;
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch {
    return; // file doesn't exist or isn't readable — skip silently
  }

  for (const raw of content.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;

    const eqIndex = line.indexOf("=");
    if (eqIndex === -1) continue;

    const key = line.slice(0, eqIndex).trim();
    if (!key) continue;

    let value = line.slice(eqIndex + 1).trim();

    // Strip surrounding quotes first so that `#` inside quoted values is
    // preserved (e.g. KEY="val#ue" or KEY="value" # comment).
    if (
      (value.startsWith('"') && value.includes('"', 1)) ||
      (value.startsWith("'") && value.includes("'", 1))
    ) {
      const quote = value[0];
      const closeIdx = value.indexOf(quote, 1);
      value = value.slice(1, closeIdx);
    } else {
      // Unquoted value — strip inline comments
      const hashIndex = value.indexOf(" #");
      if (hashIndex !== -1) {
        value = value.slice(0, hashIndex).trim();
      }
    }

    // Never overwrite existing env vars
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

// Load .env files in priority order — .env.local wins over .env
// because we never overwrite once set.
parseEnvFile(path.join(ROOT, ".env.local"));
parseEnvFile(path.join(ROOT, ".env"));

module.exports = { parseEnvFile };
