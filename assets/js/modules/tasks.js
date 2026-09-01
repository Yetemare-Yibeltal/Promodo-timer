import { loadFromStorage, saveToStorage } from "../utils/storage.js";
import { STORAGE_KEYS } from "../config.js";

export class TaskManager {
  constructor() {
    this.tasks = loadFromStorage(STORAGE_KEYS.TASKS, []);
  }

  addTask(title, estimatedPomodoros = 1) {
    const task = {
      id: Date.now().toString(),
      title,
      estimatedPomodoros,
      completedPomodoros: 0,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    this.tasks.push(task);
    this.save();
    return task;
  }

  toggleComplete(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.save();
    }
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((t) => t.id !== id);
    this.save();
  }

  save() {
    saveToStorage(STORAGE_KEYS.TASKS, this.tasks);
  }
}
