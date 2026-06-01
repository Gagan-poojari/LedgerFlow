import { CheckCircle2, AlertOctagon, AlertTriangle } from "lucide-react";

export default function ValidationPanel({ errors = [], warnings = [] }) {
  if (!errors?.length && !warnings?.length) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-4 text-xs font-bold text-emerald-800 shadow-3xs">
        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
        <span>System clearance verified. Structural entity parameter data validation metrics match perfectly.</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ERRORS PANELS STATUS LOGS */}
      {errors.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50/40 p-4 shadow-3xs">
          <div className="flex items-center gap-2 text-xs font-extrabold text-red-900 uppercase tracking-wide mb-2.5">
            <AlertOctagon className="h-4 w-4 text-red-500 shrink-0" />
            <span>Critical Exception Errors Constraints Block ({errors.length})</span>
          </div>
          <ul className="text-xs font-semibold text-red-700 space-y-1 list-none pl-0">
            {errors.map((msg, i) => (
              <li key={i} className="flex gap-2 before:content-['•'] before:text-red-400 before:font-bold">
                {msg}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* WARNINGS BLOCK STATUS RUN TIMESTAMPS */}
      {warnings.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 shadow-3xs">
          <div className="flex items-center gap-2 text-xs font-extrabold text-amber-900 uppercase tracking-wide mb-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
            <span>Audit Alert Discrepancy Warnings Log ({warnings.length})</span>
          </div>
          <ul className="text-xs font-semibold text-amber-700 space-y-1 list-none pl-0">
            {warnings.map((msg, i) => (
              <li key={i} className="flex gap-2 before:content-['•'] before:text-amber-400 before:font-bold">
                {msg}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}