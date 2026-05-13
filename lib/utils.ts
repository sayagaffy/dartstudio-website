export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: string | Date, locale: "id" | "en" = "id"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function readingTime(text: string, wordsPerMinute = 200): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function absoluteUrl(path: string, baseUrl?: string): string {
  const base = baseUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://dartstudio.id";
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Extracts plain text from Portable Text blocks. Used for SEO descriptions
 * and FAQ answers in JSON-LD where rich formatting isn't supported.
 */
export function extractPlainText(blocks: unknown): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .filter(
      (b): b is { _type: string; children?: Array<{ text?: string }> } =>
        typeof b === "object" &&
        b !== null &&
        "_type" in b &&
        (b as { _type: string })._type === "block",
    )
    .map((b) => (b.children ?? []).map((c) => c.text ?? "").join(" "))
    .join(" ")
    .trim();
}
