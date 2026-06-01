const STYLES = {
  unmatched: "bg-slate-50 text-slate-600 border-slate-200",
  partial: "bg-amber-50 text-amber-700 border-amber-200/60",
  matched: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  exception: "bg-red-50 text-red-700 border-red-200/60",
};

export default function MatchStatusBadge({ status, matchType }) {
  if (!status) return null;
  const style = STYLES[status] || STYLES.unmatched;
  const typeLabel = matchType === "3way" ? "3-Way" : matchType === "2way" ? "2-Way" : "";

  return (
    <span
      className={`inline-flex items-center gap-1.5 border rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider tabular-nums ${style}`}
    >
      {typeLabel && (
        <span className="font-extrabold text-[9px] px-1 rounded bg-black/5 text-slate-700/80 mr-0.5 select-none">
          {typeLabel}
        </span>
      )}
      <span>{status.replace(/_/g, " ")}</span>
    </span>
  );
}