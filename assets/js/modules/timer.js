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
    // Pull the latest defaultTime from config (handles newly saved settings)
    this.totalDuration = this.config.modes[this.currentMode].defaultTime;
    this.timeRemaining = this.totalDuration;
    this.onTick(this.getFormattedTime(), this.getProgressPercentage());
  }

  getFormattedTime() {
    const timeStr = formatTime(this.timeRemaining);
    const timeDisplayEl = document.getElementById("timeDisplay");

    if (timeDisplayEl) {
      // Automatically adjust font sizing based on string length to prevent overflow
      if (timeStr.length > 7) {
        timeDisplayEl.style.fontSize = "2rem";
      } else if (timeStr.length > 5) {
        timeDisplayEl.style.fontSize = "2.5rem";
      } else {
        timeDisplayEl.style.fontSize = "4.5rem";
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
