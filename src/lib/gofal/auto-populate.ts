/**
 * auto-populate.ts
 *
 * Deterministic bilingual template generators for Gofal Pro pages. Every
 * string returned here is built from CIW register fields — no LLM call at
 * request time. The Welsh translations are fixed templates so the customer
 * never sees a hallucinated phrase.
 *
 * The Pro page is shippable from these defaults alone; the customer can
 * override any field via the dashboard.
 */

export type ServiceTypeKey =
  | "care-home-with-nursing"
  | "care-home-without-nursing"
  | "care-home-mixed"
  | "domiciliary"
  | "adult-placement"
  | "other";

interface AutoPopInput {
  name: string;
  service_type: string;
  service_sub_type: string | null;
  town: string;
  local_authority: string | null;
  max_places: number | null;
  ciw_service_id: string;
}

export function classifyServiceType(input: Pick<AutoPopInput, "service_type" | "service_sub_type">): ServiceTypeKey {
  const t = input.service_type;
  const s = input.service_sub_type ?? "";
  if (t === "Care Home Service") {
    if (s === "Adults With Nursing") return "care-home-with-nursing";
    if (s === "Adults Without Nursing") return "care-home-without-nursing";
    if (s === "Adults and Children Without Nursing") return "care-home-mixed";
    return "care-home-without-nursing";
  }
  if (t === "Domiciliary Support Service") return "domiciliary";
  if (t === "Adult Placement Service") return "adult-placement";
  return "other";
}

/**
 * Bilingual labels for the service type descriptor used in the hero copy.
 * These are reviewed strings — do not auto-translate anywhere else in the
 * app, use these constants.
 */
export const SERVICE_LABELS: Record<ServiceTypeKey, { en: string; cy: string; descriptor_en: string; descriptor_cy: string }> = {
  "care-home-with-nursing": {
    en: "care home with nursing",
    cy: "cartref gofal gyda nyrsio",
    descriptor_en: "We are a care home providing nursing care for adults",
    descriptor_cy: "Rydym yn gartref gofal sy'n darparu gofal nyrsio i oedolion",
  },
  "care-home-without-nursing": {
    en: "residential care home",
    cy: "cartref gofal preswyl",
    descriptor_en: "We are a residential care home for adults",
    descriptor_cy: "Rydym yn gartref gofal preswyl i oedolion",
  },
  "care-home-mixed": {
    en: "care home for adults and children (residential)",
    cy: "cartref gofal i oedolion a phlant (preswyl)",
    descriptor_en: "We are a residential care home for adults and children",
    descriptor_cy: "Rydym yn gartref gofal preswyl i oedolion a phlant",
  },
  domiciliary: {
    en: "domiciliary support service",
    cy: "gwasanaeth cymorth cartref",
    descriptor_en: "We are a domiciliary support service providing care to adults in their own homes",
    descriptor_cy: "Rydym yn wasanaeth cymorth cartref sy'n darparu gofal i oedolion yn eu cartrefi eu hunain",
  },
  "adult-placement": {
    en: "adult placement service",
    cy: "gwasanaeth lleoli oedolion",
    descriptor_en: "We are an adult placement service",
    descriptor_cy: "Rydym yn wasanaeth lleoli oedolion",
  },
  other: {
    en: "care service",
    cy: "gwasanaeth gofal",
    descriptor_en: "We are a care service",
    descriptor_cy: "Rydym yn wasanaeth gofal",
  },
};

export function autoHeroIntro(input: AutoPopInput): { en: string; cy: string } {
  const key = classifyServiceType(input);
  const labels = SERVICE_LABELS[key];
  const placesEn =
    input.max_places && (key === "care-home-with-nursing" || key === "care-home-without-nursing" || key === "care-home-mixed")
      ? `, with ${input.max_places} registered places`
      : "";
  const placesCy =
    input.max_places && (key === "care-home-with-nursing" || key === "care-home-without-nursing" || key === "care-home-mixed")
      ? `, gyda ${input.max_places} o leoedd cofrestredig`
      : "";
  const laEn = input.local_authority ? `, ${input.local_authority}` : "";
  const laCy = input.local_authority ? `, ${input.local_authority}` : "";

  return {
    en:
      `Welcome to ${input.name}. ${labels.descriptor_en}, registered with Care Inspectorate Wales (CIW)${placesEn}, ` +
      `based in ${input.town}${laEn}.`,
    cy:
      `Croeso i ${input.name}. ${labels.descriptor_cy}, wedi'n cofrestru gydag Arolygiaeth Gofal Cymru (CIW)${placesCy}, ` +
      `wedi'n lleoli yn ${input.town}${laCy}.`,
  };
}

export function autoServicesDescription(input: Pick<AutoPopInput, "service_type" | "service_sub_type">): { en: string; cy: string } {
  const key = classifyServiceType(input);
  switch (key) {
    case "care-home-with-nursing":
      return {
        en: "We provide residential care home services with nursing for adults — including 24-hour nursing care, support with daily living, medication management, and end-of-life care where appropriate.",
        cy: "Rydym yn darparu gwasanaethau cartref gofal preswyl gyda nyrsio i oedolion — gan gynnwys gofal nyrsio 24-awr, cefnogaeth gyda byw bob dydd, rheoli meddyginiaeth, a gofal diwedd oes lle bo'n briodol.",
      };
    case "care-home-without-nursing":
      return {
        en: "We provide residential care home services for adults — including support with daily living, personal care, social activities, and a safe home-from-home environment.",
        cy: "Rydym yn darparu gwasanaethau cartref gofal preswyl i oedolion — gan gynnwys cefnogaeth gyda byw bob dydd, gofal personol, gweithgareddau cymdeithasol, ac amgylchedd cartref-o-gartref diogel.",
      };
    case "care-home-mixed":
      return {
        en: "We provide residential care home services for both adults and children — including specialist support, daily living assistance and a safe environment.",
        cy: "Rydym yn darparu gwasanaethau cartref gofal preswyl i oedolion a phlant — gan gynnwys cefnogaeth arbenigol, cymorth byw bob dydd ac amgylchedd diogel.",
      };
    case "domiciliary":
      return {
        en: "We provide domiciliary care services — visiting adults in their own homes to support daily living, personal care, medication, and companionship, on schedules that fit each person.",
        cy: "Rydym yn darparu gwasanaethau gofal cartref — yn ymweld ag oedolion yn eu cartrefi eu hunain i gefnogi byw bob dydd, gofal personol, meddyginiaeth, a chwmnïaeth, ar amserlenni sy'n addas i bob person.",
      };
    case "adult-placement":
      return {
        en: "We are an adult placement service — matching adults who need support with approved carers in their own homes.",
        cy: "Rydym yn wasanaeth lleoli oedolion — yn paru oedolion sydd angen cefnogaeth gyda gofalwyr cymeradwy yn eu cartrefi eu hunain.",
      };
    default:
      return {
        en: "We are a care service registered with Care Inspectorate Wales.",
        cy: "Rydym yn wasanaeth gofal sydd wedi'i gofrestru gydag Arolygiaeth Gofal Cymru.",
      };
  }
}

/**
 * The Welsh-medium badge tooltip — verbatim copy from the spec. Same string
 * appears on the public page and in admin views to keep the claim discipline.
 */
export function welshMediumBadgeTooltip(verifiedAt: Date | null): string {
  if (verifiedAt) {
    const d = verifiedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    return `This service has self-declared that Welsh-speaking staff are available. Verified by gofal.wales — ${d}.`;
  }
  return "This service has self-declared that Welsh-speaking staff are available. Awaiting verification.";
}

/**
 * Default opening / visiting hours JSON for new Pro subscriptions.
 * Customer can override per-day in the dashboard. We seed sensible defaults
 * rather than empty so the page never shows "we have no opening hours".
 */
export const DEFAULT_OPENING_HOURS = {
  monday: { open: "09:00", close: "17:00" },
  tuesday: { open: "09:00", close: "17:00" },
  wednesday: { open: "09:00", close: "17:00" },
  thursday: { open: "09:00", close: "17:00" },
  friday: { open: "09:00", close: "17:00" },
  saturday: { open: null, close: null, note_en: "By appointment", note_cy: "Trwy apwyntiad" },
  sunday: { open: null, close: null, note_en: "By appointment", note_cy: "Trwy apwyntiad" },
} as const;

export const DEFAULT_VISITING_HOURS = {
  monday: { open: "10:00", close: "20:00" },
  tuesday: { open: "10:00", close: "20:00" },
  wednesday: { open: "10:00", close: "20:00" },
  thursday: { open: "10:00", close: "20:00" },
  friday: { open: "10:00", close: "20:00" },
  saturday: { open: "10:00", close: "20:00" },
  sunday: { open: "10:00", close: "20:00" },
} as const;
