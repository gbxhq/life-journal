import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { loadVault, parseDiary, parseMedia } from "../lib/content-core.mjs";
import { entriesForCalendar, monthGrid, shiftMonth } from "../lib/calendar.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("loads and validates the fictional demo vault", async () => {
  const vault = await loadVault(path.join(root, "examples/demo-vault"));
  assert.equal(vault.issues.filter((issue) => issue.level === "error").length, 0);
  assert.deepEqual(vault.summary, {
    diaryDays: 10,
    people: 4,
    places: 4,
    confirmedPlaces: 1,
    thoughts: 3,
    media: 5,
    experiences: 2,
  });
  assert.equal(vault.diary[0].date, "2025-10-12");
  assert.equal(vault.diary.at(-1).date, "2025-09-21");
});

test("parses diary metadata and ignores non-date headings", () => {
  const entries = parseDiary(`# 说明\n\n## 格式\n无关\n\n## 2025-01-02\n**事件一·事件二** · 周四 · 腊月初三\n\n一件事实\n`);
  assert.equal(entries.length, 1);
  assert.deepEqual(entries[0].labels, ["事件一", "事件二"]);
  assert.equal(entries[0].lines[0], "一件事实");
});

test("filters empty media rows", () => {
  const items = parseMedia(`## 电影\n\n### 已看\n\n| 日期 | 片名 | 年份 | 感想 |\n|---|---|---|---|\n| | | | |\n| 2025-01-02 | 《示例电影》 | 2024 | 很安静 |`);
  assert.equal(items.length, 1);
  assert.equal(items[0].title, "《示例电影》");
});

test("calendar month navigation and date filtering stay in sync", () => {
  assert.equal(shiftMonth("2025-12", 1), "2026-01");
  assert.equal(shiftMonth("2025-01", -1), "2024-12");
  assert.equal(monthGrid("2025-10").filter(Boolean).length, 31);
  const entries = [{ date: "2025-10-12" }, { date: "2025-10-10" }, { date: "2025-09-30" }];
  assert.deepEqual(entriesForCalendar(entries, "2025-10", null).map((entry) => entry.date), ["2025-10-12", "2025-10-10"]);
  assert.deepEqual(entriesForCalendar(entries, "2025-10", "2025-10-10").map((entry) => entry.date), ["2025-10-10"]);
});
