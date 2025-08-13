const StatusChip = ({ value }) => {
    const label = value || "open";
    const map = {
        Open: "bg-blue-50 text-blue-700 border-blue-200",
        "In Progress": "bg-amber-50 text-amber-700 border-amber-200",
        Done: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
    const cls = map[label] || map.Open;
    return (
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${cls}`}>
            {label}
        </span>
    );
}

export default StatusChip;