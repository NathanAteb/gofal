"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import * as m from "motion/react-client";
import { useI18n } from "@/lib/i18n/context";
import { SearchBar } from "@/components/forms/SearchBar";
import { WalesMap } from "@/components/maps/WalesMap";
import { WelshWord } from "@/components/ui/WelshWord";
import { counties } from "@/lib/utils/counties";

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

      {/* ── 1. HERO ── Heather→Bramble gradient */}
      <section
        className="relative py-20 pb-28 text-white sm:py-28 sm:pb-36"
        style={{ background: "linear-gradient(135deg, #4A2F4E 0%, #7B5B7E 40%, #A68AAB 70%, #7B5B7E 100%)" }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <m.div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
          <m.div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-white/5" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }} />
        </div>
        <m.div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6" initial="hidden" animate="visible" variants={staggerChildren}>
          <m.h1 className="font-heading text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl" variants={fadeUp} transition={{ duration: 0.7 }}>
            {t("hero.title")}
          </m.h1>
          <m.p
            className="mx-auto mt-4 max-w-[480px] font-body font-normal text-white/[0.92]"
            style={{ fontSize: "20px", letterSpacing: "0.01em", lineHeight: 1.5 }}
            variants={fadeUp}
            transition={{ duration: 0.7 }}
          >
            {locale === "cy" ? "Dod o hyd i ofal Cymraeg — am ddim." : "Find Welsh-language care. Free."}
          </m.p>
          <m.div className="mx-auto mt-8 max-w-2xl" variants={fadeUp} transition={{ duration: 0.7 }}>
            <SearchBar size="lg" />
          </m.div>
          {/* P2: Concierge CTA */}
          <m.div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3" variants={fadeIn} transition={{ duration: 0.5, delay: 0.6 }}>
            <Link
              href="/cymorth"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/50 px-6 py-2.5 font-body font-semibold text-white transition-colors hover:bg-white hover:text-dusk"
            >
              {locale === "cy" ? "Neu cewch gymorth gan ein tîm" : "Or get help from our team"}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </m.div>
        </m.div>
      </section>

      {/* ── 2. STATS ── White bg */}
      <section className="-mt-8 relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <m.div className="grid grid-cols-2 gap-4 sm:grid-cols-4" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerChildren}>
          {[
            { value: "1,000+", label: locale === "cy" ? "Cartref gofal" : "Care homes", sub: locale === "cy" ? "Ar draws Cymru gyfan" : "Across all of Wales", en: "Care homes" },
            { value: "22", label: locale === "cy" ? "Sir" : "Counties", sub: locale === "cy" ? "Pob sir yng Nghymru" : "Every Welsh county", en: "Counties" },
            { value: locale === "cy" ? "Am ddim" : "Free", label: locale === "cy" ? "I deuluoedd" : "For families", sub: locale === "cy" ? "Bob amser, dim tâl" : "Always, no charge", en: "For families" },
            { value: locale === "cy" ? "Cymraeg" : "Welsh", label: locale === "cy" ? "Yn gyntaf" : "First", sub: locale === "cy" ? "Yr unig gyfeiriadur Cymraeg" : "The only Welsh directory", en: "First" },
          ].map((stat) => (
            <m.div
              key={stat.label}
              className="rounded-[16px] border border-blush-grey bg-white p-4 text-center shadow-card"
              variants={scaleIn}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -4, boxShadow: "0 20px 60px rgba(44,36,48,0.12)" }}
            >
              <p className="font-heading text-2xl font-bold text-primary sm:text-3xl">{stat.value}</p>
              <p className="mt-0.5 text-sm font-semibold text-dusk">
                <WelshWord en={stat.en}>{stat.label}</WelshWord>
              </p>
              <p className="mt-0.5 text-[11px] text-muted-plum">{stat.sub}</p>
            </m.div>
          ))}
        </m.div>
      </section>

      {/* ── 3. HOW IT WORKS ── Ivory bg */}
      <section className="bg-ivory py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <m.h2 className="text-center font-heading text-3xl font-bold sm:text-4xl" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <WelshWord en="How it works">{t("how.title")}</WelshWord>
          </m.h2>
          <m.div className="mt-12 grid gap-8 sm:grid-cols-3" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerChildren}>
            {[
              {
                icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>,
                title: t("how.step1.title"), title_en: "Search",
                desc: locale === "cy"
                  ? "Chwiliwch yn ôl lleoliad, math o ofal, neu ba gartrefi sy'n cynnig gofal Cymraeg. Mae pob cartref gofal yng Nghymru ar y cyfeiriadur hwn."
                  : "Search by location, care type, or Welsh language provision. Every regulated care home in Wales is listed here.",
              },
              {
                icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>,
                title: t("how.step2.title"), title_en: "Compare",
                desc: locale === "cy"
                  ? "Cymharwch raddfeydd CIW ar draws pedair thema, lefel y Cynnig Rhagweithiol, prisiau wythnosol, a gwasanaethau — ochr yn ochr."
                  : "Compare CIW inspection ratings across four themes, Active Offer level, weekly fees, and services — side by side.",
              },
              {
                icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>,
                title: t("how.step3.title"), title_en: "Connect",
                desc: locale === "cy"
                  ? "Anfonwch ymholiad yn uniongyrchol i'r cartref gofal, neu cewch gymorth gan ein tîm os yw'r broses yn teimlo'n llethol."
                  : "Send an enquiry directly to the care home, or get help from our team if the process feels overwhelming.",
              },
            ].map((item, i) => (
              <m.div key={i} className="text-center" variants={fadeUp} transition={{ duration: 0.6 }}>
                <m.div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {item.icon}
                </m.div>
                <h3 className="mt-4 font-heading text-xl font-bold">
                  <WelshWord en={item.title_en}>{item.title}</WelshWord>
                </h3>
                <p className="mx-auto mt-2 max-w-[240px] text-[15px] leading-[1.65] text-muted-plum">{item.desc}</p>
              </m.div>
            ))}
          </m.div>
        </div>
      </section>

      {/* ── 4. FOUNDING STORY ── Linen bg, ABOVE map (P3) */}
      <section className="bg-linen py-16 sm:py-24 overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-10 items-center md:grid-cols-2">
            <m.div
              className="text-center md:text-left"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
            >
              {/* Pull quote */}
              <div className="border-l-4 border-secondary pl-5 mb-6">
                <p className="font-heading text-[18px] font-semibold text-primary sm:text-[22px] leading-snug">
                  {locale === "cy"
                    ? "Roedd dod o hyd i ofal Cymraeg yn hunllef."
                    : "Finding Welsh-language care was a nightmare."}
                </p>
              </div>
              <h2 className="font-heading text-3xl font-bold sm:text-4xl">
                <WelshWord en="Why gofal.wales?">{t("story.title")}</WelshWord>
              </h2>
              <p className="mt-6 max-w-[560px] text-dusk leading-[1.8]" style={{ fontSize: "19px" }}>
                {t("story.paragraph1")}
              </p>
              <p className="mt-4 max-w-[560px] text-dusk leading-[1.8] mb-6" style={{ fontSize: "19px" }}>
                {t("story.paragraph2")}
              </p>
              <div className="mt-4">
                <p className="font-heading font-bold text-primary">{t("story.author")}</p>
                <p className="text-[14px] text-muted-plum">Ateb AI, Llanelli, Cymru</p>
              </div>
            </m.div>
            <m.div
              className="relative h-72 md:h-96 rounded-[24px] overflow-hidden"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80&fm=webp&fit=crop"
                alt="Cymuned Gymreig / Welsh community"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </m.div>
          </div>
        </div>
      </section>

      {/* ── 5. TRUST BANNER ── Honey stripe (P9) */}
      <div className="bg-accent py-3">
        <p className="text-center font-heading text-sm font-semibold text-dusk sm:text-base">
          <span className="mr-2 text-secondary">✓</span>
          {locale === "cy"
            ? "Mae ein gwasanaeth am ddim i deuluoedd — bob amser"
            : "Our service is free for families — always"}
        </p>
      </div>

      {/* ── 6. WALES MAP ── White bg (P6) */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <m.h2 className="text-center font-heading text-3xl font-bold sm:text-4xl" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}>
            {locale === "cy"
              ? <WelshWord en="Browse by county">Porwch yn ôl sir</WelshWord>
              : "Browse by county"}
          </m.h2>
          <m.p className="mt-3 text-center text-muted-plum" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ duration: 0.5, delay: 0.2 }}>
            {locale === "cy"
              ? "Cliciwch ar sir i weld cartrefi gofal yn yr ardal"
              : "Click a county to see care homes in the area"}
          </m.p>
          <m.div
            className="mt-10 hidden sm:block"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <WalesMap countyCounts={countyCounts} />
          </m.div>
          <m.div className="mt-8 grid grid-cols-2 gap-2 sm:hidden" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerChildren}>
            {counties.map((county) => (
              <m.div key={county.slug} variants={fadeUp} transition={{ duration: 0.4 }}>
                <Link
                  href={`/cartrefi-gofal/${county.slug}`}
                  className="block rounded-[12px] border border-blush-grey bg-ivory px-3 py-2.5 text-sm font-body font-semibold text-dusk transition-colors hover:bg-primary hover:text-white"
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

      {/* ── 7. CTA ── Heather bg (P6) */}
      <section className="bg-primary py-16 text-center text-white sm:py-20">
        <m.div className="mx-auto max-w-[640px] px-4 sm:px-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerChildren}>
          <m.h2 className="font-heading text-[26px] font-bold sm:text-[32px]" variants={fadeUp} transition={{ duration: 0.6 }}>
            {locale === "cy" ? "Barod i ddechrau chwilio?" : "Ready to start searching?"}
          </m.h2>
          <m.p className="mt-4 font-body text-[18px] text-white/[0.85]" variants={fadeUp} transition={{ duration: 0.6 }}>
            {locale === "cy"
              ? "Mae pob cartref gofal yng Nghymru ar gofal.wales — am ddim i deuluoedd bob amser. Dewch o hyd i gartref sy'n siarad Cymraeg yn eich ardal chi."
              : "Every care home in Wales is on gofal.wales — always free for families. Find a home that speaks Welsh in your area."}
          </m.p>
          <m.div variants={fadeUp} transition={{ duration: 0.6 }} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400 }}>
              <Link
                href="/cartrefi-gofal"
                className="inline-block rounded-full bg-secondary px-8 py-4 font-body text-[16px] font-bold text-white transition-colors hover:bg-secondary-hover"
              >
                {locale === "cy" ? "Dechrau chwilio nawr" : "Start searching now"}
              </Link>
            </m.div>
            <Link
              href="/cymorth"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/50 px-6 py-3 font-body font-semibold text-white transition-colors hover:bg-white hover:text-primary"
            >
              {locale === "cy" ? "Cael cymorth" : "Get help"} &rarr;
            </Link>
          </m.div>
        </m.div>
      </section>
    </>
  );
}
