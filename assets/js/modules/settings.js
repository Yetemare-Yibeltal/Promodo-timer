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
      if (saved) return JSON.parse(saved);
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
    // Fall back to defaults if empty/invalid, and cap at max 999 minutes for safety
    const workSecs =
      workMinutes !== "" && !isNaN(workMinutes) && Number(workMinutes) > 0
        ? Math.min(Number(workMinutes), 999)
        : 25;
    const shortSecs =
      shortBreakMinutes !== "" &&
      !isNaN(shortBreakMinutes) &&
      Number(shortBreakMinutes) > 0
        ? Math.min(Number(shortBreakMinutes), 999)
        : 5;
    const longSecs =
      longBreakMinutes !== "" &&
      !isNaN(longBreakMinutes) &&
      Number(longBreakMinutes) > 0
        ? Math.min(Number(longBreakMinutes), 999)
        : 15;

    this.settings.modes.work.defaultTime = workSecs * 60;
    this.settings.modes.shortBreak.defaultTime = shortSecs * 60;
    this.settings.modes.longBreak.defaultTime = longSecs * 60;

    this.save();
  }
}
