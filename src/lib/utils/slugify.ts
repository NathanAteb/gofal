const WELSH_CHAR_MAP: Record<string, string> = {
  â: "a", ê: "e", î: "i", ô: "o", û: "u", ŵ: "w", ŷ: "y",
  Â: "a", Ê: "e", Î: "i", Ô: "o", Û: "u", Ŵ: "w", Ŷ: "y",
  ä: "a", ë: "e", ï: "i", ö: "o", ü: "u",
};

export function slugify(text: string): string {
  let result = text.toLowerCase().trim();

  // Replace Welsh/accented characters from map
  result = result
    .split("")
    .map((char) => WELSH_CHAR_MAP[char] || char)
    .join("");

  // Normalize remaining unicode accents (é → e, etc.)
  result = result.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Replace non-alphanumeric with hyphens
  result = result.replace(/[^a-z0-9]+/g, "-");

  // Remove leading/trailing hyphens
  result = result.replace(/^-+|-+$/g, "");

  return result;
}

export function generateUniqueSlug(
  name: string,
  town: string,
  existingSlugs: Set<string>
): string {
  let base = slugify(`${name}-${town}`);
  if (!existingSlugs.has(base)) return base;

  let counter = 2;
  while (existingSlugs.has(`${base}-${counter}`)) {
    counter++;
  }
  return `${base}-${counter}`;
}
