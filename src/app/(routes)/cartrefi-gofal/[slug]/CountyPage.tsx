"use client";

import { useEffect, useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n/context";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CareHomeCard } from "@/components/cards/CareHomeCard";
import { FilterPanel } from "@/components/forms/FilterPanel";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import { welshSpeakerPercentage } from "@/lib/utils/counties";
import type { County, CareHomeWithProfile, SearchFilters } from "@/types/database";

interface Props {
  county: County;
}

export function CountyPage({ county }: Props) {
  const { locale, t } = useI18n();
  const [homes, setHomes] = useState<CareHomeWithProfile[]>([]);
  const [total, setTotal] = useState(0);
  const [avgFee, setAvgFee] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({ county: county.slug, page: 1 });

  const countyName = locale === "cy" ? county.name_cy : county.name_en;
  const welshPct = welshSpeakerPercentage[county.slug] || 0;

  const fetchHomes = useCallback(async (f: SearchFilters) => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("county", county.slug);
    if (f.care_type) params.set("care_type", f.care_type);
    if (f.active_offer_level) params.set("active_offer_level", f.active_offer_level.toString());
    if (f.sort) params.set("sort", f.sort);
    if (f.page && f.page > 1) params.set("page", f.page.toString());
    params.set("per_page", "50");

    try {
      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      const fetchedHomes = data.homes || [];
      setHomes(fetchedHomes);
      setTotal(data.total || 0);
      // Calculate average fee
      const fees = fetchedHomes
        .map((h: any) => h.care_home_profiles?.weekly_fee_from)
        .filter((f: any) => f != null && f > 0);
      if (fees.length > 0) {
        setAvgFee(Math.round(fees.reduce((a: number, b: number) => a + b, 0) / fees.length));
      }
    } catch {
      setHomes([]);
    } finally {
      setLoading(false);
    }
  }, [county.slug]);

  useEffect(() => {
    fetchHomes(filters);
  }, [filters, fetchHomes]);

  const introText = locale === "cy"
    ? `Dewch o hyd i gartrefi gofal yn ${county.name_cy}. Mae gennym wybodaeth am bob cartref gofal cofrestredig yn y sir, gan gynnwys graddfeydd Arolygiaeth Gofal Cymru (CIW), lefelau'r Cynnig Rhagweithiol, a manylion cyswllt. Mae ${welshPct}% o boblogaeth ${county.name_cy} yn siarad Cymraeg.`
    : `Find care homes in ${county.name_en}. We have information about every registered care home in the county, including Care Inspectorate Wales (CIW) ratings, Active Offer levels, and contact details. ${welshPct}% of ${county.name_en}'s population speaks Welsh.`;

  return (
    <div>
      {/* County header image */}
      <div className="relative h-48 sm:h-64 bg-primary-dark overflow-hidden">
        <img
          src={`https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1200&q=80&fm=webp&fit=crop`}
          alt={`${county.name_cy} / ${county.name_en} — Cymru / Wales`}
          className="h-full w-full object-cover opacity-60"
          loading="eager"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl drop-shadow-lg">
            {locale === "cy"
              ? `Cartrefi Gofal yn ${county.name_cy}`
              : `Care Homes in ${county.name_en}`}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumbs
        items={[
          { label_cy: "Cartrefi Gofal", label_en: "Care Homes", href: "/cartrefi-gofal" },
          { label_cy: county.name_cy, label_en: county.name_en },
        ]}
      />

      <div className="mt-6">
        <p className="max-w-3xl text-muted-plum leading-relaxed">
          {introText}
        </p>
      </div>

      {/* Stats strip */}
      <div className="mt-6 flex flex-wrap gap-4">
        <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          {total} {locale === "cy" ? "cartref gofal" : "care homes"}
        </div>
        {avgFee && (
          <div className="rounded-full bg-secondary/10 px-4 py-2 text-sm font-semibold text-secondary">
            ~£{avgFee.toLocaleString("en-GB")} {locale === "cy" ? "yr wythnos (cyfartaledd)" : "per week (average)"}
          </div>
        )}
        <div className="rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
          {welshPct}% {locale === "cy" ? "Cymraeg" : "Welsh speakers"}
        </div>
        <a
          href="https://www.careinspectorate.wales/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-linen px-4 py-2 text-sm font-semibold text-muted-plum hover:text-primary transition-colors"
        >
          {locale === "cy" ? "Data CIW" : "CIW Data"} &rarr;
        </a>
      </div>

      {/* Filters */}
      <div className="mt-6">
        <FilterPanel
          filters={filters}
          onChange={(f) => setFilters({ ...f, county: county.slug })}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="mt-6">
          <SkeletonGrid count={6} />
        </div>
      ) : homes.length > 0 ? (
        <div className="mt-6 flex flex-col gap-4">
          {homes.map((home) => (
            <CareHomeCard key={home.id} home={home} />
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center">
          <p className="text-lg text-muted-plum">{t("directory.no_results")}</p>
        </div>
      )}
    </div>
    </div>
  );
}
