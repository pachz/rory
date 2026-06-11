const NAMED_ENTITIES: Record<string, string> = {
  nbsp: " ",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  ndash: "–",
  mdash: "—",
  hellip: "…",
  laquo: "«",
  raquo: "»",
};

function decodeEntity(entity: string): string {
  if (entity.startsWith("#x") || entity.startsWith("#X")) {
    const code = parseInt(entity.slice(2), 16);
    return Number.isNaN(code) ? `&${entity};` : String.fromCodePoint(code);
  }

  if (entity.startsWith("#")) {
    const code = parseInt(entity.slice(1), 10);
    return Number.isNaN(code) ? `&${entity};` : String.fromCodePoint(code);
  }

  return NAMED_ENTITIES[entity.toLowerCase()] ?? `&${entity};`;
}

export function decodeHtmlEntities(text: string): string {
  return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity: string) =>
    decodeEntity(entity),
  );
}

export function stripHtml(html: string): string {
  let text = html.replace(/<[^>]*>/g, " ");
  text = decodeHtmlEntities(text);
  text = text.replace(/\u00a0/g, " ");
  // Malformed entities sometimes arrive without the leading &
  text = text.replace(/(^|\s)nbsp;(?=\s|$)/gi, " ");
  text = text.replace(/&nbsp(?![;\w])/gi, " ");
  return text.replace(/\s+/g, " ").trim();
}

const WEEKDAY_LABELS: Record<string, string> = {
  SAT: "شنبه",
  SUN: "یکشنبه",
  MON: "دوشنبه",
  TUE: "سه‌شنبه",
  WED: "چهارشنبه",
  THU: "پنجشنبه",
  FRI: "جمعه",
};

export function formatPrice(price: number, currency = "IRT"): string {
  const formatted = new Intl.NumberFormat("fa-IR").format(price);
  const suffix = currency === "IRT" ? "تومان" : currency;
  return `${formatted} ${suffix}`;
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
}

export function formatWeekday(weekday: string): string {
  return WEEKDAY_LABELS[weekday] ?? weekday;
}

export function isRtlLanguage(language: string): boolean {
  return language.startsWith("FA") || language.startsWith("AR");
}

export function hasDiscount(originalPrice: number, price: number): boolean {
  return originalPrice > price;
}
