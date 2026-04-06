"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";

export function NearMeButton() {
  const { locale } = useI18n();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleClick() {
    if (!navigator.geolocation) return;

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        router.push(
          `/cartrefi-gofal?lat=${latitude}&lng=${longitude}&sort=distance`
        );
        setLoading(false);
      },
      () => {
        setLoading(false);
      },
      { timeout: 10000 }
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full border border-blush-grey bg-white px-4 py-2 text-sm font-body font-semibold text-muted-plum transition-colors hover:bg-ivory disabled:opacity-50"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      </svg>
      {loading
        ? locale === "cy"
          ? "Yn chwilio..."
          : "Searching..."
        : locale === "cy"
        ? "Ger fi"
        : "Near me"}
    </button>
  );
}
