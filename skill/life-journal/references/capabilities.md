# External capabilities

Read this reference when a task needs lunar dates, geocoding, metadata lookup, or another external service.

- Resolve providers through `life.config.yml`; do not hardcode one provider as part of the methodology.
- Read secrets only from the environment variable named by the capability configuration.
- Never print or write a secret into Markdown, logs, browser payloads, or assistant output.
- When a provider is unavailable, preserve the confirmed journal facts and mark only the enrichment as pending.
- A geocoding result is a candidate, not proof of a visit. Ask the user to confirm the correct place before storing official coordinates.
