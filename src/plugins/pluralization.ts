// Basic CLDR plural rules for common languages
const PLURAL_RULES: Record<string, (n: number) => string> = {
  en: (n) => (n === 1 ? "one" : "other"),
  es: (n) => (n === 1 ? "one" : "other"),
  fr: (n) => (n === 1 ? "one" : "other"),
  ru: (n) => {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return "one";
    if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "few";
    if (mod10 === 0 || [5, 6, 7, 8, 9].includes(mod10) || [11, 12, 13, 14].includes(mod100)) return "many";
    return "other";
  },
  ar: (n) => {
    if (n === 0) return "zero";
    if (n === 1) return "one";
    if (n === 2) return "two";
    if (n % 100 >= 3 && n % 100 <= 10) return "few";
    if (n % 100 >= 11 && n % 100 <= 99) return "many";
    return "other";
  },
};

export function pluralize(locale: string, count: number): string {
  const lang = locale;
  const rule = PLURAL_RULES[lang] || PLURAL_RULES.en;
  return rule(count);
}

export function getPluralSuffix(locale: string, key: string, count: number): string {
  return `${key}_${pluralize(locale, count)}`;
}
