"use client";

import { ExternalLink, MapPin, MessageCircleMore } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Place } from "@/lib/vault";

type MapInstance = {
  add: (markers: unknown[]) => void;
  destroy: () => void;
  setFitView: (markers?: unknown[], immediately?: boolean, avoid?: number[], maxZoom?: number) => void;
  setZoomAndCenter: (zoom: number, center: [number, number]) => void;
};

type MarkerInstance = { on: (event: string, handler: () => void) => void };
type ConvertedLocation = { getLng: () => number; getLat: () => number };
type AMapApi = {
  Map: new (container: HTMLElement, options: Record<string, unknown>) => MapInstance;
  Marker: new (options: Record<string, unknown>) => MarkerInstance;
  convertFrom: (
    position: [number, number],
    type: "gps" | "baidu",
    callback: (status: string, result: { locations?: ConvertedLocation[] }) => void,
  ) => void;
};

declare global {
  interface Window {
    AMap?: AMapApi;
    _AMapSecurityConfig?: { securityJsCode?: string };
  }
}

function loadAmap(key: string, securityCode: string) {
  if (window.AMap) return Promise.resolve(window.AMap);
  if (securityCode) window._AMapSecurityConfig = { securityJsCode: securityCode };

  return new Promise<AMapApi>((resolve, reject) => {
    const existing = document.getElementById("life-journal-amap-sdk") as HTMLScriptElement | null;
    const script = existing ?? document.createElement("script");
    const onLoad = () => window.AMap ? resolve(window.AMap) : reject(new Error("AMap SDK did not initialize"));
    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener("error", () => reject(new Error("AMap SDK failed to load")), { once: true });
    if (!existing) {
      script.id = "life-journal-amap-sdk";
      script.async = true;
      script.src = `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(key)}`;
      document.head.appendChild(script);
    }
  });
}

async function positionForMap(api: AMapApi, place: Place): Promise<[number, number] | null> {
  if (!place.coordinate) return null;
  const source: [number, number] = [place.coordinate.longitude, place.coordinate.latitude];
  if (place.coordinate.system === "GCJ-02") return source;
  if (place.coordinate.system !== "WGS84") return null;
  return new Promise((resolve) => {
    api.convertFrom(source, "gps", (status, result) => {
      const location = result.locations?.[0];
      resolve(status === "complete" && location ? [location.getLng(), location.getLat()] : null);
    });
  });
}

export function AmapPlaceMap({ places, apiKey, securityCode }: { places: Place[]; apiKey: string; securityCode: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState(places[0]?.id ?? "");
  const [mapState, setMapState] = useState<"loading" | "ready" | "missing-key" | "error">(apiKey ? "loading" : "missing-key");
  const selected = places.find((place) => place.id === selectedId) ?? places[0];

  useEffect(() => {
    if (!apiKey || !container.current || places.length === 0) return;
    let disposed = false;
    let map: MapInstance | null = null;

    loadAmap(apiKey, securityCode)
      .then(async (api) => {
        if (disposed || !container.current) return;
        map = new api.Map(container.current, {
          zoom: 5,
          viewMode: "2D",
          mapStyle: "amap://styles/whitesmoke",
        });
        const markers: MarkerInstance[] = [];
        const positions: [number, number][] = [];
        for (const place of places) {
          const position = await positionForMap(api, place);
          if (!position || disposed) continue;
          const marker = new api.Marker({ position, title: place.name, anchor: "bottom-center" });
          marker.on("click", () => setSelectedId(place.id));
          markers.push(marker);
          positions.push(position);
        }
        map.add(markers);
        if (markers.length === 1) map.setZoomAndCenter(12, positions[0]);
        else if (markers.length > 1) map.setFitView(markers, false, [70, 70, 70, 70], 11);
        setMapState("ready");
      })
      .catch(() => setMapState("error"));

    return () => {
      disposed = true;
      map?.destroy();
    };
  }, [apiKey, places, securityCode]);

  return (
    <section className="amap-section">
      <div className="amap-canvas-wrap">
        <div className="amap-canvas" ref={container} aria-label="已确认地点地图" />
        {mapState !== "ready" && (
          <div className="amap-fallback">
            <MapPin size={29} />
            <h2>{mapState === "missing-key" ? "高德地图等待配置" : mapState === "error" ? "地图暂时无法加载" : "正在加载高德地图"}</h2>
            <p>{mapState === "missing-key" ? "SDK 已接入。配置公开 Web JS Key 后，已确认地点会自动在地图上打点。" : "地点内容仍然可以在下方浏览。"}</p>
            <div>{places.map((place) => <button type="button" onClick={() => setSelectedId(place.id)} key={place.id}><MapPin size={14} />{place.name}</button>)}</div>
          </div>
        )}
      </div>

      {selected && (
        <article className="map-place-detail">
          <header><div><span>{selected.type}</span><h2>{selected.name}</h2><p>{selected.adminArea}</p></div><small>{selected.coordinate?.system}</small></header>
          <div className="map-place-events">
            {selected.visits.map((visit) => (
              <a href={`/journal/diary/${visit.sourceDate}`} key={`${selected.id}-${visit.date}`}>
                <time>{visit.date}</time><span>{visit.summary}</span><ExternalLink size={14} />
              </a>
            ))}
          </div>
        </article>
      )}

      <p className="map-agent-tip"><MessageCircleMore size={16} />地点确认和坐标修订仍通过 Life Journal Skill 与 Agent 对话完成。</p>
    </section>
  );
}
