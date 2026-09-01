import { loadFromStorage, saveToStorage } from "../utils/storage.js";
import { STORAGE_KEYS } from "../config.js";
import { getTodayDateString } from "../utils/time.js";

export class AnalyticsManager {
  constructor() {
    this.data = loadFromStorage(STORAGE_KEYS.ANALYTICS, {
      sessions: [],
      dailyStats: {},
    });
  }

  recordSession(mode, durationSeconds) {
    const today = getTodayDateString();
    this.data.sessions.push({
      timestamp: new Date().toISOString(),
      mode,
      duration: durationSeconds,
    });

    if (!this.data.dailyStats[today]) {
      this.data.dailyStats[today] = { workTime: 0, completedPomodoros: 0 };
    }

    if (mode === "work") {
      this.data.dailyStats[today].workTime += durationSeconds;
      this.data.dailyStats[today].completedPomodoros += 1;
    }

    saveToStorage(STORAGE_KEYS.ANALYTICS, this.data);
  }
}
