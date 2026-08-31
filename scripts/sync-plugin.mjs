#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "skill", "life-journal");
const destination = path.join(root, "plugins", "life-journal", "skills", "life-journal");

await fs.rm(destination, { recursive: true, force: true });
await fs.mkdir(path.dirname(destination), { recursive: true });
await fs.cp(source, destination, { recursive: true });

process.stdout.write(`Synced ${path.relative(root, source)} to ${path.relative(root, destination)}\n`);
