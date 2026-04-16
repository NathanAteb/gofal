"use client";

import { useEffect, useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n/context";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SearchBar } from "@/components/forms/SearchBar";
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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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

  return (
    <div>
      {/* County header */}
      {/* County hero with search */}
      <div className="relative bg-primary-dark overflow-hidden py-12 sm:py-16 pb-20 sm:pb-24">
        <img
          src="https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1200&q=80&fm=webp&fit=crop"
          alt={`${county.name_cy} / ${county.name_en} — Cymru / Wales`}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          loading="eager"
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl drop-shadow-lg">
            {locale === "cy"
              ? `Cartrefi Gofal yn ${county.name_cy}`
              : `Care Homes in ${county.name_en}`}
          </h1>
          {/* Stats pills */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white">
              {total} {locale === "cy" ? "cartref gofal" : "care homes"}
            </span>
            {avgFee && (
              <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white">
                ~£{avgFee.toLocaleString("en-GB")} {locale === "cy" ? "/wythnos" : "/week"}
              </span>
            )}
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white">
              {welshPct}% {locale === "cy" ? "Cymraeg" : "Welsh"}
            </span>
          </div>
          {/* Search bar in hero */}
          <div className="mt-6 mx-auto max-w-2xl">
            <SearchBar size="lg" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Breadcrumbs
          items={[
            { label_cy: "Cartrefi Gofal", label_en: "Care Homes", href: "/cartrefi-gofal" },
            { label_cy: county.name_cy, label_en: county.name_en },
          ]}
        />

        {/* Count + Sort header */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-heading text-2xl font-bold text-dusk">
            {loading ? (
              <span className="text-muted-plum">{locale === "cy" ? "Yn chwilio..." : "Searching..."}</span>
            ) : (
              <>
                <span className="text-primary">{total}</span>{" "}
                {locale === "cy" ? "cartref gofal" : "care homes"}
              </>
            )}
          </h2>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-plum whitespace-nowrap">
                {locale === "cy" ? "Trefnu yn ôl:" : "Sort by:"}
              </label>
              <select
                value={filters.sort || "relevance"}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value as SearchFilters["sort"], page: 1 })}
                className="rounded-[10px] border border-blush-grey bg-white px-3 py-2 text-sm font-semibold text-dusk focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="relevance">{locale === "cy" ? "Argymhellir" : "Recommended"}</option>
                <option value="rating">{t("filter.sort_rating")}</option>
                <option value="fee_low">{t("filter.sort_fee_low")}</option>
                <option value="fee_high">{t("filter.sort_fee_high")}</option>
              </select>
            </div>

            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="flex items-center gap-2 rounded-[10px] border border-blush-grey bg-white px-3 py-2 text-sm font-semibold text-dusk lg:hidden"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              {locale === "cy" ? "Hidlwyr" : "Filters"}
            </button>
          </div>
        </div>

        {/* Sidebar + cards layout */}
        <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 rounded-[16px] border border-blush-grey bg-white p-5 shadow-card">
              <FilterPanel
                filters={filters}
                onChange={(f) => setFilters({ ...f, county: county.slug })}
              />
            </div>
          </aside>

          {/* Mobile filter overlay */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-dusk/50" onClick={() => setMobileFiltersOpen(false)} />
              <div className="absolute left-0 top-0 bottom-0 w-[320px] max-w-[85vw] overflow-y-auto bg-white p-5 shadow-modal">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-lg font-bold text-dusk">
                    {locale === "cy" ? "Hidlwyr" : "Filters"}
                  </h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="rounded-full p-2 text-muted-plum hover:bg-ivory"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <FilterPanel
                  filters={filters}
                  onChange={(f) => { setFilters({ ...f, county: county.slug }); setMobileFiltersOpen(false); }}
                />
              </div>
            </div>
          )}

          {/* Cards */}
          <div>
            {loading ? (
              <SkeletonGrid count={6} />
            ) : homes.length > 0 ? (
              <div className="flex flex-col gap-4">
                {homes.map((home) => (
                  <CareHomeCard key={home.id} home={home} />
                ))}
              </div>
            ) : (
              <div className="mt-8 text-center">
                <p className="text-lg text-muted-plum">{t("directory.no_results")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
