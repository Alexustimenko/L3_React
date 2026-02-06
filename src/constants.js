export const FILTERS = {
    ALL: "Все задачи",
    ACTIVE: "Активные задачи",
    DONE: "Выполненные задачи",
};


export const STATUS_LABELS = {
    ACTIVE: "Активная задача",
    DONE: "Задача выполнена",
    CANCELED: "Задача отменена",
};

export const STATUSES = Object.values(STATUS_LABELS);

export function statusColor(status) {
    if (status === STATUS_LABELS.ACTIVE) return "var(--pink)";
    if (status === STATUS_LABELS.DONE) return "var(--green)";
    if (status === STATUS_LABELS.CANCELED) return "var(--yellow)";
    return "var(--pink)";
}


export const SEED_TASKS = [
    {
        id: 1,
        description: "Выполнить ЛР7",
        status: STATUS_LABELS.ACTIVE,
        deadlineIso: "2025-02-18",
    },
    {
        id: 2,
        description: "Сдать курсач по БД",
        status: STATUS_LABELS.DONE,
        deadlineIso: "2026-02-27",
    },
    {
        id: 3,
        description: "Найти работу",
        status: STATUS_LABELS.DONE,
        deadlineIso: "2026-02-27",
    },
];


export const STORAGE_KEY = "todo_vite_tasks_v1_Ustimenko";
