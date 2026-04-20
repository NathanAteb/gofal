"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";

interface EnquiryFormProps {
  careHomeId: string;
  careHomeName: string;
}

export function EnquiryForm({ careHomeId, careHomeName }: EnquiryFormProps) {
  const { t } = useI18n();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.currentTarget);
    const data = {
      care_home_id: careHomeId,
      family_name: formData.get("family_name"),
      family_email: formData.get("family_email"),
      family_phone: formData.get("family_phone"),
      care_needed_for: formData.get("care_needed_for"),
      care_type: formData.get("care_type"),
      timeline: formData.get("timeline"),
      welsh_speaker: formData.get("welsh_speaker") === "yes",
      message: formData.get("message"),
    };

    // Optimistic UI — show success immediately
    setStatus("success");

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        // Silently log — user already sees success
        console.error("Enquiry submission failed");
      }
    } catch {
      console.error("Enquiry submission failed");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[16px] border border-blush-grey bg-white p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="font-heading text-lg font-bold">{t("enquiry.success_title")}</h3>
        <p className="mt-2 text-sm text-muted-plum">{t("enquiry.success_message")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-heading text-lg font-bold">{t("enquiry.title")}</h3>
      <p className="text-sm text-muted-plum">{t("enquiry.subtitle")}</p>
      <p className="text-sm font-semibold text-primary">{careHomeName}</p>

      <div>
        <label htmlFor="family_name" className="block text-sm font-semibold text-dusk mb-1">
          {t("enquiry.name")} *
        </label>
        <input
          id="family_name"
          name="family_name"
          required
          className="w-full rounded-[12px] border border-blush-grey bg-ivory px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="family_email" className="block text-sm font-semibold text-dusk mb-1">
          {t("enquiry.email")} *
        </label>
        <input
          id="family_email"
          name="family_email"
          type="email"
          required
          className="w-full rounded-[12px] border border-blush-grey bg-ivory px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="family_phone" className="block text-sm font-semibold text-dusk mb-1">
          {t("enquiry.phone")}
        </label>
        <input
          id="family_phone"
          name="family_phone"
          type="tel"
          className="w-full rounded-[12px] border border-blush-grey bg-ivory px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="care_needed_for" className="block text-sm font-semibold text-dusk mb-1">
          {t("enquiry.care_for")} *
        </label>
        <input
          id="care_needed_for"
          name="care_needed_for"
          required
          placeholder={t("enquiry.care_for")}
          className="w-full rounded-[12px] border border-blush-grey bg-ivory px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="care_type" className="block text-sm font-semibold text-dusk mb-1">
          {t("enquiry.care_type")} *
        </label>
        <select
          id="care_type"
          name="care_type"
          required
          className="w-full rounded-[12px] border border-blush-grey bg-ivory px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">{t("filter.all_types")}</option>
          <option value="residential">{t("filter.residential")}</option>
          <option value="nursing">{t("filter.nursing")}</option>
          <option value="dementia">{t("filter.dementia")}</option>
          <option value="respite">{t("filter.respite")}</option>
          <option value="learning_disability">{t("filter.learning_disability")}</option>
        </select>
      </div>

      <div>
        <label htmlFor="timeline" className="block text-sm font-semibold text-dusk mb-1">
          {t("enquiry.timeline")} *
        </label>
        <select
          id="timeline"
          name="timeline"
          required
          className="w-full rounded-[12px] border border-blush-grey bg-ivory px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="urgent">{t("enquiry.timeline_urgent")}</option>
          <option value="1month">{t("enquiry.timeline_1month")}</option>
          <option value="3months">{t("enquiry.timeline_3months")}</option>
          <option value="exploring">{t("enquiry.timeline_exploring")}</option>
        </select>
      </div>

      <div>
        <label htmlFor="welsh_speaker" className="block text-sm font-semibold text-dusk mb-1">
          {t("enquiry.welsh_speaker")}
        </label>
        <select
          id="welsh_speaker"
          name="welsh_speaker"
          className="w-full rounded-[12px] border border-blush-grey bg-ivory px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="no">{t("common.no")}</option>
          <option value="yes">{t("common.yes")}</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-dusk mb-1">
          {t("enquiry.message")}
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          className="w-full rounded-[12px] border border-blush-grey bg-ivory px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-secondary px-6 py-3 font-body font-bold text-white transition-colors hover:bg-secondary-hover disabled:opacity-50"
      >
        {status === "sending" ? t("enquiry.sending") : t("enquiry.submit")}
      </button>

      {status === "error" && (
        <p className="text-sm text-red-600">
          {t("common.error")} — please try again.
        </p>
      )}
    </form>
  );
}
