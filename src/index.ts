import { I18n } from "./core/i18n";
import { DatePlugin, NumberPlugin, DirectionPlugin } from "./plugins";
import { CoreI18n, Translation, Locale, I18nOptions, I18nWithPlugins } from "./types";

export function createI18n(options: I18nOptions): I18nWithPlugins {
  const i18n = new I18n(options);

  // Install default plugins
  i18n.addPlugin(DirectionPlugin);
  i18n.addPlugin(DatePlugin);
  i18n.addPlugin(NumberPlugin);

  return i18n;
}

export type { I18nOptions, CoreI18n, Translation, Locale, I18nWithPlugins };
export { I18n, DirectionPlugin, DatePlugin, NumberPlugin };
