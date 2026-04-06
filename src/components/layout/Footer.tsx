"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { counties } from "@/lib/utils/counties";

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
          </div>

          {/* Directory - Counties */}
          <div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-secondary">
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
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-secondary">
              &nbsp;
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
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-secondary">
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

            <h3 className="mt-6 font-heading font-bold text-sm uppercase tracking-wider text-secondary">
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

        <div className="mt-10 border-t border-primary-light/20 pt-6 text-center text-xs text-primary-light/60">
          {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
}
