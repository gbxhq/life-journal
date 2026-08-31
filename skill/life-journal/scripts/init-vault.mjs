#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const targetArg = process.argv[2];
if (!targetArg) {
  process.stderr.write("Usage: init-vault.mjs <target-directory>\n");
  process.exit(2);
}

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templateRoot = path.join(skillRoot, "assets", "vault-template");
const targetRoot = path.resolve(targetArg);
const files = [
  "life.config.yml",
  "diary.md",
  "person.md",
  "places.md",
  "thoughts.md",
  "media.md",
  "experiences.md",
  "experiences/TEMPLATE.md",
];

await fs.mkdir(targetRoot, { recursive: true });
const conflicts = [];
for (const relative of files) {
  try {
    await fs.access(path.join(targetRoot, relative));
    conflicts.push(relative);
  } catch {
    // The destination is available.
  }
}

if (conflicts.length) {
  process.stderr.write(`Refusing to overwrite existing files:\n${conflicts.join("\n")}\n`);
  process.exit(1);
}

for (const relative of files) {
  const destination = path.join(targetRoot, relative);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.copyFile(path.join(templateRoot, relative), destination);
}

process.stdout.write(`Initialized Life Journal vault at ${targetRoot}\n`);
