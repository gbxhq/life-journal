import type { Metadata } from "next";
import { ArrowLeft, CalendarDays } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, vault } from "@/lib/vault";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return vault.people.map((person) => ({ id: person.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const person = vault.people.find((item) => item.id === id);
  if (!person) return {};
  const title = `${person.name} · 人物关系 · Life Journal`;
  const description = `${person.description}，共记录 ${person.events.length} 段共同经历。`;
  return {
    title,
    description,
    openGraph: { title, description, images: [] },
    twitter: { title, description, images: [] },
  };
}

export default async function PersonDetailPage({ params }: Props) {
  const { id } = await params;
  const person = vault.people.find((item) => item.id === id);
  if (!person) notFound();

  return (
    <main className="journal-content detail-content">
      <Link className="back-link" href="/journal/people"><ArrowLeft size={15} /> 返回人物</Link>
      <header className="person-detail-header">
        <div className="avatar avatar-large">{person.name.slice(0, 1)}</div>
        <div><p className="section-eyebrow">SHARED MOMENTS</p><h1>{person.name}</h1><p>{person.description}</p></div>
      </header>
      <section className="person-events panel">
        <div className="panel-heading"><div><p className="section-eyebrow">TIMELINE</p><h2>共同经历</h2></div><span>{person.events.length} 条记录</span></div>
        {person.events.map((event) => (
          <a className="person-event" href={`/journal/diary/${event.sourceDate}`} key={`${event.date}-${event.summary}`}>
            <CalendarDays size={17} />
            <div><strong>{event.summary}</strong><span>{formatDate(event.date)}</span></div>
          </a>
        ))}
      </section>
    </main>
  );
}
