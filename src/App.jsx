import React, { useEffect, useMemo, useState } from "react";
import Modal from "./components/Modal.jsx";
import Header from "./components/Header.jsx";
import TasksTable from "./components/TasksTable.jsx";
import StatusDropdown from "./components/StatusDropdown.jsx";

import { FILTERS, SEED_TASKS, STATUS_LABELS } from "./constants.js";
import { dmyToIso, isoToDmy, isOverdueIso } from "./utils/dates.js";
import { loadTasks, saveTasks } from "./utils/storage.js";

function uid() {
    return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export default function App() {
    const [filter, setFilter] = useState(FILTERS.ALL);
    const [tasks, setTasks] = useState(() => loadTasks() ?? SEED_TASKS);

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
        const value = String(editing.value ?? "");

        if (field === "description") {
            // пустое сохраняем пустым
            const next = value.trim() === "" ? "" : value.trim();
            updateTask(id, { description: next });
            setEditing({ id: null, field: null, value: "" });
        }
    }

    function cancelEdit() {
        setEditing({ id: null, field: null, value: "" });
    }

    return (
        <div className="page">
            <Header filters={FILTERS} activeFilter={filter} onChangeFilter={setFilter} />

            <div className="content">
                <TasksTable
                    tasks={filtered}
                    editing={editing}
                    onStartEdit={startEdit}
                    onEditingChange={(v) => setEditing((p) => ({ ...p, value: v }))}
                    onCommitEdit={commitEdit}
                    onCancelEdit={cancelEdit}
                    onUpdateStatus={(id, status) => updateTask(id, { status })}
                    onRemoveTask={removeTask}
                    isoToDmy={isoToDmy}
                    isOverdueIso={isOverdueIso}
                    statusLabels={STATUS_LABELS}
                />

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
