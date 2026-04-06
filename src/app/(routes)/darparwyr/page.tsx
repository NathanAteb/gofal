"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function ProvidersPage() {
  const { t } = useI18n();

  const benefits = [
    { title: t("providers.benefit1_title"), desc: t("providers.benefit1_desc"), icon: "gift" },
    { title: t("providers.benefit2_title"), desc: t("providers.benefit2_desc"), icon: "users" },
    { title: t("providers.benefit3_title"), desc: t("providers.benefit3_desc"), icon: "star" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label_cy: "I Ddarparwyr", label_en: "For Providers" }]} />

      {/* Hero */}
      <div className="mt-6 text-center">
        <h1 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
          {t("providers.title")}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-plum">
          {t("providers.subtitle")}
        </p>
      </div>

      {/* Benefits */}
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {benefits.map((b) => (
          <div key={b.title} className="rounded-[16px] border border-blush-grey bg-white p-6 text-center shadow-card">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {b.icon === "gift" && <><rect x="3" y="8" width="18" height="4" rx="1" /><rect x="3" y="12" width="18" height="8" rx="1" /><path d="M12 8v12M3 12h18M7.5 8C7.5 8 7 4 12 4s4.5 4 4.5 4" /></>}
                {b.icon === "users" && <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></>}
                {b.icon === "star" && <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />}
              </svg>
            </div>
            <h3 className="mt-4 font-heading text-lg font-bold">{b.title}</h3>
            <p className="mt-2 text-sm text-muted-plum">{b.desc}</p>
          </div>
        ))}
      </div>

      {/* Enhanced listing */}
      <div className="mt-16 rounded-[24px] bg-primary-dark p-8 text-center text-white sm:p-12">
        <h2 className="font-heading text-2xl font-bold sm:text-3xl">
          {t("providers.enhanced_title")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-primary-light">
          {t("providers.enhanced_desc")}
        </p>
        <p className="mt-4 font-heading text-3xl font-bold text-accent">
          {t("providers.enhanced_price")}
        </p>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <Link
          href="/cartrefi-gofal"
          className="inline-block rounded-full bg-secondary px-8 py-4 text-lg font-body font-bold text-white transition-colors hover:bg-secondary/90"
        >
          {t("providers.cta")}
        </Link>
      </div>
    </div>
  );
}
