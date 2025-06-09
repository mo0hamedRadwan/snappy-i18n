import { CoreI18n, FormatDateOptions, I18nPlugin } from "../types";

export const DatePlugin: I18nPlugin = {
  name: "date",
  install(i18n: CoreI18n) {
    Object.assign(i18n, {
      formatDate: (date: Date | string | number, options?: FormatDateOptions) => {
        const d = date instanceof Date ? date : new Date(date);
        const locale = options?.locale || i18n.getLocale();
        const dateOptions: Intl.DateTimeFormatOptions = { day: "numeric", month: "numeric", year: "numeric", ...options };
        return new Intl.DateTimeFormat(locale, dateOptions).format(d);
      },
      formatTime: (date: Date | string | number, options?: FormatDateOptions) => {
        const d = date instanceof Date ? date : new Date(date);
        const locale = options?.locale || i18n.getLocale();
        const dateOptions: Intl.DateTimeFormatOptions = { day: "numeric", month: "numeric", year: "numeric", ...options };
        return d.toLocaleTimeString(locale, dateOptions);
      },
      formatDateTime: (date: Date | string | number, options?: FormatDateOptions) => {
        const d = date instanceof Date ? date : new Date(date);
        const locale = options?.locale || i18n.getLocale();
        const dateOptions: Intl.DateTimeFormatOptions = { day: "numeric", month: "numeric", year: "numeric", ...options };
        return d.toLocaleString(locale, dateOptions);
      },
    });
  },
};
