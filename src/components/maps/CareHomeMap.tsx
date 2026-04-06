"use client";

import { useEffect, useRef } from "react";
import type { CareHome } from "@/types/database";

interface CareHomeMapProps {
  lat: number;
  lng: number;
  name: string;
  zoom?: number;
}

export function CareHomeMap({ lat, lng, name, zoom = 15 }: CareHomeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamic import to avoid SSR issues
    import("leaflet").then((L) => {

      const map = L.map(mapRef.current!, {
        scrollWheelZoom: false,
      }).setView([lat, lng], zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        className: "care-home-marker",
        html: `<div style="background:#7B5B7E;width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/></svg>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      L.marker([lat, lng], { icon }).addTo(map).bindPopup(name);

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, name, zoom]);

  return <div ref={mapRef} className="h-full w-full rounded-[16px]" />;
}

interface DirectoryMapProps {
  homes: (CareHome & { care_home_profiles?: any })[];
  onMarkerClick?: (slug: string) => void;
}

export function DirectoryMap({ homes, onMarkerClick }: DirectoryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clean up previous
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const validHomes = homes.filter((h) => h.lat && h.lng);
    if (validHomes.length === 0) return;

    import("leaflet").then((L) => {

      // Center on Wales
      const map = L.map(mapRef.current!, {
        scrollWheelZoom: false,
      }).setView([52.1307, -3.7837], 8);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        className: "care-home-marker",
        html: `<div style="background:#7B5B7E;width:24px;height:24px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      });

      const bounds: [number, number][] = [];

      validHomes.forEach((home) => {
        const marker = L.marker([home.lat!, home.lng!], { icon })
          .addTo(map)
          .bindPopup(
            `<strong>${home.name}</strong><br>${home.town}<br><a href="/cartrefi-gofal/${home.slug}" style="color:#7B5B7E">View profile →</a>`
          );

        if (onMarkerClick) {
          marker.on("click", () => onMarkerClick(home.slug));
        }

        bounds.push([home.lat!, home.lng!]);
      });

      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [30, 30] });
      }

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [homes, onMarkerClick]);

  return <div ref={mapRef} className="h-full w-full rounded-[16px]" />;
}
