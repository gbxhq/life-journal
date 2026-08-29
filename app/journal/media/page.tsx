import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { mediaLabel, vault } from "@/lib/vault";

export const metadata: Metadata = {
  title: "媒体记录 · Life Journal",
  description: "书、电影、游戏和音乐共同构成的文化记忆。",
};

const categories = ["book", "movie", "game", "music"] as const;

export default function MediaPage() {
  return (
    <main className="journal-content">
      <header className="journal-page-header compact">
        <div>
          <p className="section-eyebrow">BOOKS · FILMS · GAMES · MUSIC</p>
          <h1>媒体</h1>
          <p>记录看过、读过、玩过和反复听过的作品。</p>
        </div>
        <span className="header-icon"><BookOpen size={24} /></span>
      </header>

      <div className="media-sections">
        {categories.map((category) => {
          const items = vault.media.filter((item) => item.category === category);
          return (
            <section className="media-section" key={category}>
              <header><p className="section-eyebrow">{category.toUpperCase()}</p><h2>{mediaLabel(category)}</h2><span>{items.length} 条</span></header>
              <div className="media-grid">
                {items.map((item, index) => (
                  <article className={`media-card media-${category}`} key={`${item.title}-${item.status}`}>
                    <div className="media-cover"><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title.slice(0, 1)}</strong></div>
                    <div><span className="status-pill">{item.status}</span><h3>{item.title}</h3><p>{item.creator || item.context}</p><blockquote>{item.note || "暂未记录感想"}</blockquote><time>{item.date}</time></div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
