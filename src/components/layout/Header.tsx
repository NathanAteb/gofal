"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { LanguageToggle } from "./LanguageToggle";
import { useLearnWelsh } from "@/lib/i18n/learn-welsh";

function DysguPill() {
  const { enabled, toggle } = useLearnWelsh();
  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${
        enabled
          ? "border-honey bg-honey/15 text-honey"
          : "border-hairline text-ink-60 hover:border-ink hover:text-ink"
      }`}
      title="Dysgu Cymraeg / Learn Welsh"
    >
      <span>📖</span> Dysgu
    </button>
  );
}

export function Header() {
  const { t, locale } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/cartrefi-gofal", label: locale === "cy" ? "Cartrefi gofal" : "Care homes" },
    { href: "/canllawiau", label: locale === "cy" ? "Canllawiau" : "Guides" },
    { href: "/darparwyr", label: locale === "cy" ? "Darparwyr" : "Providers" },
  ];

  return (
    <>
      {/* Utility strip */}
      <div className="hidden md:flex h-8 items-center justify-between bg-ink px-10 font-mono text-[11px] uppercase tracking-[0.08em] text-white/70">
        <span>◉ {locale === "cy" ? "Cyfeiriadur cartrefi gofal Cymru" : "Wales' care home directory"}</span>
        <div className="flex items-center gap-5">
          <LanguageToggle />
          <span className="text-white/30">|</span>
          <DysguPill />
        </div>
      </div>

      {/* Main nav */}
      <header className="sticky top-0 z-50 border-b border-hairline bg-ivory/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link
            href="/"
            className="font-display text-3xl leading-none tracking-tight text-ink"
          >
            gofal<span className="italic text-heather">.</span>wales
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-9">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-body text-[14px] font-semibold text-ink transition-colors hover:text-heather"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/cymorth"
              className="inline-flex items-center gap-2 bg-coral px-5 py-2.5 font-body text-[13px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#A0522D]"
            >
              {locale === "cy" ? "Cael cymorth" : "Get help"} <span aria-hidden>→</span>
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center text-ink md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>

        {mobileOpen && (
          <nav className="border-t border-hairline bg-ivory px-6 pb-5 md:hidden">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block py-3 font-body text-base font-semibold text-ink"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/cymorth"
              onClick={() => setMobileOpen(false)}
              className="mt-3 inline-flex items-center gap-2 bg-coral px-5 py-2.5 font-body text-[13px] font-bold uppercase tracking-wider text-white"
            >
              {locale === "cy" ? "Cael cymorth" : "Get help"} →
            </Link>
            <div className="mt-4 flex items-center gap-3">
              <LanguageToggle />
              <DysguPill />
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
