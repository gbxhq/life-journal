import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const execFileAsync = promisify(execFile);
const ignored = new Set([".git", "node_modules", ".vinext", ".wrangler", ".next", "dist", "generated", "work", "outputs"]);
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
    if (relative !== "scripts/release-guard.mjs" && /<(?:owner|repository-url)>|TODO_REPLACE/i.test(text)) {
      findings.push(`${relative}: unfinished release placeholder`);
    }
  }
}

await walk(root);

const demoConfig = await fs.readFile(path.join(root, "examples", "demo-vault", "life.config.yml"), "utf8");
if (!/^\s*fictional:\s*true\s*$/m.test(demoConfig)) {
  findings.push("examples/demo-vault/life.config.yml: fictional demo marker is missing");
}

const configuredVault = process.env.LIFE_JOURNAL_HOME
  ? path.resolve(process.env.LIFE_JOURNAL_HOME)
  : path.join(root, "examples", "demo-vault");
if (configuredVault !== path.join(root, "examples", "demo-vault")) {
  findings.push("LIFE_JOURNAL_HOME: release verification must use examples/demo-vault");
}

const generatedVaultPath = path.join(root, "generated", "vault.json");
try {
  const generatedVault = JSON.parse(await fs.readFile(generatedVaultPath, "utf8"));
  if (generatedVault?.config?.demo?.fictional !== true) {
    findings.push("generated/vault.json: generated site data is not marked as fictional demo content");
  }
} catch (error) {
  if (error?.code !== "ENOENT") findings.push("generated/vault.json: cannot verify generated demo content");
}

const archivePath = path.join(root, "public", "life-journal-skill.tar.gz");
try {
  const { stdout } = await execFileAsync("tar", ["-tzf", archivePath]);
  const entries = stdout.trim().split("\n").filter(Boolean);
  if (!entries.includes("life-journal/SKILL.md")) findings.push("public/life-journal-skill.tar.gz: SKILL.md is missing");
  if (entries.some((entry) => entry.includes("demo-vault") || entry.endsWith("diary.md") && !entry.includes("assets/vault-template"))) {
    findings.push("public/life-journal-skill.tar.gz: archive contains unexpected journal data");
  }
} catch {
  findings.push("public/life-journal-skill.tar.gz: archive cannot be inspected");
}

if (findings.length) {
  for (const finding of findings) process.stderr.write(`${finding}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write("RELEASE_GUARD_OK\n");
}
