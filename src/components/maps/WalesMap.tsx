"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { counties } from "@/lib/utils/counties";
import { countyPaths, WALES_SVG_WIDTH, WALES_SVG_HEIGHT } from "./wales-paths";

interface WalesMapProps {
  countyCounts?: Record<string, number>;
}

export function WalesMap({ countyCounts = {} }: WalesMapProps) {
  const { locale } = useI18n();
  const router = useRouter();
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const handleClick = useCallback(
    (slug: string) => {
      router.push(`/cartrefi-gofal/${slug}`);
    },
    [router]
  );

  const getCountyName = (slug: string): string => {
    const county = counties.find((c) => c.slug === slug);
    if (!county) return slug;
    return locale === "cy" ? county.name_cy : county.name_en;
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <svg
        viewBox={`0 0 ${WALES_SVG_WIDTH} ${WALES_SVG_HEIGHT}`}
        className="w-full h-auto"
        role="img"
        aria-label={locale === "cy" ? "Map o Gymru yn dangos 22 sir" : "Map of Wales showing 22 counties"}
      >
        {countyPaths.map((county) => {
          const isHovered = hoveredSlug === county.slug;

          return (
            <g key={county.slug}>
              <path
                d={county.path}
                fill={isHovered ? "#7B5B7E" : "#FBF7F3"}
                stroke="#DDD4CE"
                strokeWidth={isHovered ? 2 : 1}
                className="cursor-pointer transition-colors duration-150"
                role="link"
                tabIndex={0}
                aria-label={`${getCountyName(county.slug)}${countyCounts[county.slug] ? ` — ${countyCounts[county.slug]} ${locale === "cy" ? "cartref gofal" : "care homes"}` : ""}`}
                onMouseEnter={() => setHoveredSlug(county.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
                onFocus={() => setHoveredSlug(county.slug)}
                onBlur={() => setHoveredSlug(null)}
                onClick={() => handleClick(county.slug)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClick(county.slug);
                  }
                }}
              />
              {/* Subtle inline label */}
              <text
                x={county.center[0]}
                y={county.center[1]}
                textAnchor="middle"
                dominantBaseline="central"
                className={`pointer-events-none font-heading font-bold transition-opacity duration-150 ${
                  isHovered
                    ? "fill-white text-[11px] opacity-100"
                    : "fill-muted-plum text-[8px] opacity-60"
                }`}
              >
                {getCountyName(county.slug)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
