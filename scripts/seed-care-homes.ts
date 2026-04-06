/**
 * Seed ~200 realistic care homes across all 22 Welsh counties.
 * Uses realistic Welsh place names, operator names, and CIW data patterns.
 *
 * Usage: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/seed-care-homes.ts
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const COUNTIES = [
  { slug: "ynys-mon", towns: ["Llangefni", "Holyhead", "Amlwch", "Menai Bridge", "Benllech", "Beaumaris"], la: "Anglesey", lat: 53.25, lng: -4.35 },
  { slug: "gwynedd", towns: ["Caernarfon", "Bangor", "Porthmadog", "Pwllheli", "Bala", "Dolgellau", "Bethesda", "Blaenau Ffestiniog"], la: "Gwynedd", lat: 52.93, lng: -4.05 },
  { slug: "conwy", towns: ["Colwyn Bay", "Llandudno", "Conwy", "Abergele", "Llanrwst", "Betws-y-Coed"], la: "Conwy", lat: 53.28, lng: -3.83 },
  { slug: "sir-ddinbych", towns: ["Denbigh", "Ruthin", "Rhyl", "Prestatyn", "Llangollen", "Corwen"], la: "Denbighshire", lat: 53.18, lng: -3.42 },
  { slug: "sir-y-fflint", towns: ["Mold", "Flint", "Buckley", "Connah's Quay", "Holywell", "Queensferry"], la: "Flintshire", lat: 53.17, lng: -3.14 },
  { slug: "wrecsam", towns: ["Wrexham", "Ruabon", "Chirk", "Cefn Mawr", "Coedpoeth"], la: "Wrexham", lat: 53.05, lng: -3.0 },
  { slug: "ceredigion", towns: ["Aberystwyth", "Aberaeron", "Cardigan", "Lampeter", "Tregaron", "New Quay"], la: "Ceredigion", lat: 52.38, lng: -4.08 },
  { slug: "sir-benfro", towns: ["Haverfordwest", "Pembroke", "Milford Haven", "Tenby", "Fishguard", "St Davids", "Narberth"], la: "Pembrokeshire", lat: 51.82, lng: -4.97 },
  { slug: "sir-gaerfyrddin", towns: ["Carmarthen", "Llanelli", "Ammanford", "Llandeilo", "Newcastle Emlyn", "Kidwelly", "Burry Port"], la: "Carmarthenshire", lat: 51.85, lng: -4.3 },
  { slug: "abertawe", towns: ["Swansea", "Mumbles", "Gorseinon", "Pontarddulais", "Clydach", "Morriston"], la: "Swansea", lat: 51.62, lng: -3.94 },
  { slug: "castell-nedd-port-talbot", towns: ["Neath", "Port Talbot", "Pontardawe", "Briton Ferry", "Resolven"], la: "Neath Port Talbot", lat: 51.66, lng: -3.81 },
  { slug: "pen-y-bont-ar-ogwr", towns: ["Bridgend", "Porthcawl", "Maesteg", "Pencoed", "Ogmore Vale"], la: "Bridgend", lat: 51.51, lng: -3.58 },
  { slug: "bro-morgannwg", towns: ["Barry", "Penarth", "Cowbridge", "Llantwit Major", "Dinas Powys"], la: "Vale of Glamorgan", lat: 51.42, lng: -3.27 },
  { slug: "caerdydd", towns: ["Cardiff", "Canton", "Whitchurch", "Llandaff", "Roath", "Pontcanna", "Radyr", "Rhiwbina"], la: "Cardiff", lat: 51.48, lng: -3.18 },
  { slug: "rhondda-cynon-taf", towns: ["Pontypridd", "Aberdare", "Tonypandy", "Treorchy", "Mountain Ash", "Porth"], la: "Rhondda Cynon Taf", lat: 51.6, lng: -3.34 },
  { slug: "caerffili", towns: ["Caerphilly", "Blackwood", "Bargoed", "Risca", "Ystrad Mynach", "Newbridge"], la: "Caerphilly", lat: 51.58, lng: -3.22 },
  { slug: "blaenau-gwent", towns: ["Ebbw Vale", "Tredegar", "Brynmawr", "Abertillery", "Blaina"], la: "Blaenau Gwent", lat: 51.78, lng: -3.21 },
  { slug: "torfaen", towns: ["Cwmbran", "Pontypool", "Blaenavon"], la: "Torfaen", lat: 51.66, lng: -3.02 },
  { slug: "sir-fynwy", towns: ["Abergavenny", "Monmouth", "Chepstow", "Usk", "Caldicot", "Raglan"], la: "Monmouthshire", lat: 51.82, lng: -2.97 },
  { slug: "casnewydd", towns: ["Newport", "Caerleon", "Rogerstone", "Bassaleg", "Marshfield"], la: "Newport", lat: 51.59, lng: -3.0 },
  { slug: "powys", towns: ["Brecon", "Newtown", "Welshpool", "Llandrindod Wells", "Builth Wells", "Knighton", "Machynlleth", "Llanidloes"], la: "Powys", lat: 52.24, lng: -3.38 },
  { slug: "merthyr-tudful", towns: ["Merthyr Tydfil", "Dowlais", "Troedyrhiw", "Aberfan"], la: "Merthyr Tydfil", lat: 51.75, lng: -3.38 },
];

const HOME_PREFIXES = [
  "Tŷ", "Cartref", "Llys", "Plas", "Bryn", "Hafod", "Maes",
  "Awel", "Dolwen", "Glan", "Coed", "Parc", "Garth", "Cwm",
];

const HOME_SUFFIXES = [
  "Gofal", "y Dderwen", "Newydd", "Bach", "Mawr", "y Bryn",
  "y Môr", "Teg", "Wen", "y Llan", "yr Afon", "y Parc",
  "Melyn", "Glas", "y Cwm",
];

const OPERATORS = [
  "Gofal Cymru Ltd", "Hafan Healthcare", "Cartref Care Group",
  "Welsh Care Services", "Cymru Care Ltd", "Brynhyfryd Healthcare",
  "Celtic Care Homes", "Valleys Care Group", "Coastal Care Wales",
  "Heritage Care Services", "Shire Care Group", "Dragon Care Ltd",
];

const MANAGERS = [
  "Megan Williams", "Dafydd Jones", "Sioned Roberts", "Carys Evans",
  "Owain Griffiths", "Elin Rees", "Rhian Davies", "Bethan Lewis",
  "Guto Morgan", "Ffion Lloyd", "Catrin Hughes", "Iwan Parry",
  "Non Thomas", "Gethin Edwards", "Angharad Bowen", "Dylan Price",
];

const RATINGS = ["Excellent", "Good", "Good", "Good", "Adequate"];
const TYPES = ["residential", "residential", "residential", "nursing", "nursing", "dementia", "dementia", "respite"];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }

function slugify(text: string): string {
  return text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  // Check what already exists
  const { count } = await supabase.from("care_homes").select("*", { count: "exact", head: true });
  console.log(`Existing homes: ${count}`);

  const existingSlugs = new Set<string>();
  if (count && count > 0) {
    const { data } = await supabase.from("care_homes").select("slug");
    data?.forEach((h) => existingSlugs.add(h.slug));
  }

  const homes: any[] = [];
  let serviceId = (count || 0) + 100;

  for (const county of COUNTIES) {
    const numHomes = rand(6, 14);
    for (let i = 0; i < numHomes; i++) {
      serviceId++;
      const town = pick(county.towns);
      const name = `${pick(HOME_PREFIXES)} ${pick(HOME_SUFFIXES)}`;
      let slug = slugify(`${name}-${town}`);
      let counter = 2;
      while (existingSlugs.has(slug)) {
        slug = `${slugify(`${name}-${town}`)}-${counter}`;
        counter++;
      }
      existingSlugs.add(slug);

      const activeOffer = county.slug === "gwynedd" || county.slug === "ynys-mon" || county.slug === "ceredigion" || county.slug === "sir-gaerfyrddin"
        ? rand(1, 3)
        : rand(0, 2);

      const type = pick(TYPES);
      const beds = type === "respite" ? rand(10, 25) : rand(20, 80);

      homes.push({
        ciw_service_id: `W${String(serviceId).padStart(5, "0")}`,
        name,
        name_cy: name,
        address_line_1: `${rand(1, 99)} ${pick(["Heol", "Ffordd", "Stryd", "Lôn"])} ${pick(["y Dŵr", "y Bryn", "y Parc", "Newydd", "y Castell", "y Môr", "y Felin"])}`,
        town,
        county: county.slug,
        postcode: `${pick(["SA", "CF", "LL", "NP", "SY", "LD"])}${rand(1, 99)} ${rand(1, 9)}${pick(["A", "B", "D", "E", "G", "H", "J", "L", "N", "P"])}${pick(["A", "B", "D", "E", "G", "H", "J", "L", "N", "P"])}`,
        phone: `0${rand(1200, 1999)} ${rand(100000, 999999)}`,
        email: `info@${slugify(name)}.wales`,
        lat: county.lat + (Math.random() - 0.5) * 0.3,
        lng: county.lng + (Math.random() - 0.5) * 0.3,
        service_type: type,
        operator_name: pick(OPERATORS),
        registered_manager: pick(MANAGERS),
        registration_date: `${rand(2005, 2022)}-${String(rand(1, 12)).padStart(2, "0")}-${String(rand(1, 28)).padStart(2, "0")}`,
        bed_count: beds,
        local_authority: county.la,
        ciw_rating_wellbeing: pick(RATINGS),
        ciw_rating_care_support: pick(RATINGS),
        ciw_rating_leadership: pick(RATINGS),
        ciw_rating_environment: pick(RATINGS),
        ciw_last_inspected: `2025-${String(rand(1, 12)).padStart(2, "0")}-${String(rand(1, 28)).padStart(2, "0")}`,
        active_offer_level: activeOffer,
        slug,
        is_active: true,
      });
    }
  }

  console.log(`Inserting ${homes.length} care homes...`);

  // Insert in batches of 50
  for (let i = 0; i < homes.length; i += 50) {
    const batch = homes.slice(i, i + 50);
    const { error } = await supabase.from("care_homes").insert(batch);
    if (error) {
      console.error(`Batch ${i} error:`, error.message);
    } else {
      console.log(`  Inserted ${i + batch.length}/${homes.length}`);
    }
  }

  // Create profiles for all new homes
  const { data: allHomes } = await supabase
    .from("care_homes")
    .select("id, name, town, service_type, active_offer_level")
    .is("is_active", true);

  const { data: existingProfiles } = await supabase
    .from("care_home_profiles")
    .select("care_home_id");

  const profileIds = new Set(existingProfiles?.map((p) => p.care_home_id));
  const newProfiles = (allHomes || [])
    .filter((h) => !profileIds.has(h.id))
    .map((h) => ({
      care_home_id: h.id,
      description: `${h.name} is a ${h.service_type} care home in ${h.town}. ${h.active_offer_level >= 2 ? "Welsh language care is available through the Active Offer." : ""} Inspected by Care Inspectorate Wales (CIW).`,
      description_cy: `Mae ${h.name} yn gartref gofal ${h.service_type === "nursing" ? "nyrsio" : h.service_type === "dementia" ? "dementia" : "preswyl"} yn ${h.town}. ${h.active_offer_level >= 2 ? "Mae gofal Cymraeg ar gael drwy'r Cynnig Rhagweithiol." : ""} Wedi'i arolygu gan Arolygiaeth Gofal Cymru (CIW).`,
      weekly_fee_from: h.service_type === "nursing" ? rand(900, 1100) : h.service_type === "dementia" ? rand(850, 1050) : rand(700, 900),
      weekly_fee_to: h.service_type === "nursing" ? rand(1200, 1400) : h.service_type === "dementia" ? rand(1100, 1300) : rand(950, 1100),
      welsh_language_notes: h.active_offer_level >= 2 ? "Welsh is spoken daily. Staff can provide care through Welsh." : h.active_offer_level === 1 ? "Some Welsh-speaking staff available." : null,
      services: [h.service_type, "personal care", "activities"],
      amenities: ["garden", "lounge", "dining room"],
    }));

  if (newProfiles.length > 0) {
    console.log(`Creating ${newProfiles.length} profiles...`);
    for (let i = 0; i < newProfiles.length; i += 50) {
      const batch = newProfiles.slice(i, i + 50);
      const { error } = await supabase.from("care_home_profiles").insert(batch);
      if (error) console.error(`Profile batch ${i} error:`, error.message);
      else console.log(`  Profiles ${i + batch.length}/${newProfiles.length}`);
    }
  }

  const { count: finalCount } = await supabase.from("care_homes").select("*", { count: "exact", head: true });
  console.log(`\nDone! Total care homes: ${finalCount}`);
}

main().catch(console.error);
