export interface ThemeManagerOptions {
  storageKey?: string;
  target?: HTMLElement;
  attribute?: string;
  toAttribute?: (theme: string, mode: "light" | "dark") => string;
  defaultTheme?: string;
  themes?: string[];
}

export default class ThemeManager {
  constructor(options?: ThemeManagerOptions);

  getTheme(): string;
  getMode(): "light" | "dark";
  setTheme(theme: string): void;
  setMode(mode: "light" | "dark"): void;
  toggleMode(): void;
  reset(): void;
  destroy(): void;
}
