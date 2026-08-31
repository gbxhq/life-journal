import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("mobile navigation keeps the three primary modules and an Other entry", async () => {
  const [mobileNav, navigation, css] = await Promise.all([
    readFile(new URL("../app/journal/mobile-nav.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/journal/nav.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.match(navigation, /label: "记录"/);
  assert.match(navigation, /label: "人物"/);
  assert.match(navigation, /label: "地点"/);
  assert.match(navigation, /label: "媒体"/);
  assert.match(navigation, /label: "感悟"/);
  assert.match(navigation, /label: "经验"/);
  assert.match(mobileNav, />其他</);
  assert.match(css, /grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\)/);
  assert.doesNotMatch(css, /^\s*nav a:not\(\.nav-action\)/m);
});
