"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { LanguageToggle } from "./LanguageToggle";

export function Header() {
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/cartrefi-gofal", label: t("nav.directory") },
    { href: "/canllawiau", label: t("nav.guides") },
    { href: "/darparwyr", label: t("nav.providers") },
    { href: "/amdanom", label: t("nav.about") },
    { href: "/cysylltu", label: t("nav.contact") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-blush-grey bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo — clean text, no box */}
        <Link href="/" className="text-xl font-heading font-bold tracking-tight">
          <span className="text-dusk">gofal</span>
          <span className="text-primary">.wales</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-5 lg:gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm font-body font-semibold text-muted-plum transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <LanguageToggle />
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-dusk md:hidden"
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

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="border-t border-blush-grey bg-white px-4 pb-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-base font-body font-semibold text-muted-plum transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <LanguageToggle />
          </div>
        </nav>
      )}
    </header>
  );
}
