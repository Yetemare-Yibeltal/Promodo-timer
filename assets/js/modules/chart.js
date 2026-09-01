export class AnalyticsChart {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext("2d");
  }

  render(dailyStats) {
    // Calculate summary metrics from stats data
    let totalMinutes = 0;
    let totalSessions = 0;

    if (dailyStats && typeof dailyStats === "object") {
      Object.values(dailyStats).forEach((val) => {
        totalMinutes += (val.focusTime || 0) / 60;
        totalSessions += val.sessions || 0;
      });
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);

    // Update summary stat text elements safely
    const focusStatEl = document.getElementById("totalFocusStat");
    const sessionsStatEl = document.getElementById("sessionsCompletedStat");

    if (focusStatEl) focusStatEl.textContent = `${hours}h ${minutes}m`;
    if (sessionsStatEl) sessionsStatEl.textContent = totalSessions;

    // Draw clean placeholder or bar representation on canvas if context exists
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Simple modern canvas rendering for weekly progress bars
    this.ctx.fillStyle =
      getComputedStyle(document.documentElement).getPropertyValue(
        "--accent-primary",
      ) || "#ff6b6b";
    this.ctx.font = "12px sans-serif";
    this.ctx.fillText("Weekly Focus Distribution", 10, 20);

    // Draw a subtle baseline graph structure
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    this.ctx.beginPath();
    this.ctx.moveTo(10, 130);
    this.ctx.lineTo(290, 130);
    this.ctx.stroke();
  }
}
