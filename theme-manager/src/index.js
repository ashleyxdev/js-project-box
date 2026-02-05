const systemMatch = window.matchMedia("(prefers-color-scheme: dark)");

const DEFAULT_OPTIONS = {
  storageKey: "app-theme",
  target: document.documentElement,
  attribute: "data-theme",
  toAttribute: (theme, mode) => `${theme}-${mode}`,
  defaultTheme: "base",
  themes: ["base"],
};

export default class ThemeManager {
  constructor(options = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };

    this.storageKey = this.options.storageKey;
    this.target = this.options.target;
    this.attribute = this.options.attribute;
    this.format = options.format;
    this.themes = this.options.themes;

    // calculate dynamic defaults
    this.default = {
      theme: this.options.defaultTheme,
      mode: systemMatch.matches ? "dark" : "light",
    };

    this.current = this._read();

    // system listener (bound to class instance)
    this._handleSystemChange = (e) => {
      if (!localStorage.getItem(this.storageKey)) {
        this.current.mode = e.matches ? "dark" : "light";
        this._apply();
      }
    };

    // activate
    this._apply();
    systemMatch.addEventListener("change", this._handleSystemChange);
  }

  // PRIVATE UTILS

  _read() {
    try {
      const stored = JSON.parse(localStorage.getItem(this.storageKey));
      // MERGE FIX: Ensure we always have a valid object shape
      return stored ? { ...this.default, ...stored } : { ...this.default };
    } catch (error) {
      return { ...this.default };
    }
  }

  _save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.current));
  }

  _apply() {
    this.target.setAttribute(
      this.attribute,
      this.options.toAttribute(this.current.theme, this.current.mode),
    );
  }

  // PUBLIC API

  getTheme() {
    return this.current.theme;
  }

  getMode() {
    return this.current.mode;
  }

  setTheme(theme) {
    if (!this.themes.includes(theme)) return;
    this.current.theme = theme;
    this._apply();
    this._save();
  }

  setMode(mode) {
    if (mode !== "light" && mode !== "dark") return;
    this.current.mode = mode;
    this._apply();
    this._save();
  }

  toggleMode() {
    this.current.mode = this.current.mode === "light" ? "dark" : "light";
    this._apply();
    this._save();
  }

  reset() {
    localStorage.removeItem(this.storageKey);
    // RESET FIX: Recalculate live system state
    this.current = {
      theme: this.options.defaultTheme,
      mode: systemMatch.matches ? "dark" : "light",
    };
    this._apply();
  }

  // CLEANUP (Crucial for React/Vue/Svelte)
  destroy() {
    systemMatch.removeEventListener("change", this._handleSystemChange);
  }
}
