import type { Metadata } from "next";
import { Lightbulb } from "lucide-react";
import { formatDate, vault } from "@/lib/vault";

export const metadata: Metadata = {
  title: "感悟记录 · Life Journal",
  description: "从生活事件中留下的主观思考。",
};

export default function ThoughtsPage() {
  return (
    <main className="journal-content">
      <header className="journal-page-header compact">
        <div>
          <p className="section-eyebrow">THOUGHTS</p>
          <h1>感悟</h1>
          <p>事实之外，保存那些值得在未来重新读到的想法。</p>
        </div>
        <span className="header-icon"><Lightbulb size={24} /></span>
      </header>

      <section className="thought-list">
        {vault.thoughts.map((thought, index) => (
          <article className="thought-card" key={thought.date}>
            <div className="thought-index">{String(index + 1).padStart(2, "0")}</div>
            <div><time dateTime={thought.date}>{formatDate(thought.date)}</time><h2>{thought.title}</h2><p>{thought.body}</p></div>
          </article>
        ))}
      </section>
    </main>
  );
}
