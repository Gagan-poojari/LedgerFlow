const STATUS_STYLES = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  inactive: "bg-slate-50 text-slate-600 border-slate-200/60",
  pending: "bg-amber-50 text-amber-700 border-amber-200/60",
};

const ONBOARDING_STYLES = {
  draft: "bg-slate-100 text-slate-500 border-slate-200",
  submitted: "bg-blue-50 text-blue-700 border-blue-200/50",
  verified: "bg-teal-50 text-teal-700 border-teal-200/50",
  rejected: "bg-red-50 text-red-700 border-red-200/60",
};

export default function VendorStatusBadge({ status, onboardingStatus }) {
  return (
    <span className="inline-flex gap-1.5 flex-wrap select-none items-center">
      <span
        className={`inline-flex items-center border rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider tabular-nums ${STATUS_STYLES[status] || STATUS_STYLES.pending}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
          status === "active" ? "bg-emerald-500" : status === "inactive" ? "bg-slate-400" : "bg-amber-500"
        }`} />
        <span>{status}</span>
      </span>
      
      {onboardingStatus && (
        <span
          className={`inline-flex items-center border rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider tabular-nums ${ONBOARDING_STYLES[onboardingStatus] || "border-transparent bg-slate-50 text-slate-400"}`}
        >
          <span className="font-extrabold text-[9px] px-1 rounded bg-black/5 text-slate-700/60 mr-1">FLOW</span>
          <span>{onboardingStatus}</span>
        </span>
      )}
    </span>
  );
}