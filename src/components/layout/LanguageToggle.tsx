"use client";

import { useI18n } from "@/lib/i18n/context";

export function LanguageToggle() {
  const { locale, setLocale, t } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === "cy" ? "en" : "cy")}
      className="inline-flex items-center gap-1.5 rounded-full border border-blush-grey bg-ivory px-3 py-1.5 text-sm font-body font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
      aria-label={locale === "cy" ? "Switch to English" : "Newid i Gymraeg"}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
      {t("nav.language")}
    </button>
  );
}
