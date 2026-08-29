import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the finished promotional homepage", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Life Journal/);
  assert.match(html, /把生活写下来/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|Your site is taking shape/);
});

test("renders the journal dashboard from demo Markdown", async () => {
  const response = await render("/journal");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /林舟的生活记录/);
  assert.match(html, /最近的日子/);
  assert.match(html, />10</);
});

test("detail route emits record-specific metadata", async () => {
  const response = await render("/journal/diary/2025-10-12");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /发布准备/);
  assert.match(html, /发布准备 · 整理方法 · Life Journal/);
  assert.doesNotMatch(html, /og:image[^>]*og\.png/);
});
