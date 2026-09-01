import { loadFromStorage, saveToStorage } from "../utils/storage.js";
import { DEFAULT_CONFIG, STORAGE_KEYS } from "../config.js";

export class SettingsManager {
  constructor() {
    this.settings = loadFromStorage(STORAGE_KEYS.SETTINGS, DEFAULT_CONFIG);
  }

  update(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    saveToStorage(STORAGE_KEYS.SETTINGS, this.settings);
  }

  get() {
    return this.settings;
  }
}
