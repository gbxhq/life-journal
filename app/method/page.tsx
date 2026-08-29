import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, FileCog, FileText, Settings2 } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "记录方法 · Life Journal",
  description: "了解 Life Journal 如何用 Skill、AI Guide 和配置文件维护可携带的 Markdown 人生记录。",
};

export default function MethodPage() {
  return (
    <main className="method-page">
      <header className="method-page-header">
        <Link className="back-link" href="/"><ArrowLeft size={15} /> 返回首页</Link>
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
        <header><p className="eyebrow">CLEAR RESPONSIBILITIES</p><h2>三个文件，各自只做一件事。</h2></header>
        <div className="responsibility-grid">
          <article><FileCog size={23} /><small>执行入口</small><h3>SKILL.md</h3><p>决定何时触发、如何发现 Vault、怎样安全写入和验证。它不复制用户的完整记录规则。</p></article>
          <article><FileText size={23} /><small>本地契约</small><h3>AI_GUIDE.md</h3><p>跟随当前 Vault 保存格式、判断标准和个人偏好。把目录交给另一个 AI，规则仍然在。</p></article>
          <article><Settings2 size={23} /><small>结构化配置</small><h3>life.config.yml</h3><p>保存语言、时区、功能、主题、隐私选项和环境变量名，不保存真实密钥。</p></article>
        </div>
      </section>

      <section className="source-truth-section">
        <div><p className="eyebrow">ONE SOURCE OF TRUTH</p><h2>Markdown 是源，页面只是窗口。</h2><p>Web 构建会解析日记目录、生成关系图和搜索索引，但不会成为新的主数据库。删除派生产物后，仍可从 Markdown 完整重建。</p></div>
        <pre><code>{`vault/
├── AI_GUIDE.md
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
