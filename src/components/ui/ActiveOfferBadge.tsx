"use client";

import { useI18n } from "@/lib/i18n/context";

interface ActiveOfferBadgeProps {
  level: number;
  size?: "sm" | "md";
}

export function ActiveOfferBadge({ level, size = "sm" }: ActiveOfferBadgeProps) {
  const { t } = useI18n();

  const labels = [
    t("profile.active_offer_0"),
    t("profile.active_offer_1"),
    t("profile.active_offer_2"),
    t("profile.active_offer_3"),
  ];

  const label = labels[level] || labels[0];
  const stars = level;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-body font-semibold ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      } ${
        level >= 2
          ? "bg-accent/20 text-accent"
          : level === 1
          ? "bg-accent/10 text-accent/70"
          : "bg-linen text-muted-plum"
      }`}
      title={`${t("profile.active_offer")} — ${label}`}
    >
      {Array.from({ length: 3 }, (_, i) => (
        <svg
          key={i}
          width={size === "sm" ? 12 : 14}
          height={size === "sm" ? 12 : 14}
          viewBox="0 0 24 24"
          fill={i < stars ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      {size === "md" && <span className="ml-0.5">{label}</span>}
    </span>
  );
}
