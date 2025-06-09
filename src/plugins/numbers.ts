import { I18nPlugin, CoreI18n, FormatNumberOptions } from "../types";

export const NumberPlugin: I18nPlugin = {
  name: "number",
  install(i18n: CoreI18n) {
    Object.assign(i18n, {
      formatNumber: (num: number, options?: FormatNumberOptions) => {
        const locale = options?.locale || i18n.getLocale();
        return num.toLocaleString(locale, options);
      },
      formatCurrency: (num: number, currency: string, options?: FormatNumberOptions) => {
        const locale = options?.locale || i18n.getLocale();
        return num.toLocaleString(locale, {
          ...options,
          style: "currency",
          currency,
        });
      },
      formatPercent: (num: number, options?: FormatNumberOptions) => {
        const locale = options?.locale || i18n.getLocale();
        return num.toLocaleString(locale, {
          ...options,
          style: "percent",
        });
      },
    });
  },
};
