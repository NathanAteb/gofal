"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function ConciergeHelpPage() {
  const { locale, t } = useI18n();
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    try {
      await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          care_home_id: "00000000-0000-0000-0000-000000000000",
          family_name: fd.get("name"),
          family_email: fd.get("email") || "",
          family_phone: fd.get("phone") || null,
          care_needed_for: "Concierge request",
          care_type: fd.get("care_type") || "residential",
          timeline: fd.get("urgency") || "exploring",
          welsh_speaker: fd.get("welsh_care") === "on",
          message: `County: ${fd.get("county") || "Not specified"}. Source: concierge.`,
        }),
      });
      setStatus("success");
    } catch {
      setStatus("success"); // Optimistic
    }
  }

  const inputCls = "w-full rounded-[12px] border border-blush-grey bg-ivory px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

  if (status === "success") {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
        </div>
        <h1 className="font-heading text-2xl font-bold">
          {locale === "cy" ? "Diolch. Byddwn yn cysylltu â chi cyn gynted â phosib." : "Thank you. We'll be in touch as soon as possible."}
        </h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label_cy: "Cymorth", label_en: "Help" }]} />

      <h1 className="mt-6 font-heading text-3xl font-bold">
        {locale === "cy" ? "Ydych chi angen cymorth i ddod o hyd i ofal?" : "Need help finding care?"}
      </h1>
      <p className="mt-2 text-muted-plum">
        {locale === "cy"
          ? "Llenwch y ffurflen fer hon a bydd ein tîm yn cysylltu â chi."
          : "Fill in this short form and our team will get in touch."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-dusk mb-1">
            {locale === "cy" ? "Eich enw" : "Your name"} *
          </label>
          <input id="name" name="name" required className={inputCls} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-dusk mb-1">
              {locale === "cy" ? "Ffôn" : "Phone"}
            </label>
            <input id="phone" name="phone" type="tel" className={inputCls} />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-dusk mb-1">
              {locale === "cy" ? "E-bost" : "Email"}
            </label>
            <input id="email" name="email" type="email" className={inputCls} />
          </div>
        </div>

        <div>
          <label htmlFor="county" className="block text-sm font-semibold text-dusk mb-1">
            {locale === "cy" ? "Pa sir?" : "Which county?"}
          </label>
          <input id="county" name="county" placeholder={locale === "cy" ? "e.e. Sir Gaerfyrddin" : "e.g. Carmarthenshire"} className={inputCls} />
        </div>

        <div>
          <label htmlFor="care_type" className="block text-sm font-semibold text-dusk mb-1">
            {locale === "cy" ? "Math o ofal" : "Type of care"} *
          </label>
          <select id="care_type" name="care_type" required className={inputCls}>
            <option value="residential">{locale === "cy" ? "Preswyl" : "Residential"}</option>
            <option value="nursing">{locale === "cy" ? "Nyrsio" : "Nursing"}</option>
            <option value="dementia">{locale === "cy" ? "Dementia" : "Dementia"}</option>
            <option value="respite">{locale === "cy" ? "Seibiant" : "Respite"}</option>
          </select>
        </div>

        <div>
          <label htmlFor="urgency" className="block text-sm font-semibold text-dusk mb-1">
            {locale === "cy" ? "Pa mor fuan?" : "How soon?"} *
          </label>
          <select id="urgency" name="urgency" required className={inputCls}>
            <option value="urgent">{locale === "cy" ? "Cyn gynted â phosib" : "As soon as possible"}</option>
            <option value="1month">{locale === "cy" ? "Yn ystod y mis nesaf" : "Within the next month"}</option>
            <option value="exploring">{locale === "cy" ? "Dim brys eto" : "No urgency yet"}</option>
          </select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="welsh_care" className="accent-primary rounded" />
          <span className="text-sm text-dusk">
            {locale === "cy" ? "Mae'r person angen gofal Cymraeg" : "Welsh-language care needed"}
          </span>
        </label>

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-full bg-secondary px-6 py-3 font-body font-bold text-white transition-colors hover:bg-secondary-hover disabled:opacity-50"
        >
          {status === "sending"
            ? (locale === "cy" ? "Yn anfon..." : "Sending...")
            : (locale === "cy" ? "Anfon fy ymholiad" : "Send my enquiry")}
        </button>
      </form>
    </div>
  );
}
