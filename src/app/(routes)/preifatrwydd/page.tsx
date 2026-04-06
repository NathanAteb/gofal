"use client";

import { useI18n } from "@/lib/i18n/context";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function PrivacyPage() {
  const { locale } = useI18n();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label_cy: "Preifatrwydd", label_en: "Privacy" }]} />

      <h1 className="mt-6 font-heading text-3xl font-bold sm:text-4xl">
        {locale === "cy" ? "Polisi Preifatrwydd" : "Privacy Policy"}
      </h1>
      <p className="mt-2 text-sm text-muted-plum">
        {locale === "cy" ? "Diweddarwyd: Ebrill 2026" : "Updated: April 2026"}
      </p>

      <div className="mt-8 space-y-6 text-muted-plum leading-relaxed">
        {locale === "cy" ? (
          <>
            <section>
              <h2 className="font-heading text-xl font-bold text-dusk">1. Pwy ydym ni</h2>
              <p className="mt-2">Mae gofal.wales yn cael ei weithredu gan Ateb AI, cwmni wedi&apos;i leoli yn Llanelli, Cymru. Rydym yn ymrwymedig i ddiogelu eich preifatrwydd a&apos;ch data personol.</p>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-dusk">2. Pa ddata rydym yn ei gasglu</h2>
              <p className="mt-2">Rydym yn casglu&apos;r data canlynol pan fyddwch yn defnyddio gofal.wales:</p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Gwybodaeth a roddwch i ni trwy ffurflenni ymholiad (enw, e-bost, rhif ffôn, manylion gofal)</li>
                <li>Gwybodaeth am eich defnydd o&apos;r wefan (trwy Vercel Analytics — dienw)</li>
                <li>Cwcis angenrheidiol ar gyfer gweithrediad y wefan</li>
              </ul>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-dusk">3. Sut rydym yn defnyddio eich data</h2>
              <p className="mt-2">Rydym yn defnyddio eich data i:</p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Anfon eich ymholiad i&apos;r cartref gofal perthnasol</li>
                <li>Cadarnhau eich ymholiad trwy e-bost</li>
                <li>Gwella&apos;r wefan a&apos;r gwasanaeth</li>
              </ul>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-dusk">4. Rhannu data</h2>
              <p className="mt-2">Rydym yn rhannu eich data ymholiad gyda&apos;r cartref gofal y gwnaethoch ymholi amdano yn unig. Nid ydym yn gwerthu eich data i drydydd partïon.</p>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-dusk">5. Eich hawliau</h2>
              <p className="mt-2">O dan GDPR y DU, mae gennych yr hawl i gael mynediad at, cywiro, neu ddileu eich data personol. Cysylltwch â ni ar hello@gofal.wales.</p>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-dusk">6. Cysylltu</h2>
              <p className="mt-2">Am unrhyw gwestiynau am ein polisi preifatrwydd, cysylltwch â: hello@gofal.wales</p>
            </section>
          </>
        ) : (
          <>
            <section>
              <h2 className="font-heading text-xl font-bold text-dusk">1. Who we are</h2>
              <p className="mt-2">gofal.wales is operated by Ateb AI, a company based in Llanelli, Wales. We are committed to protecting your privacy and personal data.</p>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-dusk">2. What data we collect</h2>
              <p className="mt-2">We collect the following data when you use gofal.wales:</p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Information you provide via enquiry forms (name, email, phone number, care details)</li>
                <li>Information about your use of the website (via Vercel Analytics — anonymous)</li>
                <li>Essential cookies for website operation</li>
              </ul>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-dusk">3. How we use your data</h2>
              <p className="mt-2">We use your data to:</p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Send your enquiry to the relevant care home</li>
                <li>Confirm your enquiry via email</li>
                <li>Improve the website and service</li>
              </ul>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-dusk">4. Data sharing</h2>
              <p className="mt-2">We share your enquiry data only with the care home you enquired about. We do not sell your data to third parties.</p>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-dusk">5. Your rights</h2>
              <p className="mt-2">Under UK GDPR, you have the right to access, correct, or delete your personal data. Contact us at hello@gofal.wales.</p>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-dusk">6. Contact</h2>
              <p className="mt-2">For any questions about our privacy policy, contact: hello@gofal.wales</p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
