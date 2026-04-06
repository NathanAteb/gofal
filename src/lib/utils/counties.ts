import type { County } from "@/types/database";

export const counties: County[] = [
  { slug: "ynys-mon", name_cy: "Ynys Môn", name_en: "Anglesey" },
  { slug: "blaenau-gwent", name_cy: "Blaenau Gwent", name_en: "Blaenau Gwent" },
  { slug: "pen-y-bont-ar-ogwr", name_cy: "Pen-y-bont ar Ogwr", name_en: "Bridgend" },
  { slug: "caerffili", name_cy: "Caerffili", name_en: "Caerphilly" },
  { slug: "caerdydd", name_cy: "Caerdydd", name_en: "Cardiff" },
  { slug: "sir-gaerfyrddin", name_cy: "Sir Gaerfyrddin", name_en: "Carmarthenshire" },
  { slug: "ceredigion", name_cy: "Ceredigion", name_en: "Ceredigion" },
  { slug: "conwy", name_cy: "Conwy", name_en: "Conwy" },
  { slug: "sir-ddinbych", name_cy: "Sir Ddinbych", name_en: "Denbighshire" },
  { slug: "sir-y-fflint", name_cy: "Sir y Fflint", name_en: "Flintshire" },
  { slug: "gwynedd", name_cy: "Gwynedd", name_en: "Gwynedd" },
  { slug: "merthyr-tudful", name_cy: "Merthyr Tudful", name_en: "Merthyr Tydfil" },
  { slug: "sir-fynwy", name_cy: "Sir Fynwy", name_en: "Monmouthshire" },
  { slug: "castell-nedd-port-talbot", name_cy: "Castell-nedd Port Talbot", name_en: "Neath Port Talbot" },
  { slug: "casnewydd", name_cy: "Casnewydd", name_en: "Newport" },
  { slug: "sir-benfro", name_cy: "Sir Benfro", name_en: "Pembrokeshire" },
  { slug: "powys", name_cy: "Powys", name_en: "Powys" },
  { slug: "rhondda-cynon-taf", name_cy: "Rhondda Cynon Taf", name_en: "Rhondda Cynon Taf" },
  { slug: "abertawe", name_cy: "Abertawe", name_en: "Swansea" },
  { slug: "torfaen", name_cy: "Torfaen", name_en: "Torfaen" },
  { slug: "bro-morgannwg", name_cy: "Bro Morgannwg", name_en: "Vale of Glamorgan" },
  { slug: "wrecsam", name_cy: "Wrecsam", name_en: "Wrexham" },
];

export function getCountyBySlug(slug: string): County | undefined {
  return counties.find((c) => c.slug === slug);
}

export function getCountyName(slug: string, locale: "cy" | "en"): string {
  const county = getCountyBySlug(slug);
  if (!county) return slug;
  return locale === "cy" ? county.name_cy : county.name_en;
}

export function normalizeCounty(input: string): County | undefined {
  const lower = input.toLowerCase().trim();
  return counties.find(
    (c) =>
      c.slug === lower ||
      c.name_cy.toLowerCase() === lower ||
      c.name_en.toLowerCase() === lower
  );
}

export const welshSpeakerPercentage: Record<string, number> = {
  "ynys-mon": 55.8,
  "blaenau-gwent": 7.9,
  "pen-y-bont-ar-ogwr": 10.0,
  "caerffili": 11.2,
  "caerdydd": 12.2,
  "sir-gaerfyrddin": 43.6,
  "ceredigion": 44.3,
  "conwy": 27.4,
  "sir-ddinbych": 26.4,
  "sir-y-fflint": 12.0,
  "gwynedd": 64.4,
  "merthyr-tudful": 8.8,
  "sir-fynwy": 9.0,
  "castell-nedd-port-talbot": 15.3,
  "casnewydd": 9.3,
  "sir-benfro": 18.8,
  "powys": 18.6,
  "rhondda-cynon-taf": 12.3,
  "abertawe": 14.1,
  "torfaen": 9.8,
  "bro-morgannwg": 10.8,
  "wrecsam": 14.1,
};
