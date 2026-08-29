import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ignored = new Set([".git", "node_modules", ".vinext", ".wrangler", "work", "outputs"]);
const forbiddenNames = new Set([".DS_Store", ".env", ".env.local", "workspace.json"]);
const textExtensions = new Set([".md", ".yml", ".yaml", ".json", ".js", ".mjs", ".ts", ".tsx", ".css", ".txt"]);
const findings = [];

async function walk(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    const relative = path.relative(root, fullPath);
    if (forbiddenNames.has(entry.name)) findings.push(`${relative}: forbidden file name`);
    if (entry.isDirectory()) {
      if ([".workbuddy", ".obsidian"].includes(entry.name)) findings.push(`${relative}: private tool directory`);
      await walk(fullPath);
      continue;
    }
    if (!textExtensions.has(path.extname(entry.name))) continue;
    const text = await fs.readFile(fullPath, "utf8").catch(() => "");
    if (/\/(Users|home)\/[^\s"']+/.test(text) || /[A-Za-z]:\\\\Users\\\\/.test(text)) {
      findings.push(`${relative}: absolute user path`);
    }
    if (/-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY-----/.test(text) || /AKIA[0-9A-Z]{16}/.test(text)) {
      findings.push(`${relative}: credential material`);
    }
    if (/api_key:\s*["'][^$][^"']{12,}["']/.test(text) && !relative.includes("fixtures/invalid")) {
      findings.push(`${relative}: possible inline API key`);
    }
  }
}

await walk(root);
if (findings.length) {
  for (const finding of findings) process.stderr.write(`${finding}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write("RELEASE_GUARD_OK\n");
}
