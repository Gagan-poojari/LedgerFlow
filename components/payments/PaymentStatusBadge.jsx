const STYLES = {
  pending: "bg-amber-50 text-amber-800 border-amber-200/60",
  processed: "bg-emerald-50 text-emerald-800 border-emerald-200/60",
  failed: "bg-red-50 text-red-800 border-red-200/60",
};

export default function PaymentStatusBadge({ status }) {
  const normStatus = status || "unknown";
  
  return (
    <span
      className={`inline-flex items-center border rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
        STYLES[normStatus] || "bg-slate-50 text-slate-600 border-slate-200"
      }`}
    >
      {normStatus.replace(/_/g, " ")}
    </span>
  );
}