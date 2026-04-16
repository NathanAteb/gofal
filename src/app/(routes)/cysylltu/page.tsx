"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function ContactPage() {
  const { locale, t } = useI18n();
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const formData = new FormData(e.currentTarget);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });
      setStatus("success");
    } catch {
      setStatus("idle");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label_cy: "Cysylltu", label_en: "Contact" }]} />

      <h1 className="mt-6 font-heading text-3xl font-bold sm:text-4xl">
        {t("contact.title")}
      </h1>
      <p className="mt-2 text-muted-plum">{t("contact.subtitle")}</p>

      <div className="mt-4 rounded-[12px] bg-linen p-4 text-sm text-muted-plum">
        <p>
          <strong>E-bost / Email:</strong>{" "}
          <a href="mailto:hello@gofal.wales" className="text-primary hover:underline">hello@gofal.wales</a>
        </p>
        <p className="mt-1">
          {locale === "cy"
            ? "Byddwn yn ymateb o fewn 24 awr."
            : "We'll respond within 24 hours."}
        </p>
      </div>

      {status === "success" ? (
        <div className="mt-8 rounded-[16px] border border-blush-grey bg-white p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <p className="text-lg font-semibold">{t("contact.success")}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-dusk mb-1">
              {t("contact.name")} *
            </label>
            <input
              id="name"
              name="name"
              required
              className="w-full rounded-[12px] border border-blush-grey bg-ivory px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-dusk mb-1">
              {t("contact.email")} *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-[12px] border border-blush-grey bg-ivory px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-dusk mb-1">
              {t("contact.message")} *
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="w-full rounded-[12px] border border-blush-grey bg-ivory px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-full bg-secondary px-6 py-3 font-body font-bold text-white transition-colors hover:bg-secondary-hover disabled:opacity-50"
          >
            {status === "sending" ? t("common.loading") : t("contact.submit")}
          </button>
        </form>
      )}
    </div>
  );
}
