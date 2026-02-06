import React from "react";
import StatusDropdown from "./StatusDropdown.jsx";

export default function TasksTable({
                                       tasks,
                                       editing,
                                       onStartEdit,
                                       onEditingChange,
                                       onCommitEdit,
                                       onCancelEdit,
                                       onUpdateStatus,
                                       onRemoveTask,
                                       isoToDmy,
                                       isOverdueIso,
                                       statusLabels,
                                   }) {
    return (
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
                    {tasks.length === 0 ? (
                        <tr>
                            <td className="emptyCell" colSpan={3}>
                                Нет задач
                            </td>
                        </tr>
                    ) : (
                        tasks.map((t) => {
                            const isEditingDesc =
                                editing.id === t.id && editing.field === "description";

                            const deadlineText = isoToDmy(t.deadlineIso);
                            const deadlineRed =
                                t.status === statusLabels.ACTIVE && isOverdueIso(t.deadlineIso);

                            return (
                                <tr key={t.id}>
                                    {/* Описание (in-cell) */}
                                    <td
                                        className="tdDesc"
                                        onClick={() => {
                                            if (!isEditingDesc) onStartEdit(t.id, "description", t.description);
                                        }}
                                    >
                                        {isEditingDesc ? (
                                            <input
                                                className="cellInput"
                                                autoFocus
                                                value={editing.value}
                                                onChange={(e) => onEditingChange(e.target.value)}
                                                onBlur={onCommitEdit}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") e.currentTarget.blur();
                                                    if (e.key === "Escape") onCancelEdit();
                                                }}
                                            />
                                        ) : (
                                            <span className="cellText">{t.description}</span>
                                        )}
                                    </td>

                                    {/* Статус */}
                                    <td className="tdStatus">
                                        <StatusDropdown
                                            value={t.status}
                                            onChange={(v) => onUpdateStatus(t.id, v)}
                                        />
                                    </td>

                                    {/* Дедлайн (норедактируемый) */}
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

            {/* Колонка удаления */}
            <div className="deleteCol">
                <div className="deleteHeaderSpacer" />
                {tasks.map((t) => (
                    <button
                        key={t.id}
                        className="trashBtn"
                        onClick={() => onRemoveTask(t.id)}
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
    );
}
