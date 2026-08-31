import { ArrowRight, BookOpen, Bot, Check, FileText, FolderTree, Images, Lightbulb, Link2, LockKeyhole, MapPinned, MessageCircle, Mic, Monitor, Server, ShieldCheck, Sparkles, Users, Video, Wrench } from "lucide-react";
import { vault } from "@/lib/vault";

export default function Home() {
  const watchedMovies = vault.media.filter((item) => item.category === "movie");
  const demoPerson = vault.people.find((person) => person.name === "阿澄");
  const sharedDates = new Set(demoPerson?.events.map((event) => event.sourceDate) ?? []);
  const sharedPlaces = vault.places.filter((place) => place.visits.some((visit) => sharedDates.has(visit.sourceDate)));

  return (
    <main>
      <header className="plain-site-header">
        <a className="brand" href="#top" aria-label="Life Journal 首页">
          <span className="brand-mark">LJ</span>
          <span><strong>人生记录</strong><small>Life Journal Skill</small></span>
        </a>
        <nav aria-label="主导航">
          <a href="#why">为什么要做</a>
          <a href="#method">怎么记录</a>
          <a className="nav-action" href="/journal">查看示例</a>
        </nav>
      </header>

      <section className="recording-hero" id="top">
        <div className="recording-hero-copy">
          <p className="plain-kicker">一个适合长期坚持的人生记录 Skill</p>
          <h1>日记不用写很长。<span>把今天发生的事记下一两句，就够了。</span></h1>
          <p className="recording-intro">我已经坚持写日记十年。写到后来，我越来越确定：日记最重要的不是写得好，而是能一直记下去。</p>
          <p className="recording-intro">Life Journal 把记录这件事尽量变简单。你只需要告诉 Agent 哪天发生了什么，它会整理客观事实，并把人物、地点、感悟、经验和媒体记录放到各自的 Markdown 文件中。</p>
          <div className="hero-actions">
            <a className="button button-primary" href="/journal">打开示例记录</a>
            <a className="button button-quiet" href="#method">看看它怎么工作</a>
          </div>
          <p className="recording-note">推荐配合 Typeless，把语音转换成文字后发给 Agent。每天一两句话、重要时记一笔，或者每周记一次，都可以。</p>
        </div>

        <div className="recording-example" aria-label="从语音到 Markdown 的记录示例">
          <header><Mic size={18} /><span>你对 Agent 说</span></header>
          <blockquote>“10 月 10 日啊，帮我记一下日记吧。10 月 10 日好像是……傍晚的时候吧，我和阿澄，嗯……想一下啊，当时我们去了青岚湖，走了大概四十分钟。风有点凉，回家前还买了两个烤红薯。”</blockquote>
          <div className="recording-file">
            <div><FileText size={16} /><strong>diary.md</strong><span>事实记录</span></div>
            <pre>
              <span>## 2025-10-10</span>
              <strong>**湖边散步 · 秋天** · 周五 · 八月十九</strong>
              <span>傍晚和阿澄沿青岚湖走了四十分钟</span>
              <span>风有点凉，回家前买了两个烤红薯</span>
            </pre>
          </div>
          <footer><Check size={15} /><span>只整理事实，不替你扩写成一篇文章</span></footer>
        </div>
      </section>

      <section className="consistency-strip" id="why" aria-label="为什么强调简短记录">
        <p>先让记录足够容易，才有可能坚持很多年。</p>
        <div>
          <span><strong>每天</strong>一两句话</span>
          <span><strong>重要时</strong>随手记一笔</span>
          <span><strong>忙的时候</strong>每周记一次</span>
        </div>
      </section>

      <section className="plain-section recording-method" id="method">
        <header className="plain-section-header">
          <p className="plain-section-label">它怎么记录</p>
          <h2>先记事实，其他内容再分流。</h2>
          <p>你不需要先判断这句话应该放在哪个文件。把当天发生的事告诉 Agent，分类和关联由 Skill 完成。</p>
        </header>
        <div className="recording-steps">
          <article><span>01 · 你只需要</span><Mic size={22} /><h3>说出来</h3><p>输入文字；如果习惯说话，可以用 Typeless 转成文字再发送。日常记录只要一两句话。</p></article>
          <ArrowRight aria-hidden="true" size={22} />
          <article className="ai-step"><span>02 · AI 自动完成</span><Sparkles size={22} /><h3>AI 拆开整理</h3><p>AI 把客观事实留在日记里，并识别明显的感想、人物、地点和媒体信息。</p></article>
          <ArrowRight aria-hidden="true" size={22} />
          <article className="ai-step"><span>03 · AI 自动完成</span><FolderTree size={22} /><h3>AI 写入文件</h3><p>AI 把内容写入对应的 Markdown。你可以直接查看，也可以继续让 Agent 查询和整理。</p></article>
        </div>
      </section>

      <section className="plain-section content-system" id="content">
        <header className="plain-section-header">
          <p className="plain-section-label">记录内容与后续能力</p>
          <h2>每类内容各自保存，日记本身保持简短。</h2>
        </header>
        <div className="content-type-grid">
          <article className="content-type-card primary"><header><span>01</span><FileText size={21} /></header><small>diary.md</small><h3>事件</h3><p>最基础的客观事实。哪天去了哪里、和谁做了什么、结果怎样，不写成长篇文章。</p></article>
          <article className="content-type-card"><header><span>02</span><Lightbulb size={21} /></header><small>thoughts.md</small><h3>感悟</h3><p>当输入里有比较多的感想和情绪，AI 会把它们从事实中分离出来，单独保存。</p></article>
          <article className="content-type-card"><header><span>03</span><Wrench size={21} /></header><small>experiences/</small><h3>经验</h3><p>工作流程、处理方法和实用技巧。可以主动要求提炼，也可以让 AI 识别值得沉淀的内容。</p></article>
          <article className="content-type-card"><header><span>04</span><Users size={21} /></header><small>person.md</small><h3>人物</h3><p>首次出现时询问关系；确认是同一个人后可以合并。人物通过共同事件连接回日记。</p></article>
          <article className="content-type-card"><header><span>05</span><MapPinned size={21} /></header><small>places.md</small><h3>地点</h3><p>配置高德地图后可以搜索并确认坐标。不想当场确认也没关系，先标记为“待确认”。</p></article>
          <article className="content-type-card"><header><span>06</span><BookOpen size={21} /></header><small>media.md</small><h3>媒体</h3><p>读过的书、看过的电影、玩过的游戏和听过的音乐，会自动归入媒体记录。</p></article>
          <article className="content-type-card planned"><header><span>07</span><em>待开发</em><Images size={21} /></header><small>attachments/</small><h3>相册</h3><p>把照片和视频关联到具体日期与事件，再按时间生成相册页面，并能跳回对应日记。</p></article>
        </div>
      </section>

      <section className="plain-section markdown-section">
        <div>
          <p className="plain-section-label">为什么用 Markdown</p>
          <h2>数据越简单，越容易长期保存，也越适合 AI 处理。</h2>
          <p>这些文件不依赖某个封闭应用。你可以直接打开、同步、备份和迁移；Agent 读取和修改它们也很高效。</p>
          <ul>
            <li><Check size={15} />不用数据库，文件始终在自己手里</li>
            <li><Check size={15} />换一个 Agent，也能继续维护</li>
            <li><Check size={15} />网页只是阅读界面，Markdown 才是数据源</li>
          </ul>
        </div>
        <div className="vault-file-list" aria-label="人生记录文件结构">
          <header><FolderTree size={17} /><strong>life-journal/</strong></header>
          <span><b>AI_GUIDE.md</b><small>当前记录库的规则</small></span>
          <span><b>diary.md</b><small>每天发生的事实</small></span>
          <span><b>person.md</b><small>人物与共同事件</small></span>
          <span><b>places.md</b><small>地点、坐标与到访</small></span>
          <span><b>thoughts.md</b><small>感想与体会</small></span>
          <span><b>experiences/</b><small>经验与处理方法</small></span>
          <span><b>media.md</b><small>书、电影、游戏与音乐</small></span>
        </div>
      </section>

      <section className="plain-section reader-section" id="reader">
        <header className="plain-section-header">
          <p className="plain-section-label">前端阅读界面</p>
          <h2>Markdown 负责保存，网页负责查看。</h2>
          <p>前端代码在 Life Journal 项目仓库中，可以在自己的电脑或 NAS 上读取同一套 Markdown。最方便的方式是直接让 Agent 启动；Skill 已经包含完整的启动手册。</p>
        </header>
        <article className="reader-agent-card">
          <header><Bot size={22} /><div><small>推荐方式</small><h3>直接让 Agent 帮你启动</h3></div></header>
          <div className="reader-agent-prompt"><code>$life-journal 启动这个项目的前端</code></div>
          <p>Agent 会定位 Life Journal 项目和你的日记目录，先验证 Markdown，再启动本地服务并把访问地址发给你。下面的命令仅作为手动操作备用。</p>
        </article>
        <p className="reader-manual-label">手动启动</p>
        <div className="reader-deploy-grid">
          <article>
            <header><Monitor size={21} /><div><small>本机查看</small><h3>启动开发界面</h3></div></header>
            <pre><code><span>npm install</span><span>LIFE_JOURNAL_HOME=/你的日记目录 npm run dev</span></code></pre>
            <p>然后打开 <strong>http://localhost:3000/journal</strong>。</p>
          </article>
          <article>
            <header><Server size={21} /><div><small>NAS · 局域网</small><h3>构建并长期运行</h3></div></header>
            <pre><code><span>LIFE_JOURNAL_HOME=/NAS/日记目录 npm run build</span><span>PORT=3000 npm start</span></code></pre>
            <p>在家庭局域网中打开 <strong>http://NAS-IP:3000/journal</strong>。日记更新后需要重新构建并重启。</p>
          </article>
        </div>
        <div className="reader-security-note"><ShieldCheck size={20} /><p><strong>当前版本没有内置密码。</strong>建议只在本机、NAS 局域网或 Tailscale/VPN 内访问，不要直接把端口暴露到公网。需要远程访问时，优先使用成熟的反向代理认证和 HTTPS。</p></div>
      </section>

      <section className="plain-section review-section">
        <header className="plain-section-header">
          <p className="plain-section-label">记录久了以后</p>
          <h2>不仅可以翻日记，也可以直接向 AI 问自己的过去。</h2>
          <p>因为人物、地点、媒体和日记之间都有明确关联，Agent 可以读取这些 Markdown 文件，再按你的问题整理答案。</p>
        </header>
        <div className="ai-question-demo">
          <article>
            <div className="question-bubble"><MessageCircle size={18} /><div><small>你问</small><p>帮我看一下过去一年我看了哪些电影？</p></div></div>
            <div className="answer-bubble"><Bot size={18} /><div><small>AI 根据 media.md 回答</small><p>过去一年记录了 {watchedMovies.length} 部电影：{watchedMovies.map((item) => item.title).join("、")}。</p>{watchedMovies.map((item) => <span key={`${item.title}-${item.date}`}>{item.date} · {item.note}</span>)}</div></div>
          </article>
          <article>
            <div className="question-bubble"><MessageCircle size={18} /><div><small>你问</small><p>帮我看一下过去一个月我跟阿澄都去过哪里玩？</p></div></div>
            <div className="answer-bubble"><Bot size={18} /><div><small>AI 根据 person.md、places.md 和 diary.md 回答</small><p>你和阿澄一起去过 {sharedPlaces.map((place) => place.name).join("、")}。</p>{sharedPlaces.flatMap((place) => place.visits.filter((visit) => sharedDates.has(visit.sourceDate)).map((visit) => <span key={`${place.id}-${visit.date}`}>{visit.date} · {visit.summary}</span>))}</div></div>
          </article>
        </div>
      </section>

      <section className="plain-section fit-section">
        <header className="plain-section-header">
          <p className="plain-section-label">它的边界</p>
          <h2>重点是留下生活记录，不是帮你写出一篇好文章。</h2>
        </header>
        <div className="fit-grid">
          <article><h3>适合</h3><ul><li>希望降低写日记的负担</li><li>想记录每天或重要事件</li><li>愿意用一两句话保留事实</li><li>希望以后按时间、人物、地点回看</li></ul></article>
          <article className="not-fit"><h3>不太适合</h3><ul><li>习惯每天写很长的抒情日记</li><li>主要目标是写文章或公开发表</li><li>希望 AI 替自己补充没有说过的内容</li><li>不愿意维护任何本地文件</li></ul></article>
        </div>
      </section>

      <section className="privacy-note-section">
        <ShieldCheck size={24} />
        <div><h2>真实记录默认留在本地。</h2><p>公开示例使用从零编写的虚构数据，不从真实日记改名或简单脱敏。地图密钥和精确坐标也不会写进公开页面。</p></div>
      </section>

      <section className="plain-section roadmap-section" id="roadmap">
        <header className="plain-section-header">
          <p className="plain-section-label">Todo List · 以下功能均未实现</p>
          <h2>这是后续计划，不是当前版本已有的功能。</h2>
          <p>目前计划补充媒体相册与私有访问控制。两项都仍在设计阶段，完成之前不会把它们写成现成功能。</p>
        </header>
        <article className="roadmap-card is-planned">
          <div className="roadmap-status">尚未实现 · 计划中</div>
          <header><div><h3>媒体附件与相册</h3></div><Images size={27} /></header>
          <div className="roadmap-list">
            <span><i /><FolderTree size={17} /><b>附件目录</b><small>按年份、日期和事件组织图片与视频</small></span>
            <span><i /><Link2 size={17} /><b>事件关联</b><small>明确关联到哪一天的哪件事，不由 AI 猜测</small></span>
            <span><i /><Images size={17} /><b>相册页面</b><small>按时间浏览，并能跳回对应日记</small></span>
            <span><i /><Video size={17} /><b>媒体预览</b><small>提供图片缩略图、视频封面和播放入口</small></span>
          </div>
          <footer>文字仍然是记录的主体。照片和视频只在真正值得保留的时候添加，不建议为了完整而大量插入。</footer>
        </article>
        <article className="roadmap-card is-planned access-control-card">
          <div className="roadmap-status">尚未实现 · 计划中</div>
          <header><div><h3>私有访问控制</h3></div><LockKeyhole size={27} /></header>
          <p className="roadmap-summary">未来可能加入真正的登录保护。只有服务端验证、安全会话、登录限速和 HTTPS 等基础条件完整实现后，才会开放这项能力。</p>
          <footer>当前版本没有内置密码。请只在本机、NAS 私有局域网或 Tailscale/VPN 中使用，不要把端口直接暴露到公网。</footer>
        </article>
      </section>

      <section className="plain-start-section" id="start">
        <p className="plain-section-label">从今天开始</p>
        <h2>先记下一两句话。<br />以后想补人物、地点和经验，再慢慢整理。</h2>
        <div className="install-box"><code>$life-journal 帮我记录今天发生的事</code></div>
        <div className="hero-actions centered-actions"><a className="button button-primary" href="/life-journal-skill.tar.gz" download>下载 Skill</a><a className="button button-quiet" href="/journal">打开示例</a></div>
      </section>

      <footer className="plain-landing-footer"><a className="brand" href="#top"><span className="brand-mark">LJ</span><span>人生记录</span></a><p>简短记录，长期保存。</p><span>虚构 Demo · Markdown 数据源</span></footer>
    </main>
  );
}
