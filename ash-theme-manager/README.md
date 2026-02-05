# Simple Theme Manager

A lightweight, framework-agnostic JavaScript theme manager with:

- ✅ System dark mode detection
- ✅ LocalStorage persistence
- ✅ Customizable attribute format
- ✅ Framework-friendly cleanup
- ✅ TypeScript support

---

## Install

```bash
npm install ash-theme-manager
```

---

## Basic Usage

```js
import ThemeManager from "simple-theme-manager";

const tm = new ThemeManager({
  themes: ["base", "ocean", "sunset"],
});

tm.toggleMode();
tm.setTheme("ocean");
```

---

## Custom attribute format

```js
const tm = new ThemeManager({
  toAttribute: (theme, mode) => `${mode}:${theme}`,
});
```

Result:

```html
<html data-theme="dark:ocean"></html>
```

---

## API

| Method         | Description            |
| -------------- | ---------------------- |
| `getTheme()`   | Get current theme      |
| `getMode()`    | Get light/dark mode    |
| `setTheme(t)`  | Set theme              |
| `setMode(m)`   | Set light/dark         |
| `toggleMode()` | Switch mode            |
| `reset()`      | Clear storage          |
| `destroy()`    | Remove system listener |
