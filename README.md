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

- `skill/life-journal`：独立 Life Journal Skill 源码。
- `plugins/life-journal`：用于公开安装和更新的 Codex Plugin 包。
- `.agents/plugins/marketplace.json`：仓库 Marketplace 清单。
- `examples/demo-vault`：只用于演示和测试的虚构 Markdown 数据。
- `app`：宣传页和只读 Web 阅读界面。
- `lib/content-core.mjs`：Markdown 解析与校验核心。
- `themes`：可配置的官方主题。

Markdown 始终是唯一数据源，网页只是派生的阅读界面。

## 安装

### 推荐：通过 Codex Plugin 安装

先添加 Life Journal 的 GitHub Marketplace，再安装插件：

```bash
codex plugin marketplace add gbxhq/life-journal
codex plugin add life-journal@life-journal
```

安装后请新建一个 Codex 任务，然后可以直接说：

```text
$life-journal 在 ~/Documents/life-journal-vault 初始化一套新的生活记录
```

也可以在已有 Vault 中使用：

```text
$life-journal 帮我记录今天发生的事
```

### 备用：安装独立 Skill 包

宣传页会提供 `life-journal-skill.tar.gz` 下载。解压后把 `life-journal` 文件夹放进 `$HOME/.agents/skills/`：

```bash
mkdir -p ~/.agents/skills
tar -xzf life-journal-skill.tar.gz -C ~/.agents/skills
```

Codex 会自动检测 Skill 变化；如果没有出现，请重启 Codex。

## `SKILL.md` 与 `AI_GUIDE.md` 的分工

- `SKILL.md` 属于安装包，定义 Agent 会做什么、如何定位 Vault、何时读取参考文档以及必须遵守的安全边界。
- `AI_GUIDE.md` 属于用户自己的 Vault，定义这一个记录库的具体格式和个性化规则。

因此两者都需要保留。升级 Plugin 时只更新安装包，绝不会自动覆盖用户 Vault 中的 `AI_GUIDE.md`。

## 打开前端阅读界面

最方便的方式是直接让 Agent 启动：

```text
$life-journal 启动这个项目的前端
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

### 更新 Plugin 或 Skill 程序

维护者发布新版本后执行：

```bash
codex plugin marketplace upgrade life-journal
codex plugin add life-journal@life-journal
```

然后新建一个 Codex 任务，让新版本的 Skill 被重新加载。

这一步只更新 Plugin 的安装缓存，不会修改你的 Vault。

### 检查现有 Vault 是否需要迁移

Plugin 中的模板可能会更新，但现有 `AI_GUIDE.md` 不会被自动替换。可以让 Agent 检查：

```text
$life-journal 检查我的日记库是否需要升级，先展示差异，不要直接修改
```

Vault 使用 `schema_version` 和 `guide_version` 记录结构版本。若将来需要迁移，Agent 必须先展示计划和受影响文件，保留用户自定义规则，并在得到确认后才写入。

这里不采用自制 `npx` 更新器。Codex 官方 Plugin Marketplace 已经负责安装与更新来源，用它可以避免更新脚本误碰用户日记。npm 包可以以后作为额外分发渠道评估，但不是首版依赖。

## 英文支持

首个公开版本保持中文优先。当前前端文案、Demo、`AI_GUIDE.md`、数据示例和测试都围绕中文设计；现在同时维护完整英文版会显著增加规则同步和测试成本。

本 README 先提供下面的英文摘要，完整 i18n 已列入 [TODO.md](TODO.md)。

### English summary

Life Journal is a local-first Markdown journaling system for short, sustainable life logging. You tell an AI Agent what happened; the Agent keeps factual diary entries concise and maintains separate files for people, places, reflections, reusable experiences, and media. The current release, demo data, Web UI, and Vault guide are Chinese-first. Your Vault remains local and is never overwritten when the Plugin is updated.

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
