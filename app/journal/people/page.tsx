import type { Metadata } from "next";
import { ArrowRight, Users } from "lucide-react";
import Link from "next/link";
import { formatDate, vault } from "@/lib/vault";

export const metadata: Metadata = {
  title: "人物关系 · Life Journal",
  description: "从共同经历回看生活中的重要人物。",
};

export default function PeoplePage() {
  return (
    <main className="journal-content people-page">
      <header className="journal-page-header compact">
        <div>
          <p className="section-eyebrow">PEOPLE & EVENTS</p>
          <h1>人物</h1>
          <p>人物不是孤立的通讯录。每个人都通过真实事件连接回日记。</p>
        </div>
        <span className="header-icon"><Users size={24} /></span>
      </header>

      <section className="people-event-list">
        {vault.people.map((person, index) => (
          <article className="person-event-card" key={person.id}>
            <header>
              <div className={`avatar avatar-${(index % 4) + 1}`}>{person.name.slice(0, 1)}</div>
              <div><h2>{person.name}</h2><p>{person.description}</p></div>
              <Link href={`/journal/people/${person.id}`}>全部经历 <ArrowRight size={14} /></Link>
            </header>
            <div className="person-related-events">
              {person.events.map((event) => {
                const diary = vault.diary.find((entry) => entry.date === event.sourceDate);
                return (
                  <Link href={`/journal/diary/${event.sourceDate}`} key={`${person.id}-${event.date}-${event.summary}`}>
                    <time dateTime={event.date}><strong>{event.date.slice(8)}</strong><span>{formatDate(event.date, { month: "short" })}</span></time>
                    <div>
                      <span>{event.summary}</span>
                      <h3>{diary?.labels.join(" · ") || "日常记录"}</h3>
                      <p>{diary?.lines.slice(0, 2).join(" ")}</p>
                    </div>
                    <ArrowRight size={15} />
                  </Link>
                );
              })}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
