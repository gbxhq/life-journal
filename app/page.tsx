import { ArrowRight, FileText, FolderTree, MapPinned, ShieldCheck, Sparkles, Users } from "lucide-react";
import { vault } from "@/lib/vault";

const previewEntries = [
  { date: "08.30", title: "完成第一次发布准备", tone: "amber" },
  { date: "08.28", title: "傍晚沿河散步四十分钟", tone: "sage" },
  { date: "08.24", title: "整理书桌，重新开始阅读", tone: "blue" },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Life Journal 首页">
          <span className="brand-mark">LJ</span>
          <span>Life Journal</span>
        </a>
        <nav aria-label="主导航">
          <a href="#method">方法</a>
          <a href="#preview">预览</a>
          <a className="nav-action" href="/journal">打开 Demo</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">OPEN · LOCAL · YOURS</p>
          <h1>
            把生活写下来，
            <span>再慢慢看见自己。</span>
          </h1>
          <p className="hero-description">
            一套由 AI 协助维护、以 Markdown 为唯一数据源的人生记录方法。
            日记保存事实，人物串联关系，地点留下足迹，经验沉淀成长。
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="/journal">
              浏览示例记录
            </a>
            <a className="button button-quiet" href="#method">
              了解记录方法
            </a>
          </div>
          <div className="principles" aria-label="产品原则">
            <span>本地优先</span>
            <span>开放文件</span>
            <span>隐私可控</span>
          </div>
        </div>

        <div className="journal-preview" id="preview" aria-label="生活记录界面预览">
          <div className="preview-topline">
            <div>
              <p className="preview-kicker">AUGUST 2026</p>
              <h2>最近的日子</h2>
            </div>
            <span className="day-count">8 个记录日</span>
          </div>
          <div className="preview-list">
            {previewEntries.map((entry) => (
              <article className="preview-entry" key={entry.date}>
                <div className={`date-block ${entry.tone}`}>
                  <strong>{entry.date}</strong>
                  <span>周日</span>
                </div>
                <div>
                  <h3>{entry.title}</h3>
                  <p>一天一段事实，不追求漂亮，只留下真实。</p>
                </div>
              </article>
            ))}
          </div>
          <div className="preview-footer">
            <span>Markdown 驱动</span>
            <span>人物 · 地点 · 感悟 · 经验</span>
          </div>
        </div>
      </section>

      <section className="method-strip" id="method" aria-label="记录方法">
        <p>一份日记，生长出完整的生活脉络。</p>
        <div className="method-items">
          <span>事实</span><i />
          <span>关系</span><i />
          <span>足迹</span><i />
          <span>经验</span>
        </div>
      </section>

      <section className="landing-section method-section">
        <header className="landing-section-header">
          <p className="eyebrow">FROM EVENTS TO A LIFE GRAPH</p>
          <h2>不是把生活塞进表格，<br />而是让记录自然长出脉络。</h2>
          <p>日记保存原始事实，其他文件从事实出发建立单向索引。Markdown 仍然简单，但整个目录会越来越懂你。</p>
        </header>
        <div className="method-card-grid">
          <article><span>01</span><FileText size={22} /><h3>日记是事实底座</h3><p>每一天一个稳定日期入口，保留自然语言，不为了结构牺牲记录本身。</p></article>
          <article><span>02</span><Users size={22} /><h3>人物串起关系</h3><p>只索引真正共同经历过的事，不根据只言片语替你推断关系。</p></article>
          <article><span>03</span><MapPinned size={22} /><h3>地点留下足迹</h3><p>计划不是到访，候选坐标也不是事实。确认之后，地点才进入你的地图。</p></article>
          <article><span>04</span><Sparkles size={22} /><h3>经验持续修订</h3><p>把一次经历拆成事实、感受和待验证结论，让“下次怎么办”越来越清楚。</p></article>
        </div>
      </section>

      <section className="landing-section architecture-section">
        <div className="architecture-copy">
          <p className="eyebrow">PORTABLE BY DESIGN</p>
          <h2>文件属于你，<br />能力可以带着走。</h2>
          <p>Skill 负责执行，AI Guide 负责当前日记库的规则，配置文件负责主题和功能。任何一层都不需要吞掉你的原始记录。</p>
          <div className="architecture-points">
            <span><ShieldCheck size={17} />本地优先，不依赖封闭数据库</span>
            <span><FolderTree size={17} />普通文件夹，可同步、可备份、可迁移</span>
            <span><FileText size={17} />换一个 Agent，依然可以继续维护</span>
          </div>
        </div>
        <div className="file-stack" aria-label="Life Journal 文件结构">
          <div className="file-card file-skill"><small>EXECUTION</small><strong>SKILL.md</strong><p>发现目录 · 路由任务 · 安全写入</p></div>
          <div className="file-card file-guide"><small>LOCAL RULES</small><strong>AI_GUIDE.md</strong><p>格式 · 判断 · 个人记录习惯</p></div>
          <div className="file-card file-config"><small>CONFIG</small><strong>life.config.yml</strong><p>语言 · 时区 · 主题 · 隐私</p></div>
        </div>
      </section>

      <section className="landing-section demo-section">
        <header className="landing-section-header centered">
          <p className="eyebrow">A LIVING DEMO</p>
          <h2>打开一份已经生长起来的生活记录。</h2>
          <p>演示数据完全虚构，但页面、关系和解析方式都是真实可用的。</p>
        </header>
        <div className="demo-stat-grid">
          <div><strong>{vault.summary.diaryDays}</strong><span>记录日</span></div>
          <div><strong>{vault.summary.people}</strong><span>人物</span></div>
          <div><strong>{vault.summary.places}</strong><span>地点</span></div>
          <div><strong>{vault.summary.experiences}</strong><span>经验</span></div>
        </div>
        <a className="demo-window" href="/journal">
          <div className="demo-window-bar"><span /><span /><span /><small>life-journal.local</small></div>
          <div className="demo-window-content">
            <div><p className="eyebrow">LIFE OVERVIEW</p><h3>林舟的生活记录</h3><p>从事实开始，沿着关系、足迹和经验重新理解生活。</p></div>
            <div className="demo-mini-cards">
              <span><strong>10</strong>记录日</span><span><strong>4</strong>人物</span><span><strong>4</strong>地点</span>
            </div>
            <span className="demo-open">进入完整 Demo <ArrowRight size={16} /></span>
          </div>
        </a>
      </section>

      <section className="landing-section theme-section">
        <div>
          <p className="eyebrow">THEMEABLE, NOT LOCKED</p>
          <h2>同一份人生，<br />可以有不同的观看方式。</h2>
          <p>官方主题提供完整的排版和无障碍基础。颜色、字体、圆角与间距通过 YAML Token 配置，无需修改组件。</p>
        </div>
        <div className="theme-cards">
          <article className="theme-preview theme-paper"><div><span /><span /><span /></div><strong>Paper</strong><small>温暖 · 安静 · 长阅读</small></article>
          <article className="theme-preview theme-midnight"><div><span /><span /><span /></div><strong>Midnight</strong><small>深色 · 克制 · 夜间浏览</small></article>
        </div>
      </section>

      <section className="landing-section privacy-section">
        <ShieldCheck size={32} strokeWidth={1.4} />
        <div><p className="eyebrow">PRIVACY IS A PRODUCT FEATURE</p><h2>真实记录留在本地，公开演示从零虚构。</h2></div>
        <p>密钥只来自环境变量，精确坐标默认隐藏，发布流程会检查私有目录、本机路径和凭据。我们不会把真实日记改名后伪装成 Demo。</p>
      </section>

      <section className="landing-section start-section" id="start">
        <p className="eyebrow">START WITH ONE DAY</p>
        <h2>先写下今天，<br />剩下的让系统慢慢生长。</h2>
        <p>项目包含标准 Skill、空白 Vault 模板、虚构 Demo、解析验证工具与完整 Web 界面。</p>
        <div className="install-box"><code>$life-journal 帮我初始化一个生活记录库</code><span>自然语言开始</span></div>
        <div className="hero-actions centered-actions"><a className="button button-primary" href="/life-journal-skill.tar.gz" download>下载 Skill 包</a><a className="button button-quiet" href="/journal">打开 Demo</a><a className="button button-quiet" href="/method">阅读方法说明</a></div>
      </section>

      <footer className="landing-footer"><a className="brand" href="#top"><span className="brand-mark">LJ</span><span>Life Journal</span></a><p>Markdown belongs to you.</p><span>虚构 Demo · 2026</span></footer>
    </main>
  );
}
