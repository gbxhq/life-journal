# Life Journal

Life Journal 是一套本地优先、以 Markdown 为唯一数据源的人生记录系统。它包含：

- 一个可安装的 AI Skill，用自然语言维护日记、人物、地点、媒体、感悟和生活经验。
- 一个只读 Web 界面，用时间线、关系和主题化页面重新浏览这些记录。
- 一套完全虚构的 Demo Vault，用于演示和公开部署。

> `examples/demo-vault` 中所有人物、地点和事件均为虚构演示数据。

## 本地运行

```bash
npm install
npm run content:validate
npm run dev
```

默认读取 `examples/demo-vault`。使用自己的 Vault 时设置：

```bash
LIFE_JOURNAL_HOME=/path/to/your/vault npm run dev
```

真实 Vault 建议只在本机运行，不应直接部署到公开互联网。

## 安装 Skill

站点构建会生成 `public/life-journal-skill.tar.gz`。解压后将 `life-journal` 文件夹放入 Codex 的 Skill 目录，或直接从源码使用：

```bash
mkdir -p ~/.codex/skills
tar -xzf life-journal-skill.tar.gz -C ~/.codex/skills
```

## 项目结构

- `skill/life-journal`：标准 Life Journal Skill。
- `examples/demo-vault`：虚构演示数据。
- `lib/content-core.mjs`：Markdown 解析和验证核心。
- `app`：宣传首页和记录浏览界面。
- `themes`：官方主题配置。

## 隐私原则

- 不在仓库、浏览器产物或日志中保存 API Key。
- 不使用真实日记改名制作 Demo。
- Markdown 始终是唯一数据源，Web 只生成派生视图。
- 精确地点坐标默认不展示。

## License

MIT
