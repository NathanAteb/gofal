"use client";

import { useI18n } from "@/lib/i18n/context";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function TermsPage() {
  const { locale } = useI18n();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label_cy: "Telerau", label_en: "Terms" }]} />

      <h1 className="mt-6 font-heading text-3xl font-bold sm:text-4xl">
        {locale === "cy" ? "Telerau Defnyddio" : "Terms of Use"}
      </h1>
      <p className="mt-2 text-sm text-muted-plum">
        {locale === "cy" ? "Diweddarwyd: Ebrill 2026" : "Updated: April 2026"}
      </p>

      <div className="mt-8 space-y-6 text-muted-plum leading-relaxed">
        {locale === "cy" ? (
          <>
            <section>
              <h2 className="font-heading text-xl font-bold text-dusk">1. Defnydd o&apos;r gwasanaeth</h2>
              <p className="mt-2">Mae gofal.wales yn gyfeiriadur cartrefi gofal ar-lein am ddim. Mae&apos;r gwasanaeth yn cael ei ddarparu &quot;fel y mae&quot; ac nid yw&apos;n cymryd lle cyngor proffesiynol.</p>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-dusk">2. Cywirdeb gwybodaeth</h2>
              <p className="mt-2">Rydym yn ceisio sicrhau bod yr holl wybodaeth yn gywir ac yn gyfredol. Mae data cartrefi gofal yn dod o Arolygiaeth Gofal Cymru (CIW). Ni allwn warantu bod yr holl wybodaeth yn hollol gywir bob amser.</p>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-dusk">3. Ymholiadau</h2>
              <p className="mt-2">Pan fyddwch yn anfon ymholiad trwy gofal.wales, byddwn yn anfon eich manylion i&apos;r cartref gofal. Nid ydym yn gyfrifol am ymateb y cartref gofal nac am unrhyw wasanaethau a ddarperir ganddynt.</p>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-dusk">4. Hawlio rhestriadau</h2>
              <p className="mt-2">Mae darparwyr gofal yn gyfrifol am gywirdeb unrhyw wybodaeth y maent yn ei hychwanegu at eu proffil ar ôl hawlio eu rhestriad.</p>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-dusk">5. Atebolrwydd</h2>
              <p className="mt-2">Ni fydd gofal.wales nac Ateb AI yn atebol am unrhyw golled neu ddifrod sy&apos;n deillio o ddefnyddio&apos;r wefan hon neu ymddiried yn y wybodaeth a geir ynddi.</p>
            </section>
          </>
        ) : (
          <>
            <section>
              <h2 className="font-heading text-xl font-bold text-dusk">1. Use of the service</h2>
              <p className="mt-2">gofal.wales is a free online care home directory. The service is provided &quot;as is&quot; and does not replace professional advice.</p>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-dusk">2. Information accuracy</h2>
              <p className="mt-2">We strive to ensure all information is accurate and current. Care home data comes from Care Inspectorate Wales (CIW). We cannot guarantee that all information is completely accurate at all times.</p>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-dusk">3. Enquiries</h2>
              <p className="mt-2">When you send an enquiry through gofal.wales, we forward your details to the care home. We are not responsible for the care home&apos;s response or any services they provide.</p>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-dusk">4. Listing claims</h2>
              <p className="mt-2">Care providers are responsible for the accuracy of any information they add to their profile after claiming their listing.</p>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-dusk">5. Liability</h2>
              <p className="mt-2">gofal.wales and Ateb AI shall not be liable for any loss or damage arising from the use of this website or reliance on the information contained within it.</p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
