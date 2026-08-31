import { execSync } from 'node:child_process';
import fs from 'node:fs';

fs.mkdirSync('.wrangler/logs', { recursive: true });
fs.mkdirSync('.wrangler/registry', { recursive: true });

console.log('Running vinext build...');
execSync('npx vinext build', { stdio: 'inherit', env: { ...process.env, WRANGLER_LOG_PATH: '.wrangler/logs' } });

console.log('Running static export...');
await import('./export-static.mjs');
