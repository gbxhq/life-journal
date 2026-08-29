import { ArrowRight, CircleCheck, MapPin, Quote, Users } from "lucide-react";
import Link from "next/link";
import { formatDate, vault } from "@/lib/vault";

export default function JournalDashboard() {
  const latest = vault.diary[0];
  const recent = vault.diary.slice(0, 4);
  const latestExperience = [...vault.experiences].sort((a, b) => b.updated.localeCompare(a.updated))[0];

  return (
    <main className="journal-content">
      <header className="journal-page-header">
        <div>
          <p className="section-eyebrow">LIFE OVERVIEW</p>
          <h1>{vault.config.site?.title ?? "我的生活记录"}</h1>
          <p>从事实开始，沿着关系、足迹和经验重新理解生活。</p>
        </div>
        <div className="journal-date-card">
          <small>最近记录</small>
          <strong>{latest.date.slice(5).replace("-", ".")}</strong>
          <span>{latest.weekday}</span>
        </div>
      </header>

      <section className="summary-grid" aria-label="记录统计">
        <article><strong>{vault.summary.diaryDays}</strong><span>记录日</span><NotebookMark /></article>
        <article><strong>{vault.summary.people}</strong><span>重要人物</span><Users size={18} /></article>
        <article><strong>{vault.summary.places}</strong><span>到访地点</span><MapPin size={18} /></article>
        <article><strong>{vault.summary.experiences}</strong><span>生活经验</span><CircleCheck size={18} /></article>
      </section>

      <div className="dashboard-grid">
        <section className="panel recent-panel">
          <div className="panel-heading">
            <div><p className="section-eyebrow">RECENT DAYS</p><h2>最近的日子</h2></div>
            <Link href="/journal/diary">查看全部 <ArrowRight size={14} /></Link>
          </div>
          <div className="recent-days">
            {recent.map((entry) => (
              <a className="recent-day" href={`/journal/diary/${entry.date}`} key={entry.date}>
                <time dateTime={entry.date}><strong>{entry.date.slice(8)}</strong><span>{entry.date.slice(5, 7)}月</span></time>
                <div>
                  <h3>{entry.labels.join(" · ") || "日常记录"}</h3>
                  <p>{entry.lines[0]}</p>
                </div>
                <ArrowRight size={15} />
              </a>
            ))}
          </div>
        </section>

        <aside className="dashboard-aside">
          <section className="panel thought-highlight">
            <Quote aria-hidden="true" size={24} />
            <blockquote>{vault.thoughts[0].body}</blockquote>
            <p>{formatDate(vault.thoughts[0].date)} · {vault.thoughts[0].title}</p>
          </section>

          <section className="panel experience-highlight">
            <p className="section-eyebrow">LATEST EXPERIENCE</p>
            <span className="status-pill">{latestExperience.status}</span>
            <h2>{latestExperience.title}</h2>
            <p>{latestExperience.sections["一句话经验"]}</p>
            <a href={`/journal/experiences/${latestExperience.slug}`}>阅读完整经验 <ArrowRight size={14} /></a>
          </section>
        </aside>
      </div>
    </main>
  );
}

function NotebookMark() {
  return <span className="notebook-mark" aria-hidden="true">✦</span>;
}
