"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl, { type Map as MLMap, type GeoJSONSource, type MapGeoJSONFeature } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface FeatureProps {
  urn: string;
  name: string;
  slug: string;
  serviceType: string;
  subType: string | null;
  addressLine1: string;
  addressLine2: string | null;
  town: string;
  postcode: string;
  localAuthority: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  language: string | null;
  maxPlaces: number | null;
  providerName: string | null;
  providerApprovedServices: number | null;
}

interface ApiPayload {
  type: "FeatureCollection";
  counts: { total: number; byBucket: Record<string, number> };
  features: Array<{
    type: "Feature";
    properties: FeatureProps;
    geometry: { type: "Point"; coordinates: [number, number] };
  }>;
}

const HEATHER = "#7B5B7E";
const CORAL = "#D4806A";
const HONEY = "#E5AD3E";
const BRAMBLE = "#4A2F4E";
const IVORY = "#FBF7F3";
const TEAL = "#4F8A8B";

type FilterKey = "all" | "nursing" | "residential" | "domiciliary" | "placement";

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "All" },
  { key: "nursing", label: "Nursing" },
  { key: "residential", label: "Residential" },
  { key: "domiciliary", label: "Domiciliary" },
  { key: "placement", label: "Adult placement" },
];

function matchesFilter(p: FeatureProps, key: FilterKey): boolean {
  switch (key) {
    case "all":
      return true;
    case "nursing":
      return p.serviceType === "Care Home Service" && p.subType === "Adults With Nursing";
    case "residential":
      return p.serviceType === "Care Home Service" && p.subType === "Adults Without Nursing";
    case "domiciliary":
      return p.serviceType === "Domiciliary Support Service";
    case "placement":
      return p.serviceType === "Adult Placement Service";
  }
}

function bucketCount(byBucket: Record<string, number>, key: FilterKey): number {
  switch (key) {
    case "all":
      return Object.values(byBucket).reduce((a, b) => a + b, 0);
    case "nursing":
      return byBucket["Care Home Service|Adults With Nursing"] ?? 0;
    case "residential":
      return byBucket["Care Home Service|Adults Without Nursing"] ?? 0;
    case "domiciliary":
      return byBucket["Domiciliary Support Service"] ?? 0;
    case "placement":
      return byBucket["Adult Placement Service"] ?? 0;
  }
}

export function AdultCareHomesMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const [payload, setPayload] = useState<ApiPayload | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/care-homes/adult")
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load (${r.status})`);
        return r.json();
      })
      .then((data: ApiPayload) => {
        if (!cancelled) setPayload(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/positron",
      center: [-3.85, 52.35],
      zoom: 7.2,
      minZoom: 6,
      maxBounds: [
        [-6.4, 51.0],
        [-1.7, 53.7],
      ],
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), "top-right");
    map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-left");
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const filteredFC = useMemo(() => {
    if (!payload) return null;
    const features = payload.features.filter((f) => matchesFilter(f.properties, filter));
    return { type: "FeatureCollection" as const, features };
  }, [payload, filter]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !filteredFC) return;

    const onReady = () => {
      const existing = map.getSource("homes") as GeoJSONSource | undefined;
      if (existing) {
        existing.setData(filteredFC);
        return;
      }

      map.addSource("homes", {
        type: "geojson",
        data: filteredFC,
        cluster: true,
        clusterMaxZoom: 12,
        clusterRadius: 45,
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "homes",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            HEATHER,
            10,
            CORAL,
            50,
            HONEY,
          ],
          "circle-radius": ["step", ["get", "point_count"], 18, 10, 24, 50, 32],
          "circle-stroke-width": 3,
          "circle-stroke-color": "#FFFFFF",
          "circle-opacity": 0.92,
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "homes",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["Noto Sans Bold"],
          "text-size": 13,
        },
        paint: { "text-color": "#FFFFFF" },
      });

      map.addLayer({
        id: "homes-points",
        type: "circle",
        source: "homes",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": [
            "match",
            ["get", "serviceType"],
            "Care Home Service",
              ["match",
                ["get", "subType"],
                "Adults With Nursing", CORAL,
                HEATHER,
              ],
            "Domiciliary Support Service", TEAL,
            "Adult Placement Service", HONEY,
            HEATHER,
          ],
          "circle-radius": 7,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#FFFFFF",
        },
      });

      map.on("click", "clusters", async (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
        const cluster = features[0] as MapGeoJSONFeature | undefined;
        const clusterId = cluster?.properties?.cluster_id as number | undefined;
        if (clusterId == null) return;
        const src = map.getSource("homes") as GeoJSONSource;
        const zoom = await src.getClusterExpansionZoom(clusterId);
        const coords = (cluster!.geometry as GeoJSON.Point).coordinates as [number, number];
        map.easeTo({ center: coords, zoom });
      });

      map.on("click", "homes-points", (e) => {
        const f = e.features?.[0];
        if (!f) return;
        const p = f.properties as unknown as FeatureProps;
        const coords = (f.geometry as GeoJSON.Point).coordinates.slice() as [number, number];
        const addr = [p.addressLine1, p.addressLine2, p.town, p.postcode].filter(Boolean).join(", ");

        const phoneRow = p.phone
          ? `<div style="margin-top:6px;"><a href="tel:${p.phone}" style="color:${HEATHER};text-decoration:none;font-weight:600;">📞 ${escapeHtml(p.phone)}</a></div>`
          : "";
        const webRow = p.website
          ? `<div><a href="${normaliseUrl(p.website)}" target="_blank" rel="noopener" style="color:${HEATHER};">${escapeHtml(p.website.replace(/^https?:\/\//, ""))}</a></div>`
          : "";
        const operatorBadge =
          p.providerApprovedServices && p.providerApprovedServices > 1
            ? `<div style="margin-top:8px;display:inline-block;background:${HONEY};color:${BRAMBLE};padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:700;">Multi-site operator · ${p.providerApprovedServices} services</div>`
            : "";
        const langBadge =
          p.language === "Welsh" || p.language === "Bilingual"
            ? `<span style="display:inline-block;margin-left:6px;background:${HEATHER};color:#fff;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:700;">🏴 ${p.language === "Bilingual" ? "Cymraeg + EN" : "Cymraeg"}</span>`
            : "";

        const typeLabel = p.serviceType === "Care Home Service"
          ? p.subType ?? "Care Home"
          : p.serviceType;

        const html = `
          <div style="font-family:Nunito,system-ui,sans-serif;color:${BRAMBLE};max-width:280px;">
            <div style="font-family:Poppins,system-ui,sans-serif;font-weight:700;font-size:15px;line-height:1.25;color:${BRAMBLE};">${escapeHtml(p.name)}</div>
            <div style="font-size:11px;color:#6B5670;margin-top:2px;">${escapeHtml(typeLabel)}${langBadge}</div>
            <div style="margin-top:8px;font-size:13px;line-height:1.4;">${escapeHtml(addr)}</div>
            ${phoneRow}
            ${webRow}
            <div style="margin-top:8px;font-size:12px;color:#6B5670;">
              ${p.providerName ? `<strong>Operator:</strong> ${escapeHtml(p.providerName)}<br/>` : ""}
              ${p.maxPlaces ? `<strong>Capacity:</strong> ${p.maxPlaces} places · ` : ""}<strong>LA:</strong> ${escapeHtml(p.localAuthority ?? "—")}
            </div>
            ${operatorBadge}
          </div>`;
        new maplibregl.Popup({ offset: 12, maxWidth: "320px" }).setLngLat(coords).setHTML(html).addTo(map);
      });

      map.on("mouseenter", "clusters", () => (map.getCanvas().style.cursor = "pointer"));
      map.on("mouseleave", "clusters", () => (map.getCanvas().style.cursor = ""));
      map.on("mouseenter", "homes-points", () => (map.getCanvas().style.cursor = "pointer"));
      map.on("mouseleave", "homes-points", () => (map.getCanvas().style.cursor = ""));
    };

    if (map.isStyleLoaded()) onReady();
    else map.once("load", onReady);
  }, [filteredFC]);

  const total = payload?.counts.total ?? 0;
  const counts = payload?.counts.byBucket ?? {};

  return (
    <div className="relative w-full" style={{ background: IVORY }}>
      <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "#DDD4CE" }}>
        {FILTERS.map((f) => {
          const active = filter === f.key;
          const c = bucketCount(counts, f.key);
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="text-sm font-semibold transition-colors"
              style={{
                background: active ? HEATHER : "#FFFFFF",
                color: active ? "#FFFFFF" : BRAMBLE,
                border: `1.5px solid ${active ? HEATHER : "#DDD4CE"}`,
                padding: "6px 14px",
                borderRadius: 9999,
              }}
            >
              {f.label} <span style={{ opacity: 0.75, marginLeft: 4 }}>· {c}</span>
            </button>
          );
        })}
        <div className="ml-auto text-xs" style={{ color: "#6B5670" }}>
          {total.toLocaleString()} mapped · live from Supabase · CIW public register
        </div>
      </div>

      <div ref={containerRef} className="w-full" style={{ height: "calc(100vh - 180px)", minHeight: 520 }} />

      {error && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-2xl px-4 py-2 text-sm" style={{ color: CORAL }}>
          {error}
        </div>
      )}

      <div
        className="absolute bottom-12 left-4 bg-white/95 rounded-2xl px-4 py-3 text-xs shadow-md"
        style={{ color: BRAMBLE, border: "1px solid #DDD4CE" }}
      >
        <div className="font-bold mb-1.5" style={{ fontFamily: "Poppins,system-ui,sans-serif" }}>Legend</div>
        <LegendDot color={HEATHER} label="Residential (no nursing)" />
        <LegendDot color={CORAL} label="Nursing care home" />
        <LegendDot color={TEAL} label="Domiciliary (home care)" />
        <LegendDot color={HONEY} label="Adult placement" />
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 leading-tight" style={{ marginTop: 2 }}>
      <span style={{ width: 10, height: 10, borderRadius: 9999, background: color, border: "2px solid white", boxShadow: "0 0 0 1px #DDD4CE" }} />
      <span>{label}</span>
    </div>
  );
}

function escapeHtml(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normaliseUrl(u: string): string {
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
}
