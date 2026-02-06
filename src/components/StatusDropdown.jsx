import React, { useEffect, useMemo, useRef, useState } from "react";
import { STATUSES, statusColor } from "../constants.js";

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
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className="statusText">{value}</span>
                <span className={"chev " + (open ? "up" : "down")} />
            </button>

            {open && !disabled && (
                <div className="statusMenu" role="listbox" aria-label="Выбор статуса">
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
                            role="option"
                            aria-selected={s === value}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
