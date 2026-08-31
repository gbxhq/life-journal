import type { Metadata } from "next";
import { BookOpen, Lightbulb, Search, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "其他内容 · Life Journal",
  description: "进入媒体、感悟、经验和搜索。",
};

const items = [
  { href: "/journal/media", title: "媒体", description: "书、电影、游戏和音乐", icon: BookOpen },
  { href: "/journal/thoughts", title: "感悟", description: "值得以后重新读到的想法", icon: Lightbulb },
  { href: "/journal/experiences", title: "经验", description: "从经历中沉淀的处理方法", icon: Sparkles },
  { href: "/journal/search", title: "搜索", description: "跨所有记录查找内容", icon: Search },
];

export default function OtherPage() {
  return (
    <main className="journal-content">
      <header className="journal-page-header compact"><div><p className="section-eyebrow">MORE</p><h1>其他</h1><p>媒体、感悟和经验收在这里，核心导航始终留给时间、人物与地点。</p></div></header>
      <section className="other-grid">
        {items.map(({ href, title, description, icon: Icon }) => (
          <a href={href} key={href}><Icon size={23} /><div><h2>{title}</h2><p>{description}</p></div></a>
        ))}
      </section>
    </main>
  );
}
