import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadVault } from "../lib/content-core.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vaultDir = path.resolve(process.argv[2] || process.env.LIFE_JOURNAL_HOME || path.join(root, "examples/demo-vault"));
const vault = await loadVault(vaultDir);

for (const issue of vault.issues) {
  process.stdout.write(`${issue.level.toUpperCase()} [${issue.code}] ${issue.message}\n`);
}

const errors = vault.issues.filter((issue) => issue.level === "error");
if (errors.length) {
  process.stderr.write(`Validation failed with ${errors.length} error(s).\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(
    `VALID: ${vault.summary.diaryDays} diary days, ${vault.summary.people} people, ${vault.summary.places} places, ${vault.summary.experiences} experiences.\n`,
  );
}
