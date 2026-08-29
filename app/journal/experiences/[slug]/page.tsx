import type { Metadata } from "next";
import { ArrowLeft, CalendarDays, CircleHelp, ClipboardCheck, History, Sparkles } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { vault } from "@/lib/vault";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return vault.experiences.map((experience) => ({ slug: experience.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const experience = vault.experiences.find((item) => item.slug === slug);
  if (!experience) return {};
  const title = `${experience.title} · Life Journal`;
  const description = experience.sections["一句话经验"] || "Life Journal 生活经验";
  return {
    title,
    description,
    openGraph: { title, description, images: [] },
    twitter: { title, description, images: [] },
  };
}

const sectionIcons = {
  "一句话经验": Sparkles,
  "当时的情况": CalendarDays,
  "我实际做过什么": ClipboardCheck,
  "哪些表现可能有效": ClipboardCheck,
  "下次处理清单": ClipboardCheck,
  "尚不确定或需要核实": CircleHelp,
  "来源日记": CalendarDays,
  "修订记录": History,
};

export default async function ExperienceDetailPage({ params }: Props) {
  const { slug } = await params;
  const experience = vault.experiences.find((item) => item.slug === slug);
  if (!experience) notFound();

  return (
    <main className="journal-content detail-content">
      <Link className="back-link" href="/journal/experiences"><ArrowLeft size={15} /> 返回经验</Link>
      <header className="experience-detail-header">
        <div className="label-row"><span>{experience.category}</span><span>{experience.status}</span></div>
        <h1>{experience.title}</h1>
        <p>{experience.sections["一句话经验"]}</p>
        <footer><span>创建于 {experience.created}</span><span>更新于 {experience.updated}</span></footer>
      </header>

      <div className="experience-sections">
        {Object.entries(experience.sections).filter(([title]) => title !== "一句话经验").map(([title, content]) => {
          const Icon = sectionIcons[title as keyof typeof sectionIcons] ?? Sparkles;
          const lines = content.split("\n").filter(Boolean);
          return (
            <section className="experience-section" key={title}>
              <div className="experience-section-icon"><Icon size={18} /></div>
              <div><h2>{title}</h2>{lines.map((line) => line.startsWith("-") ? <p className="check-line" key={line}>{line.replace(/^-\s*/, "")}</p> : <p key={line}>{line}</p>)}</div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
