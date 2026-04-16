"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { counties } from "@/lib/utils/counties";
import { countyPaths, WALES_SVG_WIDTH, WALES_SVG_HEIGHT } from "./wales-paths";

interface WalesMapProps {
  countyCounts?: Record<string, number>;
  variant?: "default" | "hero";
}

export function WalesMap({ countyCounts = {}, variant = "default" }: WalesMapProps) {
  const { locale } = useI18n();
  const router = useRouter();
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [pulsingCounties, setPulsingCounties] = useState<string[]>([]);

  const isHero = variant === "hero";

  // Subtle pulse on 3 random counties on first load (hero only)
  useEffect(() => {
    if (!isHero) return;
    const slugs = countyPaths.map((c) => c.slug);
    const shuffled = slugs.sort(() => Math.random() - 0.5).slice(0, 3);
    setPulsingCounties(shuffled);
    const timer = setTimeout(() => setPulsingCounties([]), 3000);
    return () => clearTimeout(timer);
  }, [isHero]);

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

  // Colours based on variant
  const defaultFill = isHero ? "rgba(255,255,255,0.15)" : "#FFFFFF";
  const hoverFill = isHero ? "#B5603A" : "#7B5B7E";
  const strokeColor = isHero ? "rgba(255,255,255,0.3)" : "#E5E7EB";
  const labelDefault = isHero ? "#FFFFFF" : "#1A1A1A";
  const labelHover = "#FFFFFF";
  const labelOpacityDefault = isHero ? 0.7 : 0.6;

  return (
    <>
      <svg
        viewBox={`0 0 ${WALES_SVG_WIDTH} ${WALES_SVG_HEIGHT}`}
        className={`mx-auto block h-auto w-full ${isHero ? "max-w-[380px] lg:max-w-[440px]" : "max-w-lg"}`}
        role="img"
        aria-label={locale === "cy" ? "Map o Gymru yn dangos 22 sir" : "Map of Wales showing 22 counties"}
      >
        <defs>
          {/* Pulse animation for hero */}
          {isHero && (
            <style>{`
              @keyframes countyPulse {
                0%, 100% { fill-opacity: 0.15; }
                50% { fill-opacity: 0.35; }
              }
              .county-pulse { animation: countyPulse 3s ease-in-out; }
            `}</style>
          )}
        </defs>
        {countyPaths.map((county) => {
          const isHovered = hoveredSlug === county.slug;
          const isPulsing = pulsingCounties.includes(county.slug) && !isHovered;

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
              className="cursor-pointer outline-none focus:outline-none"
              role="link"
              tabIndex={0}
              aria-label={`${getCountyName(county.slug)}${countyCounts[county.slug] ? ` — ${countyCounts[county.slug]} ${locale === "cy" ? "cartref gofal" : "care homes"}` : ""}`}
            >
              <path
                d={county.path}
                fill={isHovered ? hoverFill : defaultFill}
                stroke={strokeColor}
                strokeWidth={isHero ? 0.5 : 1}
                className={`transition-colors duration-150 ${isPulsing ? "county-pulse" : ""}`}
              />
              {/* Labels: hidden on mobile for hero, always hidden on mobile for default */}
              <text
                x={county.center[0]}
                y={county.center[1]}
                textAnchor="middle"
                dominantBaseline="central"
                className={`pointer-events-none select-none ${isHero ? "hidden md:block" : "hidden sm:block"}`}
                fill={isHovered ? labelHover : labelDefault}
                fontSize={isHovered ? 11 : 9}
                fontWeight={isHovered ? 700 : 400}
                fontFamily="var(--font-nunito), sans-serif"
                opacity={isHovered ? 1 : labelOpacityDefault}
              >
                {getCountyName(county.slug)}
              </text>
            </g>
          );
        })}
      </svg>
      {/* Screen reader accessible county list */}
      <ul className="sr-only">
        {countyPaths.map((county) => (
          <li key={county.slug}>
            <a href={`/cartrefi-gofal/${county.slug}`}>{getCountyName(county.slug)}</a>
          </li>
        ))}
      </ul>
    </>
  );
}
