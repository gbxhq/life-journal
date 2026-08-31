# Life Journal

Life Journal 是一套本地优先、以 Markdown 为唯一数据源的人生记录系统。它让 Agent 帮你把每天发生的事保持在一两句话，同时分别维护人物、地点、感悟、经验和媒体记录。

[查看宣传页](https://life-journal.ixs.im) · [打开虚构 Demo](https://life-journal.ixs.im/journal) · [查看源码](https://github.com/gbxhq/life-journal)

> `examples/demo-vault` 中的事件、人物和地点关联均为从零编写的虚构演示数据，不是由作者真实日记改名或简单脱敏得到的。

## 它解决什么问题

Life Journal 的重点是“长期记录”，不是写长文：

- 每天用一两句话保留事实，忙的时候也可以每周补记一次。
- 你只需要把事情告诉 Agent，分类、去重、关联和 Markdown 写入由 AI 完成。
- 简短心情可以留在日记；完整观点和反思分流到 `thoughts.md`。
- 人物、地点、媒体和生活经验分别维护，并链接回相关日记。
- 所有源文件都是普通 Markdown，可以直接打开、同步、备份和迁移。

如果你的主要目标是每天写长篇抒情文章，这套方法并不合适。

## 项目包含什么

- `skill/life-journal`：独立 Life Journal Skill 源码（跨 Agent 兼容）。
- `plugins/life-journal`：为兼容支持 Plugin 的 Agent 保留的包装，不是主要安装方式。
- `examples/demo-vault`：只用于演示和测试的虚构 Markdown 数据。
- `app`：宣传页和只读 Web 阅读界面。
- `lib/content-core.mjs`：Markdown 解析与校验核心。
- `themes`：可配置的官方主题。

Markdown 始终是唯一数据源，网页只是派生的阅读界面。

## 安装 Skill

Life Journal 是一套通用的 Agent Skill 规范，支持 Claude Code、Cursor、Codex、Windsurf 以及各类兼容 Agent。

### 使用 `npx skills` 一键安装

无需手动下载或配置，直接通过官方通用 Agent Skills CLI 全局或项目级安装：

```bash
# 全局安装到所有已支持的 Agent（Claude Code, Cursor, Codex 等）
npx skills add gbxhq/life-journal -g

# 或指定安装给特定 Agent
npx skills add gbxhq/life-journal --agent claude-code cursor
```

### 备用：手动解压安装独立 Skill 包

从宣传页下载 `life-journal-skill.tar.gz`，解压后放入对应 Agent 的技能目录（如 `~/.agents/skills/` 或 `~/.codex/skills/`）：

```bash
mkdir -p ~/.agents/skills
tar -xzf life-journal-skill.tar.gz -C ~/.agents/skills
```

---

安装后，在你的 Agent 对话中即可开始使用：

```text
# 初始化一个新的生活记录库
请用 Life Journal 在 ~/Documents/life-journal-vault 初始化一套新的生活记录

# 日常记日记
请用 Life Journal 帮我记录今天发生的事
```

## Skill 与 Vault 的分工

- `SKILL.md`、`references/` 和 `scripts/` 共同组成完整能力包，集中定义分类、格式、人物与地点判断、安全边界和验证流程。
- 用户 Vault 只保存 Markdown 数据与 `life.config.yml`。配置文件负责语言、时区、外部服务、主题和隐私选项，不再承担自然语言行为约束。

从 schema version 2 开始，新 Vault 不再包含 `AI_GUIDE.md`。这样通过 `npx skills update -g` 更新 Skill 时，整套记录机制会一起更新，用户日记不会被覆盖。

旧 Vault 中的 `AI_GUIDE.md` 会被视为遗留文件：系统不会继续把它当规则源，也不会自动删除。用户可以让 Agent 先检查其中是否还有个人定制，再确认迁移和删除。

## 打开前端阅读界面

最方便的方式是直接让 Agent 启动：

```text
请用 Life Journal 启动这个项目的前端
```

Skill 内置了启动手册。Agent 会定位本仓库和 Vault、验证 Markdown、启动服务，并返回访问地址。

### 手动在本机启动

需要 Node.js 22.13 或更高版本：

```bash
git clone git@github.com:gbxhq/life-journal.git
cd life-journal
npm install
LIFE_JOURNAL_HOME=/path/to/your/vault npm run content:validate
LIFE_JOURNAL_HOME=/path/to/your/vault npm run dev
```

然后打开：

- 宣传页：`http://localhost:3000/`
- 记录界面：`http://localhost:3000/journal`

不设置 `LIFE_JOURNAL_HOME` 时，默认读取 `examples/demo-vault`。

### 在 NAS 或家庭局域网运行

```bash
npm install
LIFE_JOURNAL_HOME=/path/to/your/vault npm run content:validate
LIFE_JOURNAL_HOME=/path/to/your/vault npm run build
PORT=3000 npm start
```

同一局域网内可打开 `http://NAS-IP:3000/journal`。当前版本在构建时生成内容索引，因此日记更新后需要重新构建并重启。

## 安全与隐私

当前 Web 阅读界面没有内置密码或登录功能。真实 Vault 建议只在以下环境使用：

- 本机 `localhost`。
- NAS 私有局域网。
- Tailscale 或其他可信 VPN。
- 带有成熟身份认证和 HTTPS 的反向代理之后。

不要直接把 Web 端口暴露到公网，也不要把明文密码写进 Markdown、`life.config.yml`、前端代码或浏览器存储。内置访问控制仍是明确标注的未来计划，详见 [TODO.md](TODO.md)。

地点页可选用高德地图 JavaScript API 2.0。密钥只通过 `NEXT_PUBLIC_AMAP_JS_KEY` 和 `NEXT_PUBLIC_AMAP_SECURITY_CODE` 配置；未配置时仍可浏览地点文字内容。公开演示不会使用作者的私人地图凭据。

发布检查还会阻止绝对本机路径、常见密钥材料、未标记的 Demo 数据和意外打包的日记文件进入发布产物。

## 如何更新

### 更新 Skill 程序

通过 `npx skills` 更新：

```bash
npx skills update -g
```

### 检查现有 Vault 是否需要迁移

Skill 安装包更新不会影响你现有的日记。可以让 Agent 检查：

```text
请用 Life Journal 检查我的日记库是否需要升级，先展示差异，不要直接修改
```

Vault 使用 `schema_version` 记录数据结构版本。若将来需要迁移，Agent 必须先展示计划和受影响文件，并在得到确认后才写入。

## 英文支持

首个公开版本保持中文优先。当前前端文案、Demo、数据示例和测试都围绕中文设计；现在同时维护完整英文版会显著增加规则同步和测试成本。

本 README 先提供下面的英文摘要，完整 i18n 已列入 [TODO.md](TODO.md)。

### English summary

Life Journal is a local-first Markdown journaling system for short, sustainable life logging. You tell an AI Agent what happened; the Agent keeps factual diary entries concise and maintains separate files for people, places, reflections, reusable experiences, and media. The current release, demo data, Web UI, and record formats are Chinese-first. Your Vault remains local and is never overwritten when the Skill is updated.

## 开发与验证

```bash
npm test
npm run lint
npm run build
npm run test:e2e
npm run verify:release
```

Skill 与 Plugin 还分别使用官方验证脚本检查结构。发布前必须确保 Demo 构建、独立 Skill 包和 Plugin 中的 Skill 副本完全一致。

## License

[MIT](LICENSE)
