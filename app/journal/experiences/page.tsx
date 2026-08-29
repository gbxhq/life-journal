import type { Metadata } from "next";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { vault } from "@/lib/vault";

export const metadata: Metadata = {
  title: "生活经验 · Life Journal",
  description: "从具体经历中沉淀、修订并持续验证的个人经验。",
};

export default function ExperiencesPage() {
  return (
    <main className="journal-content">
      <header className="journal-page-header compact">
        <div>
          <p className="section-eyebrow">LIVING KNOWLEDGE</p>
          <h1>生活经验</h1>
          <p>日记回答发生了什么，经验回答下次可以怎样做。</p>
        </div>
        <span className="header-icon"><Sparkles size={24} /></span>
      </header>

      <section className="experience-grid">
        {vault.experiences.map((experience, index) => (
          <a className="experience-card" href={`/journal/experiences/${experience.slug}`} key={experience.slug}>
            <div className="experience-card-top"><span>{String(index + 1).padStart(2, "0")}</span><ArrowUpRight size={17} /></div>
            <div className="label-row"><span>{experience.category}</span><span>{experience.status}</span></div>
            <h2>{experience.title}</h2>
            <p>{experience.sections["一句话经验"]}</p>
            <footer><div>{experience.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div><time>{experience.updated}</time></footer>
          </a>
        ))}
      </section>
    </main>
  );
}
