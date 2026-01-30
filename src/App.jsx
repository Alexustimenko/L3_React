import React, { useEffect, useMemo, useState } from "react";
import Modal from "./components/Modal.jsx";
import StatusDropdown, { STATUS_LABELS } from "./components/StatusDropdown.jsx";
import { dmyToIso, isoToDmy, isOverdueIso } from "./utils/dates.js";
import { loadTasks, saveTasks } from "./utils/storage.js";

const FILTERS = {
    ALL: "Все задачи",
    ACTIVE: "Активные задачи",
    DONE: "Выполненные задачи",
};

function uid() {
    return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

const seed = [
    {
        id: uid(),
        description: "Выполнить ЛР7",
        status: STATUS_LABELS.ACTIVE,
        deadlineIso: dmyToIso("18.02.2025"),
    },
    {
        id: uid(),
        description: "Сдать курсач по БД",
        status: STATUS_LABELS.DONE,
        deadlineIso: dmyToIso("27.02.2026"),
    },
    {
        id: uid(),
        description: "Найти работу",
        status: STATUS_LABELS.DONE,
        deadlineIso: dmyToIso("27.02.2026"),
    },
];

export default function App() {
    const [filter, setFilter] = useState(FILTERS.ALL);
    const [tasks, setTasks] = useState(() => loadTasks() ?? seed);

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        description: "",
        status: STATUS_LABELS.ACTIVE,
        deadlineDmy: "",
    });
    const [errors, setErrors] = useState({});


    const [editing, setEditing] = useState({
        id: null,
        field: null,
        value: "",
    });

    useEffect(() => {
        saveTasks(tasks);
    }, [tasks]);

    const filtered = useMemo(() => {
        if (filter === FILTERS.ALL) return tasks;

        if (filter === FILTERS.ACTIVE) {
            return tasks.filter((t) => t.status === STATUS_LABELS.ACTIVE);
        }


        return tasks.filter(
            (t) => t.status === STATUS_LABELS.DONE || t.status === STATUS_LABELS.CANCELED
        );
    }, [tasks, filter]);

    function validateForm(nextForm) {
        const e = {};
        if (!String(nextForm.description || "").trim()) e.description = "Укажите описание";
        if (!String(nextForm.status || "").trim()) e.status = "Укажите статус";
        if (!String(nextForm.deadlineDmy || "").trim()) e.deadlineDmy = "Укажите дедлайн";

        const iso = dmyToIso(nextForm.deadlineDmy);
        if (!e.deadlineDmy && !iso) e.deadlineDmy = "Введите дату в формате ДД.ММ.ГГГГ";

        return e;
    }

    function onCreateTask() {
        const e = validateForm(form);
        setErrors(e);
        if (Object.keys(e).length > 0) return;

        const iso = dmyToIso(form.deadlineDmy);
        const newTask = {
            id: uid(),
            description: form.description.trim(),
            status: form.status,
            deadlineIso: iso,
        };

        setTasks((prev) => [newTask, ...prev]);

        setOpen(false);
        setForm({ description: "", status: STATUS_LABELS.ACTIVE, deadlineDmy: "" });
        setErrors({});
    }

    function removeTask(id) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
    }

    function updateTask(id, patch) {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    }

    function startEdit(id, field, initialValue) {
        setEditing({ id, field, value: initialValue ?? "" });
    }

    function commitEdit() {
        if (!editing.id || !editing.field) return;

        const id = editing.id;
        const field = editing.field;
        const raw = String(editing.value ?? "").trim();

        // нельзя сохранить пустое
        if (!raw) {
            setEditing({ id: null, field: null, value: "" });
            return;
        }

        if (field === "description") {
            updateTask(id, { description: raw });
            setEditing({ id: null, field: null, value: "" });
        }
    }

    return (
        <div className="page">
            <div className="topBar">
                <div className="topBarInner">
                    {Object.values(FILTERS).map((f) => (
                        <button
                            key={f}
                            className={"tabBtn " + (filter === f ? "active" : "")}
                            onClick={() => setFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="content">
                <div className="tableArea">
                    <div className="tableBox">
                        <table className="tasksTable">
                            <thead>
                            <tr>
                                <th className="colDesc">Описание</th>
                                <th className="colStatus">Статус</th>
                                <th className="colDeadline">Дедлайн</th>
                            </tr>
                            </thead>

                            <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td className="emptyCell" colSpan={3}>
                                        Нет задач
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((t) => {
                                    const isEditingDesc =
                                        editing.id === t.id && editing.field === "description";

                                    const deadlineText = isoToDmy(t.deadlineIso);
                                    const deadlineRed =
                                        t.status === STATUS_LABELS.ACTIVE && isOverdueIso(t.deadlineIso);

                                    return (
                                        <tr key={t.id}>

                                            <td
                                                className="tdDesc"
                                                onClick={() => {
                                                    if (!isEditingDesc)
                                                        startEdit(t.id, "description", t.description);
                                                }}
                                            >
                                                {isEditingDesc ? (
                                                    <input
                                                        className="cellInput"
                                                        autoFocus
                                                        value={editing.value}
                                                        onChange={(e) =>
                                                            setEditing((p) => ({ ...p, value: e.target.value }))
                                                        }
                                                        onBlur={commitEdit}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") e.currentTarget.blur();
                                                            if (e.key === "Escape")
                                                                setEditing({ id: null, field: null, value: "" });
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="cellText">{t.description}</span>
                                                )}
                                            </td>


                                            <td className="tdStatus">
                                                <StatusDropdown
                                                    value={t.status}
                                                    onChange={(v) => updateTask(t.id, { status: v })}
                                                />
                                            </td>


                                            <td className={"tdDeadline " + (deadlineRed ? "red" : "")}>
                                                <span className="cellText">{deadlineText}</span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                            </tbody>
                        </table>
                    </div>

                    <div className="deleteCol">
                        <div className="deleteHeaderSpacer" />
                        {filtered.map((t) => (
                            <button
                                key={t.id}
                                className="trashBtn"
                                onClick={() => removeTask(t.id)}
                                aria-label="Удалить"
                                title="Удалить"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path
                                        d="M9 3h6l1 2h5v2H3V5h5l1-2zm1 7h2v9h-2v-9zm4 0h2v9h-2v-9zM6 8h12l-1 13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8z"
                                        stroke="black"
                                        strokeWidth="1.3"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>

                <button className="addBtn" onClick={() => setOpen(true)}>
                    Добавить задачу
                </button>
            </div>

            <Modal
                open={open}
                title="Добавить новую задачу"
                onClose={() => {
                    setOpen(false);
                    setErrors({});
                }}
            >
                <div className="formGrid">
                    <label className="lbl">Описание</label>
                    <div>
                        <input
                            className={"inp " + (errors.description ? "err" : "")}
                            placeholder="Введите описание"
                            value={form.description}
                            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                        />
                        {errors.description && <div className="errText">{errors.description}</div>}
                    </div>

                    <label className="lbl">Статус</label>
                    <div>
                        <div className={errors.status ? "errOutline" : ""}>
                            <StatusDropdown
                                value={form.status}
                                onChange={(v) => setForm((p) => ({ ...p, status: v }))}
                            />
                        </div>
                        {errors.status && <div className="errText">{errors.status}</div>}
                    </div>

                    <label className="lbl">Дедлайн</label>
                    <div>
                        <input
                            className={"inp " + (errors.deadlineDmy ? "err" : "")}
                            placeholder="Укажите дедлайн"
                            value={form.deadlineDmy}
                            onChange={(e) => setForm((p) => ({ ...p, deadlineDmy: e.target.value }))}
                        />
                        {errors.deadlineDmy && <div className="errText">{errors.deadlineDmy}</div>}
                    </div>

                    <div />
                    <button className="createBtn" onClick={onCreateTask}>
                        Добавить задачу
                    </button>
                </div>
            </Modal>
        </div>
    );
}
