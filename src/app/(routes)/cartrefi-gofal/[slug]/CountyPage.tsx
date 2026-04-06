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
      setHomes(data.homes || []);
      setTotal(data.total || 0);
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumbs
        items={[
          { label_cy: "Cartrefi Gofal", label_en: "Care Homes", href: "/cartrefi-gofal" },
          { label_cy: county.name_cy, label_en: county.name_en },
        ]}
      />

      <div className="mt-6">
        <h1 className="font-heading text-3xl font-bold sm:text-4xl">
          {locale === "cy"
            ? `Cartrefi Gofal yn ${county.name_cy}`
            : `Care Homes in ${county.name_en}`}
        </h1>
        <p className="mt-3 max-w-3xl text-muted-plum leading-relaxed">
          {introText}
        </p>
      </div>

      {/* Stats strip */}
      <div className="mt-6 flex flex-wrap gap-4">
        <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          {total} {locale === "cy" ? "cartref gofal" : "care homes"}
        </div>
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
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
  );
}
