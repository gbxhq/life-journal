#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const vaultArg = process.argv[2];
if (!vaultArg) {
  process.stderr.write("Usage: check-vault-version.mjs <vault-directory>\n");
  process.exit(2);
}

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templateConfigPath = path.join(skillRoot, "assets", "vault-template", "life.config.yml");
const vaultConfigPath = path.join(path.resolve(vaultArg), "life.config.yml");

function numericField(text, name) {
  const match = text.match(new RegExp(`^${name}:\\s*(\\d+)\\s*$`, "m"));
  return match ? Number(match[1]) : 0;
}

const [templateConfig, vaultConfig] = await Promise.all([
  fs.readFile(templateConfigPath, "utf8"),
  fs.readFile(vaultConfigPath, "utf8"),
]);

const current = {
  schema: numericField(templateConfig, "schema_version"),
  guide: numericField(templateConfig, "guide_version"),
};
const installed = {
  schema: numericField(vaultConfig, "schema_version"),
  guide: numericField(vaultConfig, "guide_version"),
};
const needsUpgrade = installed.schema < current.schema || installed.guide < current.guide;

process.stdout.write(`${JSON.stringify({ status: needsUpgrade ? "upgrade-available" : "current", installed, current })}\n`);
