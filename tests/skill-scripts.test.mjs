import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function run(script, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script, ...args], { cwd: root });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => resolve({ code, stdout, stderr }));
  });
}

async function listFiles(directory, prefix = "") {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(path.join(directory, entry.name), relative));
    else files.push(relative);
  }
  return files;
}

test("initializes and validates a clean vault", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "life-journal-test-"));
  try {
    const init = await run("skill/life-journal/scripts/init-vault.mjs", [directory]);
    assert.equal(init.code, 0, init.stderr);
    const validate = await run("skill/life-journal/scripts/validate-vault.mjs", [directory]);
    assert.equal(validate.code, 0, validate.stderr);
    assert.match(validate.stdout, /LIFE_JOURNAL_VALID/);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test("diary upsert is idempotent", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "life-journal-upsert-"));
  try {
    await run("skill/life-journal/scripts/init-vault.mjs", [directory]);
    const operationPath = path.join(directory, "operation.json");
    await fs.writeFile(operationPath, JSON.stringify({
      operation: "upsertDiary",
      date: "2025-01-02",
      labels: ["开始记录"],
      weekday: "周四",
      lunar: "腊月初三",
      lines: ["今天写下第一条记录"],
    }));
    await run("skill/life-journal/scripts/apply-operation.mjs", [directory, operationPath]);
    await run("skill/life-journal/scripts/apply-operation.mjs", [directory, operationPath]);
    const diary = await fs.readFile(path.join(directory, "diary.md"), "utf8");
    assert.equal((diary.match(/今天写下第一条记录/g) || []).length, 1);
    assert.equal((diary.match(/^## 2025-01-02$/gm) || []).length, 1);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test("skill routes Web reader requests to private deployment guidance", async () => {
  const [skill, guide] = await Promise.all([
    fs.readFile(path.join(root, "skill/life-journal/SKILL.md"), "utf8"),
    fs.readFile(path.join(root, "skill/life-journal/references/web-reader.md"), "utf8"),
  ]);
  assert.match(skill, /references\/web-reader\.md/);
  assert.match(guide, /LIFE_JOURNAL_HOME=\/path\/to\/vault npm run dev/);
  assert.match(guide, /perform the startup workflow instead of only printing commands/);
  assert.match(guide, /no built-in password or authentication/);
  assert.match(guide, /Do not expose the reader port directly to the public Internet/);
});

test("vault version checks are read-only and current for a new vault", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "life-journal-version-"));
  try {
    await run("skill/life-journal/scripts/init-vault.mjs", [directory]);
    const check = await run("skill/life-journal/scripts/check-vault-version.mjs", [directory]);
    assert.equal(check.code, 0, check.stderr);
    assert.deepEqual(JSON.parse(check.stdout), {
      status: "current",
      installed: { schema: 2 },
      current: { schema: 2 },
    });
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test("the Skill is the single rule source", async () => {
  const [skill, upgrades] = await Promise.all([
    fs.readFile(path.join(root, "skill/life-journal/SKILL.md"), "utf8"),
    fs.readFile(path.join(root, "skill/life-journal/references/upgrades.md"), "utf8"),
  ]);
  assert.match(skill, /single authority for recording behavior and file formats/);
  assert.match(upgrades, /npx skills update -g/);
  assert.match(upgrades, /A Skill update must never write to the user's Vault/);
});

test("README promotes the cross-Agent npx installer", async () => {
  const readme = await fs.readFile(path.join(root, "README.md"), "utf8");
  assert.match(readme, /npx skills add gbxhq\/life-journal -g/);
  assert.match(readme, /npx skills update -g/);
  assert.doesNotMatch(readme, /codex plugin (?:marketplace|add)/);
});

test("the Plugin distribution contains the exact standalone Skill source", async () => {
  const source = path.join(root, "skill/life-journal");
  const packaged = path.join(root, "plugins/life-journal/skills/life-journal");
  const files = await listFiles(source);
  assert.deepEqual(await listFiles(packaged), files);
  for (const file of files) {
    const [left, right] = await Promise.all([
      fs.readFile(path.join(source, file)),
      fs.readFile(path.join(packaged, file)),
    ]);
    assert.deepEqual(right, left, file);
  }
});

test("the repository exposes a valid Life Journal marketplace entry", async () => {
  const [plugin, marketplace] = await Promise.all([
    fs.readFile(path.join(root, "plugins/life-journal/.codex-plugin/plugin.json"), "utf8").then(JSON.parse),
    fs.readFile(path.join(root, ".agents/plugins/marketplace.json"), "utf8").then(JSON.parse),
  ]);
  assert.equal(plugin.name, "life-journal");
  assert.equal(plugin.skills, "./skills/");
  assert.equal(plugin.homepage, "https://life-journal.ixs.im");
  assert.equal(marketplace.name, "life-journal");
  assert.equal(marketplace.plugins[0].source.path, "./plugins/life-journal");
});
