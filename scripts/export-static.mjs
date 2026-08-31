import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'out');

async function renderRoute(pathname) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("export", `${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  const clientAssetsDir = path.join(rootDir, 'dist', 'client');
  const response = await worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    {
      ASSETS: {
        fetch: async (req) => {
          const u = new URL(req.url);
          const relPath = u.pathname.replace(/^\//, '');
          const filePath = path.join(clientAssetsDir, relPath);
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const data = fs.readFileSync(filePath);
            return new Response(data, { status: 200 });
          }
          return new Response("Not found", { status: 404 });
        }
      }
    },
    { waitUntil() {}, passThroughOnException() {} }
  );

  return response;
}

async function exportAll() {
  console.log('Building static export into out/...');
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  // 1. Copy client build assets
  const distClientDir = path.join(rootDir, 'dist', 'client');
  if (fs.existsSync(distClientDir)) {
    fs.cpSync(distClientDir, outDir, { recursive: true });
  }

  // 2. Load vault data to discover routes
  const vaultPath = path.join(rootDir, 'generated', 'vault.json');
  const contentData = JSON.parse(fs.readFileSync(vaultPath, 'utf-8'));

  const routes = [
    '/',
    '/method',
    '/journal',
    '/journal/people',
    '/journal/places',
    '/journal/thoughts',
    '/journal/experiences',
    '/journal/media',
    '/journal/other',
    '/journal/search'
  ];

  // Add diary days
  for (const item of contentData.diary || []) {
    routes.push(`/journal/diary/${item.date}`);
  }

  // Add people
  for (const p of contentData.people || []) {
    routes.push(`/journal/people/${p.id}`);
  }

  // Add experiences
  for (const e of contentData.experiences || []) {
    routes.push(`/journal/experiences/${e.slug}`);
  }

  console.log(`Prerendering ${routes.length} routes...`);

  for (const r of routes) {
    const res = await renderRoute(r);
    if (res.status !== 200) {
      console.error(`Failed to prerender route ${r}: status ${res.status}`);
      continue;
    }
    const html = await res.text();
    
    let targetFilePath;
    if (r === '/') {
      targetFilePath = path.join(outDir, 'index.html');
    } else {
      const folderPath = path.join(outDir, r.replace(/^\//, ''));
      fs.mkdirSync(folderPath, { recursive: true });
      targetFilePath = path.join(folderPath, 'index.html');
    }

    fs.writeFileSync(targetFilePath, html, 'utf-8');
  }

  // Handle redirect for /journal/diary -> /journal
  const diaryRedirectFolder = path.join(outDir, 'journal', 'diary');
  fs.mkdirSync(diaryRedirectFolder, { recursive: true });
  fs.writeFileSync(
    path.join(diaryRedirectFolder, 'index.html'),
    '<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/journal"><script>location.replace("/journal")</script></head><body>Redirecting to <a href="/journal">/journal</a>...</body></html>',
    'utf-8'
  );

  console.log('Static export complete!');
}

exportAll().catch(err => {
  console.error(err);
  process.exit(1);
});
