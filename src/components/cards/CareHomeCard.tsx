"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { ActiveOfferBadge } from "@/components/ui/ActiveOfferBadge";
import { formatPhoneForTel } from "@/lib/utils/format";
import type { CareHome, CareHomeProfile } from "@/types/database";

interface CareHomeCardProps {
  home: CareHome & { care_home_profiles?: CareHomeProfile | null };
}

function getInitials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function getRatingDotColor(rating: string | null): string {
  if (!rating) return "bg-gray-300";
  switch (rating.toLowerCase()) {
    case "excellent": return "bg-green-500";
    case "good": return "bg-green-500";
    case "adequate": return "bg-amber-500";
    case "poor": return "bg-red-500";
    default: return "bg-gray-300";
  }
}

function getLowestRating(ratings: (string | null)[]): string | null {
  const order = ["Poor", "Adequate", "Good", "Excellent"];
  let lowest: string | null = null;
  let lowestIdx = Infinity;
  for (const r of ratings) {
    if (!r) continue;
    const idx = order.indexOf(r);
    if (idx !== -1 && idx < lowestIdx) {
      lowestIdx = idx;
      lowest = r;
    }
  }
  return lowest;
}

const RATING_LABELS: Record<string, { cy: string; en: string }> = {
  Excellent: { cy: "Rhagorol", en: "Excellent" },
  Good: { cy: "Da", en: "Good" },
  Adequate: { cy: "Digonol", en: "Adequate" },
  Poor: { cy: "Gwael", en: "Poor" },
};

const CARE_TYPE_LABELS: Record<string, { cy: string; en: string }> = {
  residential: { cy: "Preswyl", en: "Residential" },
  nursing: { cy: "Nyrsio", en: "Nursing" },
  dementia: { cy: "Dementia", en: "Dementia" },
  respite: { cy: "Seibiant", en: "Respite" },
  "personal care": { cy: "Gofal personol", en: "Personal care" },
};

export function CareHomeCard({ home }: CareHomeCardProps) {
  const { locale } = useI18n();
  const router = useRouter();

  const name = (locale === "cy" && home.name_cy) ? home.name_cy : home.name;
  const profile = home.care_home_profiles;
  const photoUrl = profile?.photos?.[0] || null;
  const address = [home.address_line_1, home.town, home.postcode].filter(Boolean).join(", ");

  const overallRating = getLowestRating([
    home.ciw_rating_wellbeing,
    home.ciw_rating_care_support,
    home.ciw_rating_leadership,
    home.ciw_rating_environment,
  ]);

  const careTypes = (profile?.services || [home.service_type])
    .filter((s) => s && CARE_TYPE_LABELS[s])
    .slice(0, 4);

  function handleCallClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (home.phone) window.location.href = `tel:${formatPhoneForTel(home.phone)}`;
  }

  function handleViewPricing(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/cartrefi-gofal/${home.slug}#pricing`);
  }

  return (
    <Link
      href={`/cartrefi-gofal/${home.slug}`}
      className="group block overflow-hidden rounded-[16px] border border-blush-grey bg-white shadow-card transition-all duration-200 hover:shadow-modal hover:-translate-y-0.5"
    >
      {/* ═══ DESKTOP ═══ */}
      <div className="hidden md:flex">
        {/* Photo — ~45% width, full card height */}
        <div className="relative w-[45%] shrink-0 overflow-hidden bg-linen">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full min-h-[280px] items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <span className="font-heading text-5xl font-bold text-primary/20">{getInitials(home.name)}</span>
            </div>
          )}
          {/* Rooms available badge */}
          {home.bed_count != null && home.bed_count > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-green-500 px-3.5 py-1.5 text-sm font-bold text-white shadow-sm">
              {locale === "cy" ? "Ystafelloedd ar gael" : "Rooms Available"}
            </span>
          )}
        </div>

        {/* Content — 3 stacked zones */}
        <div className="flex flex-1 flex-col">

          {/* Zone 1: Name, address, CIW rating, operator */}
          <div className="flex-1 p-5 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-heading text-xl font-bold text-dusk leading-tight group-hover:text-primary transition-colors">
                  {name}
                </h3>
                <p className="mt-1.5 text-sm text-muted-plum">{address}</p>
                {/* CIW rating inline */}
                <div className="mt-2 flex items-center gap-2">
                  {overallRating && (
                    <>
                      <span className={`inline-block h-3 w-3 rounded-full ring-2 ring-white ${getRatingDotColor(overallRating)}`} />
                      <span className="text-sm text-dusk">
                        <span className="font-bold">CIW {locale === "cy" ? "Gradd" : "Rating"}</span>{" "}
                        {RATING_LABELS[overallRating]?.[locale] || overallRating}
                      </span>
                    </>
                  )}
                  {home.active_offer_level > 0 && (
                    <span className="ml-1">
                      <ActiveOfferBadge level={home.active_offer_level} size="sm" />
                    </span>
                  )}
                </div>
              </div>
              {/* Operator badge (like Lottie's logo) */}
              {home.operator_name && (
                <div className="shrink-0 rounded-[10px] border border-blush-grey bg-ivory/60 px-3 py-2 text-center">
                  <span className="block text-[10px] text-muted-plum leading-tight">{home.operator_name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="mx-5 border-t border-blush-grey" />

          {/* Zone 2: Care available + price */}
          <div className="px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-dusk">
                  {locale === "cy" ? "Gofal ar gael" : "Care available"}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
                  {careTypes.map((type) => {
                    const label = CARE_TYPE_LABELS[type];
                    return (
                      <span key={type} className="inline-flex items-center gap-1.5 text-sm text-dusk">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                          <circle cx="12" cy="12" r="10" fill="#22c55e" />
                          <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {label ? label[locale] : type}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="shrink-0 text-right">
                {profile?.weekly_fee_from ? (
                  <p className="text-sm text-muted-plum">
                    {locale === "cy" ? "O" : "From"}{" "}
                    <span className="font-heading text-2xl font-bold text-dusk">
                      &pound;{profile.weekly_fee_from.toLocaleString("en-GB")}
                    </span>{" "}
                    {locale === "cy" ? "yr wythnos" : "per week"}
                  </p>
                ) : (
                  <p className="text-sm text-muted-plum italic">
                    {locale === "cy" ? "Cysylltwch am bris" : "Contact for price"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Zone 3: CTA buttons — tinted background */}
          <div className="flex border-t border-blush-grey bg-primary/[0.04]">
            {home.phone && (
              <button
                onClick={handleCallClick}
                className="flex flex-1 items-center justify-center gap-2 border-r border-blush-grey py-3.5 text-sm font-bold text-dusk transition-colors hover:bg-primary/[0.08]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                {locale === "cy" ? "Ffonio'r cartref" : "Call home"}
              </button>
            )}
            <button
              onClick={handleViewPricing}
              className="flex flex-1 items-center justify-center py-3.5 text-sm font-bold text-white bg-secondary transition-colors hover:bg-secondary-hover"
            >
              {locale === "cy" ? "Gweld prisiau" : "View pricing"}
            </button>
          </div>
        </div>
      </div>

      {/* ═══ MOBILE ═══ */}
      <div className="md:hidden">
        {/* Photo */}
        <div className="relative h-[220px] overflow-hidden bg-linen">
          {photoUrl ? (
            <img src={photoUrl} alt={name} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <span className="font-heading text-4xl font-bold text-primary/20">{getInitials(home.name)}</span>
            </div>
          )}
          {home.bed_count != null && home.bed_count > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
              {locale === "cy" ? "Ystafelloedd ar gael" : "Rooms Available"}
            </span>
          )}
        </div>

        {/* Zone 1: Name, address, rating */}
        <div className="p-4 pb-3">
          <h3 className="font-heading text-lg font-bold text-dusk leading-tight group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="mt-1 text-sm text-muted-plum">{address}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {overallRating && (
              <div className="flex items-center gap-1.5">
                <span className={`inline-block h-2.5 w-2.5 rounded-full ${getRatingDotColor(overallRating)}`} />
                <span className="text-sm text-dusk">
                  <span className="font-bold">CIW</span> {RATING_LABELS[overallRating]?.[locale] || overallRating}
                </span>
              </div>
            )}
            {home.active_offer_level > 0 && (
              <ActiveOfferBadge level={home.active_offer_level} size="sm" />
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 border-t border-blush-grey" />

        {/* Zone 2: Care types + price */}
        <div className="px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-dusk mb-1.5">
                {locale === "cy" ? "Gofal ar gael" : "Care available"}
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {careTypes.map((type) => {
                  const label = CARE_TYPE_LABELS[type];
                  return (
                    <span key={type} className="inline-flex items-center gap-1 text-xs text-dusk">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                        <circle cx="12" cy="12" r="10" fill="#22c55e" />
                        <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {label ? label[locale] : type}
                    </span>
                  );
                })}
              </div>
            </div>
            {profile?.weekly_fee_from && (
              <p className="shrink-0 text-right text-xs text-muted-plum">
                {locale === "cy" ? "O" : "From"}{" "}
                <span className="font-heading text-lg font-bold text-dusk block">
                  &pound;{profile.weekly_fee_from.toLocaleString("en-GB")}
                </span>
                {locale === "cy" ? "yr wythnos" : "per week"}
              </p>
            )}
          </div>
        </div>

        {/* Zone 3: Buttons */}
        <div className="flex border-t border-blush-grey bg-primary/[0.04]">
          {home.phone && (
            <button
              onClick={handleCallClick}
              className="flex flex-1 items-center justify-center gap-1.5 border-r border-blush-grey py-3 text-sm font-bold text-dusk"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              {locale === "cy" ? "Ffonio" : "Call"}
            </button>
          )}
          <button
            onClick={handleViewPricing}
            className="flex flex-1 items-center justify-center py-3 text-sm font-bold text-white bg-secondary"
          >
            {locale === "cy" ? "Gweld prisiau" : "View pricing"}
          </button>
        </div>
      </div>
    </Link>
  );
}
