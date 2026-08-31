"use client";

import { LayoutGrid, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { primaryNavigation, secondaryNavigation } from "./nav";

export function MobileJournalNav() {
  const [otherOpen, setOtherOpen] = useState(false);

  return (
    <>
      {otherOpen && (
        <div className="mobile-other-layer">
          <button className="mobile-other-backdrop" type="button" aria-label="关闭其他菜单" onClick={() => setOtherOpen(false)} />
          <section className="mobile-other-sheet" aria-label="其他内容">
            <header><div><p className="section-eyebrow">MORE</p><h2>其他</h2></div><button type="button" onClick={() => setOtherOpen(false)} aria-label="关闭"><X size={20} /></button></header>
            <div>
              {secondaryNavigation.map(({ href, label, icon: Icon }) => (
                <Link href={href} key={href} onClick={() => setOtherOpen(false)}>
                  <Icon aria-hidden="true" size={20} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}
      <nav className="mobile-journal-nav" aria-label="移动端生活记录导航">
        {primaryNavigation.map(({ href, label, icon: Icon }) => (
          <Link href={href} key={href}>
            <Icon aria-hidden="true" size={20} />
            <span>{label}</span>
          </Link>
        ))}
        <button type="button" onClick={() => setOtherOpen(true)} aria-expanded={otherOpen}>
          <LayoutGrid aria-hidden="true" size={20} />
          <span>其他</span>
        </button>
      </nav>
    </>
  );
}
