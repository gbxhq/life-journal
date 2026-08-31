import type { Metadata } from "next";
import { AlertCircle, MapPinned } from "lucide-react";
import { formatDate, vault } from "@/lib/vault";
import { AmapPlaceMap } from "./amap-map";

export const metadata: Metadata = {
  title: "到访地点 · Life Journal",
  description: "在高德地图中浏览已确认地点，并查看仍待确认的地点。",
};

export default function PlacesPage() {
  const confirmed = vault.places.filter((place) => Boolean(place.coordinate));
  const pending = vault.places.filter((place) => !place.coordinate);

  return (
    <main className="journal-content places-page">
      <header className="journal-page-header compact">
        <div>
          <p className="section-eyebrow">PLACES & EVENTS</p>
          <h1>地点</h1>
          <p>地图只展示坐标已经确认的到访地点，点击标记可以回到相关日记。</p>
        </div>
        <span className="header-icon"><MapPinned size={24} /></span>
      </header>

      <AmapPlaceMap
        places={confirmed}
        apiKey={process.env.NEXT_PUBLIC_AMAP_JS_KEY ?? ""}
        securityCode={process.env.NEXT_PUBLIC_AMAP_SECURITY_CODE ?? ""}
      />

      <section className="pending-places">
        <header><div><p className="section-eyebrow">PENDING CONFIRMATION</p><h2>待确认地点</h2></div><span>{pending.length} 个</span></header>
        <p className="pending-description">这些地点已经确认到访，但坐标或具体位置尚未确认。这里只做展示，不在页面中直接修改。</p>
        <div>
          {pending.map((place) => (
            <article key={place.id}>
              <AlertCircle size={18} />
              <div><h3>{place.name}</h3><p>{place.adminArea}</p>{place.visits.map((visit) => <a href={`/journal/diary/${visit.sourceDate}`} key={visit.date}>{formatDate(visit.date)} · {visit.summary}</a>)}</div>
              <span>{place.type}</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
