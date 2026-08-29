# Privacy

Read this reference before publishing, exporting, sharing, deploying, or creating demo content.

- Treat diary text, relationships, health, finances, travel, media habits, and coordinates as private by default.
- Never expose environment variables, credentials, private keys, or service responses containing secrets.
- Do not build a public demo by renaming or lightly redacting real records. Write fictional demo data from scratch.
- Keep real vaults local unless the user explicitly authorizes deployment after reviewing the generated output.
- Exact coordinates are sensitive. Respect `life.config.yml` and omit them when exact display is disabled.
- Do not copy agent memory, editor workspace state, operating-system metadata, or absolute local paths into a release.
