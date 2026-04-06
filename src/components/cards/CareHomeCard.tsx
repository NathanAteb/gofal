"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { ActiveOfferBadge } from "@/components/ui/ActiveOfferBadge";
import { CiwRatingBadge } from "@/components/ui/CiwRatingBadge";
import type { CareHome, CareHomeProfile } from "@/types/database";

interface CareHomeCardProps {
  home: CareHome & { care_home_profiles?: CareHomeProfile | null };
}

function getRatingBorderColor(rating: string | null): string {
  if (!rating) return "#DDD4CE";
  switch (rating.toLowerCase()) {
    case "excellent": return "#D4806A";
    case "good": return "#E5AD3E";
    case "adequate": return "#6B5C6B";
    default: return "#DDD4CE";
  }
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function CareHomeCard({ home }: CareHomeCardProps) {
  const { locale, t } = useI18n();

  const name = (locale === "cy" && home.name_cy) ? home.name_cy : home.name;
  const profile = home.care_home_profiles;
  const photoUrl = profile?.photos?.[0] || null;
  const borderColor = getRatingBorderColor(home.ciw_rating_care_support);

  return (
    <Link
      href={`/cartrefi-gofal/${home.slug}`}
      className="group block rounded-[16px] border border-blush-grey bg-white shadow-card transition-all duration-150 hover:shadow-modal hover:-translate-y-0.5"
      style={{ borderLeftWidth: "4px", borderLeftColor: borderColor }}
    >
      {/* Image / Initials placeholder */}
      <div className="relative h-44 overflow-hidden rounded-tr-[16px] bg-linen">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={`${locale === "cy" && home.name_cy ? home.name_cy : home.name} / ${home.name}`}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            className="flex h-full items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${borderColor}22, ${borderColor}44)` }}
          >
            <span className="font-heading text-4xl font-bold text-white/80">
              {getInitials(home.name)}
            </span>
          </div>
        )}

        {/* Active Offer badge — top right */}
        {home.active_offer_level > 0 && (
          <div className="absolute right-2 top-2">
            <ActiveOfferBadge level={home.active_offer_level} />
          </div>
        )}

        {/* Tier badges — top left */}
        {home.is_featured && (
          <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white">
            {t("card.featured")}
          </span>
        )}
        {home.listing_tier === "enhanced" && !home.is_featured && (
          <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white">
            {t("card.enhanced")}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* 1. Name */}
        <h3 className="font-heading text-lg font-bold text-dusk leading-tight group-hover:text-primary transition-colors">
          {name}
        </h3>

        {/* 2. Location */}
        <p className="mt-1 text-sm text-muted-plum">
          <span className="mr-1">📍</span>
          {home.town}, {home.county}
        </p>

        {/* 3. CIW ratings — all 4 themes */}
        <div className="mt-2 flex flex-wrap gap-1">
          <CiwRatingBadge rating={home.ciw_rating_wellbeing} />
          <CiwRatingBadge rating={home.ciw_rating_care_support} />
          <CiwRatingBadge rating={home.ciw_rating_leadership} />
          <CiwRatingBadge rating={home.ciw_rating_environment} />
        </div>

        {/* 4. Welsh care available pill */}
        {home.active_offer_level >= 2 && (
          <p className="mt-2 inline-block rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
            {locale === "cy" ? "Gofal Cymraeg ar gael" : "Welsh care available"}
          </p>
        )}

        {/* 5. Fee & Beds */}
        <div className="mt-3 flex items-center justify-between text-sm">
          {profile?.weekly_fee_from ? (
            <span className="font-semibold text-dusk">
              {t("card.from")} £{profile.weekly_fee_from.toLocaleString("en-GB")}/{locale === "cy" ? "wythnos" : "week"}
            </span>
          ) : (
            <span />
          )}
          {home.bed_count && (
            <span className="text-muted-plum">
              {home.bed_count} {home.bed_count === 1 ? t("card.beds") : t("card.beds_plural")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
