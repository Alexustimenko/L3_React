import React from "react";

export default function Header({ filters, activeFilter, onChangeFilter }) {
    return (
        <div className="topBar">
            <div className="topBarInner">
                {Object.values(filters).map((f) => (
                    <button
                        key={f}
                        className={"tabBtn " + (activeFilter === f ? "active" : "")}
                        onClick={() => onChangeFilter(f)}
                    >
                        {f}
                    </button>
                ))}
            </div>
        </div>
    );
}
