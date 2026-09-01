export class NotificationManager {
  static async requestPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  }

  static sendNotification(title, options = {}) {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        icon: "/assets/icons/timer-icon.png",
        ...options,
      });
    }
  }
}
