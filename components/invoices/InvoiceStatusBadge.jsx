const STYLES = {
  uploaded: "bg-slate-50 text-slate-600 border-slate-200/60",
  ocr_processing: "bg-blue-50/60 text-blue-700 border-blue-200/40 animate-pulse",
  validated: "bg-cyan-50 text-cyan-700 border-cyan-200/50",
  pending_approval: "bg-amber-50 text-amber-700 border-amber-200/60",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  paid: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
  rejected: "bg-red-50 text-red-700 border-red-200/60",
};

export default function InvoiceStatusBadge({ status }) {
  const label = (status || "unknown").replace(/_/g, " ");
  const style = STYLES[status] || "bg-slate-50 text-slate-500 border-slate-200";

  return (
    <span
      className={`inline-flex items-center border rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider tabular-nums ${style}`}
    >
      {label}
    </span>
  );
}