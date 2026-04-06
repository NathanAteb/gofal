"use client";

import { useI18n } from "@/lib/i18n/context";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label_cy: "Amdanom Ni", label_en: "About Us" }]} />

      <h1 className="mt-6 font-heading text-3xl font-bold sm:text-4xl">
        {t("about.title")}
      </h1>

      <section className="mt-8">
        <h2 className="font-heading text-2xl font-bold">{t("about.mission_title")}</h2>
        <p className="mt-3 text-muted-plum leading-relaxed">{t("about.mission")}</p>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold">{t("about.nathan_title")}</h2>
        <p className="mt-3 text-muted-plum leading-relaxed">{t("about.nathan_story")}</p>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold">{t("about.what_we_do_title")}</h2>
        <p className="mt-3 text-muted-plum leading-relaxed">{t("about.what_we_do")}</p>
      </section>
    </div>
  );
}
