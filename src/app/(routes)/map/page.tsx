import type { Metadata } from "next";
import { MapClient } from "./MapClient";

export const metadata: Metadata = {
  title: "Map of every adult care service in Wales · Map o bob gwasanaeth gofal oedolion yng Nghymru",
  description:
    "Interactive map of every adult care home, domiciliary provider and adult placement service registered with Care Inspectorate Wales. Filter by service type, click for operator and contact details.",
};

export default function MapPage() {
  return (
    <main className="min-h-screen" style={{ background: "#FBF7F3" }}>
      <header className="px-6 py-6 border-b" style={{ borderColor: "#DDD4CE" }}>
        <h1
          className="text-3xl md:text-4xl font-bold"
          style={{ fontFamily: "Poppins,system-ui,sans-serif", color: "#4A2F4E" }}
        >
          Cartrefi gofal oedolion Cymru
        </h1>
        <p className="mt-1 text-sm md:text-base" style={{ color: "#6B5670" }}>
          Every adult care service registered with Care Inspectorate Wales — care homes, domiciliary providers, and adult placement.
        </p>
      </header>
      <MapClient />
    </main>
  );
}
