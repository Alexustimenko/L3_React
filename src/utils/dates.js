function pad2(n) {
    return String(n).padStart(2, "0");
}


export function dmyToIso(dmy) {
    const s = String(dmy || "").trim();
    const m = s.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (!m) return null;

    const dd = Number(m[1]);
    const mm = Number(m[2]);
    const yyyy = Number(m[3]);

    if (mm < 1 || mm > 12) return null;
    if (dd < 1 || dd > 31) return null;

    const dt = new Date(yyyy, mm - 1, dd);

    if (
        dt.getFullYear() !== yyyy ||
        dt.getMonth() !== mm - 1 ||
        dt.getDate() !== dd
    ) {
        return null;
    }

    return `${yyyy}-${pad2(mm)}-${pad2(dd)}`;
}


export function isoToDmy(iso) {
    const s = String(iso || "").trim();
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return "";
    return `${m[3]}.${m[2]}.${m[1]}`;
}

export function isOverdueIso(iso) {
    const s = String(iso || "").trim();
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return false;

    const yyyy = Number(m[1]);
    const mm = Number(m[2]);
    const dd = Number(m[3]);

    const due = new Date(yyyy, mm - 1, dd);
    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return due.getTime() < today.getTime();
}
