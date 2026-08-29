import {
  BookOpen,
  Compass,
  House,
  Lightbulb,
  MapPinned,
  NotebookText,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";

export const journalNavigation = [
  { href: "/journal", label: "总览", icon: House },
  { href: "/journal/diary", label: "日记", icon: NotebookText },
  { href: "/journal/people", label: "人物", icon: Users },
  { href: "/journal/places", label: "地点", icon: MapPinned },
  { href: "/journal/media", label: "媒体", icon: BookOpen },
  { href: "/journal/thoughts", label: "感悟", icon: Lightbulb },
  { href: "/journal/experiences", label: "经验", icon: Sparkles },
  { href: "/journal/search", label: "搜索", icon: Search },
];

export function JournalNav() {
  return (
    <>
      <Link className="journal-brand" href="/">
        <span className="brand-mark">LJ</span>
        <span>
          <strong>Life Journal</strong>
          <small>Demo Vault</small>
        </span>
      </Link>
      <nav className="journal-nav" aria-label="生活记录导航">
        {journalNavigation.map(({ href, label, icon: Icon }) => (
          <a href={href} key={href}>
            <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
            <span>{label}</span>
          </a>
        ))}
      </nav>
      <div className="sidebar-note">
        <Compass aria-hidden="true" size={17} />
        <p>所有演示内容均为虚构，真实记录默认只在本地打开。</p>
      </div>
    </>
  );
}
