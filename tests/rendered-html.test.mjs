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
  assert.match(html, /日记不用写很长/);
  assert.match(html, /我已经坚持写日记十年/);
  assert.match(html, /先记事实，其他内容再分流/);
  assert.match(html, /你只需要/);
  assert.match(html, /AI 拆开整理/);
  assert.match(html, /AI 写入文件/);
  assert.match(html, /AI 自动完成/);
  assert.match(html, /只整理事实，不替你扩写成一篇文章/);
  assert.match(html, /记录内容与后续能力/);
  assert.match(html, /相册/);
  assert.match(html, /待开发/);
  assert.match(html, /直接让 Agent 帮你启动/);
  assert.match(html, /请用 Life Journal 启动这个项目的前端/);
  assert.match(html, /npx skills add gbxhq\/life-journal -g/);
  assert.match(html, /过去一年我看了哪些电影/);
  assert.match(html, /过去一个月我跟阿澄都去过哪里玩/);
  assert.match(html, /媒体附件与相册/);
  assert.match(html, /按年份、日期和事件组织图片与视频/);
  assert.match(html, /尚未实现 · 计划中/);
  assert.doesNotMatch(html, /文字或语音都可以/);
  assert.doesNotMatch(html, /查看文件分工/);
  assert.doesNotMatch(html, /记录的六类内容/);
  assert.doesNotMatch(html, />PLANNED<|SECURITY TODO/);
  assert.doesNotMatch(html, /再慢慢看见自己|生活图谱|FROM EVENTS TO A LIFE GRAPH/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|Your site is taking shape/);
});

test("renders the calendar-first journal page from demo Markdown", async () => {
  const response = await render("/journal");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /YOUR DAYS/);
  assert.match(html, />记录</);
  assert.match(html, /发布准备/);
  assert.match(html, /农历廿一/);
  assert.match(html, /href="\/journal\/media"/);
  assert.doesNotMatch(html, /从日历进入一天/);
  assert.doesNotMatch(html, />有记录<|>未记录</);
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
  assert.match(html, /\/journal\/people\/u-963f-6f84/);
});

test("person detail route uses an ASCII id and renders linked diary events", async () => {
  const response = await render("/journal/people/u-963f-6f84");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /阿澄/);
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
