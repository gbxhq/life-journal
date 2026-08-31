# Updates and migrations

Read this reference when the user asks how to update Life Journal or whether an existing Vault needs migration.

## Keep code and data separate

1. **Skill update:** updates `SKILL.md`, references, scripts, and templates through the Agent Skills installer.
2. **Vault migration:** changes `life.config.yml` or the user's Markdown data schema.

Update the cross-Agent Skill with:

```bash
npx skills update -g
```

A Skill update must never write to the user's Vault. Standard recording behavior belongs to the installed Skill, so ordinary methodology updates require no copy into each Vault.

## Check a Vault

Run:

```bash
node scripts/check-vault-version.mjs /path/to/vault
```

The check is read-only and compares only `schema_version` in `life.config.yml` with the schema bundled in the installed Skill.

## Migrate only with confirmation

When a newer schema is available:

1. Read `life.config.yml` and the affected Markdown structures.
2. Show the exact files and structural changes required.
3. Preserve user data and supported configuration.
4. Ask for confirmation before writing.
5. Back up each file that will change, apply the smallest migration, update `schema_version`, and validate the Vault.

If no migration note exists for a version gap, report that manual review is required instead of guessing.

## Legacy `AI_GUIDE.md`

Vaults created before schema version 2 may contain `AI_GUIDE.md`. The file is no longer required and must not override the installed Skill.

Before deleting it, review it once for actual user-specific preferences. Standard Life Journal rules are already in the Skill. Convert supported structured preferences to `life.config.yml`; report any remaining personal instruction to the user. Delete the legacy file only after explicit approval.
