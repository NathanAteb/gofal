"use client";

import { useI18n } from "@/lib/i18n/context";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function CookiesPage() {
  const { locale } = useI18n();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label_cy: "Cwcis", label_en: "Cookies" }]} />

      <h1 className="mt-6 font-heading text-3xl font-bold sm:text-4xl">
        {locale === "cy" ? "Polisi Cwcis" : "Cookie Policy"}
      </h1>
      <p className="mt-2 text-sm text-muted-plum">
        {locale === "cy" ? "Diweddarwyd: Ebrill 2026" : "Updated: April 2026"}
      </p>

      <div className="mt-8 space-y-6 text-muted-plum leading-relaxed">
        {locale === "cy" ? (
          <>
            <section>
              <h2 className="font-heading text-xl font-bold text-dusk">Beth yw cwcis?</h2>
              <p className="mt-2">Mae cwcis yn ffeiliau testun bach sy&apos;n cael eu storio ar eich dyfais pan fyddwch yn ymweld â gwefan. Maent yn helpu&apos;r wefan i gofio eich dewisiadau.</p>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-dusk">Pa gwcis rydym yn eu defnyddio</h2>
              <ul className="mt-2 space-y-3">
                <li><strong>gofal-locale</strong> — Yn cofio eich dewis iaith (Cymraeg/Saesneg). Cwci hanfodol.</li>
                <li><strong>Vercel Analytics</strong> — Dadansoddeg dienw i&apos;n helpu i ddeall sut mae&apos;r wefan yn cael ei defnyddio. Dim data personol.</li>
              </ul>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-dusk">Sut i reoli cwcis</h2>
              <p className="mt-2">Gallwch reoli neu ddileu cwcis trwy osodiadau eich porwr. Sylwch y gall analluogi cwcis effeithio ar weithrediad y wefan.</p>
            </section>
          </>
        ) : (
          <>
            <section>
              <h2 className="font-heading text-xl font-bold text-dusk">What are cookies?</h2>
              <p className="mt-2">Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences.</p>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-dusk">What cookies we use</h2>
              <ul className="mt-2 space-y-3">
                <li><strong>gofal-locale</strong> ��� Remembers your language preference (Welsh/English). Essential cookie.</li>
                <li><strong>Vercel Analytics</strong> — Anonymous analytics to help us understand how the website is used. No personal data.</li>
              </ul>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-dusk">How to control cookies</h2>
              <p className="mt-2">You can control or delete cookies through your browser settings. Note that disabling cookies may affect the functionality of the website.</p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
