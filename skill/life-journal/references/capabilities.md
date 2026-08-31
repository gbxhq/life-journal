# External capabilities

Read this reference when a task needs lunar dates, geocoding, metadata lookup, or another external service.

- Resolve providers through `life.config.yml`; do not hardcode one provider as part of the methodology.
- Read secrets only from the environment variable named by the capability configuration.
- Never print or write a secret into Markdown, logs, browser payloads, or assistant output.
- When a provider is unavailable, preserve the confirmed journal facts and mark only the enrichment as pending.
- A geocoding result is a candidate, not proof of a visit. Ask the user to confirm the correct place before storing official coordinates.

## Lunar calendar

- Use the provider selected by `capabilities.lunar` for the exact Gregorian date and configured timezone.
- Do not calculate a lunar date from memory or reuse a nearby day's value.
- If lookup fails, finish the factual diary write and report only the lunar field as pending.

## Geocoding

- Build the search from the place name, known alias, and confirmed administrative area.
- Filter obviously incompatible regions or categories, but leave the final identity choice to the user.
- Show no more than `max_candidates`, including name, address, coordinates, and provider ID when returned.
- In mainland China, record AMap results as `GCJ-02`. A POI center is a provider location, not the user's exact GPS position.
- Save unresolved candidates so a later confirmation can continue without repeating the search.
- On confirmation, keep the selected result and remove rejected candidates.
