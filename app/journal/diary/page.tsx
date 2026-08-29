import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import { formatDate, vault, yearMonth } from "@/lib/vault";

export const metadata: Metadata = {
  title: "日记时间线 · Life Journal",
  description: "按日期浏览虚构 Demo Vault 中的 Markdown 日记。",
};

export default function DiaryPage() {
  const months = new Map<string, typeof vault.diary>();
  for (const entry of vault.diary) {
    const key = yearMonth(entry.date);
    months.set(key, [...(months.get(key) ?? []), entry]);
  }

  return (
    <main className="journal-content">
      <header className="journal-page-header compact">
        <div>
          <p className="section-eyebrow">DIARY TIMELINE</p>
          <h1>日记</h1>
          <p>每一天只保留一个入口，事实按时间慢慢累积。</p>
        </div>
        <span className="header-icon"><CalendarDays size={24} /></span>
      </header>

      <div className="timeline-months">
        {[...months.entries()].map(([month, entries]) => (
          <section className="timeline-month" key={month}>
            <header><strong>{month.slice(5)}月</strong><span>{month.slice(0, 4)}</span></header>
            <div className="timeline-entries">
              {entries.map((entry) => (
                <a href={`/journal/diary/${entry.date}`} className="timeline-entry" key={entry.date}>
                  <time dateTime={entry.date}><strong>{entry.date.slice(8)}</strong><span>{entry.weekday}</span></time>
                  <div>
                    <div className="label-row">{entry.labels.map((label) => <span key={label}>{label}</span>)}</div>
                    <h2>{entry.lines[0]}</h2>
                    {entry.lines[1] && <p>{entry.lines[1]}</p>}
                  </div>
                  <small>{formatDate(entry.date, { month: "long", day: "numeric" })}</small>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
