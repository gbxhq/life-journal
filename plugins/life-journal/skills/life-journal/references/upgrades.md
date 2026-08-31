# Upgrades

Read this reference when the user asks how to update Life Journal, whether their Vault needs an upgrade, or whether a newer bundled `AI_GUIDE.md` should replace their local guide.

## Separate the two update layers

1. **Plugin or Skill update:** replaces installed instructions, scripts, references, and the template used for future Vaults.
2. **Vault migration:** changes the user's existing `AI_GUIDE.md`, `life.config.yml`, or record structure.

Updating the Plugin must never write to the user's Vault. The bundled `assets/vault-template/AI_GUIDE.md` is only the default for a newly initialized Vault.

## Check an existing Vault

Run:

```bash
node scripts/check-vault-version.mjs /path/to/vault
```

The check is read-only. It compares the Vault's `schema_version` and `guide_version` with the versions bundled in the installed Skill.

## Migrate only with confirmation

When a newer version is available:

1. Read the user's complete `AI_GUIDE.md` and the bundled template.
2. Identify only the rules or schema changes introduced after the Vault's recorded version.
3. Show a concise migration plan and the exact files that would change.
4. Preserve every user customization that does not conflict with the new requirement.
5. Ask for confirmation before writing.
6. Back up each file that will change, apply the smallest patch, update the version field, and validate the Vault.

Never replace the entire guide, silently rewrite user rules, or modify diary content merely because the Plugin version changed. If no migration note exists for a version gap, report that manual review is required instead of guessing.
