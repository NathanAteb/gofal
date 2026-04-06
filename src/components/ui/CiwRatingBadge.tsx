"use client";

import { useI18n } from "@/lib/i18n/context";
import type { TranslationKey } from "@/lib/i18n/translations";

interface CiwRatingBadgeProps {
  rating: string | null;
  size?: "sm" | "md";
}

const ratingColors: Record<string, string> = {
  excellent: "bg-green-100 text-green-800",
  good: "bg-blue-100 text-blue-800",
  adequate: "bg-amber-100 text-amber-800",
  poor: "bg-red-100 text-red-800",
};

export function CiwRatingBadge({ rating, size = "sm" }: CiwRatingBadgeProps) {
  const { t } = useI18n();

  if (!rating) {
    return (
      <span
        className={`inline-block rounded-full bg-linen text-muted-plum font-body font-semibold ${
          size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
        }`}
      >
        {t("rating.not_rated")}
      </span>
    );
  }

  const key = rating.toLowerCase();
  const translationKey = `rating.${key}` as TranslationKey;
  const colorClass = ratingColors[key] || "bg-linen text-muted-plum";

  return (
    <span
      className={`inline-block rounded-full font-body font-semibold ${colorClass} ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      }`}
    >
      {t(translationKey)}
    </span>
  );
}
