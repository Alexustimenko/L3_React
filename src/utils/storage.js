const KEY = "todo_vite_tasks_v1_Ustimenko";

export function loadTasks() {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        return Array.isArray(data) ? data : null;
    } catch {
        return null;
    }
}

export function saveTasks(tasks) {
    try {
        localStorage.setItem(KEY, JSON.stringify(tasks));
    } catch {
            console.error("Error");
    }
}
