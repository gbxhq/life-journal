# Web Reader

Read this reference when the user asks to open, start, preview, host, or privately access the Life Journal Web interface.

## Boundary

- The installed Skill manages Markdown records. The complete Web reader lives in the Life Journal project repository and is not contained in the standalone Skill package.
- The Web reader is a derived, read-only view. Markdown remains the canonical data source.
- Starting a local server does not authorize public deployment or opening a firewall port.

## Locate the Web project

Use an explicitly provided project path first. Otherwise look for a directory containing all of:

- `package.json`
- `app/journal`
- `scripts/build-content.mjs`
- `.openai/hosting.json`

If the project repository is unavailable, explain that the standalone Skill does not contain the full Web reader. Offer to clone or locate the public Life Journal repository before continuing; do not pretend that the Skill package alone can serve the site.

## Prefer doing the work for the user

When the user says “启动这个项目的前端”, “打开我的日记页面”, or an equivalent request, perform the startup workflow instead of only printing commands:

1. Resolve the Life Journal Web project and the user's Vault.
2. Install dependencies only when they are missing or changed.
3. Validate the Vault.
4. Start the development server in a retained session.
5. Confirm the route responds, then give the user the URL.

Use the manual commands below as the implementation procedure and as a fallback for users who explicitly want to run the server themselves.

## Local preview

From the project directory:

```bash
npm install
LIFE_JOURNAL_HOME=/path/to/vault npm run content:validate
LIFE_JOURNAL_HOME=/path/to/vault npm run dev
```

Open `http://localhost:3000/journal`.

- `npm install` is only needed when dependencies are absent or changed.
- The development server binds to localhost by default.
- Keep the server running when the user is actively reviewing the interface.

## NAS or private LAN

Build the reader with the real Vault path, then start the production server:

```bash
npm install
LIFE_JOURNAL_HOME=/path/to/vault npm run content:validate
LIFE_JOURNAL_HOME=/path/to/vault npm run build
PORT=3000 npm start
```

`vinext start` binds to `0.0.0.0` by default. Open `http://NAS-IP:3000/journal` from the same private network. Rebuild and restart after the Markdown content changes because the current reader generates its content index at build time.

## Access control

The current version has no built-in password or authentication.

- Prefer localhost, a private NAS network, or Tailscale/VPN.
- Do not expose the reader port directly to the public Internet.
- For remote access, use a mature reverse proxy or identity provider with HTTPS and authentication.
- Do not put a plaintext password in `life.config.yml`, Markdown, frontend code, browser storage, or a public environment variable.
- Do not claim the reader is protected merely because an unverified password form is present.

Built-in access control is only acceptable when it includes server-side verification, a strong password hash, secret environment variables, secure HttpOnly cookies, session expiry and logout, login rate limiting, failure lockout, and HTTPS for remote access.

## Report the result

Tell the user:

- which Vault was rendered;
- the local or LAN URL;
- whether the server is bound only to localhost or to the LAN;
- that no public deployment occurred unless the user explicitly requested one;
- any missing map keys or other optional capabilities.
