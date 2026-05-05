"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { useLearnWelsh } from "@/lib/i18n/learn-welsh";

function LearnWelshToggle() {
  const { enabled, toggle } = useLearnWelsh();
  const { locale } = useI18n();
  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 border border-white/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white/60 transition-colors hover:text-white"
    >
      <span className={`relative inline-block h-3.5 w-6 rounded-full transition-colors ${enabled ? "bg-honey" : "bg-white/20"}`}>
        <span className={`absolute top-0.5 h-2.5 w-2.5 rounded-full bg-white transition-transform ${enabled ? "translate-x-3" : "translate-x-0.5"}`} />
      </span>
      {locale === "cy" ? "Dysgu Cymraeg" : "Learn Welsh"}
    </button>
  );
}

export function Footer() {
  const { locale, t } = useI18n();

  const columns: Array<{ title: string; links: Array<[string, string]> }> = [
    {
      title: locale === "cy" ? "Chwilio" : "Find",
      links: [
        [locale === "cy" ? "Pob cartref" : "All homes", "/cartrefi-gofal"],
        [locale === "cy" ? "Yn ôl sir" : "By county", "/cartrefi-gofal"],
        [locale === "cy" ? "Yn ôl math" : "By care type", "/cartrefi-gofal"],
        [locale === "cy" ? "Siaradwyr Cymraeg" : "Welsh-speaking", "/cartrefi-gofal?welsh=1"],
      ],
    },
    {
      title: locale === "cy" ? "Dysgu" : "Learn",
      links: [
        [locale === "cy" ? "Canllawiau" : "Guides", "/canllawiau"],
        [locale === "cy" ? "Graddfeydd CIW" : "CIW ratings", "/canllawiau/ciw"],
        [locale === "cy" ? "Cynnig Rhagweithiol" : "Active Offer", "/canllawiau/cynnig-rhagweithiol"],
        [locale === "cy" ? "Ariannu" : "Funding", "/canllawiau/ariannu"],
      ],
    },
    {
      title: locale === "cy" ? "I ddarparwyr" : "For providers",
      links: [
        [locale === "cy" ? "Hawlio eich cartref" : "Claim your listing", "/hawlio"],
        [locale === "cy" ? "Proffil estynedig" : "Enhanced profile", "/darparwyr"],
        [locale === "cy" ? "Prisiau" : "Pricing", "/darparwyr#prisiau"],
        [locale === "cy" ? "Cysylltu" : "Contact sales", "/cysylltu"],
      ],
    },
    {
      title: "Ateb AI",
      links: [
        [locale === "cy" ? "Amdanom ni" : "About", "/amdanom"],
        ["Llanelli, Cymru", "/amdanom"],
        ["hello@gofal.wales", "mailto:hello@gofal.wales"],
        ["© MMXXVI", "/"],
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="grid gap-10 border-b border-white/10 px-6 pb-10 pt-14 lg:grid-cols-4 lg:px-10">
        {columns.map((col) => (
          <div key={col.title}>
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.15em] text-white/50">
              {col.title}
            </div>
            <ul className="space-y-2 font-body text-sm">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-white/85 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Oversized wordmark */}
      <div
        className="overflow-hidden whitespace-nowrap px-5 pb-5 pt-10 font-display font-normal leading-[0.82] tracking-[-0.05em]"
        style={{ fontSize: "clamp(160px, 22vw, 300px)" }}
      >
        gofal<span className="italic text-heather">.</span>wales
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 px-6 pb-8 font-mono text-[10px] uppercase tracking-[0.12em] text-white/40 lg:px-10">
        <span>{locale === "cy" ? "Cymraeg yn gyntaf · Welsh first" : "Welsh first · Cymraeg yn gyntaf"}</span>
        <LearnWelshToggle />
        <span>{locale === "cy" ? "Adeiladwyd yn Llanelli, Cymru" : "Built in Llanelli, Cymru"}</span>
      </div>
    </footer>
  );
}
