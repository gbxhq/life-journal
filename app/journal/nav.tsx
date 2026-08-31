import {
  BookOpen,
  CalendarDays,
  Compass,
  Lightbulb,
  LayoutGrid,
  MapPinned,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";

export const primaryNavigation = [
  { href: "/journal", label: "记录", icon: CalendarDays },
  { href: "/journal/people", label: "人物", icon: Users },
  { href: "/journal/places", label: "地点", icon: MapPinned },
];

export const secondaryNavigation = [
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
        {primaryNavigation.map(({ href, label, icon: Icon }) => (
          <Link href={href} key={href}>
            <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
            <span>{label}</span>
          </Link>
        ))}
        <details className="sidebar-other">
          <summary><LayoutGrid aria-hidden="true" size={17} strokeWidth={1.8} /><span>其他</span></summary>
          <div>
            {secondaryNavigation.map(({ href, label, icon: Icon }) => (
              <Link href={href} key={href}><Icon aria-hidden="true" size={15} /><span>{label}</span></Link>
            ))}
          </div>
        </details>
      </nav>
      <div className="sidebar-note">
        <Compass aria-hidden="true" size={17} />
        <p>所有演示内容均为虚构，真实记录默认只在本地打开。</p>
      </div>
    </>
  );
}
