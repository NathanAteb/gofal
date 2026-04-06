"use client";

import { useI18n } from "@/lib/i18n/context";

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="inline-flex items-center rounded-full border border-blush-grey bg-ivory p-[3px]" role="radiogroup" aria-label="Language / Iaith">
      <button
        onClick={() => setLocale("cy")}
        className={`rounded-full px-3.5 py-1.5 text-[13px] font-body transition-all duration-150 ${
          locale === "cy"
            ? "bg-dark-heather text-white font-semibold"
            : "text-muted-plum font-normal hover:text-dark-heather"
        }`}
        role="radio"
        aria-checked={locale === "cy"}
        aria-label="Cymraeg"
      >
        CY
      </button>
      <button
        onClick={() => setLocale("en")}
        className={`rounded-full px-3.5 py-1.5 text-[13px] font-body transition-all duration-150 ${
          locale === "en"
            ? "bg-dark-heather text-white font-semibold"
            : "text-muted-plum font-normal hover:text-dark-heather"
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
