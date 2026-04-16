"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-client";
import { useI18n } from "@/lib/i18n/context";
import { SearchBar } from "@/components/forms/SearchBar";
import { FilterPanel } from "@/components/forms/FilterPanel";
import { CareHomeCard } from "@/components/cards/CareHomeCard";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import { counties } from "@/lib/utils/counties";
import type { CareHomeWithProfile, SearchFilters } from "@/types/database";

const WELSH_PROVERBS = [
  { cy: "Cenedl heb iaith, cenedl heb galon.", en: "A nation without a language is a nation without a heart." },
  { cy: "Gorau adnabod, d'adnabod dy hun.", en: "The best knowledge is to know yourself." },
  { cy: "Hir yw pob ymaros.", en: "Long is every waiting." },
  { cy: "A fo ben, bid bont.", en: "He who would be a leader, let him be a bridge." },
  { cy: "Gwell dysg na golud.", en: "Learning is better than riches." },
  { cy: "Dyfal donc a dyr y garreg.", en: "Persistent tapping breaks the stone." },
  { cy: "Nid aur yw popeth melyn.", en: "Not everything yellow is gold." },
  { cy: "Gorau tarian, tarian dysg.", en: "The best shield is the shield of learning." },
  { cy: "Hen wlad fy nhadau.", en: "Land of my fathers." },
  { cy: "Tŷ a adeiladir ar gariad, fe saif am byth.", en: "A house built on love will stand forever." },
];

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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [proverbIndex, setProverbIndex] = useState(0);

  // Rotate proverbs every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setProverbIndex((prev) => (prev + 1) % WELSH_PROVERBS.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

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

  const proverb = WELSH_PROVERBS[proverbIndex];

  return (
    <div>
      {/* Hero with rotating Welsh proverbs + search */}
      <div
        className="relative py-12 pb-20 sm:py-16 sm:pb-24 text-white"
        style={{ background: "linear-gradient(135deg, #4A2F4E 0%, #7B5B7E 40%, #A68AAB 70%, #7B5B7E 100%)" }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5" />
          <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-white/5" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          {/* Rotating proverb */}
          <div className="h-24 sm:h-28 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <m.div
                key={proverbIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <p className="font-heading text-2xl font-bold text-white italic sm:text-3xl lg:text-4xl" style={{ color: "white" }}>
                  &ldquo;{proverb.cy}&rdquo;
                </p>
                <p className="mt-2 text-sm font-body text-white/60">
                  {proverb.en}
                </p>
              </m.div>
            </AnimatePresence>
          </div>
          {/* Search bar */}
          <div className="mt-8 mx-auto max-w-2xl">
            <SearchBar defaultValue={filters.query} size="lg" />
          </div>
        </div>
      </div>

    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

      {/* Count + Sort header */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-bold text-dusk">
          {loading ? (
            <span className="text-muted-plum">{locale === "cy" ? "Yn chwilio..." : "Searching..."}</span>
          ) : (
            <>
              <span className="text-primary">{total}</span>{" "}
              {locale === "cy" ? "cartref gofal" : "care homes"}
            </>
          )}
        </h1>

        <div className="flex items-center gap-3">
          {/* Sort dropdown */}
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

          {/* Mobile filter toggle */}
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

      {/* Main layout: sidebar + cards */}
      <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">

        {/* ═══ LEFT SIDEBAR — filters ═══ */}
        {/* Desktop: always visible */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded-[16px] border border-blush-grey bg-white p-5 shadow-card">
            <FilterPanel filters={filters} onChange={setFilters} />
          </div>
        </aside>

        {/* Mobile: slide-in overlay */}
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
              <FilterPanel filters={filters} onChange={(f) => { setFilters(f); setMobileFiltersOpen(false); }} />
            </div>
          </div>
        )}

        {/* ═══ MAIN CONTENT — cards ═══ */}
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
              <p className="mt-3 italic text-muted-plum text-[14px]">
                Ceisiwch sir arall, neu ehangwch eich chwiliad.
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

          {/* Pagination */}
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
      </div>
    </div>
    </div>
  );
}
