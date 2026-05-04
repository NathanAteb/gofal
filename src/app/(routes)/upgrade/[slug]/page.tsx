import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export const GOFAL_PRO_MONTHLY_GBP = 99;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Uwchraddio i Gofal Pro · Upgrade to Gofal Pro — £${GOFAL_PRO_MONTHLY_GBP}/month`,
    description: `Tudalen reoledig ddwyieithog i'ch cartref gofal · Managed bilingual page for your care service. £${GOFAL_PRO_MONTHLY_GBP}/month, no setup fee.`,
    alternates: {
      languages: { cy: `/upgrade/${slug}`, en: `/upgrade/${slug}` },
    },
  };
}

const HEATHER = "#7B5B7E";
const BRAMBLE = "#4A2F4E";
const CORAL = "#D4806A";
const HONEY = "#E5AD3E";
const IVORY = "#FBF7F3";
const BLUSH = "#DDD4CE";

const FREE_FEATURES: Array<{ en: string; cy: string }> = [
  { en: "CIW-data listing on gofal.wales", cy: "Rhestriad data CIW ar gofal.wales" },
  { en: "Address, phone, email surfaced from CIW", cy: "Cyfeiriad, ffôn, e-bost o CIW" },
  { en: "Map pin", cy: "Pin map" },
  { en: "Bilingual auto-generated description", cy: "Disgrifiad dwyieithog awtomatig" },
];

const PRO_FEATURES: Array<{ en: string; cy: string; highlight?: boolean }> = [
  { en: "Everything in the free listing", cy: "Popeth o'r rhestriad rhad ac am ddim" },
  { en: "Custom subdomain (yourname.gofal.wales) included", cy: "Is-barth (yourname.gofal.wales) wedi'i gynnwys", highlight: true },
  { en: "Connect your own domain (e.g. yourcarehome.cymru)", cy: "Cysylltu eich parth eich hun (e.e. yourcarehome.cymru)" },
  { en: "Photo gallery — up to 10 photos", cy: "Oriel luniau — hyd at 10 llun" },
  { en: "Editable bilingual welcome and services copy", cy: "Croeso a gwasanaethau dwyieithog y gallwch eu golygu" },
  { en: "Working contact form delivered to your email", cy: "Ffurflen gysylltu sy'n cyrraedd eich e-bost" },
  { en: "Welsh-speaking-staff-available badge", cy: "Bathodyn 'staff sy'n siarad Cymraeg ar gael'", highlight: true },
  { en: "Statement of Purpose and Compliance section (live June 2026)", cy: "Adran Datganiad o Bwrpas a Chydymffurfio (byw Mehefin 2026)" },
  { en: "Mobile responsive, SSL by default, indexed by Google", cy: "Ymateb i ffôn, SSL yn ddiofyn, wedi'i fynegeio gan Google" },
  { en: "No setup fee. Cancel any time.", cy: "Dim ffi sefydlu. Canslwch unrhyw bryd.", highlight: true },
];

export default async function UpgradePage({ params }: Props) {
  const { slug } = await params;

  const supabase = await createClient();
  const { data: home } = await supabase
    .from("care_homes")
    .select("ciw_service_id, name, name_cy, town, local_authority, service_type, service_sub_type, max_places, slug")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!home) notFound();

  return (
    <main style={{ background: IVORY, minHeight: "100vh", color: BRAMBLE, fontFamily: "Nunito, system-ui, sans-serif" }}>
      <header style={{ background: "white", borderBottom: `1px solid ${BLUSH}`, padding: "16px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <Link href={`/cartrefi-gofal/${slug}`} style={{ color: HEATHER, textDecoration: "none", fontWeight: 700 }}>
            ← {home.name}
          </Link>
          <div style={{ fontSize: 13, color: "#6B5670" }}>
            gofal.wales · Pro
          </div>
        </div>
      </header>

      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 24px" }}>
        <div style={{ display: "inline-block", background: HEATHER, color: "white", padding: "4px 14px", borderRadius: 9999, fontSize: 12, fontWeight: 700, marginBottom: 14 }}>
          GOFAL PRO · TUDALEN REOLEDIG · MANAGED PAGE
        </div>
        <h1 style={{ fontFamily: "Poppins, system-ui, sans-serif", fontSize: 36, lineHeight: 1.15, color: BRAMBLE, margin: 0 }}>
          Tudalen reoledig ddwyieithog i {home.name}
        </h1>
        <h2 style={{ fontFamily: "Poppins, system-ui, sans-serif", fontSize: 22, lineHeight: 1.3, color: HEATHER, margin: "8px 0 0", fontWeight: 600 }}>
          A managed bilingual page for {home.name} — £{GOFAL_PRO_MONTHLY_GBP}/month, no setup fee.
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: "#2C2430", marginTop: 18, maxWidth: 760 }}>
          Eich rhestriad rhad ac am ddim wedi'i uwchraddio i dudalen llawn — wedi'i lenwi'n awtomatig
          o ddata CIW, yn ddwyieithog, yn ymateb i ffôn, ac yn cael ei letya gan gofal.wales.
          {" "}
          <span style={{ color: "#6B5670" }}>
            Your free listing, upgraded to a full managed page — auto-populated from CIW data, bilingual,
            mobile-responsive, hosted at gofal.wales. No web designer required.
          </span>
        </p>
      </section>

      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 24px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="gofal-upgrade-grid">
          {/* Free tier */}
          <div style={{ background: "white", border: `1px solid ${BLUSH}`, borderRadius: 20, padding: 24 }}>
            <div style={{ fontSize: 12, color: "#6B5670", fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>
              Rhad ac am ddim · Free
            </div>
            <div style={{ fontFamily: "Poppins, system-ui, sans-serif", fontSize: 36, fontWeight: 700, color: BRAMBLE, margin: "6px 0" }}>
              £0
              <span style={{ fontSize: 16, color: "#6B5670", fontWeight: 400 }}> /forever</span>
            </div>
            <div style={{ color: "#6B5670", fontSize: 13 }}>
              Your default gofal.wales listing — already live for every CIW-registered service.
            </div>
            <ul style={{ listStyle: "none", padding: 0, marginTop: 18 }}>
              {FREE_FEATURES.map((f, i) => (
                <li key={i} style={{ fontSize: 14, lineHeight: 1.45, padding: "6px 0", color: "#2C2430", borderBottom: i < FREE_FEATURES.length - 1 ? `1px solid ${IVORY}` : "none" }}>
                  ✓ {f.cy} <span style={{ color: "#6B5670" }}>· {f.en}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro tier */}
          <div style={{ background: "white", border: `2px solid ${HEATHER}`, borderRadius: 20, padding: 24, position: "relative" }}>
            <div style={{ position: "absolute", top: -12, right: 16, background: HONEY, color: BRAMBLE, padding: "4px 12px", borderRadius: 9999, fontSize: 11, fontWeight: 700 }}>
              ARGYMHELLIR · RECOMMENDED
            </div>
            <div style={{ fontSize: 12, color: HEATHER, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>
              Gofal Pro
            </div>
            <div style={{ fontFamily: "Poppins, system-ui, sans-serif", fontSize: 36, fontWeight: 700, color: BRAMBLE, margin: "6px 0" }}>
              £{GOFAL_PRO_MONTHLY_GBP}
              <span style={{ fontSize: 16, color: "#6B5670", fontWeight: 400 }}> /mis · /month</span>
            </div>
            <div style={{ color: "#6B5670", fontSize: 13 }}>
              Dim ffi sefydlu · Canslwch unrhyw bryd · No setup fee · Cancel any time
            </div>
            <ul style={{ listStyle: "none", padding: 0, marginTop: 18 }}>
              {PRO_FEATURES.map((f, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: 14,
                    lineHeight: 1.45,
                    padding: "6px 0",
                    color: "#2C2430",
                    borderBottom: i < PRO_FEATURES.length - 1 ? `1px solid ${IVORY}` : "none",
                    fontWeight: f.highlight ? 700 : 400,
                  }}
                >
                  <span style={{ color: f.highlight ? CORAL : HEATHER }}>✓</span> {f.cy}{" "}
                  <span style={{ color: "#6B5670", fontWeight: 400 }}>· {f.en}</span>
                </li>
              ))}
            </ul>
            <Link
              href={`/checkout/${slug}`}
              style={{
                display: "block",
                marginTop: 22,
                background: CORAL,
                color: "white",
                padding: "14px 22px",
                borderRadius: 9999,
                fontFamily: "Poppins, system-ui, sans-serif",
                fontWeight: 700,
                textAlign: "center",
                textDecoration: "none",
                fontSize: 16,
              }}
            >
              Cychwyn Gofal Pro · Start Gofal Pro — £{GOFAL_PRO_MONTHLY_GBP}/mo
            </Link>
            <div style={{ fontSize: 11, color: "#6B5670", marginTop: 10, textAlign: "center", lineHeight: 1.4 }}>
              Tâl misol &middot; Monthly billing · VAT applied where applicable · Powered by Stripe
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 760, margin: "0 auto", padding: "16px 24px 64px", color: "#2C2430" }}>
        <h3 style={{ fontFamily: "Poppins, system-ui, sans-serif", fontSize: 18, color: BRAMBLE }}>Cwestiynau cyffredin · FAQ</h3>
        <Faq
          q_cy="A oes angen i mi ddylunio'r dudalen?"
          q_en="Do I have to design the page?"
          a_cy="Nac oes. Mae'r dudalen yn cael ei chreu'n awtomatig o ddata CIW pan fyddwch yn cofrestru. Gallwch olygu'r copi a llwytho lluniau i fyny os dymunwch — neu beidio."
          a_en="No. The page is auto-generated from CIW data the moment you subscribe. You can edit the copy and upload photos if you want — or not."
        />
        <Faq
          q_cy="A allaf gysylltu fy mharth fy hun?"
          q_en="Can I connect my own domain?"
          a_cy="Gallwch. Mae is-barth (yourname.gofal.wales) yn rhad ac am ddim. I gysylltu eich parth eich hun (e.e. yourcarehome.cymru), pwyntiwch CNAME — byddwn yn anfon cyfarwyddiadau."
          a_en="Yes. A subdomain (yourname.gofal.wales) is included. To use your own domain (e.g. yourcarehome.cymru) point a CNAME — we send the instructions."
        />
        <Faq
          q_cy="A yw'r dudalen yn ddwyieithog?"
          q_en="Is the page bilingual?"
          a_cy="Ydy. Cymraeg a Saesneg, gyda thoglo iaith yn y pennawd. Caiff y copi diofyn ei greu'n awtomatig yn y ddwy iaith o ddata CIW."
          a_en="Yes. Welsh and English with a language toggle in the header. Default copy is auto-generated in both languages from CIW data."
        />
        <Faq
          q_cy="A allaf ganslo?"
          q_en="Can I cancel?"
          a_cy="Gallwch unrhyw bryd. Bydd y dudalen yn dychwelyd i'r rhestriad rhad ac am ddim ar ddiwedd y cyfnod biliau cyfredol."
          a_en="Yes, any time. The page reverts to the free listing at the end of the current billing period."
        />
      </section>

      <style>{`
        @media (max-width: 720px) {
          .gofal-upgrade-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}

function Faq({ q_cy, q_en, a_cy, a_en }: { q_cy: string; q_en: string; a_cy: string; a_en: string }) {
  return (
    <div style={{ marginTop: 16, padding: "14px 0", borderTop: `1px solid ${BLUSH}` }}>
      <div style={{ fontWeight: 700, color: BRAMBLE, fontSize: 15 }}>{q_cy}</div>
      <div style={{ fontSize: 13, color: "#6B5670", marginTop: 2 }}>{q_en}</div>
      <div style={{ fontSize: 14, lineHeight: 1.55, color: "#2C2430", marginTop: 8 }}>
        {a_cy} <span style={{ color: "#6B5670" }}>· {a_en}</span>
      </div>
    </div>
  );
}
