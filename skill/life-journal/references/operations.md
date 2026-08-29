# Operations

Read this reference for corrections, deduplication, reconciliation, or multi-file writes.

## Upsert a diary day

1. Find an existing `## YYYY-MM-DD` section.
2. Merge new facts without duplicating existing lines.
3. Update the label line if the new facts add a material event.
4. Keep date sections newest first.
5. Synchronize only confirmed shared people and confirmed visits.

## Correct or remove a fact

Update the diary fact first, then reconcile every reverse index that points to that date. Do not leave stale summaries or broken links.

## Ambiguity

Write the unambiguous diary facts first. Ask for confirmation before assigning an ambiguous person, claiming a visit, or storing a coordinate. A pending identity or coordinate is not a reason to invent data.

## Idempotency

Repeating the same request must not create duplicate diary lines, person events, place visits, or experience sources.
