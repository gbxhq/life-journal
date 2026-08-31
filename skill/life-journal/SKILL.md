---
name: life-journal
description: Initialize and maintain a local Markdown-based life journal containing dated diary entries, people, confirmed visits, media, thoughts, and reusable personal experiences. Use when the user wants to record, correct, organize, validate, browse, migrate, or start the local Web reader for their life records; do not use for generic literary journaling or public publishing without an explicit privacy review.
---

# Life Journal

Maintain a portable life record whose Markdown files remain the canonical data source. This Skill is the single authority for recording behavior and file formats. A user's Vault contains data and structured configuration only; it does not need a separate AI instruction file.

## Resolve the Vault

Use the first unambiguous source:

1. A path explicitly provided by the user.
2. The current workspace when it contains `life.config.yml` and the canonical Markdown files.
3. `LIFE_JOURNAL_HOME`.

When no Vault is found, offer to initialize one with `scripts/init-vault.mjs`. When multiple candidates exist, ask which one to use. Never hardcode an author-specific path or create journal files in an uncertain directory.

## Required workflow

1. Read `life.config.yml` and only the content files relevant to the request.
2. Separate confirmed facts from reflections, reusable knowledge, and unresolved identities or locations.
3. Preserve the user's facts and natural language. Concise reordering and removal of speech fillers are allowed; literary expansion, invented detail, and changed meaning are not.
4. Apply the smallest complete change across every affected file.
5. Run `scripts/validate-vault.mjs <vault>` after writing.
6. Report changed files, validation outcome, and any pending identity or location confirmation.

Write unambiguous facts directly. Do not add a redundant confirmation step before ordinary journal writes. Ask only when the date, identity, actual visit, coordinate, destructive scope, or another material fact is uncertain.

## Route the user's input

- Put objective events in `diary.md`.
- A short state such as “今天很高兴” may remain beside the day's facts.
- Put developed opinions, reflections, or emotional passages in `thoughts.md`; keep only a concise factual trace in the diary when appropriate.
- Put books, films, games, and music activity in `media.md`, with brief notes only.
- Put reusable procedures, checklists, lessons, or techniques in `experiences.md` and `experiences/`. Do not turn every one-off event into an experience.
- Update `person.md` only for people who genuinely shared an experience with the user.
- Update `places.md` only for places the user personally and actually visited.
- A correction or deletion requires reconciliation of every reverse link for that date.
- A validation request is read-only unless the user explicitly requests deterministic fixes.

## Diary rules

Use exactly one section per day, newest first:

```markdown
## YYYY-MM-DD
**事件标签** · 周X · 农历X

每行一件事
```

- The date heading contains only the ISO date so `#YYYY-MM-DD` remains a stable Markdown anchor.
- The label, weekday, and lunar date share the next line. Omit the bold label when there is no useful event label.
- Keep one event per plain line; do not add bullets to diary facts.
- Keep concrete details the user supplied, such as time, quantity, amount, name, and result.
- When the user adds more information for the same day, merge and deduplicate it under the existing heading.
- When the user recounts several days, split them by their real dates. Ask when a date cannot be resolved; do not guess a whole week into one day.
- Obtain lunar data through the configured capability. Do not calculate it from memory. If unavailable, preserve the event and leave only the enrichment pending.

## People rules

Each person uses one section:

```markdown
## 人物称呼

**描述：** 用户确认的身份，或待补充

- [YYYY-MM-DD](diary.md#YYYY-MM-DD) 共同经历短语
```

- Use the name or form of address in the diary; do not silently replace it with a relationship label.
- Ask for a short identity description the first time a person appears. The diary write may finish first; use `待补充` when the user does not answer.
- Never infer a relationship from diary context.
- Keep events newest first and concise. Multiple real events on one day may remain separate.
- A celebrity, public figure, person merely mentioned, or someone who did not share the activity does not belong in `person.md`.
- Same-looking names or family titles are not the same person without confirmation. Use a user-provided qualifier in the heading when needed.
- Before merging people, show the affected identities and links; merge only after the user confirms they are the same person.

## Place rules

Only record a place when the user personally arrived or performed an activity there. Plans, wishes, searches, negations, another person's visit, and a place merely mentioned are not visits.

- Prefer the smallest confirmed granularity: POI, village or town, county, city, then province or region.
- Store administrative hierarchy as metadata instead of creating redundant parent visit entries.
- Normalize confirmed aliases into one place entry. Disambiguate same-named places with user-confirmed administrative information.
- Link each visit back to the diary date; do not add place backlink rows to the diary.
- Coordinates may come only from the user, photo metadata, or a trusted map result confirmed by the user. Never infer coordinates.
- A map search result is a candidate, even when only one result is returned. Show up to the configured maximum with name, address, and coordinates, and ask which one is correct.
- Until confirmed, keep `坐标：待确认` and saved candidates. On confirmation, store coordinate, coordinate system, source, provider ID when available, and confirmation date; remove rejected candidates.
- Only confirmed coordinates may appear as map markers.

## Thoughts, media, and experiences

- Thoughts use `## YYYY-MM-DD 标题` followed by the reflection.
- Media stays in the existing GFM tables and uses ISO dates for new rows. Reuse the existing category and status sections rather than inventing a new field.
- `experiences.md` is an index; each reusable experience lives in one stable, date-free file under `experiences/`.
- Search for an equivalent experience before creating another file. Update the existing topic when appropriate.
- Separate observed facts, personal interpretation, and unverified conclusions. Health, legal, financial, and other high-risk experience notes must retain uncertainty and cannot replace professional advice.
- When new evidence conflicts with an old conclusion, explain the change in the experience's revision history instead of silently overwriting it.

## Relationship and safety invariants

- People, places, and experiences may link to an existing diary date. The diary remains free of backlink rows.
- Repeating the same request must not create duplicate diary lines, people events, place visits, media rows, or experience sources.
- Do not invent facts, relationships, visits, coordinates, metadata, or professional conclusions.
- Keep secrets in environment variables and out of Markdown, logs, browser payloads, and responses.
- Respect `life.config.yml` for locale, timezone, providers, theme, privacy, and optional features. It stores configuration, not prose instructions or secret values.

## Operation-specific references

- Read [references/data-model.md](references/data-model.md) for exact schemas, links, media tables, or migrations.
- Read [references/operations.md](references/operations.md) for corrections, deduplication, reconciliation, or multi-file writes.
- Read [references/capabilities.md](references/capabilities.md) before lunar, map, or metadata enrichment.
- Read [references/privacy.md](references/privacy.md) before export, sharing, deployment, or demo generation.
- Read [references/web-reader.md](references/web-reader.md) before starting, hosting, or explaining the frontend reader.
- Read [references/upgrades.md](references/upgrades.md) before updating the installed Skill or migrating an existing Vault.

The deterministic `scripts/apply-operation.mjs` currently handles diary upserts. For other operations, make minimal file edits that follow this Skill and validate the result.
