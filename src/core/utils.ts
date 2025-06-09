import { Locale } from "../types";

export function isValidLocale(locale: Locale): boolean {
  return locale.length === 2 && /^[a-z]{2}$/i.test(locale);
}

export function isValidLocaleArray(locales: Locale[]): boolean {
  return locales.every(isValidLocale);
}
