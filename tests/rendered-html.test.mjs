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

test("renders the calendar-first journal page from demo Markdown", async () => {
  const response = await render("/journal");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /YOUR DAYS/);
  assert.match(html, />记录</);
  assert.match(html, /发布准备/);
});

test("detail route emits record-specific metadata", async () => {
  const response = await render("/journal/diary/2025-10-12");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /发布准备/);
  assert.match(html, /发布准备 · 整理方法 · Life Journal/);
  assert.doesNotMatch(html, /og:image[^>]*og\.png/);
});

test("people page renders related events with diary links", async () => {
  const response = await render("/journal/people");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /沿青岚湖散步/);
  assert.match(html, /\/journal\/diary\/2025-10-10/);
});

test("places page keeps the map surface and pending locations together", async () => {
  const response = await render("/journal/places");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /高德地图等待配置/);
  assert.match(html, /待确认地点/);
  assert.match(html, /青岚湖/);
});
