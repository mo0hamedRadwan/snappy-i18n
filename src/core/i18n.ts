import { getPluralSuffix } from "../plugins/pluralization";
import { I18nWithPlugins, I18nOptions, I18nPlugin, Locale, Translation, TranslationMap, TranslationsStructure } from "../types";
import { isArray, isString, merge } from "../utils";
import { isValidLocale, isValidLocaleArray } from "./utils";

export class I18n implements I18nWithPlugins {
  private locale: string;
  private options: I18nOptions;
  private translations: TranslationMap = {};
  private mergeStrategy: "shallow" | "deep";
  private plugins: I18nPlugin[] = [];

  constructor(options: I18nOptions) {
    this.translations = options.translations || {};
    this.mergeStrategy = options.mergeStrategy || "shallow";
    this.locale = options.defaultLocale || options.fallbackLocale || options.supportedLocales[0];
    this.plugins = options.plugins || [];
    this.options = {
      supportedLocales: options.supportedLocales,
      defaultLocale: options.defaultLocale,
      fallbackLocale: options.fallbackLocale || options.defaultLocale,
      translations: this.translations || {},
      mergeStrategy: this.mergeStrategy || "shallow",
      plugins: options.plugins || [],
    };

    // Validate options
    this.validateOptions(options);

    // intialize plugins
    this.initializePlugins();
  }

  validateOptions(options: I18nOptions): void {
    // Validate supported locales
    if (!isArray(options.supportedLocales) || options.supportedLocales.length === 0) {
      throw new Error("Supported locales must be a non-empty array.");
    }

    if (!isValidLocaleArray(options.supportedLocales)) {
      throw new Error("Invalid locale format in supported locales.");
    }

    // Validate default locale
    if (!options.supportedLocales.includes(options.defaultLocale)) {
      throw new Error(`Default locale ${options.defaultLocale} is not supported.`);
    }

    // Validate fallback locale
    if (options.fallbackLocale && !options.supportedLocales.includes(options.fallbackLocale)) {
      throw new Error(`Fallback locale ${options.fallbackLocale} is not supported.`);
    }

    // Validate merge strategy
    if (options.mergeStrategy && !["shallow", "deep"].includes(options.mergeStrategy)) {
      throw new Error(`Invalid merge strategy: ${options.mergeStrategy}. Must be 'shallow' or 'deep'.`);
    }

    // Validate translations
    if (options.translations) {
      for (const locale in options.translations) {
        if (!options.supportedLocales.includes(locale)) {
          throw new Error(`Translations for locale ${locale} are not supported.`);
        }
        if (typeof options.translations[locale] !== "object") {
          throw new Error(`Translations for locale ${locale} must be an object.`);
        }
      }
    }

    // Validate plugins
    if (options.plugins) {
      options.plugins.forEach((plugin) => {
        if (!plugin || typeof plugin.install !== "function") {
          throw new Error("Invalid plugin. Plugin must have an install method.");
        }
      });
    }
  }

  getLocale(): string {
    return this.locale;
  }

  setLocale(locale: string): void {
    if (!this.options.supportedLocales.includes(locale)) {
      throw new Error(`Locale ${locale} is not supported.`);
    }
    this.locale = locale;
  }

  getDefaultLocale(): string {
    return this.options.defaultLocale;
  }

  getFallbackLocale(): string {
    return this.options.fallbackLocale || this.options.defaultLocale;
  }

  getSupportedLocales(): string[] {
    return this.options.supportedLocales;
  }

  addTranslations(locale: Locale, translation: TranslationsStructure): void {
    if (!isValidLocale(locale) && !this.options.supportedLocales.includes(locale)) {
      throw new Error(`Locale ${locale} is not supported.`);
    }

    const translations = this.translations;
    this.restructureTranslations(locale, translations, translation);
  }

  restructureTranslations(locale: Locale, translations: TranslationMap, otherTranslate: TranslationsStructure) {
    for (const key in otherTranslate) {
      if (Object.prototype.hasOwnProperty.call(otherTranslate, key)) {
        if (!translations[key]) {
          translations[key] = {};
        }
        if (typeof otherTranslate[key] === "string") {
          translations[key][locale] = otherTranslate[key];
        } else if (typeof otherTranslate[key] === "object" && !isArray(otherTranslate[key])) {
          this.restructureTranslations(locale, translations[key] as TranslationMap, otherTranslate[key]);
        } else {
          throw new Error(`Invalid translation format for key "${key}" in locale "${locale}".`);
        }
      }
    }
  }

  mergeTranslations(translations: Translation, strategy: "shallow" | "deep" = "shallow"): Translation {
    return merge(this.translations, translations, strategy);
  }

  t(key: string, params?: Record<string, any>, defaultTranslation?: string): string {
    let translation = this.getTranslation(key, this.locale);
    if (!translation) {
      if (this.options.warnOnMissing) {
        console.warn(`Translation for key "${key}" not found in locale "${this.locale}".`);
      }
      translation = this.getTranslation(key, this.getFallbackLocale()) || defaultTranslation || key;
    }

    if (typeof translation !== "string") {
      throw new Error(`Translation for key "${key}" is not a string in locale "${this.locale}".`);
    }

    // Handle pluralization if the translation is a string with a count parameter
    if (params && params.count !== undefined) {
      let translationKey = this.pluralize(translation, params.count);
      translation = this.getTranslation(translationKey, this.locale) || translationKey;
    }

    // Handle interpolation
    translation = this.interpolate(translation, params);

    return translation;
  }

  getTranslation(key: string, locale: Locale): string | undefined {
    const keys = key.split(".");
    let result = this.translations;

    for (const k of keys) {
      if (!result || typeof result !== "object") return undefined;
      result = result[k] as TranslationMap;
    }

    result = result[locale] as TranslationMap;

    return typeof result === "string" ? result : undefined;
  }

  pluralize(text: string, count: number): string {
    if (!isString(text)) return text;

    return getPluralSuffix(this.locale, text, count);
  }

  interpolate(text: string, params?: Record<string, any>): string {
    if (!params || typeof params !== "object") {
      return text;
    }

    const prefix = this.options.interpolation?.prefix || "{{";
    const suffix = this.options.interpolation?.suffix || "}}";

    return text.replace(new RegExp(`${prefix}(.+?)${suffix}`, "g"), (_, key) => {
      return params[key] || `${prefix}${key}${suffix}`;
    });
  }

  private initializePlugins(): void {
    this.plugins.forEach((plugin) => {
      if (plugin.install) {
        plugin.install(this);
      }
    });
  }

  addPlugin(plugin: I18nPlugin): void {
    if (!plugin || typeof plugin.install !== "function") {
      throw new Error("Invalid plugin. Plugin must have an install method.");
    }
    this.plugins.push(plugin);
    plugin.install(this);
  }
}
