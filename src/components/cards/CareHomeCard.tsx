"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { ActiveOfferBadge } from "@/components/ui/ActiveOfferBadge";
import { CiwRatingBadge } from "@/components/ui/CiwRatingBadge";
import type { CareHome, CareHomeProfile } from "@/types/database";

interface CareHomeCardProps {
  home: CareHome & { care_home_profiles?: CareHomeProfile | null };
}

export function CareHomeCard({ home }: CareHomeCardProps) {
  const { locale, t } = useI18n();

  const name = (locale === "cy" && home.name_cy) ? home.name_cy : home.name;
  const profile = home.care_home_profiles;
  const photoUrl = profile?.photos?.[0] || null;

  return (
    <Link
      href={`/cartrefi-gofal/${home.slug}`}
      className="group block rounded-[16px] border border-blush-grey bg-white shadow-card transition-shadow hover:shadow-modal"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden rounded-t-[16px] bg-linen">
        <img
          src={photoUrl || `https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&q=75&fm=webp&fit=crop&txt=${encodeURIComponent(name)}`}
          alt={`${locale === "cy" && home.name_cy ? home.name_cy : home.name} / ${home.name}`}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />

        {/* Tier badges */}
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
        <h3 className="font-heading text-lg font-bold text-dusk leading-tight group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="mt-1 text-sm text-muted-plum">
          {home.town}, {locale === "cy" ? home.county : home.county}
        </p>

        {/* Badges */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          <ActiveOfferBadge level={home.active_offer_level} />
          <CiwRatingBadge rating={home.ciw_rating_care_support} />
        </div>

        {/* Fee & Beds */}
        <div className="mt-3 flex items-center justify-between text-sm">
          {profile?.weekly_fee_from ? (
            <span className="font-semibold text-dusk">
              {t("card.from")} £{profile.weekly_fee_from.toLocaleString("en-GB")} {t("card.per_week")}
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
