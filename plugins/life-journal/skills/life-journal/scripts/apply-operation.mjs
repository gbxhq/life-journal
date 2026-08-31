#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const [vaultArg, operationFile] = process.argv.slice(2);
if (!vaultArg || !operationFile) {
  process.stderr.write("Usage: apply-operation.mjs <vault> <operation.json>\n");
  process.exit(2);
}

const vault = path.resolve(vaultArg);
const operation = JSON.parse(await fs.readFile(path.resolve(operationFile), "utf8"));
if (operation.operation !== "upsertDiary") {
  process.stderr.write("Only upsertDiary is supported by this deterministic helper.\n");
  process.exit(2);
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(operation.date) || !Array.isArray(operation.lines)) {
  process.stderr.write("Invalid upsertDiary operation.\n");
  process.exit(2);
}

const diaryPath = path.join(vault, "diary.md");
const before = (await fs.readFile(diaryPath, "utf8")).replace(/\r\n?/g, "\n").trim();
const marker = `## ${operation.date}`;
const sections = before ? before.split(/(?=^##\s+\d{4}-\d{2}-\d{2}\s*$)/m) : [];
const existingIndex = sections.findIndex((section) => section.startsWith(marker));
const labels = Array.isArray(operation.labels) ? operation.labels.filter(Boolean) : [];
const meta = labels.length
  ? `**${labels.join("·")}** · ${operation.weekday || ""}${operation.lunar ? ` · ${operation.lunar}` : ""}`.trim()
  : `${operation.weekday || ""}${operation.lunar ? ` · ${operation.lunar}` : ""}`.trim();

if (existingIndex >= 0) {
  const lines = sections[existingIndex].trim().split("\n");
  const currentFacts = new Set(lines.slice(2).map((line) => line.trim()).filter(Boolean));
  for (const line of operation.lines.map((value) => String(value).trim()).filter(Boolean)) currentFacts.add(line);
  const currentMeta = lines[1]?.trim() || meta;
  sections[existingIndex] = `${marker}\n${currentMeta}\n\n${[...currentFacts].join("\n")}\n`;
} else {
  sections.push(`${marker}\n${meta}\n\n${operation.lines.map((line) => String(line).trim()).filter(Boolean).join("\n")}\n`);
}

sections.sort((a, b) => b.slice(3, 13).localeCompare(a.slice(3, 13)));
const next = `${sections.map((section) => section.trim()).join("\n\n")}\n`;
const temporary = `${diaryPath}.life-journal-tmp`;
await fs.writeFile(temporary, next);
await fs.rename(temporary, diaryPath);
process.stdout.write(`Updated diary ${operation.date}\n`);
