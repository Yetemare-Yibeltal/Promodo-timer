export class TimerManager {
  constructor(config, onTick, onComplete) {
    this.config = config;
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.currentMode = "work";
    this.timeLeft = this.config.modes[this.currentMode].defaultTime;
    this.isRunning = false;
    this.timerId = null;
  }

  setMode(mode) {
    this.currentMode = mode;
    // Pull the latest defaultTime directly from the config object
    this.timeLeft = this.config.modes[mode].defaultTime;
    this.pause();
    this.updateDisplay();
  }

  // ... rest of your timer methods ...
}

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
    this.timeRemaining = this.totalDuration;
    this.onTick(this.getFormattedTime(), this.getProgressPercentage());
  }

  getFormattedTime() {
    return formatTime(this.timeRemaining);
  }

  getProgressPercentage() {
    return (
      ((this.totalDuration - this.timeRemaining) / this.totalDuration) * 100
    );
  }
}
