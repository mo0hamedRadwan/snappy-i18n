import { get } from "http";
import { I18nPlugin, I18nWithPlugins } from "../types";

export const DirectionPlugin: I18nPlugin = {
  name: "rtl",
  install(i18n: I18nWithPlugins) {
    Object.assign(i18n, {
      isRTL: (locale?: string): boolean => {
        const loc = locale || i18n.getLocale() || i18n.getDefaultLocale();
        // List of RTL languages
        const rtlLanguages = ["ar", "he", "fa", "ur", "ps", "sd", "ug", "yi"];
        return rtlLanguages.some((l) => loc.startsWith(l));
      },
      isLTR: (locale?: string): boolean => {
        return !Boolean(i18n.isRTL!(locale));
      },

      getDirection: (locale?: string): "rtl" | "ltr" => {
        return Boolean(i18n.isRTL!(locale)) ? "rtl" : "ltr";
      },
    });
  },
};
