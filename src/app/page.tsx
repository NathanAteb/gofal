"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import * as m from "motion/react-client";
import { useI18n } from "@/lib/i18n/context";
import { SearchBar } from "@/components/forms/SearchBar";
import { WalesMap } from "@/components/maps/WalesMap";
import { WelshWord } from "@/components/ui/WelshWord";
import { counties } from "@/lib/utils/counties";

// Shared animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

const staggerChildren = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function HomePage() {
  const { locale, t } = useI18n();
  const [countyCounts, setCountyCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/api/search?per_page=1")
      .then((r) => r.json())
      .then((data) => {
        counties.forEach((c) => {
          fetch(`/api/search?county=${c.slug}&per_page=1`)
            .then((r) => r.json())
            .then((d) => {
              if (d.total > 0) {
                setCountyCounts((prev) => ({ ...prev, [c.slug]: d.total }));
              }
            })
            .catch(() => {});
        });
      })
      .catch(() => {});
  }, []);

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

      {/* ═══════════════════════════════════════════
          HERO — staggered fade-up on headline, subtitle, search
         ═══════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden py-20 text-white sm:py-28"
        style={{ background: "linear-gradient(135deg, #4A2F4E 0%, #7B5B7E 40%, #A68AAB 70%, #7B5B7E 100%)" }}
      >
        {/* Animated decorative shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <m.div
            className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5"
            animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.08, 0.05] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <m.div
            className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-white/5"
            animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.07, 0.05] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          <m.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-white/[0.02]"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          />
        </div>

        <m.div
          className="relative mx-auto max-w-4xl px-4 text-center sm:px-6"
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          <m.h1
            className="font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {t("hero.title")}
          </m.h1>
          <m.p
            className="mx-auto mt-4 max-w-2xl text-lg text-primary-light sm:text-xl"
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {t("hero.subtitle")}
          </m.p>
          <m.div
            className="mx-auto mt-8 max-w-2xl"
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <SearchBar size="lg" />
          </m.div>
          <m.p
            className="mt-4 text-sm text-primary-light/70"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {t("hero.browse_counties")}
          </m.p>
        </m.div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS — staggered scale-in from below hero
         ═══════════════════════════════════════════ */}
      <section className="-mt-8 relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <m.div
          className="grid grid-cols-2 gap-4 sm:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerChildren}
        >
          {[
            { value: "1,000+", label: t("stats.care_homes"), en: "Care homes" },
            { value: "22", label: t("stats.counties"), en: "Counties" },
            { value: "CIW", label: locale === "cy" ? "Data wedi'i wirio" : "Verified data", en: "Verified data" },
            { value: "🏴", label: locale === "cy" ? "Cymraeg yn gyntaf" : "Welsh first", en: "Welsh first" },
          ].map((stat) => (
            <m.div
              key={stat.label}
              className="rounded-[16px] border border-blush-grey bg-white p-4 text-center shadow-card"
              variants={scaleIn}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ y: -4, boxShadow: "0 20px 60px rgba(44,36,48,0.12)" }}
            >
              <p className="font-heading text-2xl font-bold text-primary sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-muted-plum sm:text-sm">
                <WelshWord en={stat.en}>{stat.label}</WelshWord>
              </p>
            </m.div>
          ))}
        </m.div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS — staggered fade-up on scroll
         ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <m.h2
          className="text-center font-heading text-3xl font-bold sm:text-4xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <WelshWord en="How it works">{t("how.title")}</WelshWord>
        </m.h2>
        <m.div
          className="mt-12 grid gap-8 sm:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerChildren}
        >
          {[
            {
              step: "1",
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
              ),
              title: t("how.step1.title"), title_en: "Search",
              desc: t("how.step1.desc"),
            },
            {
              step: "2",
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                </svg>
              ),
              title: t("how.step2.title"), title_en: "Compare",
              desc: t("how.step2.desc"),
            },
            {
              step: "3",
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
              ),
              title: t("how.step3.title"), title_en: "Connect",
              desc: t("how.step3.desc"),
            },
          ].map((item) => (
            <m.div
              key={item.step}
              className="text-center"
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <m.div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(123,91,126,0.2)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {item.icon}
              </m.div>
              <h3 className="mt-4 font-heading text-xl font-bold">
                <WelshWord en={item.title_en}>{item.title}</WelshWord>
              </h3>
              <p className="mt-2 text-muted-plum">{item.desc}</p>
            </m.div>
          ))}
        </m.div>
      </section>

      {/* ═══════════════════════════════════════════
          WALES MAP — fade in on scroll
         ═══════════════════════════════════════════ */}
      <section className="bg-linen py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <m.h2
            className="text-center font-heading text-3xl font-bold sm:text-4xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            {locale === "cy"
              ? <WelshWord en="Browse by county">Porwch yn ôl sir</WelshWord>
              : "Browse by county"}
          </m.h2>
          <m.p
            className="mt-3 text-center text-muted-plum"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {locale === "cy"
              ? "Cliciwch ar sir i weld cartrefi gofal yn yr ardal"
              : "Click a county to see care homes in the area"}
          </m.p>

          {/* Map — scale in */}
          <m.div
            className="mt-10 hidden sm:block"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          >
            <WalesMap countyCounts={countyCounts} />
          </m.div>

          {/* County list for mobile — staggered */}
          <m.div
            className="mt-8 grid grid-cols-2 gap-2 sm:hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            {counties.map((county) => (
              <m.div key={county.slug} variants={fadeUp} transition={{ duration: 0.4 }}>
                <Link
                  href={`/cartrefi-gofal/${county.slug}`}
                  className="block rounded-[12px] border border-blush-grey bg-white px-3 py-2.5 text-sm font-body font-semibold text-dusk transition-colors hover:bg-primary hover:text-white"
                >
                  {locale === "cy" ? county.name_cy : county.name_en}
                  {countyCounts[county.slug] > 0 && (
                    <span className="ml-1 text-xs text-muted-plum">({countyCounts[county.slug]})</span>
                  )}
                </Link>
              </m.div>
            ))}
          </m.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOUNDING STORY — slide in from sides
         ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 overflow-hidden">
        <div className="grid gap-10 items-center md:grid-cols-2">
          <m.div
            className="relative h-64 md:h-80 rounded-[24px] overflow-hidden"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80&fm=webp&fit=crop"
              alt="Cymuned Gymreig / Welsh community"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </m.div>
          <m.div
            className="text-center md:text-left"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          >
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              <WelshWord en="Why gofal.wales?">{t("story.title")}</WelshWord>
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
          </m.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA — fade up with button spring
         ═══════════════════════════════════════════ */}
      <section className="bg-secondary py-16 text-center text-white sm:py-20">
        <m.div
          className="mx-auto max-w-2xl px-4 sm:px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <m.h2
            className="font-heading text-3xl font-bold sm:text-4xl"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            {locale === "cy"
              ? "Barod i ddechrau chwilio?"
              : "Ready to start searching?"}
          </m.h2>
          <m.p
            className="mt-4 text-lg text-white/80"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            {locale === "cy"
              ? "Mae pob cartref gofal yng Nghymru ar gofal.wales — am ddim."
              : "Every care home in Wales is on gofal.wales — for free."}
          </m.p>
          <m.div variants={fadeUp} transition={{ duration: 0.6 }}>
            <m.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="inline-block"
            >
              <Link
                href="/cartrefi-gofal"
                className="mt-8 inline-block rounded-full bg-white px-8 py-4 font-body text-lg font-bold text-secondary transition-colors hover:bg-ivory"
              >
                {t("hero.search_button")}
              </Link>
            </m.div>
          </m.div>
        </m.div>
      </section>
    </>
  );
}
