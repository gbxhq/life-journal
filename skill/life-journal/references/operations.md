# Operations

Read this reference for corrections, deduplication, reconciliation, or multi-file writes.

## Upsert a diary day

1. Find an existing `## YYYY-MM-DD` section.
2. Merge new facts without duplicating existing lines.
3. Update the label line if the new facts add a material event.
4. Keep date sections newest first.
5. Synchronize only confirmed shared people and confirmed visits.

After the diary is stable, route developed reflections, media activity, and explicitly reusable knowledge to their canonical files. Preserve a short factual line in the diary when the routed content describes something that happened that day.

## Synchronize people

1. Extract people who actually shared an activity with the user.
2. Preserve the form of address used in the diary.
3. Add or update one concise dated event under each confirmed identity.
4. Keep each person's events newest first, including across years.
5. Ask for a description on first appearance, but do not block the diary write when it remains pending.
6. Never merge same-looking names, nicknames, or family titles without user confirmation.

## Synchronize places

1. Extract place mentions only after the diary facts are stable.
2. Exclude plans, wishes, negations, searches, another person's visit, and ordinary mentions.
3. Normalize the smallest confirmed place and update an existing alias when possible.
4. Add a concise dated visit and keep visits newest first.
5. Resolve coordinate candidates through the configured capability, but store an official coordinate only after user confirmation.

## Route reflections, media, and experiences

- Move developed subjective passages to `thoughts.md` without inventing a title or conclusion the user did not express.
- Update the matching media table for reading, watching, playing, or listening activity; preserve its existing columns.
- Create or update an experience only when the content is intended to be reusable. Search for a synonymous topic first and preserve uncertainty and revision history.

## Correct or remove a fact

Update the diary fact first, then reconcile every reverse index that points to that date. Do not leave stale summaries or broken links.

## Ambiguity

Write the unambiguous diary facts first. Ask for confirmation before assigning an ambiguous person, claiming a visit, or storing a coordinate. A pending identity or coordinate is not a reason to invent data.

## Idempotency

Repeating the same request must not create duplicate diary lines, person events, place visits, or experience sources.
