"use client";

import { CheckCircle2, ShieldAlert, ArrowUpRight, UserCheck, XCircle, Loader2 } from "lucide-react";

export default function OnboardingActions({
  vendor,
  userRole,
  onAction,
  loading,
}) {
  if (!vendor) return null;

  const canReview = ["admin", "vendor_manager"].includes(userRole);
  const { onboardingStatus } = vendor;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-4 shadow-2xs">
      {/* CARD RUNTIME HEADER */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
        <div className="h-7 w-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
          <UserCheck className="h-4 w-4 stroke-[2]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Vendor Onboarding Status</h3>
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5 select-none">
            Draft <span className="text-slate-300 font-sans mx-1">→</span> Under Review <span className="text-slate-300 font-sans mx-1">→</span> Active / Verified
          </p>
        </div>
      </div>

      {/* CONTROLLER ACTION DECKS */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        {onboardingStatus === "draft" && (
          <>
            <p className="text-xs font-semibold text-slate-500 max-w-md">
              This vendor profile is currently a draft. Submit it for review to activate this vendor.
            </p>
            <button
              type="button"
              disabled={loading}
              onClick={() => onAction("submit")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-blue-700 disabled:opacity-50 active:scale-98 cursor-pointer ml-auto"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
              <span>Submit for Review</span>
            </button>
          </>
        )}

        {onboardingStatus === "submitted" && (
          <>
            <div className="flex items-start gap-2 max-w-sm sm:max-w-md">
              <ShieldAlert className="h-4 w-4 text-amber-500 mt-0.5 shrink-0 stroke-[2.2]" />
              <p className="text-xs font-semibold text-slate-500 leading-normal">
                Vendor profile submitted and under review. Requires manager or admin approval to activate.
              </p>
            </div>
            
            {canReview ? (
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => onAction("reject")}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/50 px-3.5 py-2 text-xs font-bold text-red-700 shadow-3xs hover:bg-red-100 transition-all active:scale-98 cursor-pointer"
                >
                  {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                  <span>Reject Vendor</span>
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => onAction("verify")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-98 cursor-pointer"
                >
                  {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                  <span>Approve & Activate</span>
                </button>
              </div>
            ) : (
              <span className="inline-flex items-center rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wide ml-auto select-none">
                Awaiting Approval
              </span>
            )}
          </>
        )}

        {onboardingStatus === "verified" && (
          <div className="w-full flex items-center gap-2.5 rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-3.5 text-xs font-bold text-emerald-800 shadow-3xs">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Onboarding complete. This vendor is active and verified.</span>
          </div>
        )}

        {onboardingStatus === "rejected" && (
          <div className="w-full flex items-center gap-2.5 rounded-xl border border-red-200/80 bg-red-50/40 p-3.5 text-xs font-bold text-red-800 shadow-3xs">
            <XCircle className="h-4 w-4 text-red-600 shrink-0" />
            <span>This vendor has been rejected.</span>
          </div>
        )}
      </div>
    </div>
  );
}