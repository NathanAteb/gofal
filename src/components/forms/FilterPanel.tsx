"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { counties } from "@/lib/utils/counties";
import type { SearchFilters } from "@/types/database";

interface FilterPanelProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
}

const CARE_TYPES = [
  { value: "residential", cy: "Preswyl", en: "Residential" },
  { value: "nursing", cy: "Nyrsio", en: "Nursing" },
  { value: "dementia", cy: "Dementia", en: "Dementia" },
  { value: "respite", cy: "Seibiant", en: "Respite" },
];

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const { locale, t } = useI18n();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    care_type: true,
    welsh: true,
    rating: false,
    price: false,
  });

  function update(partial: Partial<SearchFilters>) {
    onChange({ ...filters, ...partial, page: 1 });
  }

  function toggleSection(key: string) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const hasActiveFilters = !!(filters.county || filters.care_type || filters.active_offer_level || filters.min_rating || filters.beds_available);

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-blush-grey">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-dusk">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          {locale === "cy" ? "Hidlwyr Chwilio" : "Search Filters"}
        </h2>
        {hasActiveFilters && (
          <button
            onClick={() => onChange({ page: 1 })}
            className="text-sm font-semibold text-primary hover:underline"
          >
            {t("filter.clear_all")}
          </button>
        )}
      </div>

      {/* County */}
      <div className="py-3 border-b border-blush-grey">
        <label className="block text-sm font-semibold text-dusk mb-2">
          {t("filter.county")}
        </label>
        <select
          value={filters.county || ""}
          onChange={(e) => update({ county: e.target.value || undefined })}
          className="w-full rounded-[12px] border border-blush-grey bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">{t("filter.all_counties")}</option>
          {counties.map((c) => (
            <option key={c.slug} value={c.slug}>
              {locale === "cy" ? c.name_cy : c.name_en}
            </option>
          ))}
        </select>
      </div>

      {/* Care Type — pill buttons like Lottie */}
      <div className="py-3 border-b border-blush-grey">
        <button
          onClick={() => toggleSection("care_type")}
          className="flex w-full items-center justify-between text-sm font-semibold text-dusk"
        >
          {t("filter.care_type")}
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={`transition-transform ${openSections.care_type ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {openSections.care_type && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {CARE_TYPES.map(({ value, cy, en }) => {
              const active = filters.care_type === value;
              return (
                <button
                  key={value}
                  onClick={() => update({ care_type: active ? undefined : value })}
                  className={`rounded-[10px] border px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-blush-grey bg-white text-dusk hover:border-primary/50"
                  }`}
                >
                  {locale === "cy" ? cy : en}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Welsh Language Level */}
      <div className="py-3 border-b border-blush-grey">
        <button
          onClick={() => toggleSection("welsh")}
          className="flex w-full items-center justify-between text-sm font-semibold text-dusk"
        >
          {t("filter.welsh_language")}
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={`transition-transform ${openSections.welsh ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {openSections.welsh && (
          <div className="mt-2 space-y-1.5">
            {[
              { value: "", label: locale === "cy" ? "Unrhyw lefel" : "Any level" },
              { value: "1", label: locale === "cy" ? "Lefel 1+" : "Level 1+" },
              { value: "2", label: locale === "cy" ? "Lefel 2+" : "Level 2+" },
              { value: "3", label: locale === "cy" ? "Lefel 3 (Rhagorol)" : "Level 3 (Excellent)" },
            ].map(({ value, label }) => {
              const active = (filters.active_offer_level?.toString() || "") === value;
              return (
                <button
                  key={value}
                  onClick={() => update({ active_offer_level: value ? parseInt(value) : undefined })}
                  className={`block w-full rounded-[10px] border px-3 py-2 text-left text-sm transition-colors ${
                    active
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-transparent text-dusk hover:bg-ivory"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* CIW Rating */}
      <div className="py-3 border-b border-blush-grey">
        <button
          onClick={() => toggleSection("rating")}
          className="flex w-full items-center justify-between text-sm font-semibold text-dusk"
        >
          {t("filter.rating")}
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={`transition-transform ${openSections.rating ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {openSections.rating && (
          <div className="mt-2 space-y-1.5">
            {[
              { value: "", label: locale === "cy" ? "Unrhyw radd" : "Any rating" },
              { value: "excellent", label: locale === "cy" ? "Rhagorol" : "Excellent" },
              { value: "good", label: locale === "cy" ? "Da" : "Good" },
            ].map(({ value, label }) => {
              const active = (filters.min_rating || "") === value;
              return (
                <button
                  key={value}
                  onClick={() => update({ min_rating: value || undefined })}
                  className={`block w-full rounded-[10px] border px-3 py-2 text-left text-sm transition-colors ${
                    active
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-transparent text-dusk hover:bg-ivory"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Beds available */}
      <div className="py-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.beds_available || false}
            onChange={(e) => update({ beds_available: e.target.checked || undefined })}
            className="h-4 w-4 rounded border-blush-grey text-primary focus:ring-primary"
          />
          <span className="text-sm font-medium text-dusk">
            {locale === "cy" ? "Gwelyau ar gael yn unig" : "Beds available only"}
          </span>
        </label>
      </div>
    </div>
  );
}
