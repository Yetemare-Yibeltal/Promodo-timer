import { formatTime } from "../utils/time.js";

export class TimerManager {
  constructor(config, onTick, onComplete) {
    this.config = config;
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.currentMode = "work";
    this.timeRemaining = this.config.modes.work.defaultTime;
    this.totalDuration = this.timeRemaining;
    this.intervalId = null;
    this.isRunning = false;
  }

  setMode(mode) {
    this.pause();
    this.currentMode = mode;
    this.totalDuration = this.config.modes[mode].defaultTime;
    this.timeRemaining = this.totalDuration;
    this.onTick(this.getFormattedTime(), this.getProgressPercentage());
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.timeRemaining--;
      this.onTick(this.getFormattedTime(), this.getProgressPercentage());

      if (this.timeRemaining <= 0) {
        this.pause();
        this.onComplete(this.currentMode);
      }
    }, 1000);
  }

  pause() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset() {
    this.pause();
    this.totalDuration = this.config.modes[this.currentMode].defaultTime;
    this.timeRemaining = this.totalDuration;
    this.onTick(this.getFormattedTime(), this.getProgressPercentage());
  }

  getFormattedTime() {
    const timeStr = formatTime(this.timeRemaining);
    const timeDisplayEl = document.getElementById("timeDisplay");

    if (timeDisplayEl) {
      // Aggressive font scaling based on digit count
      if (timeStr.length > 8) {
        timeDisplayEl.style.fontSize = "1.2rem";
      } else if (timeStr.length > 6) {
        timeDisplayEl.style.fontSize = "1.8rem";
      } else if (timeStr.length > 4) {
        timeDisplayEl.style.fontSize = "2.4rem";
      } else {
        timeDisplayEl.style.fontSize = "3.5rem";
      }
    }

    return timeStr;
  }

  getProgressPercentage() {
    return (
      ((this.totalDuration - this.timeRemaining) / this.totalDuration) * 100
    );
  }
}
