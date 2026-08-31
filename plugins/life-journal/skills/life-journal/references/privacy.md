# Privacy

Read this reference before publishing, exporting, sharing, deploying, or creating demo content.

- Treat diary text, relationships, health, finances, travel, media habits, and coordinates as private by default.
- Never expose environment variables, credentials, private keys, or service responses containing secrets.
- Do not build a public demo by renaming or lightly redacting real records. Write fictional demo data from scratch.
- Keep real vaults local unless the user explicitly authorizes deployment after reviewing the generated output.
- The current Web reader has no built-in authentication. Prefer localhost, a private NAS network, or Tailscale/VPN, and never present a client-side password form as real protection.
- Public or remote access requires HTTPS and server-side access control. Keep plaintext passwords out of config files, Markdown, frontend bundles, browser storage, logs, and responses.
- Exact coordinates are sensitive. Respect `life.config.yml` and omit them when exact display is disabled.
- Do not copy agent memory, editor workspace state, operating-system metadata, or absolute local paths into a release.
