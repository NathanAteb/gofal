"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { useLearnWelsh } from "@/lib/i18n/learn-welsh";
import { counties } from "@/lib/utils/counties";

function LearnWelshToggle() {
  const { enabled, toggle } = useLearnWelsh();
  const { locale } = useI18n();

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-full border border-primary-light/30 px-3 py-1.5 text-xs text-primary-light/80 transition-colors hover:bg-primary-light/10 hover:text-white"
      aria-label={enabled ? "Disable Welsh learning tooltips" : "Enable Welsh learning tooltips"}
    >
      <span className={`relative inline-block h-4 w-7 rounded-full transition-colors ${enabled ? "bg-accent" : "bg-primary-light/30"}`}>
        <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${enabled ? "translate-x-3.5" : "translate-x-0.5"}`} />
      </span>
      {locale === "cy" ? "Dysgu Cymraeg" : "Learn Welsh"}
    </button>
  );
}

export function Footer() {
  const { locale, t } = useI18n();

  return (
    <footer className="border-t border-blush-grey bg-primary-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="text-xl font-heading font-bold">
              gofal<span className="text-secondary">.wales</span>
            </Link>
            <p className="mt-3 text-sm text-primary-light leading-relaxed">
              {t("footer.description")}
            </p>
            <p className="mt-2 text-xs text-primary-light/70">
              {t("footer.built_by")}
            </p>
            <a href="mailto:hello@gofal.wales" className="mt-3 inline-block text-sm text-primary-light hover:text-white transition-colors">
              hello@gofal.wales
            </a>
            <div className="mt-3 flex gap-3">
              <a href="https://linkedin.com/company/gofal-wales" target="_blank" rel="noopener noreferrer" className="text-primary-light hover:text-white transition-colors" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://twitter.com/gofalwales" target="_blank" rel="noopener noreferrer" className="text-primary-light hover:text-white transition-colors" aria-label="X / Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* Directory - Counties */}
          <div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white">
              {t("footer.directory")}
            </h3>
            <ul className="mt-3 space-y-1.5">
              {counties.slice(0, 11).map((county) => (
                <li key={county.slug}>
                  <Link
                    href={`/cartrefi-gofal/${county.slug}`}
                    className="text-sm text-primary-light/80 transition-colors hover:text-white"
                  >
                    {locale === "cy" ? county.name_cy : county.name_en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-body font-semibold text-[13px] uppercase tracking-[0.08em] text-white/60">
              {locale === "cy" ? "Siroedd eraill" : "More counties"}
            </h3>
            <ul className="mt-3 space-y-1.5">
              {counties.slice(11).map((county) => (
                <li key={county.slug}>
                  <Link
                    href={`/cartrefi-gofal/${county.slug}`}
                    className="text-sm text-primary-light/80 transition-colors hover:text-white"
                  >
                    {locale === "cy" ? county.name_cy : county.name_en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information & Legal */}
          <div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white">
              {t("footer.information")}
            </h3>
            <ul className="mt-3 space-y-1.5">
              <li>
                <Link href="/canllawiau" className="text-sm text-primary-light/80 transition-colors hover:text-white">
                  {t("nav.guides")}
                </Link>
              </li>
              <li>
                <Link href="/darparwyr" className="text-sm text-primary-light/80 transition-colors hover:text-white">
                  {t("nav.providers")}
                </Link>
              </li>
              <li>
                <Link href="/amdanom" className="text-sm text-primary-light/80 transition-colors hover:text-white">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href="/cysylltu" className="text-sm text-primary-light/80 transition-colors hover:text-white">
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>

            <h3 className="mt-6 font-heading font-bold text-sm uppercase tracking-wider text-white">
              {t("footer.legal")}
            </h3>
            <ul className="mt-3 space-y-1.5">
              <li>
                <Link href="/preifatrwydd" className="text-sm text-primary-light/80 transition-colors hover:text-white">
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link href="/telerau" className="text-sm text-primary-light/80 transition-colors hover:text-white">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link href="/cwcis" className="text-sm text-primary-light/80 transition-colors hover:text-white">
                  {t("footer.cookies")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Data attribution + trust */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-[11px] text-primary-light/50">
          <span>Data: Arolygiaeth Gofal Cymru (OGL v3.0)</span>
          <span>·</span>
          <a href="https://www.trustpilot.com/review/gofal.wales" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
            {locale === "cy" ? "Graddiwch ni ar Trustpilot" : "Rate us on Trustpilot"} &rarr;
          </a>
        </div>

        <div className="mt-6 border-t border-primary-light/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-primary-light/60">
          <span>{t("footer.copyright")}</span>
          <LearnWelshToggle />
        </div>
      </div>
    </footer>
  );
}
