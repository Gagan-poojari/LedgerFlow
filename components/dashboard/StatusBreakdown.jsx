"use client";

import { Layers } from "lucide-react";

const COLORS = {
  uploaded: "bg-slate-400",
  ocr_processing: "bg-blue-500",
  validated: "bg-cyan-500",
  pending_approval: "bg-amber-500",
  approved: "bg-emerald-500",
  paid: "bg-indigo-600",
  rejected: "bg-red-500",
};

export default function StatusBreakdown({ items }) {
  if (!items?.length) {
    return (
      <div className="flex items-center gap-3 py-6 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 justify-center text-slate-400">
        <Layers className="h-4 w-4 stroke-[1.8]" />
        <span className="text-xs font-semibold">No invoice status data available.</span>
      </div>
    );
  }

  const total = items.reduce((s, i) => s + i.count, 0) || 1;

  return (
    <div className="space-y-4 bg-white p-1 rounded-xl">
      {items.map((item) => {
        const percent = (item.count / total) * 100;
        return (
          <div key={item.status} className="space-y-1.5 group">
            <div className="flex justify-between items-end text-xs">
              <span className="capitalize font-bold text-slate-700 tracking-tight transition-colors group-hover:text-slate-900">
                {item.status.replace(/_/g, " ")}
              </span>
              <div className="font-semibold text-slate-400 group-hover:text-slate-500 transition-colors">
                <span className="text-slate-700 font-bold tabular-nums">{item.count}</span> items
                <span className="text-slate-200 px-1.5 select-none">·</span>
                <span className="text-slate-800 font-bold tabular-nums">
                  ₹{item.amount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${COLORS[item.status] || "bg-slate-400"}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}