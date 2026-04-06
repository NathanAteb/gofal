"use client";

import { use } from "react";
import { useI18n } from "@/lib/i18n/context";
import { ClaimForm } from "@/components/forms/ClaimForm";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function ClaimPage({ params }: Props) {
  const { slug } = use(params);
  const { locale } = useI18n();

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
      <Breadcrumbs
        items={[
          { label_cy: "Cartrefi Gofal", label_en: "Care Homes", href: "/cartrefi-gofal" },
          { label_cy: "Hawlio", label_en: "Claim" },
        ]}
      />
      <div className="mt-6 rounded-[16px] border border-blush-grey bg-white p-6 shadow-card">
        <ClaimForm careHomeId={slug} careHomeName={slug} />
      </div>
    </div>
  );
}
