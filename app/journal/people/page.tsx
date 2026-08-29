import type { Metadata } from "next";
import { ArrowUpRight, Users } from "lucide-react";
import { formatDate, vault } from "@/lib/vault";

export const metadata: Metadata = {
  title: "人物关系 · Life Journal",
  description: "从共同经历回看生活中的重要人物。",
};

export default function PeoplePage() {
  return (
    <main className="journal-content">
      <header className="journal-page-header compact">
        <div>
          <p className="section-eyebrow">PEOPLE & MOMENTS</p>
          <h1>人物</h1>
          <p>不为人物打分，只保存真正一起经历过的时刻。</p>
        </div>
        <span className="header-icon"><Users size={24} /></span>
      </header>

      <section className="people-grid">
        {vault.people.map((person, index) => (
          <a className="person-card" href={`/journal/people/${person.id}`} key={person.id}>
            <div className={`avatar avatar-${(index % 4) + 1}`}>{person.name.slice(0, 1)}</div>
            <div className="person-card-title">
              <h2>{person.name}</h2>
              <ArrowUpRight size={16} />
            </div>
            <p>{person.description}</p>
            <footer>
              <strong>{person.events.length}</strong>
              <span>段共同经历</span>
              <time dateTime={person.events[0]?.date}>{person.events[0] ? formatDate(person.events[0].date, { month: "numeric", day: "numeric" }) : ""}</time>
            </footer>
          </a>
        ))}
      </section>
    </main>
  );
}
