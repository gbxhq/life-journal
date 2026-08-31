import type { Metadata } from "next";
import { ArrowLeft, MapPin, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, relatedExperiences, relatedPeople, relatedPlaces, vault } from "@/lib/vault";

type Props = { params: Promise<{ date: string }> };

export function generateStaticParams() {
  return vault.diary.map((entry) => ({ date: entry.date }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  const entry = vault.diary.find((item) => item.date === date);
  if (!entry) return {};
  const title = `${entry.labels.join(" · ") || date} · Life Journal`;
  const description = entry.lines[0] || "Life Journal 日记记录";
  return {
    title,
    description,
    openGraph: { title, description, images: [] },
    twitter: { title, description, images: [] },
  };
}

export default async function DiaryDetailPage({ params }: Props) {
  const { date } = await params;
  const entry = vault.diary.find((item) => item.date === date);
  if (!entry) notFound();
  const people = relatedPeople(date);
  const places = relatedPlaces(date);
  const experiences = relatedExperiences(date);

  return (
    <main className="journal-content detail-content">
      <Link className="back-link" href="/journal"><ArrowLeft size={15} /> 返回记录</Link>
      <article className="diary-detail">
        <header>
          <time dateTime={entry.date}>{entry.date}</time>
          <h1>{entry.labels.join(" · ") || "日常记录"}</h1>
          <p>{formatDate(entry.date)} · {entry.lunar}</p>
        </header>
        <div className="diary-lines">
          {entry.lines.map((line) => <p key={line}>{line}</p>)}
        </div>
      </article>

      {(people.length > 0 || places.length > 0 || experiences.length > 0) && (
        <section className="connections-panel">
          <p className="section-eyebrow">CONNECTIONS</p>
          <h2>这一天连接到</h2>
          <div className="connection-groups">
            {people.length > 0 && <div><Users size={17} /><span>人物</span>{people.map((person) => <a href={`/journal/people/${person.id}`} key={person.id}>{person.name}</a>)}</div>}
            {places.length > 0 && <div><MapPin size={17} /><span>地点</span>{places.map((place) => <a href="/journal/places" key={place.id}>{place.name}</a>)}</div>}
            {experiences.length > 0 && <div><Sparkles size={17} /><span>经验</span>{experiences.map((experience) => <a href={`/journal/experiences/${experience.slug}`} key={experience.slug}>{experience.title}</a>)}</div>}
          </div>
        </section>
      )}
    </main>
  );
}
