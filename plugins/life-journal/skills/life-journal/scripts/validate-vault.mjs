#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const vault = path.resolve(process.argv[2] || process.env.LIFE_JOURNAL_HOME || ".");
const required = ["life.config.yml", "diary.md", "person.md", "places.md", "thoughts.md", "media.md", "experiences.md"];
const issues = [];

for (const file of required) {
  try {
    await fs.access(path.join(vault, file));
  } catch {
    issues.push(`missing required file: ${file}`);
  }
}

if (!issues.length) {
  const diary = await fs.readFile(path.join(vault, "diary.md"), "utf8");
  const dates = [...diary.matchAll(/^##\s+(\d{4}-\d{2}-\d{2})\s*$/gm)].map((match) => match[1]);
  if (new Set(dates).size !== dates.length) issues.push("duplicate diary date heading");
  if (!dates.every((date, index) => index === 0 || dates[index - 1] >= date)) issues.push("diary dates are not descending");

  const linkedFiles = ["person.md", "places.md", "experiences.md"];
  const experienceDir = path.join(vault, "experiences");
  const experienceFiles = await fs.readdir(experienceDir).catch(() => []);
  linkedFiles.push(...experienceFiles.filter((name) => name.endsWith(".md")).map((name) => `experiences/${name}`));
  const dateSet = new Set(dates);
  for (const file of linkedFiles) {
    const text = await fs.readFile(path.join(vault, file), "utf8").catch(() => "");
    for (const match of text.matchAll(/diary\.md#(?:diary-)?(\d{4}-\d{2}-\d{2})/g)) {
      if (!dateSet.has(match[1])) issues.push(`${file}: broken diary link ${match[1]}`);
    }
  }
}

if (issues.length) {
  for (const issue of issues) process.stderr.write(`ERROR ${issue}\n`);
  process.exit(1);
}
process.stdout.write("LIFE_JOURNAL_VALID\n");
