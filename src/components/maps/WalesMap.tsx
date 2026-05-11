"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { counties } from "@/lib/utils/counties";
import { countyPaths, WALES_SVG_WIDTH, WALES_SVG_HEIGHT } from "./wales-paths";

type WalesMapVariant = "default" | "hero" | "editorial";

interface WalesMapProps {
  countyCounts?: Record<string, number>;
  variant?: WalesMapVariant;
}

// Per-variant style atoms. Keeps the JSX one-pass and lets the editorial
// variant slot in without forking branches all over the file.
const STYLES = {
  default: {
    pathFill: "#FFFFFF",
    pathFillHover: "#7B5B7E",
    pathStroke: "#E5E7EB",
    pathStrokeWidth: 1,
    labelDefault: "#1A1A1A",
    labelHover: "#FFFFFF",
    labelOpacityDefault: 0.6,
    labelFontFamily: "var(--font-nunito), sans-serif",
    labelLetterSpacing: undefined as string | undefined,
    labelTransform: undefined as React.CSSProperties["textTransform"] | undefined,
    readout: false,
  },
  hero: {
    pathFill: "rgba(255,255,255,0.15)",
    pathFillHover: "#B5603A",
    pathStroke: "rgba(255,255,255,0.3)",
    pathStrokeWidth: 0.5,
    labelDefault: "#FFFFFF",
    labelHover: "#FFFFFF",
    labelOpacityDefault: 0.7,
    labelFontFamily: "var(--font-nunito), sans-serif",
    labelLetterSpacing: undefined,
    labelTransform: undefined,
    readout: false,
  },
  editorial: {
    pathFill: "#1A1A1A",
    pathFillOpacity: 0.88,
    pathFillHover: "#B5603A",
    pathStroke: "#FBF7F3",
    pathStrokeWidth: 0.6,
    pathStrokeWidthHover: 1.2,
    labelDefault: "#FBF7F3",
    labelHover: "#FFFFFF",
    labelOpacityDefault: 0.55,
    labelFontFamily: "var(--font-mono), ui-monospace, monospace",
    labelLetterSpacing: "0.04em",
    labelTransform: "uppercase" as const,
    readout: true,
  },
} as const;

export function WalesMap({ countyCounts = {}, variant = "default" }: WalesMapProps) {
  const { locale } = useI18n();
  const router = useRouter();
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [pulsingCounties, setPulsingCounties] = useState<string[]>([]);

  const isHero = variant === "hero";
  const isEditorial = variant === "editorial";
  const s = STYLES[variant];

  // Subtle pulse on 3 random counties on first load (hero + editorial).
  useEffect(() => {
    if (variant === "default") return;
    const slugs = countyPaths.map((c) => c.slug);
    const shuffled = [...slugs].sort(() => Math.random() - 0.5).slice(0, 3);
    setPulsingCounties(shuffled);
    const timer = setTimeout(() => setPulsingCounties([]), 3000);
    return () => clearTimeout(timer);
  }, [variant]);

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

  const hoveredName = hoveredSlug ? getCountyName(hoveredSlug) : null;
  const hoveredCount = hoveredSlug ? countyCounts[hoveredSlug] : undefined;

  const sizeClass = isHero
    ? "max-w-[380px] lg:max-w-[440px]"
    : isEditorial
    ? "max-w-[440px] lg:max-w-[520px]"
    : "max-w-lg";

  return (
    <>
      <svg
        viewBox={`0 0 ${WALES_SVG_WIDTH} ${WALES_SVG_HEIGHT}`}
        className={`mx-auto block h-auto w-full ${sizeClass}`}
        role="img"
        aria-label={
          locale === "cy"
            ? "Map o Gymru yn dangos 22 sir"
            : "Map of Wales showing 22 counties"
        }
      >
        <defs>
          {variant !== "default" && (
            <style>{`
              @keyframes countyPulse {
                0%, 100% { fill-opacity: ${isEditorial ? "0.88" : "0.15"}; }
                50% { fill-opacity: ${isEditorial ? "1" : "0.35"}; }
              }
              .county-pulse { animation: countyPulse 3s ease-in-out; }
            `}</style>
          )}
        </defs>
        {countyPaths.map((county) => {
          const isHovered = hoveredSlug === county.slug;
          const isPulsing = pulsingCounties.includes(county.slug) && !isHovered;
          const fill = isHovered ? s.pathFillHover : s.pathFill;
          const fillOpacity = isEditorial && !isHovered ? STYLES.editorial.pathFillOpacity : 1;
          const strokeWidth =
            isEditorial && isHovered ? STYLES.editorial.pathStrokeWidthHover : s.pathStrokeWidth;

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
              aria-label={`${getCountyName(county.slug)}${
                countyCounts[county.slug]
                  ? ` — ${countyCounts[county.slug]} ${locale === "cy" ? "cartref gofal" : "care homes"}`
                  : ""
              }`}
            >
              <path
                d={county.path}
                fill={fill}
                fillOpacity={fillOpacity}
                stroke={s.pathStroke}
                strokeWidth={strokeWidth}
                className={`transition-colors duration-150 ${isPulsing ? "county-pulse" : ""}`}
              />
              <text
                x={county.center[0]}
                y={county.center[1]}
                textAnchor="middle"
                dominantBaseline="central"
                className={`pointer-events-none select-none transition-opacity duration-200 ${
                  variant === "default" ? "hidden sm:block" : "hidden md:block"
                }`}
                fill={isHovered ? s.labelHover : s.labelDefault}
                fontSize={isHovered ? 11 : 9}
                fontWeight={isHovered ? 700 : 400}
                fontFamily={s.labelFontFamily}
                /* Editorial: labels are off by default — the top-left
                   readout names the hovered county, so the over-shape label
                   only appears on hover. Other variants keep their soft
                   always-on labels. */
                opacity={isHovered ? 1 : isEditorial ? 0 : s.labelOpacityDefault}
                style={{
                  letterSpacing: s.labelLetterSpacing,
                  textTransform: s.labelTransform,
                }}
              >
                {getCountyName(county.slug)}
              </text>
            </g>
          );
        })}

        {/* Editorial corner readout: shown only on hover; mono "County" label
            above the display-serif county name. Fixed position top-left. */}
        {isEditorial && hoveredName && (
          <g pointerEvents="none">
            <rect x={8} y={8} width={180} height={52} fill="#1A1A1A" />
            <text
              x={18}
              y={26}
              fill="#FBF7F3"
              opacity={0.55}
              fontSize={9}
              fontFamily="var(--font-mono), ui-monospace, monospace"
              style={{ letterSpacing: "0.12em", textTransform: "uppercase" }}
            >
              {locale === "cy" ? "Sir" : "County"}
              {hoveredCount ? `  ·  ${hoveredCount}` : ""}
            </text>
            <text
              x={18}
              y={48}
              fill="#FBF7F3"
              fontSize={16}
              fontFamily="var(--font-instrument-serif), serif"
              style={{ letterSpacing: "-0.01em" }}
            >
              {hoveredName}
            </text>
          </g>
        )}
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
