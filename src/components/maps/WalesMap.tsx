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
    <svg
      viewBox={`0 0 ${WALES_SVG_WIDTH} ${WALES_SVG_HEIGHT}`}
      className="mx-auto block h-auto w-full max-w-lg"
      role="img"
      aria-label={locale === "cy" ? "Map o Gymru yn dangos 22 sir" : "Map of Wales showing 22 counties"}
    >
      {countyPaths.map((county) => {
        const isHovered = hoveredSlug === county.slug;

        return (
          <g
            key={county.slug}
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
            className="cursor-pointer"
            role="link"
            tabIndex={0}
            aria-label={`${getCountyName(county.slug)}${countyCounts[county.slug] ? ` — ${countyCounts[county.slug]} ${locale === "cy" ? "cartref gofal" : "care homes"}` : ""}`}
          >
            <path
              d={county.path}
              fill={isHovered ? "#7B5B7E" : "#FBF7F3"}
              stroke="#DDD4CE"
              strokeWidth={1}
              className="transition-colors duration-150"
            />
            <text
              x={county.center[0]}
              y={county.center[1]}
              textAnchor="middle"
              dominantBaseline="central"
              className="pointer-events-none select-none"
              fill={isHovered ? "#FFFFFF" : "#6B5C6B"}
              fontSize={isHovered ? 11 : 8}
              fontWeight={isHovered ? 700 : 600}
              fontFamily="var(--font-poppins), sans-serif"
              opacity={isHovered ? 1 : 0.6}
            >
              {getCountyName(county.slug)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
