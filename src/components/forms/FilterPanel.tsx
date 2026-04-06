"use client";

import { useI18n } from "@/lib/i18n/context";
import { counties } from "@/lib/utils/counties";
import type { SearchFilters } from "@/types/database";

interface FilterPanelProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
}

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const { locale, t } = useI18n();

  function update(partial: Partial<SearchFilters>) {
    onChange({ ...filters, ...partial, page: 1 });
  }

  return (
    <div className="flex flex-wrap gap-3">
      {/* County */}
      <select
        value={filters.county || ""}
        onChange={(e) => update({ county: e.target.value || undefined })}
        className="rounded-full border border-blush-grey bg-white px-4 py-2 text-sm font-body focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="">{t("filter.all_counties")}</option>
        {counties.map((c) => (
          <option key={c.slug} value={c.slug}>
            {locale === "cy" ? c.name_cy : c.name_en}
          </option>
        ))}
      </select>

      {/* Care type */}
      <select
        value={filters.care_type || ""}
        onChange={(e) => update({ care_type: e.target.value || undefined })}
        className="rounded-full border border-blush-grey bg-white px-4 py-2 text-sm font-body focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="">{t("filter.all_types")}</option>
        <option value="residential">{t("filter.residential")}</option>
        <option value="nursing">{t("filter.nursing")}</option>
        <option value="dementia">{t("filter.dementia")}</option>
        <option value="respite">{t("filter.respite")}</option>
        <option value="learning_disability">{t("filter.learning_disability")}</option>
      </select>

      {/* Welsh language level */}
      <select
        value={filters.active_offer_level?.toString() || ""}
        onChange={(e) =>
          update({
            active_offer_level: e.target.value
              ? parseInt(e.target.value)
              : undefined,
          })
        }
        className="rounded-full border border-blush-grey bg-white px-4 py-2 text-sm font-body focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="">{t("filter.any_level")}</option>
        <option value="1">{t("filter.active_offer_1")}</option>
        <option value="2">{t("filter.active_offer_2")}</option>
        <option value="3">{t("filter.active_offer_3")}</option>
      </select>

      {/* CIW Rating */}
      <select
        value={filters.min_rating || ""}
        onChange={(e) => update({ min_rating: e.target.value || undefined })}
        className="rounded-full border border-blush-grey bg-white px-4 py-2 text-sm font-body focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="">{t("filter.any_rating")}</option>
        <option value="excellent">{t("rating.excellent")}</option>
        <option value="good">{t("rating.good")}</option>
      </select>

      {/* Beds */}
      <label className="inline-flex items-center gap-2 rounded-full border border-blush-grey bg-white px-4 py-2 text-sm font-body cursor-pointer">
        <input
          type="checkbox"
          checked={filters.beds_available || false}
          onChange={(e) => update({ beds_available: e.target.checked || undefined })}
          className="rounded border-blush-grey"
        />
        {locale === "cy" ? "Gwelyau ar gael" : "Beds available"}
      </label>

      {/* Sort */}
      <select
        value={filters.sort || "relevance"}
        onChange={(e) => update({ sort: e.target.value as SearchFilters["sort"] })}
        className="rounded-full border border-blush-grey bg-white px-4 py-2 text-sm font-body focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="relevance">{t("filter.sort_relevance")}</option>
        <option value="rating">{t("filter.sort_rating")}</option>
        <option value="fee_low">{t("filter.sort_fee_low")}</option>
        <option value="fee_high">{t("filter.sort_fee_high")}</option>
        <option value="distance">{t("filter.sort_distance")}</option>
      </select>

      {/* Clear */}
      {(filters.county || filters.care_type || filters.active_offer_level || filters.query) && (
        <button
          onClick={() => onChange({ page: 1 })}
          className="rounded-full border border-blush-grey bg-ivory px-4 py-2 text-sm font-body font-semibold text-muted-plum transition-colors hover:bg-linen"
        >
          {t("filter.clear_all")}
        </button>
      )}
    </div>
  );
}
