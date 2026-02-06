import { STORAGE_KEY } from "../constants.js";

export function loadTasks() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;

        const data = JSON.parse(raw);
        return Array.isArray(data) ? data : null;
    } catch {
        return null;
    }
}

export function saveTasks(tasks) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
        console.error("Error saving tasks to localStorage", e);
    }
}
