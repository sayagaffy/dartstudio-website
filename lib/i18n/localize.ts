import type { Locale } from "./routing";

export type LocalizedField<T = string> = { id: T; en: T };

export function localize<T>(field: LocalizedField<T> | null | undefined, locale: Locale): T | null {
  if (!field) return null;
  if (locale === "en") return field.en ?? field.id ?? null;
  return field.id ?? field.en ?? null;
}

export function localizer(locale: Locale) {
  return <T>(field: LocalizedField<T> | null | undefined) => localize(field, locale);
}

export function isLocalizedField(value: unknown): value is LocalizedField<string> {
  return typeof value === "object" && value !== null && "id" in value && "en" in value;
}
