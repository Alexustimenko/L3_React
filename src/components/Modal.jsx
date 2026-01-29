import React, { useEffect } from "react";

export default function Modal({ open, title, onClose, children }) {
    useEffect(() => {
        if (!open) return;

        const onKey = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="modalOverlay" onMouseDown={onClose}>
            <div className="modalCard" onMouseDown={(e) => e.stopPropagation()}>
                <button className="modalClose" onClick={onClose} aria-label="Закрыть">
                    ×
                </button>
                <div className="modalTitle">{title}</div>
                {children}
            </div>
        </div>
    );
}
