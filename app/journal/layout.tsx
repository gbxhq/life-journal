import type { ReactNode } from "react";
import { JournalNav } from "./nav";
import { MobileJournalNav } from "./mobile-nav";

export default function JournalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="journal-shell">
      <aside className="journal-sidebar">
        <JournalNav />
      </aside>
      <div className="journal-main">{children}</div>
      <MobileJournalNav />
    </div>
  );
}
