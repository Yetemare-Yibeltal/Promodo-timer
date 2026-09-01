import { $ } from "./utils/dom.js";
import { SettingsManager } from "./modules/settings.js";
import { TimerManager } from "./modules/timer.js";
import { TaskManager } from "./modules/tasks.js";
import { AudioManager } from "./modules/audio.js";
import { ThemeManager } from "./modules/theme.js";
import { NotificationManager } from "./modules/notifications.js";
import { AnalyticsManager } from "./modules/analytics.js";

document.addEventListener("DOMContentLoaded", () => {
  const settings = new SettingsManager();
  const audio = new AudioManager();
  const theme = new ThemeManager(settings.get().theme);
  const tasks = new TaskManager();
  const analytics = new AnalyticsManager();

  const timeDisplay = $("#timeDisplay");
  const progressCircle = $("#progressCircle");
  const startPauseBtn = $("#startPauseBtn");
  const resetBtn = $("#resetBtn");
  const themeToggle = $("#themeToggle");

  const circleRadius = 110;
  const circumference = 2 * Math.PI * circleRadius;

  NotificationManager.requestPermission();

  const updateUI = (formattedTime, progressPercent) => {
    timeDisplay.textContent = formattedTime;
    document.title = `${formattedTime} - Promodo Timer`;
    const offset = circumference - (progressPercent / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
  };

  const timer = new TimerManager(settings.get(), updateUI, (completedMode) => {
    audio.playBeep();
    analytics.recordSession(
      completedMode,
      settings.get().modes[completedMode].defaultTime,
    );
    NotificationManager.sendNotification("Time is up!", {
      body: `${settings.get().modes[completedMode].label} completed.`,
    });
    startPauseBtn.textContent = "Start";
  });

  startPauseBtn.addEventListener("click", () => {
    if (timer.isRunning) {
      timer.pause();
      startPauseBtn.textContent = "Start";
    } else {
      timer.start();
      startPauseBtn.textContent = "Pause";
    }
  });

  resetBtn.addEventListener("click", () => {
    timer.reset();
    startPauseBtn.textContent = "Start";
  });

  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    theme.applyTheme(next);
  });
});
