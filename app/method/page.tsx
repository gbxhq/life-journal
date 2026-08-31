import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, FileCog, Settings2 } from "lucide-react";

export const metadata: Metadata = {
  title: "记录方法 · Life Journal",
  description: "了解 Life Journal 如何用一个完整 Skill 和结构化配置维护可携带的 Markdown 人生记录。",
};

export default function MethodPage() {
  return (
    <main className="method-page">
      <header className="method-page-header">
        <a className="back-link" href="/"><ArrowLeft size={15} /> 返回首页</a>
        <p className="eyebrow">THE LIFE JOURNAL METHOD</p>
        <h1>记录事实，连接生活，<br />沉淀可以继续修订的经验。</h1>
        <p>Life Journal 把可读的 Markdown、可执行的 AI Skill 和只读 Web 界面组合在一起。任何展示都可以重建，原始记录始终由用户掌握。</p>
      </header>

      <section className="method-flow">
        <article><span>01</span><h2>觉察并记录</h2><p>先保存当天发生的事实，不要求完整，不为了优美而重写。</p></article>
        <ArrowRight aria-hidden="true" />
        <article><span>02</span><h2>建立反向索引</h2><p>人物、地点和经验从日记出发，日记本身保持简单。</p></article>
        <ArrowRight aria-hidden="true" />
        <article><span>03</span><h2>持续回看与修订</h2><p>在 Web 中重新发现关系和模式，让经验随着新事实更新。</p></article>
      </section>

      <section className="responsibility-section">
        <header><p className="eyebrow">CLEAR RESPONSIBILITIES</p><h2>规则由 Skill 统一维护，Vault 只保存数据和配置。</h2></header>
        <div className="responsibility-grid">
          <article><FileCog size={23} /><small>唯一规则源</small><h3>Skill</h3><p>完整包含内容分流、文件格式、人物与地点判断、安全边界、操作流程和验证脚本。通过 npx 更新即可同步整套机制。</p></article>
          <article><Settings2 size={23} /><small>当前记录库配置</small><h3>life.config.yml</h3><p>只保存语言、时区、功能、主题、隐私选项和环境变量名，不保存行为说明或真实密钥。</p></article>
        </div>
      </section>

      <section className="source-truth-section">
        <div><p className="eyebrow">ONE SOURCE OF TRUTH</p><h2>Markdown 是源，页面只是窗口。</h2><p>Web 构建会解析日记目录、生成关系图和搜索索引，但不会成为新的主数据库。删除派生产物后，仍可从 Markdown 完整重建。</p></div>
        <pre><code>{`vault/
├── life.config.yml
├── diary.md
├── person.md
├── places.md
├── thoughts.md
├── media.md
├── experiences.md
└── experiences/`}</code></pre>
      </section>

      <section className="method-cta"><h2>看看这套方法实际长什么样。</h2><a className="button button-primary" href="/journal">打开虚构 Demo <ArrowRight size={15} /></a></section>
    </main>
  );
}
