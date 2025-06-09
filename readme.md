# @snappy/i18n

A lightweight, TypeScript-based internationalization (i18n) and localization (l10n) library for JavaScript applications. Designed to be framework-agnostic, extensible, and performant, @snappy/i18n provides robust features for managing translations, formatting numbers and dates, handling text direction, and supporting pluralization.

## 🚀 Features

- ✅ Tiny and fast
- ✅ Type-Safe: Written in TypeScript with full type definitions.
- ✅ Translation Management: Key-based translations with fallback locale support.
- ✅ Nested key resolution
- ✅ Interpolation: Dynamic string interpolation for parameterized translations. `{{name}}`
- ✅ Pluralization: Built-in support for plural forms using
- ✅ Formatting: Number and date formatting using the Intl API.
- ✅ Text Direction: Detect RTL (Right-to-Left) or LTR (Left-to-Right) based on locale.
- ✅ Deep or shallow merge strategies
- ✅ Plugin Architecture: Extensible with custom plugins for additional functionality.
- ✅ Framework-Agnostic: Works with any JavaScript framework or vanilla JS.
- ✅ Tested: Comprehensive test suite using Vitest.

---

## 📦 Installation

```bash
npm install @snappy/i18n
# or
yarn add @snappy/i18n
```

---

## 🛠 Usage

### Basic Setup

Initialize the `I18n` instance with a locale and translations:

```ts
import I18n from "@snappy/i18n";
import common from "./locales/en/common.json";

const i18n = new I18n({
  supportedLocale: ["en", "ar"],
  defualtLocale: "en",
  translations: common,
});

// Example common.json
// {
//   "greeting": {"en": "Hello", "ar": "مرحبا"},
//   "welcome": {"en": "Welcome, {{name}}!", "ar": "مرحبا, {{name}}"},
//   "items_one": {"en": "{{count}} item"}
//   "items_other": {"en": "{{count}} items", "{{count}} من العناصر"}
// }

console.log(i18n.t("welcome", { name: "Alice" }));
```

### With Plugins

```ts
import { DirectionPlugin, DatePlugin } from "@snappy/i18n";

const i18n = new I18n({
  supportedLocale: ["en", "ar"],
  locale: "en",
  fallbackLocale: "en",
  translations: common,
  plugins: [DirectionPlugin, DatePlugin, NumberPlugin],
});

console.log(i18n.formatDate!(date)); // "1/1/2023"
console.log(i18n.formatNumber!(1234.56)); // "1,234.56"
```

### Nested Keys & Pluralization

```ts
// {
//   "user": {
//     "welcome": {
//       "en": "Hello, {{name}}!"
//     }
//   },
//   "items_one": {
//     "en": "{{count}} item",
//     "ar": "عنصر واحد"
//   },
//   "items_other": {
//     "en": "{{count}} items",
//     "ar": "{{count}} عناصر"
//   }
// }

i18n.t("user.welcome", { name: "Sam" }); // "Hello, Sam!"
i18n.t("items", { count: 3 }, 3); // "3 items"
```

### Merge Translations

with `mergeTranslation` method:

```ts
i18n.mergeTranslation({ shop: { wishlist: { en: "wishlist page", ar: "الصفحة المفضلة" } } });
```

with `addTranslation` method:

```ts
i18n.addTranslation("en", { cart: { empty: "Your cart is empty" } });
```

---

## 🔌 Plugins API

### `DirectionPlugin`

Adds `isLTR()`, `isRTL()` and `getDirection()` methods based on locale.

### `DatePlugin`

Adds `formatDate()`, `formatTime()` and `formatDateTime()` `formatNumber()` using `Intl`.

### `NumberPlugin`

Adds `formatNumber()`, `formatCurrency()` and `formatPercent()` using `Intl`.

---

## 🔍 Comparison with Popular Libraries

| Feature                    | @snappy/i18n | i18next      | react-intl      | vue-i18n      |
| -------------------------- | ------------ | ------------ | --------------- | ------------- |
| **Framework-Agnostic**     | ✅           | ✅           | ❌ (React-only) | ❌ (Vue-only) |
| **TypeScript Support**     | ✅ (Full)    | ✅ (Partial) | ✅              | ✅            |
| **Plugin Architecture**    | ✅           | ✅           | ❌              | ✅            |
| **Tree Shaking Friendly**  | ✅           | ❌           | ❌              | ❌            |
| **Pluralization**          | ✅           | ✅           | ✅              | ✅            |
| **Interpolation**          | ✅           | ✅           | ✅              | ✅            |
| **RTL/LTR Detection**      | ✅           | ❌           | ❌              | ❌            |
| **Number/Date Formatting** | ✅           | ✅           | ✅              | ✅            |
| **Bundle Size**            | Lightweight  | Medium       | Heavy           | Medium        |
| **Dependencies**           | None         | Minimal      | React           | Vue           |
| **Performance**            | High         | High         | Medium          | Medium        |

i18next: A robust, framework-agnostic library with a large ecosystem. @snappy/i18n offers similar core features but is lighter and includes built-in RTL/LTR detection.
react-intl: Tailored for React with tight integration. @snappy/i18n is more flexible, working with any framework or vanilla JS.
vue-i18n: Designed for Vue.js. @snappy/i18n provides comparable features but is not tied to a specific framework.


## 👥 Contributing

Pull requests and ideas are welcome! This project aims to be simple but flexible enough for real-world production apps.

## Development

### Building the Package

```bash
npm run build
```

### Running Tests

```bash
npm test
```

### Watching Tests

```bash
npm run test:watch
```

---

## 📄 License

MIT
