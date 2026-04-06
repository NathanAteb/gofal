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
      {/* Language indicator */}
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold leading-none" aria-hidden="true">
        {locale === "cy" ? "EN" : "CY"}
      </span>
      {t("nav.language")}
    </button>
  );
}
