"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { SearchBar } from "@/components/forms/SearchBar";
import { WalesMap } from "@/components/maps/WalesMap";
import { counties } from "@/lib/utils/counties";

const WELSH_NOUNS: Array<{ cy: string; en: string }> = [
  { cy: "cartref", en: "home" },
  { cy: "gofal", en: "care" },
  { cy: "teulu", en: "family" },
  { cy: "cymuned", en: "community" },
];

export default function HomePage() {
  const { locale, t } = useI18n();
  const [countyCounts, setCountyCounts] = useState<Record<string, number>>({});
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setWordIdx((x) => (x + 1) % WELSH_NOUNS.length), 2600);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    counties.forEach((c) => {
      fetch(`/api/search?county=${c.slug}&per_page=1`)
        .then((r) => r.json())
        .then((d) => {
          if (d.total > 0) setCountyCounts((p) => ({ ...p, [c.slug]: d.total }));
        })
        .catch(() => {});
    });
  }, []);

  const word = WELSH_NOUNS[wordIdx];
  const cyLabel = (cy: string, en: string) => (locale === "cy" ? cy : en);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "gofal.wales",
            url: "https://gofal.wales",
            description: t("meta.home_description"),
          }),
        }}
      />

      {/* ── 1. HERO — editorial ivory ── */}
      <section className="relative bg-ivory px-6 pb-20 pt-12 lg:px-16">
        <div className="mb-9 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.15em] text-ink-60">
          <span>001 / {cyLabel("Cartref", "Home")}</span>
          <span>Est. Llanelli, Cymru — MMXXVI</span>
        </div>

        <div className="grid items-start gap-16 lg:grid-cols-[minmax(0,1fr)_520px]">
          <div>
            <h1 className="font-display text-[clamp(72px,9vw,148px)] font-normal leading-[0.92] tracking-[-0.03em] text-ink">
              {cyLabel("Mae ", "Finding ")}
              <span className="relative inline-block min-w-[3ch]">
                <span
                  key={wordIdx}
                  className="inline-block italic text-heather"
                  style={{ animation: "wordSwap 500ms cubic-bezier(.2,.8,.2,1)" }}
                >
                  {word.cy}
                </span>
              </span>
              <br />
              <span className="tracking-[-0.04em]">
                {cyLabel("yn iawn.", "is okay.")}
              </span>
            </h1>
            <p className="mt-8 max-w-[480px] text-[20px] leading-[1.5] text-ink">
              {locale === "cy"
                ? <>Pob cartref gofal rheoleiddiedig yng Nghymru — <i>/{word.cy}/</i> chwiliadwy, cymharadwy, ac am ddim i deuluoedd bob amser.</>
                : <>Every regulated care home in Wales — <i>/{word.en}/</i> searchable, comparable, and always free for families.</>}
            </p>

            <div className="mt-9 max-w-[560px]">
              <SearchBar size="lg" />
            </div>

            <div className="mt-14 grid max-w-md grid-cols-3 gap-10 border-t border-hairline pt-5 font-mono text-[11px] uppercase tracking-[0.08em]">
              <div>
                <div className="font-display text-[36px] normal-case leading-none tracking-[-0.02em] text-ink">1,024</div>
                <div className="mt-1.5 text-ink-60">{cyLabel("Cartrefi gofal", "Care homes")}</div>
              </div>
              <div>
                <div className="font-display text-[36px] normal-case leading-none tracking-[-0.02em] text-ink">22</div>
                <div className="mt-1.5 text-ink-60">{cyLabel("Siroedd", "Counties")}</div>
              </div>
              <div>
                <div className="font-display text-[36px] normal-case italic leading-none tracking-[-0.02em] text-ink">{cyLabel("Am ddim", "Free")}</div>
                <div className="mt-1.5 text-ink-60">{cyLabel("I deuluoedd", "For families")}</div>
              </div>
            </div>
          </div>

          {/* Interactive map card */}
          <aside className="sticky top-24 hidden overflow-hidden border border-hairline bg-white lg:block">
            <div className="flex items-center justify-between border-b border-hairline px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-60">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4ADE80]" /> Live · {cyLabel("Porwch yn ôl sir", "Browse by county")}
              </span>
              <span>22 {cyLabel("siroedd", "counties")}</span>
            </div>
            <div
              className="p-6"
              style={{
                height: 480,
                backgroundImage: "repeating-linear-gradient(135deg, #FBF7F3 0 12px, #F3EFE8 12px 13px)",
              }}
            >
              {/* Editorial variant: ink paths on ivory, mono uppercase
                  labels, coral hover, top-left county readout on hover. */}
              <WalesMap countyCounts={countyCounts} variant="editorial" />
            </div>
            <div className="flex items-center justify-between border-t border-hairline px-5 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-60">
              <span>{cyLabel("Hofer i archwilio", "Hover to explore")}</span>
              <span>{cyLabel("Cliciwch i fynd", "Click to enter")} →</span>
            </div>
          </aside>
        </div>

        {/* Mobile map */}
        <div className="mt-10 lg:hidden" style={{ height: 320 }}>
          <WalesMap countyCounts={countyCounts} variant="editorial" />
        </div>

        <style>{`
          @keyframes wordSwap {
            0% { opacity: 0; transform: translateY(16px); filter: blur(4px); }
            100% { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
        `}</style>
      </section>

      {/* ── 2. TRUST STRIP ── */}
      <section className="flex flex-wrap items-center justify-center gap-6 bg-ink px-6 py-4 font-mono text-[12px] uppercase tracking-[0.12em] text-white">
        <span className="text-[#4ADE80]">✓</span>
        <span>{cyLabel("Am ddim i deuluoedd — bob amser", "Free for families — always")}</span>
        <span className="text-white/30">·</span>
        <span>{cyLabel("Data CIW wedi'i ddiweddaru'n wythnosol", "CIW data updated weekly")}</span>
        <span className="text-white/30">·</span>
        <span>{cyLabel("Cymraeg yn gyntaf, cy_GB yw'r rhagosodiad", "Welsh-first, cy_GB default")}</span>
      </section>

      {/* ── 3. HOW IT WORKS ── */}
      <section className="border-t border-hairline bg-ivory px-6 py-28 lg:px-16">
        <div className="mb-14">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-60">
            002 / {cyLabel("Sut mae'n gweithio", "How it works")}
          </div>
          <h2 className="font-display text-[88px] font-normal leading-[0.95] tracking-[-0.03em] text-ink">
            {cyLabel("Tri cham.", "Three steps.")}
            <br />
            <span className="italic text-heather">{cyLabel("Dim ceidwaid.", "No gatekeepers.")}</span>
          </h2>
        </div>

        <div className="grid border-t border-ink lg:grid-cols-3">
          {[
            {
              n: "01",
              t: cyLabel("Chwilio", "Search"),
              d: locale === "cy"
                ? "Chwiliwch yn ôl lleoliad, math o ofal, neu Gymraeg. Mae pob cartref gofal rheoleiddiedig ar y rhestr — dim byd y tu ôl i dâl."
                : "Search by location, care type, or Welsh-language provision. Every regulated care home in Wales is listed — nothing paywalled.",
            },
            {
              n: "02",
              t: cyLabel("Cymharu", "Compare"),
              d: locale === "cy"
                ? "Graddfeydd arolygu CIW ar draws pedair thema, lefel y Cynnig Rhagweithiol, ffioedd wythnosol, a gwasanaethau — ochr yn ochr."
                : "CIW inspection ratings across four themes, Active Offer level, weekly fees, and services — side by side.",
            },
            {
              n: "03",
              t: cyLabel("Cysylltu", "Connect"),
              d: locale === "cy"
                ? "Ymholwch yn uniongyrchol, neu cewch gymorth gan ein tîm os yw'r broses yn teimlo'n llethol. Am ddim i deuluoedd bob amser."
                : "Enquire directly, or get help from our team if the process feels overwhelming. Always free for families.",
            },
          ].map((s, i) => (
            <div
              key={s.n}
              className={`px-9 pb-10 pt-8 ${i < 2 ? "lg:border-r lg:border-hairline" : ""}`}
            >
              <div className="font-mono text-[12px] uppercase tracking-[0.15em] text-ink-60">{s.n}</div>
              <div className="mt-4 font-display text-[52px] leading-none tracking-[-0.02em] text-ink">{s.t}</div>
              <p className="mt-5 max-w-[340px] text-[16px] leading-[1.6] text-ink">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. FOUNDING STORY ── */}
      <section className="bg-warmgrey px-6 py-28 lg:px-16">
        <div className="grid items-center gap-20 lg:grid-cols-2">
          <div>
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-60">
              003 / {cyLabel("Pam gofal.wales?", "Why gofal.wales?")}
            </div>
            <h2 className="font-display text-[72px] font-normal leading-[0.98] tracking-[-0.03em] text-ink">
              {cyLabel("Roedd dod o hyd i ofal Cymraeg yn ", "Finding Welsh-language care was ")}
              <span className="italic text-coral">{cyLabel("hunllef.", "a nightmare.")}</span>
            </h2>
            <p className="mt-7 max-w-[520px] text-[19px] leading-[1.7] text-ink">
              {t("story.paragraph1")}
            </p>
            <p className="mt-4 max-w-[520px] text-[19px] leading-[1.7] text-ink">
              {t("story.paragraph2")}
            </p>
            <div className="mt-8 flex items-center gap-4 border-t border-hairline pt-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink font-display text-[22px] text-white">
                {t("story.author").charAt(0)}
              </div>
              <div>
                <div className="font-display text-[20px] tracking-[-0.01em] text-ink">
                  {t("story.author")}, Ateb AI
                </div>
                <div className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-60">
                  Llanelli, Cymru
                </div>
              </div>
            </div>
          </div>

          <div
            className="relative aspect-[4/5] border border-hairline"
            style={{
              backgroundImage: "repeating-linear-gradient(135deg, #E8E3DA 0 14px, #DDD6CC 14px 15px)",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80&fm=webp&fit=crop"
              alt={cyLabel("Cymuned Gymreig", "Welsh community")}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.12em] text-white mix-blend-difference">
              [ {cyLabel("llun · cymuned Gymreig", "photograph · Welsh community")} ]
            </div>
            <div className="absolute bottom-4 right-4 font-mono text-[10px] uppercase tracking-[0.12em] text-white mix-blend-difference">
              PLATE 01
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. COUNTY RAIL ── */}
      <section className="bg-ivory px-6 py-28 lg:px-16">
        <div className="mb-12 flex items-baseline justify-between">
          <div>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-60">
              004 / {cyLabel("Porwch yn ôl sir", "Browse by county")}
            </div>
            <h2 className="font-display text-[72px] font-normal leading-[0.95] tracking-[-0.03em] text-ink">
              {cyLabel("Pob 22 sir.", "All 22 counties.")}
            </h2>
          </div>
          <Link
            href="/cartrefi-gofal"
            className="border-b-[1.5px] border-ink pb-1 font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-ink"
          >
            {cyLabel("Gweld pob cartref", "See every home")} →
          </Link>
        </div>

        <div className="grid border-t border-ink sm:grid-cols-2 lg:grid-cols-4">
          {counties.map((c, i) => {
            const count = countyCounts[c.slug];
            const borderR = (i + 1) % 4 !== 0;
            return (
              <Link
                key={c.slug}
                href={`/cartrefi-gofal/${c.slug}`}
                className={`flex flex-col gap-2 border-b border-hairline px-5 py-6 transition-colors hover:bg-warmgrey ${
                  borderR ? "lg:border-r lg:border-hairline" : ""
                }`}
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-60">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="font-display text-[26px] leading-[1.05] tracking-[-0.02em] text-ink">
                  {c.name_cy}
                </div>
                <div className="font-body text-[12px] text-ink-60">{c.name_en}</div>
                <div className="mt-auto flex items-baseline justify-between pt-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-60">
                    {count ? `${count} ${cyLabel("cartrefi", "homes")}` : "—"}
                  </span>
                  <span>→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── 6. BIG CTA ── */}
      <section className="border-t border-hairline bg-ivory px-6 py-28 text-center lg:px-16">
        <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-60">
          005 / {cyLabel("Barod?", "Ready?")}
        </div>
        <h2 className="font-display text-[clamp(72px,10vw,128px)] font-normal leading-[0.92] tracking-[-0.04em] text-ink">
          {cyLabel("Dewch o hyd i'r cartref iawn.", "Find the right home.")}
          <br />
          <span className="italic text-heather">{cyLabel("Yn Gymraeg.", "Yn Gymraeg.")}</span>
        </h2>
        <div className="mt-14 flex flex-wrap justify-center gap-4">
          <Link
            href="/cartrefi-gofal"
            className="inline-flex items-center gap-3 bg-ink px-8 py-5 font-mono text-[13px] font-bold uppercase tracking-[0.12em] text-white"
          >
            {cyLabel("Dechrau chwilio", "Start searching")} <span>↗</span>
          </Link>
          <Link
            href="/cymorth"
            className="inline-flex items-center gap-3 border-[1.5px] border-ink px-8 py-5 font-mono text-[13px] font-bold uppercase tracking-[0.12em] text-ink"
          >
            {cyLabel("Siarad â'n tîm", "Talk to our team")}
          </Link>
        </div>
      </section>
    </>
  );
}
