import type { Metadata } from "next";
import { Search } from "lucide-react";
import { vault } from "@/lib/vault";
import { SearchClient } from "./search-client";

export const metadata: Metadata = {
  title: "搜索生活记录 · Life Journal",
  description: "在日记、人物、地点、感悟、媒体和经验之间进行本地搜索。",
};

export default function SearchPage() {
  const records = [
    ...vault.diary.map((entry) => ({ type: "日记", title: entry.labels.join(" · ") || entry.date, text: entry.lines.join(" "), href: `/journal/diary/${entry.date}`, date: entry.date })),
    ...vault.people.map((person) => ({ type: "人物", title: person.name, text: `${person.description} ${person.events.map((event) => event.summary).join(" ")}`, href: `/journal/people/${person.id}`, date: person.events[0]?.date || "" })),
    ...vault.places.map((place) => ({ type: "地点", title: place.name, text: `${place.adminArea} ${place.visits.map((visit) => visit.summary).join(" ")}`, href: "/journal/places", date: place.visits[0]?.date || "" })),
    ...vault.thoughts.map((thought) => ({ type: "感悟", title: thought.title, text: thought.body, href: "/journal/thoughts", date: thought.date })),
    ...vault.media.map((item) => ({ type: "媒体", title: item.title, text: `${item.creator} ${item.note}`, href: "/journal/media", date: item.date })),
    ...vault.experiences.map((experience) => ({ type: "经验", title: experience.title, text: Object.values(experience.sections).join(" "), href: `/journal/experiences/${experience.slug}`, date: experience.updated })),
  ];

  return (
    <main className="journal-content">
      <header className="journal-page-header compact">
        <div><p className="section-eyebrow">LOCAL SEARCH</p><h1>搜索</h1><p>搜索在浏览器本地完成，不把查询词发送给第三方。</p></div>
        <span className="header-icon"><Search size={24} /></span>
      </header>
      <SearchClient records={records} />
    </main>
  );
}
