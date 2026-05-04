"use client";

import dynamic from "next/dynamic";

const AdultCareHomesMap = dynamic(
  () => import("@/components/maps/AdultCareHomesMap").then((m) => m.AdultCareHomesMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full flex items-center justify-center"
        style={{ height: "calc(100vh - 180px)", minHeight: 520, background: "#FBF7F3" }}
      >
        <div style={{ color: "#7B5B7E", fontFamily: "Nunito,system-ui,sans-serif" }}>Loading map…</div>
      </div>
    ),
  }
);

export function MapClient() {
  return <AdultCareHomesMap />;
}
