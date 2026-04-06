"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { SearchBar } from "@/components/forms/SearchBar";
import { counties } from "@/lib/utils/counties";

export default function HomePage() {
  const { locale, t } = useI18n();

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "gofal.wales",
            url: "https://gofal.wales",
            description: t("meta.home_description"),
            potentialAction: {
              "@type": "SearchAction",
              target: "https://gofal.wales/cartrefi-gofal?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary-dark py-20 text-white sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-dark opacity-90" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-light sm:text-xl">
            {t("hero.subtitle")}
          </p>
          <div className="mx-auto mt-8 max-w-2xl">
            <SearchBar size="lg" />
          </div>
          <p className="mt-4 text-sm text-primary-light/70">
            {t("hero.browse_counties")}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="-mt-8 relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: "1,000+", label: t("stats.care_homes") },
            { value: "22", label: t("stats.counties") },
            { value: "100%", label: t("stats.welsh_language") },
            { value: "100%", label: t("stats.free_service") },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-[16px] border border-blush-grey bg-white p-4 text-center shadow-card"
            >
              <p className="font-heading text-2xl font-bold text-primary sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-muted-plum sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <h2 className="text-center font-heading text-3xl font-bold sm:text-4xl">
          {t("how.title")}
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {[
            {
              step: "1",
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              ),
              title: t("how.step1.title"),
              desc: t("how.step1.desc"),
            },
            {
              step: "2",
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              ),
              title: t("how.step2.title"),
              desc: t("how.step2.desc"),
            },
            {
              step: "3",
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
              ),
              title: t("how.step3.title"),
              desc: t("how.step3.desc"),
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                {item.icon}
              </div>
              <h3 className="mt-4 font-heading text-xl font-bold">
                {item.title}
              </h3>
              <p className="mt-2 text-muted-plum">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Browse by County */}
      <section className="bg-linen py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center font-heading text-3xl font-bold sm:text-4xl">
            {locale === "cy"
              ? "Porwch yn ôl sir"
              : "Browse by county"}
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {counties.map((county) => (
              <Link
                key={county.slug}
                href={`/cartrefi-gofal/${county.slug}`}
                className="group rounded-[16px] border border-blush-grey bg-white p-4 shadow-card transition-all hover:shadow-modal hover:border-primary"
              >
                <p className="font-heading font-bold text-dusk group-hover:text-primary transition-colors">
                  {locale === "cy" ? county.name_cy : county.name_en}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Founding Story */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <h2 className="font-heading text-3xl font-bold sm:text-4xl">
          {t("story.title")}
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-muted-plum">
          {t("story.paragraph1")}
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted-plum">
          {t("story.paragraph2")}
        </p>
        <p className="mt-6 font-heading font-bold text-primary">
          {t("story.author")}
        </p>
      </section>

      {/* CTA */}
      <section className="bg-secondary py-16 text-center text-white sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">
            {locale === "cy"
              ? "Barod i ddechrau chwilio?"
              : "Ready to start searching?"}
          </h2>
          <p className="mt-4 text-lg text-white/80">
            {locale === "cy"
              ? "Mae pob cartref gofal yng Nghymru ar gofal.wales — am ddim."
              : "Every care home in Wales is on gofal.wales — for free."}
          </p>
          <Link
            href="/cartrefi-gofal"
            className="mt-8 inline-block rounded-full bg-white px-8 py-4 font-body text-lg font-bold text-secondary transition-colors hover:bg-ivory"
          >
            {t("hero.search_button")}
          </Link>
        </div>
      </section>
    </>
  );
}
