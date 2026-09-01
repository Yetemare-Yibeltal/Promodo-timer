export class ThemeManager {
  constructor(initialTheme = "auto") {
    this.theme = initialTheme;
    this.init();
  }

  init() {
    this.applyTheme(this.theme);
  }

  applyTheme(theme) {
    this.theme = theme;
    if (theme === "auto") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      document.documentElement.setAttribute(
        "data-theme",
        prefersDark ? "dark" : "light",
      );
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }
}
