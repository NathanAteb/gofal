"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { ActiveOfferBadge } from "@/components/ui/ActiveOfferBadge";
import { CiwRatingBadge } from "@/components/ui/CiwRatingBadge";
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

function getRatingBorderColor(rating: string | null): string {
  if (!rating) return "#DDD4CE";
  switch (rating.toLowerCase()) {
    case "excellent": return "#B5603A";
    case "good": return "#E5AD3E";
    case "adequate": return "#6B5C6B";
    default: return "#DDD4CE";
  }
}

function getInitials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

const SERVICE_TYPE_MAP: Record<string, { cy: string; en: string }> = {
  residential: { cy: "Preswyl", en: "Residential" },
  nursing: { cy: "Nyrsio", en: "Nursing" },
  dementia: { cy: "Dementia", en: "Dementia" },
  respite: { cy: "Seibiant", en: "Respite" },
  "learning disability": { cy: "Anabledd dysgu", en: "Learning disability" },
};

const RATING_LABELS: Record<string, { cy: string; en: string }> = {
  excellent: { cy: "Rhagorol", en: "Excellent" },
  good: { cy: "Da", en: "Good" },
  adequate: { cy: "Digonol", en: "Adequate" },
  poor: { cy: "Gwael", en: "Poor" },
};

export function CareHomeCard({ home }: CareHomeCardProps) {
  const { locale, t } = useI18n();
  const router = useRouter();

  const name = (locale === "cy" && home.name_cy) ? home.name_cy : home.name;
  const profile = home.care_home_profiles;
  const photoUrl = profile?.photos?.[0] || null;
  const borderColor = getRatingBorderColor(home.ciw_rating_care_support);

  const allRatings = [
    home.ciw_rating_wellbeing,
    home.ciw_rating_care_support,
    home.ciw_rating_leadership,
    home.ciw_rating_environment,
  ];
  const overallRating = getLowestRating(allRatings);
  const hasAnyRating = allRatings.some(Boolean);

  const serviceLabel = SERVICE_TYPE_MAP[home.service_type?.toLowerCase() || ""]
    || { cy: home.service_type, en: home.service_type };

  const ratingThemes = [
    { key: locale === "cy" ? "Llesiant" : "Wellbeing", value: home.ciw_rating_wellbeing },
    { key: locale === "cy" ? "Gofal" : "Care", value: home.ciw_rating_care_support },
    { key: locale === "cy" ? "Arweinyddiaeth" : "Leadership", value: home.ciw_rating_leadership },
    { key: locale === "cy" ? "Amgylchedd" : "Environment", value: home.ciw_rating_environment },
  ];

  function handleEnquireClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/cartrefi-gofal/${home.slug}#enquiry`);
  }

  return (
    <Link
      href={`/cartrefi-gofal/${home.slug}`}
      className="group block rounded-[16px] border border-blush-grey bg-white shadow-card transition-all duration-150 hover:shadow-modal hover:-translate-y-0.5"
      style={{ borderLeftWidth: "4px", borderLeftColor: borderColor }}
    >
      {/* ═══ DESKTOP: horizontal layout ═══ */}
      <div className="hidden sm:flex" style={{ minHeight: "160px" }}>
        {/* Image */}
        <div className="relative w-[200px] shrink-0 overflow-hidden rounded-l-[12px] bg-linen">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={`${name} / ${home.name} — Photo: Unsplash`}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center" style={{ background: `linear-gradient(135deg, ${borderColor}22, ${borderColor}44)` }}>
              <span className="font-heading text-3xl font-bold text-white/70">{getInitials(home.name)}</span>
            </div>
          )}
          {/* Care type tag */}
          <span className="absolute left-2 top-2 rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-semibold text-dusk backdrop-blur-sm">
            {locale === "cy" ? serviceLabel.cy : serviceLabel.en}
          </span>
          {/* Availability */}
          {home.bed_count != null && home.bed_count > 0 && (
            <span className="absolute left-2 bottom-2 rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-bold text-white">
              {locale === "cy" ? "Llefydd ar gael" : "Beds available"}
            </span>
          )}
        </div>

        {/* Content — three columns */}
        <div className="flex flex-1 items-stretch p-4">
          {/* LEFT: name + location + badges */}
          <div className="flex flex-1 flex-col justify-center pr-4">
            <h3 className="font-heading text-lg font-bold text-dusk leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {name}
            </h3>
            <p className="mt-1 text-sm text-muted-plum">
              <span className="mr-1">📍</span>{home.town}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {home.active_offer_level > 0 && <ActiveOfferBadge level={home.active_offer_level} />}
              {home.active_offer_level >= 2 && (
                <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                  {locale === "cy" ? "Gofal Cymraeg ar gael" : "Welsh care available"}
                </span>
              )}
            </div>
          </div>

          {/* CENTRE: CIW ratings */}
          <div className="flex flex-col justify-center border-l border-blush-grey px-4" style={{ minWidth: "150px" }}>
            {hasAnyRating && overallRating && (
              <p className="mb-1.5 text-[11px] font-semibold text-dusk">
                {locale === "cy" ? "Cyffredinol" : "Overall"}:{" "}
                <span className="font-bold">{RATING_LABELS[overallRating]?.[locale] || overallRating}</span>
              </p>
            )}
            <div className="space-y-1">
              {ratingThemes.map(({ key, value }) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-plum w-[70px] shrink-0">{key}</span>
                  <CiwRatingBadge rating={value} />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: fee + beds + enquire */}
          <div className="flex flex-col items-end justify-between border-l border-blush-grey pl-4" style={{ minWidth: "130px" }}>
            <div className="text-right">
              {profile?.weekly_fee_from ? (
                <>
                  <p className="font-heading text-xl font-bold text-dusk">
                    £{profile.weekly_fee_from.toLocaleString("en-GB")}
                  </p>
                  <p className="text-[11px] text-muted-plum">
                    /{locale === "cy" ? "wythnos" : "week"}
                  </p>
                </>
              ) : (
                <p className="text-xs text-muted-plum italic">
                  {locale === "cy" ? "Pris heb ei nodi" : "Price on request"}
                </p>
              )}
              {home.bed_count != null && home.bed_count > 0 && (
                <p className="mt-1 text-[11px] text-muted-plum">
                  {home.bed_count} {locale === "cy" ? "gwely" : "beds"}
                </p>
              )}
            </div>
            <button
              onClick={handleEnquireClick}
              className="mt-2 w-full rounded-full bg-secondary px-4 py-2 text-center font-body text-[14px] font-semibold text-white transition-colors hover:bg-secondary-hover"
            >
              {locale === "cy" ? "Ymholi" : "Enquire"}
            </button>
          </div>
        </div>
      </div>

      {/* ═══ MOBILE: vertical stack ═══ */}
      <div className="sm:hidden">
        {/* Image */}
        <div className="relative h-[180px] overflow-hidden rounded-t-[12px] bg-linen">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={`${name} / ${home.name} — Photo: Unsplash`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center" style={{ background: `linear-gradient(135deg, ${borderColor}22, ${borderColor}44)` }}>
              <span className="font-heading text-3xl font-bold text-white/70">{getInitials(home.name)}</span>
            </div>
          )}
          <span className="absolute left-2 top-2 rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-semibold text-dusk backdrop-blur-sm">
            {locale === "cy" ? serviceLabel.cy : serviceLabel.en}
          </span>
          {home.bed_count != null && home.bed_count > 0 && (
            <span className="absolute left-2 bottom-2 rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-bold text-white">
              {locale === "cy" ? "Llefydd ar gael" : "Beds available"}
            </span>
          )}
          {home.active_offer_level > 0 && (
            <div className="absolute right-2 top-2">
              <ActiveOfferBadge level={home.active_offer_level} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-heading text-lg font-bold text-dusk leading-tight group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="mt-1 text-sm text-muted-plum">
            <span className="mr-1">📍</span>{home.town}
          </p>

          {home.active_offer_level >= 2 && (
            <span className="mt-2 inline-block rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700">
              {locale === "cy" ? "Gofal Cymraeg ar gael" : "Welsh care available"}
            </span>
          )}

          {/* Overall + ratings */}
          {hasAnyRating && (
            <div className="mt-2">
              {overallRating && (
                <p className="mb-1 text-[11px] font-semibold text-dusk">
                  {locale === "cy" ? "Cyffredinol" : "Overall"}:{" "}
                  <span className="font-bold">{RATING_LABELS[overallRating]?.[locale] || overallRating}</span>
                </p>
              )}
              <div className="flex flex-wrap gap-1">
                <CiwRatingBadge rating={home.ciw_rating_wellbeing} />
                <CiwRatingBadge rating={home.ciw_rating_care_support} />
                <CiwRatingBadge rating={home.ciw_rating_leadership} />
                <CiwRatingBadge rating={home.ciw_rating_environment} />
              </div>
            </div>
          )}

          {/* Fee + enquire */}
          <div className="mt-3 flex items-center justify-between">
            {profile?.weekly_fee_from ? (
              <span className="font-heading text-lg font-bold text-dusk">
                £{profile.weekly_fee_from.toLocaleString("en-GB")}<span className="text-xs font-normal text-muted-plum">/{locale === "cy" ? "wythnos" : "wk"}</span>
              </span>
            ) : (
              <span className="text-xs text-muted-plum italic">
                {locale === "cy" ? "Pris ar gais" : "Price on request"}
              </span>
            )}
            {home.bed_count != null && home.bed_count > 0 && (
              <span className="text-xs text-muted-plum">{home.bed_count} {locale === "cy" ? "gwely" : "beds"}</span>
            )}
          </div>
          <button
            onClick={handleEnquireClick}
            className="mt-3 w-full rounded-full bg-secondary py-2.5 text-center font-body text-[14px] font-semibold text-white transition-colors hover:bg-secondary-hover"
          >
            {locale === "cy" ? "Ymholi" : "Enquire"}
          </button>
        </div>
      </div>
    </Link>
  );
}
