"use client";

import { useState } from "react";
import { CheckCircle2, AlertTriangle, Loader2, MessageSquarePlus } from "lucide-react";

export default function ApprovalActions({ invoiceId, onComplete, disabled }) {
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleAction(action) {
    if (submitting) return;
    setSubmitting(true);
    try {
      await onComplete(invoiceId, action, remarks);
      setRemarks("");
    } finally {
      setSubmitting(false);
    }
  }

  const isIdle = disabled || submitting;

  return (
    <div className="space-y-4 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 shadow-2xs">
      <div className="flex items-center gap-2">
        <MessageSquarePlus className="h-4 w-4 text-slate-400 stroke-[2.2]" />
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
          Approval Comments / Remarks
        </label>
      </div>

      <textarea
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        rows={2}
        disabled={isIdle}
        className="w-full rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 text-sm font-medium placeholder-slate-400 shadow-3xs transition-all focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:bg-slate-100 disabled:text-slate-400"
        placeholder="Write a comment or reason (optional)..."
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isIdle}
          onClick={() => handleAction("approve")}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-emerald-700 disabled:opacity-50 active:scale-98 cursor-pointer"
        >
          {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
          <span>Approve</span>
        </button>

        <button
          type="button"
          disabled={isIdle}
          onClick={() => handleAction("reject")}
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-red-700 disabled:opacity-50 active:scale-98 cursor-pointer"
        >
          {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <AlertTriangle className="h-3.5 w-3.5" />}
          <span>Reject</span>
        </button>
      </div>
    </div>
  );
}