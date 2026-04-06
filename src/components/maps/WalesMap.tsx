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
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

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
      {/* Tooltip */}
      {hoveredSlug && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg bg-primary-dark px-3 py-2 text-sm text-white shadow-modal transition-opacity"
          style={{
            left: `${((tooltipPos?.x || 0) / WALES_SVG_WIDTH) * 100}%`,
            top: `${((tooltipPos?.y || 0) / WALES_SVG_HEIGHT) * 100}%`,
            transform: "translate(-50%, -120%)",
          }}
        >
          <p className="font-heading font-bold text-secondary">
            {getCountyName(hoveredSlug)}
          </p>
          {countyCounts[hoveredSlug] !== undefined && countyCounts[hoveredSlug] > 0 && (
            <p className="text-xs text-primary-light">
              {countyCounts[hoveredSlug]} {locale === "cy" ? "cartref gofal" : "care homes"}
            </p>
          )}
        </div>
      )}

      {/* SVG Map */}
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
                onMouseEnter={(e) => {
                  setHoveredSlug(county.slug);
                  setTooltipPos({ x: county.center[0], y: county.center[1] });
                }}
                onMouseLeave={() => {
                  setHoveredSlug(null);
                  setTooltipPos(null);
                }}
                onFocus={() => {
                  setHoveredSlug(county.slug);
                  setTooltipPos({ x: county.center[0], y: county.center[1] });
                }}
                onBlur={() => {
                  setHoveredSlug(null);
                  setTooltipPos(null);
                }}
                onClick={() => handleClick(county.slug)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClick(county.slug);
                  }
                }}
              />
              {/* County label (visible on larger screens) */}
              {isHovered && (
                <text
                  x={county.center[0]}
                  y={county.center[1]}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="pointer-events-none fill-white font-heading text-[10px] font-bold"
                >
                  {getCountyName(county.slug)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
