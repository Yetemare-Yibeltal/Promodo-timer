export class SettingsManager {
  constructor() {
    this.storageKey = "promodo_settings_v1";
    this.defaultSettings = {
      theme: "dark",
      modes: {
        work: { defaultTime: 25 * 60, label: "Pomodoro" },
        shortBreak: { defaultTime: 5 * 60, label: "Short Break" },
        longBreak: { defaultTime: 15 * 60, label: "Long Break" },
      },
    };
    this.settings = this.load();
  }

  load() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load settings from storage", e);
    }
    return JSON.parse(JSON.stringify(this.defaultSettings));
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
    } catch (e) {
      console.error("Failed to save settings to storage", e);
    }
  }

  get() {
    return this.settings;
  }

  updateFromInputs(workMinutes, shortBreakMinutes, longBreakMinutes) {
    // Fall back to standard defaults if empty, NaN, or <= 0
    const workSecs =
      workMinutes !== "" && !isNaN(workMinutes) && Number(workMinutes) > 0
        ? Number(workMinutes)
        : 25;
    const shortSecs =
      shortBreakMinutes !== "" &&
      !isNaN(shortBreakMinutes) &&
      Number(shortBreakMinutes) > 0
        ? Number(shortBreakMinutes)
        : 5;
    const longSecs =
      longBreakMinutes !== "" &&
      !isNaN(longBreakMinutes) &&
      Number(longBreakMinutes) > 0
        ? Number(longBreakMinutes)
        : 15;

    this.settings.modes.work.defaultTime = workSecs * 60;
    this.settings.modes.shortBreak.defaultTime = shortSecs * 60;
    this.settings.modes.longBreak.defaultTime = longSecs * 60;

    this.save();
  }
}
