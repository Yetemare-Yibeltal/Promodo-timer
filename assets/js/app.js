import { $, $$ } from "./utils/dom.js";
import { SettingsManager } from "./modules/settings.js";
import { TimerManager } from "./modules/timer.js";
import { TaskManager } from "./modules/tasks.js";
import { AudioManager } from "./modules/audio.js";
import { ThemeManager } from "./modules/theme.js";
import { NotificationManager } from "./modules/notifications.js";
import { AnalyticsManager } from "./modules/analytics.js";
import { AmbientSoundManager } from "./modules/ambient.js";
import { ModalManager } from "./modules/modal.js";
import { AnalyticsChart } from "./modules/chart.js";
import { registerGlobalShortcuts } from "./utils/keyboard.js";
import { exportDataAsJSON } from "./utils/export.js";

document.addEventListener("DOMContentLoaded", () => {
  const settings = new SettingsManager();
  const audio = new AudioManager();
  const theme = new ThemeManager(settings.get().theme);
  const tasks = new TaskManager();
  const analytics = new AnalyticsManager();
  const ambient = new AmbientSoundManager();
  const settingsModal = new ModalManager("settingsModal");

  const timeDisplay = $("#timeDisplay");
  const progressCircle = $("#progressCircle");
  const startPauseBtn = $("#startPauseBtn");
  const resetBtn = $("#resetBtn");
  const themeToggle = $("#themeToggle");
  const ambientBtn = $("#ambientBtn");
  const exportBtn = $("#exportBtn");
  const modeBtns = $$(".mode-btn");

  const taskInput = $("#taskInput");
  const addTaskBtn = $("#addTaskBtn");
  const taskList = $("#taskList");

  const chartCanvas = $("#analyticsChart");
  const chart = chartCanvas ? new AnalyticsChart(chartCanvas) : null;

  const circleRadius = 110;
  const circumference = 2 * Math.PI * circleRadius;

  NotificationManager.requestPermission();

  const updateUI = (formattedTime, progressPercent) => {
    timeDisplay.textContent = formattedTime;
    document.title = `${formattedTime} - Promodo Timer`;
    const offset = circumference - (progressPercent / 100) * circumference;
    if (progressCircle) {
      progressCircle.style.strokeDashoffset = offset;
    }
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
    if (chart) chart.render(analytics.data.dailyStats);
  });

  modeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      modeBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const mode = btn.dataset.mode;
      document.documentElement.style.setProperty(
        "--accent-active",
        `var(--accent-${mode.replace("Break", "")})`,
      );
      timer.setMode(mode);
      startPauseBtn.textContent = "Start";
    });
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

  if (ambientBtn) {
    ambientBtn.addEventListener("click", () => {
      const active = ambient.toggleNoise();
      ambientBtn.classList.toggle("active", active);
    });
  }

  const renderTasks = () => {
    taskList.innerHTML = "";
    tasks.tasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = `task-item ${task.completed ? "completed" : ""}`;
      li.innerHTML = `
        <span>${task.title}</span>
        <div class="task-actions">
          <button class="icon-btn complete-btn" data-id="${task.id}">✓</button>
          <button class="icon-btn delete-btn" data-id="${task.id}">✕</button>
        </div>
      `;
      taskList.appendChild(li);
    });
  };

  if (addTaskBtn && taskInput) {
    addTaskBtn.addEventListener("click", () => {
      const val = taskInput.value.trim();
      if (val) {
        tasks.addTask(val);
        taskInput.value = "";
        renderTasks();
      }
    });
  }

  if (taskList) {
    taskList.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      if (e.target.classList.contains("complete-btn")) {
        tasks.toggleComplete(id);
        renderTasks();
      } else if (e.target.classList.contains("delete-btn")) {
        tasks.deleteTask(id);
        renderTasks();
      }
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      exportDataAsJSON("promodo-data-backup.json", {
        tasks: tasks.tasks,
        analytics: analytics.data,
        settings: settings.get(),
      });
    });
  }

  registerGlobalShortcuts({
    onSpace: () => startPauseBtn.click(),
    onReset: () => resetBtn.click(),
  });

  settingsModal.bindEvents("settingsToggle", "closeSettings");
  renderTasks();
  if (chart) chart.render(analytics.data.dailyStats);
});
