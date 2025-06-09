import { createI18n, I18nWithPlugins } from "../../src";
import { describe, it, expect, beforeEach } from "vitest";

describe("@snappy/i18n", () => {
  let i18n: ReturnType<typeof createI18n>;

  beforeEach(() => {
    i18n = createI18n({
      supportedLocales: ["en", "ar", "es", "fr", "he"],
      defaultLocale: "en",
      fallbackLocale: "en",
      warnOnMissing: true,
    });

    i18n.addTranslations("en", {
      common: {
        hello: "Hello, {{name}}!",
        items_one: "{{count}} item",
        items_other: "{{count}} items",
        nested: {
          message: "This is nested",
        },
      },
    });

    i18n.addTranslations("es", {
      common: {
        hello: "¡Hola, {{name}}!",
        items: "{{count}} artículo | {{count}} artículos",
      },
    });
  });

  it("should translate simple strings", () => {
    expect(i18n.t("common.hello", { name: "John" })).toBe("Hello, John!");
    i18n.setLocale("es");
    expect(i18n.t("common.hello", { name: "Juan" })).toBe("¡Hola, Juan!");
  });

  it("should handle nested keys", () => {
    expect(i18n.t("common.nested.message")).toBe("This is nested");
  });

  it("should handle pluralization", () => {
    expect(i18n.t("common.items", { count: 1 })).toBe("1 item");
    expect(i18n.t("common.items", { count: 5 })).toBe("5 items");
  });

  it("should use fallback locale", () => {
    i18n.setLocale("fr");
    expect(i18n.t("common.hello", { name: "Jean" })).toBe("Hello, Jean!");
  });

  it("should detect RTL languages", () => {
    expect(i18n.isRTL!("en")).toBe(false);
    expect(i18n.isRTL!("ar")).toBe(true);
    expect(i18n.isLTR!("he")).toBe(false);
  });

  it("should format dates", () => {
    const date = new Date(2023, 0, 1);
    expect(i18n.formatDate!(date)).toBe("1/1/2023");
    expect(i18n.formatDate!(date, { locale: "en-US", month: "long" })).toBe("January 1, 2023");
  });

  it("should format numbers", () => {
    expect(i18n.formatNumber!(1234.56)).toBe("1,234.56");
    expect(i18n.formatNumber!(1234.56, { locale: "de-DE" })).toBe("1.234,56");
    expect(i18n.formatCurrency!(1234.56, "USD")).toBe("$1,234.56");
  });
});
