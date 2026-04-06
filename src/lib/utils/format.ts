const WELSH_MONTHS: Record<number, string> = {
  0: "Ionawr", 1: "Chwefror", 2: "Mawrth", 3: "Ebrill",
  4: "Mai", 5: "Mehefin", 6: "Gorffennaf", 7: "Awst",
  8: "Medi", 9: "Hydref", 10: "Tachwedd", 11: "Rhagfyr",
};

const EN_MONTHS: Record<number, string> = {
  0: "January", 1: "February", 2: "March", 3: "April",
  4: "May", 5: "June", 6: "July", 7: "August",
  8: "September", 9: "October", 10: "November", 11: "December",
};

export function formatDate(dateStr: string, locale: "cy" | "en"): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const day = date.getDate();
  const months = locale === "cy" ? WELSH_MONTHS : EN_MONTHS;
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export function formatFee(pence: number): string {
  const pounds = pence / 100;
  return `£${pounds.toLocaleString("en-GB", { minimumFractionDigits: pounds % 1 === 0 ? 0 : 2 })}`;
}

export function formatFeeRange(
  from: number | null,
  to: number | null,
  locale: "cy" | "en"
): string {
  if (!from && !to) return locale === "cy" ? "Heb ei nodi" : "Not specified";
  const perWeek = locale === "cy" ? "yr wythnos" : "per week";
  if (from && to && from !== to) {
    return `£${from.toLocaleString("en-GB")} – £${to.toLocaleString("en-GB")} ${perWeek}`;
  }
  const fee = from || to;
  return `£${fee!.toLocaleString("en-GB")} ${perWeek}`;
}

export function formatPhoneForDisplay(phone: string): string {
  return phone.replace(/\s+/g, " ").trim();
}

export function formatPhoneForTel(phone: string): string {
  return phone.replace(/\s+/g, "").replace(/^0/, "+44");
}
