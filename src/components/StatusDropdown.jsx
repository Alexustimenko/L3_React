import React, { useEffect, useMemo, useRef, useState } from "react";

const STATUS = {
    ACTIVE: "Активная задача",
    DONE: "Задача выполнена",
    CANCELED: "Задача отменена",
};

export const STATUSES = Object.values(STATUS);

export function statusColor(status) {
    if (status === STATUS.ACTIVE) return "var(--pink)";
    if (status === STATUS.DONE) return "var(--green)";
    if (status === STATUS.CANCELED) return "var(--yellow)";
    return "var(--pink)";
}

export default function StatusDropdown({ value, onChange, disabled = false }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const onDoc = (e) => {
            if (!ref.current) return;
            if (!ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    const bg = useMemo(() => statusColor(value), [value]);

    return (
        <div className="statusWrap" ref={ref}>
            <button
                type="button"
                className="statusBtn"
                style={{ background: bg }}
                onClick={() => !disabled && setOpen((v) => !v)}
                disabled={disabled}
            >
                <span className="statusText">{value}</span>
                <span className={"chev " + (open ? "up" : "down")} />
            </button>

            {open && !disabled && (
                <div className="statusMenu" role="menu">
                    {STATUSES.map((s) => (
                        <button
                            key={s}
                            type="button"
                            className="statusItem"
                            style={{ background: statusColor(s) }}
                            onClick={() => {
                                onChange?.(s);
                                setOpen(false);
                            }}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export const STATUS_LABELS = STATUS;
