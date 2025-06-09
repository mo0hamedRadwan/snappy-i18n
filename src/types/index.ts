import { DirectionPlugin } from "./../plugins/direction";
export type Locale = string;

export type Translation = {
  [locale: Locale]: string;
};

export type TranslationsStructure = {
  [key: string]: TranslationsStructure | string;
};

export type TranslationMap = {
  [key: string]: TranslationMap | Translation;
};

export interface I18nPlugin {
  name: string;
  install(i18n: CoreI18n): void;
}

export type I18nOptions = {
  supportedLocales: Locale[];
  defaultLocale: Locale;
  fallbackLocale?: Locale;
  translations?: TranslationMap;
  mergeStrategy?: "shallow" | "deep";
  plugins?: I18nPlugin[];
  warnOnMissing?: boolean;
  throwOnError?: boolean;
  interpolation?: {
    prefix?: string;
    suffix?: string;
  };
};

export interface CoreI18n {
  getLocale(): Locale;
  setLocale(locale: Locale): void;
  getDefaultLocale(): Locale;
  getFallbackLocale(): Locale | undefined;
  getSupportedLocales(): Locale[];
  addTranslations(locale: Locale, translation: TranslationsStructure): void;
  t(key: string, params?: Record<string, any>): string;
  addPlugin(plugin: I18nPlugin): void;
}

export interface FormatNumberOptions extends Intl.NumberFormatOptions {
  locale?: Locale;
}

export interface FormatDateOptions extends Intl.DateTimeFormatOptions {
  locale?: Locale;
}

export type I18nWithPlugins = CoreI18n & DirectionPlugin & NumberPlugin & DatePlugin;

export interface DirectionPlugin {
  isRTL?(locale?: string): boolean;
  isLTR?(locale?: string): boolean;
  getDirection?(locale?: string): "rtl" | "ltr";
}

export interface NumberPlugin {
  formatNumber?(num: number, options?: FormatNumberOptions): string;
  formatCurrency?(num: number, currency: string, options?: FormatNumberOptions): string;
  formatPercent?(num: number, options?: FormatNumberOptions): string;
}

export interface DatePlugin {
  formatDate?(date: Date, options?: FormatDateOptions): string;
  formatTime?(date: Date, options?: FormatDateOptions): string;
  formatDateTime?(date: Date, options?: FormatDateOptions): string;
}
