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
    const workSecs = parseInt(workMinutes, 10);
    const shortSecs = parseInt(shortBreakMinutes, 10);
    const longSecs = parseInt(longBreakMinutes, 10);

    if (!isNaN(workSecs) && workSecs > 0) {
      this.settings.modes.work.defaultTime = workSecs * 60;
    }
    if (!isNaN(shortSecs) && shortSecs > 0) {
      this.settings.modes.shortBreak.defaultTime = shortSecs * 60;
    }
    if (!isNaN(longSecs) && longSecs > 0) {
      this.settings.modes.longBreak.defaultTime = longSecs * 60;
    }

    this.save();
  }
}
