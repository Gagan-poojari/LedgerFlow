"use client";

import { useEffect, useState, useTransition } from "react";
import { BarChart3, Landmark, ShieldAlert, Calendar, RefreshCw, Loader2 } from "lucide-react";
import ApAgingReport from "@/components/reports/ApAgingReport";
import GstReport from "@/components/reports/GstReport";
import ExceptionsReport from "@/components/reports/ExceptionsReport";
import { useReports } from "@/hooks/useReports";

const TABS = [
  { id: "aging", label: "AP Aging", icon: BarChart3 },
  { id: "gst", label: "GST Summary", icon: Landmark },
  { id: "exceptions", label: "Exceptions", icon: ShieldAlert },
];

export default function ReportsPage() {
  const { data, fetchReports, loading, error } = useReports();
  const [tab, setTab] = useState("aging");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchReports("all");
  }, [fetchReports]);

  const handleTabChange = (id) => {
    startTransition(() => {
      setTab(id);
    });
  };

  return (
    <div className="space-y-6 max-w-(--size-xl) mx-auto p-1">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 select-none">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Reports
          </h1>
          <p className="mt-0.5 text-xs font-semibold text-slate-400 uppercase tracking-wider flex flex-wrap items-center gap-2">
            <span>Payables Summary</span>
            {data?.generatedAt && (
              <>
                <span className="text-slate-200 font-sans">•</span>
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-500 lowercase normal-case tracking-normal bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60 font-semibold">
                  <Calendar className="h-3 w-3 text-slate-400 stroke-[2]" />
                  Snapshot: {new Date(data.generatedAt).toLocaleString()}
                </span>
              </>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchReports("all")}
          disabled={loading}
          className="inline-flex self-start sm:self-center items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-3xs hover:bg-slate-50 disabled:opacity-50 transition-all active:scale-98 cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-slate-400 ${loading ? "animate-spin text-slate-900" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/40 p-4 text-xs font-bold text-red-800 shadow-3xs">
          <ShieldAlert className="h-4 w-4 text-red-600 shrink-0 mt-0.5 stroke-[2.2]" />
          <div className="space-y-1">
            <p className="tracking-tight uppercase text-[10px] tracking-wider text-red-500">Error</p>
            <p className="font-semibold text-slate-600 leading-normal">{error}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1.5 border-b border-slate-200/80 overflow-x-auto no-scrollbar py-0.5 select-none">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTabChange(t.id)}
              className={`group flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 -mb-px transition-all cursor-pointer whitespace-nowrap rounded-t-xl ${
                isActive
                  ? "border-slate-900 text-slate-900 bg-slate-50/40"
                  : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200"
              }`}
            >
              <Icon className={`h-4 w-4 stroke-[2.2] transition-colors ${
                isActive ? "text-slate-900" : "text-slate-300 group-hover:text-slate-400"
              }`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Report content */}
      <div className="relative min-h-[320px]">
        {loading && !data ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200/60 p-8 shadow-3xs animate-pulse">
            <Loader2 className="h-6 w-6 text-slate-300 animate-spin" />
            <p className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest select-none">
              Loading reports...
            </p>
          </div>
        ) : (
          <div className={`transition-opacity duration-150 ${isPending ? "opacity-40" : "opacity-100"}`}>
            {tab === "aging" && (
              <div className={!data?.apAging ? "py-10 text-center text-slate-400" : ""}>
                <ApAgingReport report={data?.apAging} />
              </div>
            )}
            {tab === "gst" && (
              <div className={!data?.gst ? "py-10 text-center text-slate-400" : ""}>
                <GstReport report={data?.gst} />
              </div>
            )}
            {tab === "exceptions" && (
              <div className={!data?.exceptions ? "py-10 text-center text-slate-400" : ""}>
                <ExceptionsReport report={data?.exceptions} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}