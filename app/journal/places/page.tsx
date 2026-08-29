import type { Metadata } from "next";
import { MapPinned, Navigation, ShieldCheck } from "lucide-react";
import { formatDate, vault } from "@/lib/vault";

export const metadata: Metadata = {
  title: "到访地点 · Life Journal",
  description: "只展示确认本人真实到访的地点和对应日记。",
};

export default function PlacesPage() {
  return (
    <main className="journal-content">
      <header className="journal-page-header compact">
        <div>
          <p className="section-eyebrow">VISITED PLACES</p>
          <h1>地点</h1>
          <p>计划不是足迹。这里只留下确认本人真正到达过的地方。</p>
        </div>
        <span className="header-icon"><MapPinned size={24} /></span>
      </header>

      <section className="place-overview panel">
        <div><Navigation size={20} /><strong>{vault.summary.places}</strong><span>已记录地点</span></div>
        <div><ShieldCheck size={20} /><strong>{vault.summary.confirmedPlaces}</strong><span>坐标已确认</span></div>
        <p>精确坐标在当前 Demo 中默认隐藏，页面只显示坐标状态和坐标系。</p>
      </section>

      <section className="places-grid">
        {vault.places.map((place, index) => (
          <article className="place-card" key={place.id}>
            <div className={`place-visual place-visual-${(index % 4) + 1}`}>
              <span>{place.type}</span>
              <MapPinned size={28} strokeWidth={1.4} />
            </div>
            <div className="place-card-body">
              <div className="place-title"><h2>{place.name}</h2><span className={place.coordinate ? "coordinate confirmed" : "coordinate"}>{place.coordinate ? "已确认" : "待确认"}</span></div>
              <p>{place.adminArea}</p>
              {place.coordinate && <small>{place.coordinate.system} · 精确坐标已隐藏</small>}
              <div className="visit-list">
                {place.visits.map((visit) => (
                  <a href={`/journal/diary/${visit.sourceDate}`} key={visit.date}><time>{formatDate(visit.date, { month: "numeric", day: "numeric" })}</time><span>{visit.summary}</span></a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
