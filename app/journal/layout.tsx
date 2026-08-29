import type { ReactNode } from "react";
import { JournalNav, journalNavigation } from "./nav";

export default function JournalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="journal-shell">
      <aside className="journal-sidebar">
        <JournalNav />
      </aside>
      <div className="journal-main">{children}</div>
      <nav className="mobile-journal-nav" aria-label="移动端生活记录导航">
        {journalNavigation.slice(0, 5).map(({ href, label, icon: Icon }) => (
          <a href={href} key={href}>
            <Icon aria-hidden="true" size={18} />
            <span>{label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
