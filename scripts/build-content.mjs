import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { loadVault } from "../lib/content-core.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vaultDir = path.resolve(process.env.LIFE_JOURNAL_HOME || path.join(root, "examples/demo-vault"));
const outputDir = path.join(root, "generated");

function merge(base, override) {
  if (!override || typeof override !== "object" || Array.isArray(override)) return base;
  const result = { ...base };
  for (const [key, value] of Object.entries(override)) {
    result[key] = value && typeof value === "object" && !Array.isArray(value)
      ? merge(base?.[key] || {}, value)
      : value;
  }
  return result;
}

function cssValue(value) {
  return String(value).replace(/[\n\r;{}]/g, "").trim();
}

function buildThemeCss(theme) {
  const variables = {
    "theme-background": theme.colors?.background,
    "theme-background-deep": theme.colors?.background_deep,
    "theme-surface": theme.colors?.surface,
    "theme-surface-muted": theme.colors?.surface_muted,
    "theme-text": theme.colors?.text,
    "theme-muted": theme.colors?.muted,
    "theme-accent": theme.colors?.accent,
    "theme-accent-dark": theme.colors?.accent_dark,
    "theme-warm": theme.colors?.warm,
    "theme-border": theme.colors?.border,
    "theme-font-body": theme.typography?.body,
    "theme-font-display": theme.typography?.display,
    "theme-radius-card": theme.radius?.card,
    "theme-radius-control": theme.radius?.control,
    "theme-content-width": theme.spacing?.content_width,
    "theme-shadow": theme.effects?.shadow,
  };

  const declarations = Object.entries(variables)
    .filter(([, value]) => value)
    .map(([key, value]) => `  --${key}: ${cssValue(value)};`)
    .join("\n");
  return `/* Generated from life.config.yml and themes/${theme.id}/theme.yml */\n:root {\n${declarations}\n}\n`;
}

const vault = await loadVault(vaultDir);
const errors = vault.issues.filter((issue) => issue.level === "error");
if (errors.length) {
  for (const issue of errors) process.stderr.write(`[${issue.code}] ${issue.message}\n`);
  process.exitCode = 1;
} else {
  const preset = vault.config.theme?.preset || "paper";
  const presetPath = path.join(root, "themes", preset, "theme.yml");
  const presetTheme = YAML.parse(await fs.readFile(presetPath, "utf8"));
  const theme = { id: preset, ...merge(presetTheme, vault.config.theme?.overrides || {}) };

  await fs.mkdir(outputDir, { recursive: true });
  await Promise.all([
    fs.writeFile(path.join(outputDir, "vault.json"), `${JSON.stringify(vault, null, 2)}\n`),
    fs.writeFile(path.join(outputDir, "theme.json"), `${JSON.stringify(theme, null, 2)}\n`),
    fs.writeFile(path.join(outputDir, "theme.css"), buildThemeCss(theme)),
  ]);

  process.stdout.write(`Built ${vault.summary.diaryDays} diary days from ${vaultDir}\n`);
}
