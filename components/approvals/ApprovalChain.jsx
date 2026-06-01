"use client";

import { CheckCircle2, AlertCircle, HelpCircle, ArrowUpCircle } from "lucide-react";

const CHAIN_THEME = {
  pending: { bg: "bg-amber-500", text: "text-amber-800 bg-amber-50 border-amber-200/60", icon: HelpCircle },
  approved: { bg: "bg-emerald-500", text: "text-emerald-800 bg-emerald-50 border-emerald-200/60", icon: CheckCircle2 },
  rejected: { bg: "bg-red-500", text: "text-red-800 bg-red-50 border-red-200/60", icon: AlertCircle },
  escalated: { bg: "bg-orange-500", text: "text-orange-800 bg-orange-50 border-orange-200/60", icon: ArrowUpCircle },
};

export default function ApprovalChain({ chain }) {
  if (!chain?.length) {
    return (
      <div className="py-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/40">
        <p className="text-xs font-semibold text-slate-400">No approval workflow has been started for this invoice.</p>
      </div>
    );
  }

  return (
    <div className="relative pl-3.5 space-y-6 before:absolute before:left-5 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-slate-100">
      {chain.map((step, i) => {
        const theme = CHAIN_THEME[step.status] || { bg: "bg-slate-400", text: "text-slate-600 bg-slate-50", icon: HelpCircle };
        const StatusIcon = theme.icon;

        return (
          <div key={step.id || i} className="relative flex gap-4 items-start group">
            {/* Timeline dot */}
            <div className={`absolute left-[3px] top-1.5 h-2 w-2 rounded-full z-10 ring-4 ring-white ${theme.bg}`} />

            <div className="flex-1 bg-slate-50/30 border border-slate-100 rounded-xl p-3.5 hover:bg-slate-50/70 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-bold text-slate-900 capitalize tracking-tight">
                  {step.role?.replace(/_/g, " ")}
                </p>
                <span className={`inline-flex items-center gap-1 border px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${theme.text}`}>
                  <StatusIcon className="h-2.5 w-2.5 stroke-[2.5]" />
                  {step.status}
                </span>
              </div>

              {step.userName && (
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Action by: <span className="text-slate-700 font-bold">{step.userName}</span>
                </p>
              )}

              {step.remarks && (
                <blockquote className="mt-2 text-xs font-medium text-slate-600 pl-2.5 border-l-2 border-slate-200 italic bg-white/50 py-1 rounded-r-md">
                  &ldquo;{step.remarks}&rdquo;
                </blockquote>
              )}

              {step.timestamp && (
                <p className="text-[10px] font-bold text-slate-400 tracking-wide uppercase mt-2.5">
                  {new Date(step.timestamp).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short"
                  })}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}