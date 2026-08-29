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
