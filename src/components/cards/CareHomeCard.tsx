"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { ActiveOfferBadge } from "@/components/ui/ActiveOfferBadge";
import { CiwRatingBadge } from "@/components/ui/CiwRatingBadge";
import { formatPhoneForTel } from "@/lib/utils/format";
import type { CareHome, CareHomeProfile } from "@/types/database";

interface CareHomeCardProps {
  home: CareHome & { care_home_profiles?: CareHomeProfile | null };
}

const RATING_ORDER = ["excellent", "good", "adequate", "poor"] as const;

function getLowestRating(ratings: (string | null)[]): string | null {
  const valid = ratings.filter(Boolean).map((r) => r!.toLowerCase());
  if (valid.length === 0) return null;
  for (const level of [...RATING_ORDER].reverse()) {
    if (valid.includes(level)) return level;
  }
  return valid[0];
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

const SERVICE_TYPE_MAP: Record<string, { cy: string; en: string }> = {
  residential: { cy: "Preswyl", en: "Residential" },
  nursing: { cy: "Nyrsio", en: "Nursing" },
  dementia: { cy: "Dementia", en: "Dementia" },
  respite: { cy: "Seibiant", en: "Respite" },
  "learning disability": { cy: "Anabledd dysgu", en: "Learning disability" },
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

  const allRatings = [
    home.ciw_rating_wellbeing,
    home.ciw_rating_care_support,
    home.ciw_rating_leadership,
    home.ciw_rating_environment,
  ];
  const overallRating = getLowestRating(allRatings);

  const serviceLabel = SERVICE_TYPE_MAP[home.service_type?.toLowerCase() || ""]
    || { cy: home.service_type, en: home.service_type };

  // Build care types from profile services
  const careTypes = (profile?.services || [home.service_type])
    .filter((s) => s && CARE_TYPE_LABELS[s])
    .slice(0, 4);

  const address = [home.address_line_1, home.town, home.postcode].filter(Boolean).join(", ");

  function handleEnquireClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/cartrefi-gofal/${home.slug}#enquiry`);
  }

  function handleCallClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (home.phone) {
      window.location.href = `tel:${formatPhoneForTel(home.phone)}`;
    }
  }

  return (
    <Link
      href={`/cartrefi-gofal/${home.slug}`}
      className="group block overflow-hidden rounded-[16px] border border-blush-grey bg-white shadow-card transition-all duration-200 hover:shadow-modal hover:-translate-y-0.5"
    >
      {/* ═══ DESKTOP: Lottie-style horizontal ═══ */}
      <div className="hidden md:flex">
        {/* Photo area — ~40% width */}
        <div className="relative w-[280px] shrink-0 overflow-hidden bg-linen">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div
              className="flex h-full min-h-[240px] items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7B5B7E22, #D4806A22)" }}
            >
              <span className="font-heading text-4xl font-bold text-primary/30">{getInitials(home.name)}</span>
            </div>
          )}
          {/* Rooms available badge */}
          {home.bed_count != null && home.bed_count > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
              {locale === "cy" ? "Ystafelloedd ar gael" : "Rooms Available"}
            </span>
          )}
        </div>

        {/* Content area */}
        <div className="flex flex-1 flex-col justify-between p-5">
          {/* Top section */}
          <div>
            {/* Name + operator */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-heading text-xl font-bold text-dusk leading-tight group-hover:text-primary transition-colors">
                  {name}
                </h3>
                <p className="mt-1 text-sm text-muted-plum">{address}</p>
              </div>
              {home.operator_name && (
                <span className="shrink-0 rounded-[8px] bg-linen px-2.5 py-1.5 text-[11px] font-semibold text-muted-plum">
                  {home.operator_name.length > 20 ? home.operator_name.slice(0, 18) + "..." : home.operator_name}
                </span>
              )}
            </div>

            {/* CIW rating + Active Offer */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {overallRating && (
                <div className="flex items-center gap-1.5">
                  <span className={`inline-block h-2.5 w-2.5 rounded-full ${getRatingDotColor(overallRating)}`} />
                  <span className="text-sm text-dusk">
                    <span className="font-semibold">CIW</span>{" "}
                    <CiwRatingBadge rating={overallRating} size="sm" />
                  </span>
                </div>
              )}
              {home.active_offer_level > 0 && (
                <ActiveOfferBadge level={home.active_offer_level} size="sm" />
              )}
              {home.active_offer_level >= 2 && (
                <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-[11px] font-semibold text-green-700">
                  {locale === "cy" ? "Gofal Cymraeg" : "Welsh care"}
                </span>
              )}
            </div>

            {/* Care available + Price */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-muted-plum uppercase tracking-wide mb-1.5">
                  {locale === "cy" ? "Gofal ar gael" : "Care available"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {careTypes.map((type) => {
                    const label = CARE_TYPE_LABELS[type];
                    return (
                      <span key={type} className="inline-flex items-center gap-1 text-sm text-dusk">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-green-500">
                          <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
                          <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2.5" fill="none" />
                        </svg>
                        {label ? label[locale] : type}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="text-right">
                {profile?.weekly_fee_from ? (
                  <p className="text-sm text-muted-plum">
                    {locale === "cy" ? "O" : "From"}{" "}
                    <span className="font-heading text-xl font-bold text-dusk">
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

          {/* Bottom buttons */}
          <div className="mt-4 flex gap-3 border-t border-blush-grey pt-4">
            {home.phone && (
              <button
                onClick={handleCallClick}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-blush-grey bg-white px-4 py-2.5 text-sm font-semibold text-dusk transition-colors hover:bg-ivory"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                {locale === "cy" ? "Ffonio'r cartref" : "Call home"}
              </button>
            )}
            <button
              onClick={handleEnquireClick}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-secondary px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-secondary-hover"
            >
              {locale === "cy" ? "Gweld prisiau" : "View pricing"}
            </button>
          </div>
        </div>
      </div>

      {/* ═══ MOBILE: Lottie-style vertical ═══ */}
      <div className="md:hidden">
        {/* Photo */}
        <div className="relative h-[200px] overflow-hidden bg-linen">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div
              className="flex h-full items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7B5B7E22, #D4806A22)" }}
            >
              <span className="font-heading text-4xl font-bold text-primary/30">{getInitials(home.name)}</span>
            </div>
          )}
          {home.bed_count != null && home.bed_count > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
              {locale === "cy" ? "Ystafelloedd ar gael" : "Rooms Available"}
            </span>
          )}
          {home.active_offer_level > 0 && (
            <div className="absolute right-3 top-3">
              <ActiveOfferBadge level={home.active_offer_level} size="sm" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-heading text-lg font-bold text-dusk leading-tight group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="mt-1 text-sm text-muted-plum">{address}</p>

          {/* CIW + Welsh badge */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {overallRating && (
              <div className="flex items-center gap-1.5">
                <span className={`inline-block h-2 w-2 rounded-full ${getRatingDotColor(overallRating)}`} />
                <span className="text-sm font-semibold text-dusk">CIW</span>
                <CiwRatingBadge rating={overallRating} size="sm" />
              </div>
            )}
            {home.active_offer_level >= 2 && (
              <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                {locale === "cy" ? "Gofal Cymraeg" : "Welsh care"}
              </span>
            )}
          </div>

          {/* Care types */}
          <div className="mt-3">
            <p className="text-[11px] font-semibold text-muted-plum uppercase tracking-wide mb-1">
              {locale === "cy" ? "Gofal ar gael" : "Care available"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {careTypes.map((type) => {
                const label = CARE_TYPE_LABELS[type];
                return (
                  <span key={type} className="inline-flex items-center gap-1 text-xs text-dusk">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-green-500">
                      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
                      <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2.5" fill="none" />
                    </svg>
                    {label ? label[locale] : type}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Price */}
          <div className="mt-3">
            {profile?.weekly_fee_from ? (
              <p className="text-sm text-muted-plum">
                {locale === "cy" ? "O" : "From"}{" "}
                <span className="font-heading text-lg font-bold text-dusk">
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

          {/* Buttons */}
          <div className="mt-3 flex gap-2">
            {home.phone && (
              <button
                onClick={handleCallClick}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-blush-grey bg-white px-3 py-2.5 text-sm font-semibold text-dusk"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                {locale === "cy" ? "Ffonio" : "Call"}
              </button>
            )}
            <button
              onClick={handleEnquireClick}
              className="flex flex-1 items-center justify-center rounded-full bg-secondary px-3 py-2.5 text-sm font-bold text-white"
            >
              {locale === "cy" ? "Gweld prisiau" : "View pricing"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
