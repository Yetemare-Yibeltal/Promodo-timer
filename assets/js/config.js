export const DEFAULT_CONFIG = {
  modes: {
    work: { label: "Pomodoro", defaultTime: 25 * 60 },
    shortBreak: { label: "Short Break", defaultTime: 5 * 60 },
    longBreak: { label: "Long Break", defaultTime: 15 * 60 },
  },
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundVolume: 0.7,
  theme: "auto",
};

export const STORAGE_KEYS = {
  SETTINGS: "promodo_settings",
  TASKS: "promodo_tasks",
  ANALYTICS: "promodo_analytics",
};
