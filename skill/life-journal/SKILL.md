---
name: life-journal
description: Initialize and maintain a local Markdown-based life journal containing dated diary entries, people, confirmed visits, media, thoughts, and reusable personal experiences. Use when the user wants to record, correct, organize, validate, or browse their life records; do not use for generic literary journaling or public publishing without an explicit privacy review.
---

# Life Journal

Maintain a portable life record whose Markdown files remain the canonical data source.

## Resolve the vault

Use the first unambiguous source:

1. A path explicitly provided by the user.
2. The current workspace when it contains both `AI_GUIDE.md` and `life.config.yml`.
3. `LIFE_JOURNAL_HOME`.

When no vault is found, offer to initialize one with `scripts/init-vault.mjs`. When multiple candidates exist, ask which one to use. Never hardcode an author-specific path or create journal files in an uncertain directory.

## Required workflow

1. Read the vault's `AI_GUIDE.md` completely before any write.
2. Read `life.config.yml` and only the content files relevant to the request.
3. Preserve the user's facts and language; concise reordering is allowed only when the local guide permits it.
4. Apply the smallest complete change across every affected file.
5. Run `scripts/validate-vault.mjs <vault>` after writing.
6. Report changed files, validation outcome, and any pending identity or location confirmation.

## Route operations

- A dated event or “记一下” request updates `diary.md` and confirmed reverse indexes.
- A personal realization updates `thoughts.md`.
- A book, film, game, or music record updates `media.md`.
- A reusable procedure or lesson updates `experiences.md` and `experiences/`.
- A correction or deletion requires reconciliation of every reverse link for that date.
- A validation request is read-only unless the user explicitly requests deterministic fixes.

## Invariants

- Do not invent facts, relationships, visits, coordinates, or professional conclusions.
- Keep one diary heading per ISO date and make repeated requests idempotent.
- Only shared experiences belong in `person.md`; a mere mention does not.
- Only confirmed personal visits belong in `places.md`; plans and other people's visits do not.
- People, places, and experiences may link to the diary; the diary remains free of backlink rows.
- Keep secrets in environment variables and out of Markdown, logs, browser payloads, and responses.
- Preserve user-customized local rules when the Skill is upgraded.

## References

- Read [references/data-model.md](references/data-model.md) for schemas, links, or migrations.
- Read [references/operations.md](references/operations.md) for corrections, deduplication, reconciliation, or multi-file writes.
- Read [references/capabilities.md](references/capabilities.md) before lunar, map, or metadata enrichment.
- Read [references/privacy.md](references/privacy.md) before export, sharing, deployment, or demo generation.

The deterministic `scripts/apply-operation.mjs` currently handles diary upserts. For other operations, make minimal file edits that follow the local guide and validate the result.
