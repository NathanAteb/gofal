"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { SearchBar } from "@/components/forms/SearchBar";
import { FilterPanel } from "@/components/forms/FilterPanel";
import { CareHomeCard } from "@/components/cards/CareHomeCard";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { counties } from "@/lib/utils/counties";
import type { CareHomeWithProfile, SearchFilters } from "@/types/database";

interface DirectoryContentProps {
  initialHomes?: CareHomeWithProfile[];
  initialTotal?: number;
}

export function DirectoryContent({
  initialHomes = [],
  initialTotal = 0,
}: DirectoryContentProps) {
  const { locale, t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  const [homes, setHomes] = useState<CareHomeWithProfile[]>(initialHomes as CareHomeWithProfile[]);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(Math.ceil(initialTotal / 12));
  const [loading, setLoading] = useState(false);

  const filtersFromUrl: SearchFilters = {
    query: searchParams.get("q") || undefined,
    county: searchParams.get("county") || undefined,
    care_type: searchParams.get("care_type") || undefined,
    active_offer_level: searchParams.get("active_offer_level")
      ? parseInt(searchParams.get("active_offer_level")!)
      : undefined,
    sort: (searchParams.get("sort") as SearchFilters["sort"]) || undefined,
    page: parseInt(searchParams.get("page") || "1"),
  };

  const [filters, setFilters] = useState<SearchFilters>(filtersFromUrl);

  const hasActiveFilters = !!(
    filters.query || filters.county || filters.care_type ||
    filters.active_offer_level || filters.sort ||
    (filters.page && filters.page > 1)
  );

  const fetchHomes = useCallback(async (f: SearchFilters) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (f.query) params.set("q", f.query);
    if (f.county) params.set("county", f.county);
    if (f.care_type) params.set("care_type", f.care_type);
    if (f.active_offer_level) params.set("active_offer_level", f.active_offer_level.toString());
    if (f.sort) params.set("sort", f.sort);
    if (f.page && f.page > 1) params.set("page", f.page.toString());

    try {
      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      setHomes(data.homes || []);
      setTotal(data.total || 0);
      setTotalPages(data.total_pages || 0);
    } catch {
      setHomes([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Skip first render if we have server data and no URL filters
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (initialHomes.length > 0 && !hasActiveFilters) return;
    }

    fetchHomes(filters);

    const params = new URLSearchParams();
    if (filters.query) params.set("q", filters.query);
    if (filters.county) params.set("county", filters.county);
    if (filters.care_type) params.set("care_type", filters.care_type);
    if (filters.active_offer_level) params.set("active_offer_level", filters.active_offer_level.toString());
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.page && filters.page > 1) params.set("page", filters.page.toString());

    const qs = params.toString();
    router.replace(`/cartrefi-gofal${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [filters, fetchHomes, router, initialHomes.length, hasActiveFilters]);

  const currentPage = filters.page || 1;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumbs
        items={[{ label_cy: "Cartrefi Gofal", label_en: "Care Homes" }]}
      />

      <div className="mt-6">
        <h1 className="font-heading text-3xl font-bold sm:text-4xl">
          {t("directory.title")}
        </h1>
        <p className="mt-2 text-muted-plum">{t("directory.subtitle")}</p>
      </div>

      <div className="mt-6 max-w-2xl">
        <SearchBar defaultValue={filters.query} />
      </div>

      <div className="mt-4">
        <FilterPanel filters={filters} onChange={setFilters} />
      </div>

      <div className="mt-6 text-sm text-muted-plum">
        {!loading && (
          <>
            {t("directory.showing")} {homes.length} {t("directory.of")} {total}{" "}
            {total === 1 ? t("directory.results") : t("directory.results_plural")}
          </>
        )}
      </div>

      {loading ? (
        <div className="mt-6"><SkeletonGrid count={6} /></div>
      ) : homes.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {homes.map((home) => (
            <CareHomeCard key={home.id} home={home} />
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-linen text-muted-plum mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-dusk">{t("directory.no_results")}</p>
          <p className="mt-2 text-sm text-muted-plum max-w-md mx-auto">
            {locale === "cy"
              ? "Ceisiwch chwilio am dref, sir, neu god post gwahanol. Gallwch hefyd bori yn ôl sir isod."
              : "Try searching for a different town, county, or postcode. You can also browse by county below."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["sir-gaerfyrddin", "gwynedd", "caerdydd", "abertawe", "ceredigion"].map((slug) => {
              const c = counties.find((co) => co.slug === slug);
              if (!c) return null;
              return (
                <button
                  key={slug}
                  onClick={() => setFilters({ county: slug, page: 1 })}
                  className="rounded-full border border-blush-grey bg-white px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  {locale === "cy" ? c.name_cy : c.name_en}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            disabled={currentPage <= 1}
            onClick={() => setFilters({ ...filters, page: currentPage - 1 })}
            className="rounded-full border border-blush-grey bg-white px-4 py-2 text-sm font-semibold text-muted-plum transition-colors hover:bg-ivory disabled:opacity-50"
          >
            {t("common.previous")}
          </button>
          <span className="text-sm text-muted-plum">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setFilters({ ...filters, page: currentPage + 1 })}
            className="rounded-full border border-blush-grey bg-white px-4 py-2 text-sm font-semibold text-muted-plum transition-colors hover:bg-ivory disabled:opacity-50"
          >
            {t("common.next")}
          </button>
        </div>
      )}
    </div>
  );
}
