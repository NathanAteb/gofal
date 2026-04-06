"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";

interface ClaimFormProps {
  careHomeId: string;
  careHomeName: string;
}

export function ClaimForm({ careHomeId, careHomeName }: ClaimFormProps) {
  const { locale, t } = useI18n();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.currentTarget);
    const data = {
      care_home_id: careHomeId,
      claimant_name: formData.get("claimant_name"),
      claimant_email: formData.get("claimant_email"),
      claimant_role: formData.get("claimant_role"),
    };

    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[16px] border border-blush-grey bg-white p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="font-heading text-lg font-bold">{t("claim.verified_title")}</h3>
        <p className="mt-2 text-sm text-muted-plum">
          {locale === "cy"
            ? "Rydym wedi anfon e-bost dilysu atoch. Cliciwch y ddolen i gwblhau eich hawliad."
            : "We've sent you a verification email. Click the link to complete your claim."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-heading text-xl font-bold">{t("claim.title")}</h3>
      <p className="text-sm text-muted-plum">{t("claim.subtitle")}</p>
      <p className="text-sm font-semibold text-primary">{careHomeName}</p>

      <div>
        <label htmlFor="claimant_name" className="block text-sm font-semibold text-dusk mb-1">
          {t("claim.name")} *
        </label>
        <input
          id="claimant_name"
          name="claimant_name"
          required
          className="w-full rounded-[12px] border border-blush-grey bg-ivory px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="claimant_email" className="block text-sm font-semibold text-dusk mb-1">
          {t("claim.email")} *
        </label>
        <input
          id="claimant_email"
          name="claimant_email"
          type="email"
          required
          className="w-full rounded-[12px] border border-blush-grey bg-ivory px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="claimant_role" className="block text-sm font-semibold text-dusk mb-1">
          {t("claim.role")} *
        </label>
        <select
          id="claimant_role"
          name="claimant_role"
          required
          className="w-full rounded-[12px] border border-blush-grey bg-ivory px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="manager">{t("claim.role_manager")}</option>
          <option value="owner">{t("claim.role_owner")}</option>
          <option value="admin">{t("claim.role_admin")}</option>
          <option value="other">{t("claim.role_other")}</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-secondary px-6 py-3 font-body font-bold text-white transition-colors hover:bg-secondary-hover disabled:opacity-50"
      >
        {status === "sending" ? t("enquiry.sending") : t("claim.submit")}
      </button>

      {status === "error" && (
        <p className="text-sm text-red-600">{t("common.error")} — please try again.</p>
      )}
    </form>
  );
}
