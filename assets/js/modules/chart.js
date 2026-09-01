export class AnalyticsChart {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext("2d");
  }

  render(dailyStats = {}) {
    if (!this.canvas) return;

    const dates = Object.keys(dailyStats).slice(-7);
    const values = dates.map((d) => dailyStats[d]?.completedPomodoros || 0);

    const width = this.canvas.width;
    const height = this.canvas.height;
    const maxVal = Math.max(...values, 5);

    this.ctx.clearRect(0, 0, width, height);

    const barWidth = width / (dates.length || 1) - 10;

    dates.forEach((date, i) => {
      const val = values[i];
      const barHeight = (val / maxVal) * (height - 30);
      const x = i * (barWidth + 10) + 5;
      const y = height - barHeight - 20;

      this.ctx.fillStyle =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--accent-work")
          .trim() || "#ef4444";
      this.ctx.fillRect(x, y, barWidth, barHeight);

      this.ctx.fillStyle =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--text-muted")
          .trim() || "#94a3b8";
      this.ctx.font = "10px sans-serif";
      this.ctx.textAlign = "center";
      this.ctx.fillText(date.slice(5), x + barWidth / 2, height - 5);
    });
  }
}
