"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export default function ClaimVerifiedPage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="2">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <h1 className="font-heading text-3xl font-bold">{t("claim.verified_title")}</h1>
      <p className="mt-3 text-muted-plum">{t("claim.verified_message")}</p>
      <Link
        href="/cartrefi-gofal"
        className="mt-8 inline-block rounded-full bg-secondary px-6 py-3 font-body font-bold text-white transition-colors hover:bg-secondary/90"
      >
        {t("nav.directory")}
      </Link>
    </div>
  );
}
