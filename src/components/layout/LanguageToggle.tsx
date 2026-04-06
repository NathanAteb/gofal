"use client";

import { useI18n } from "@/lib/i18n/context";

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="inline-flex items-center rounded-full border border-blush-grey bg-ivory p-0.5" role="radiogroup" aria-label="Language / Iaith">
      <button
        onClick={() => setLocale("cy")}
        className={`rounded-full px-3 py-1 text-xs font-body font-bold transition-colors ${
          locale === "cy"
            ? "bg-primary text-white"
            : "text-dusk hover:text-primary"
        }`}
        role="radio"
        aria-checked={locale === "cy"}
        aria-label="Cymraeg"
      >
        CY
      </button>
      <button
        onClick={() => setLocale("en")}
        className={`rounded-full px-3 py-1 text-xs font-body font-bold transition-colors ${
          locale === "en"
            ? "bg-primary text-white"
            : "text-dusk hover:text-primary"
        }`}
        role="radio"
        aria-checked={locale === "en"}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}
