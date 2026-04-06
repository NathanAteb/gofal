"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { guides } from "@/content/guides";

export default function GuidesPage() {
  const { locale, t } = useI18n();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label_cy: "Canllawiau", label_en: "Guides" }]} />

      <h1 className="mt-6 font-heading text-3xl font-bold sm:text-4xl">
        {t("guides.title")}
      </h1>
      <p className="mt-2 text-muted-plum">{t("guides.subtitle")}</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/canllawiau/${guide.slug}`}
            className="group rounded-[16px] border border-blush-grey bg-white p-6 shadow-card transition-all hover:shadow-modal hover:border-primary"
          >
            <span className="text-xs font-semibold uppercase text-primary">
              {locale === "cy" ? "Canllaw" : "Guide"}
            </span>
            <h2 className="mt-2 font-heading text-lg font-bold text-dusk group-hover:text-primary transition-colors">
              {locale === "cy" ? guide.title_cy : guide.title_en}
            </h2>
            <p className="mt-2 text-sm text-muted-plum line-clamp-3">
              {locale === "cy" ? guide.excerpt_cy : guide.excerpt_en}
            </p>
            <p className="mt-3 text-sm font-semibold text-secondary">
              {locale === "cy" ? "Darllen mwy" : "Read more"} &rarr;
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
