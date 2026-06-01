"use client";

import { CheckCircle, Info, RefreshCw, XCircle, Layers2, AlertCircle } from "lucide-react";
import MatchStatusBadge from "./MatchStatusBadge";

export default function MatchPanel({ invoice, onRunMatch, matching }) {
  const details = invoice?.matchDetails;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-5 shadow-2xs">
      
      {/* HEADER BAR */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Layers2 className="h-4 w-4 text-slate-400 stroke-[2.2]" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Three-Way Matching</h2>
          </div>
          <p className="text-xs font-medium text-slate-400">
            {invoice?.poNumber
              ? `Linked Documents: PO (${invoice.poNumber})${invoice.grnNumber ? ` · GRN (${invoice.grnNumber})` : ""}`
              : "Enter a Purchase Order number to match this invoice."}
          </p>
        </div>
        <div className="flex items-center gap-2 self-center">
          <MatchStatusBadge status={invoice?.matchStatus} matchType={invoice?.matchType} />
          {invoice?.poNumber && (
            <button
              type="button"
              onClick={onRunMatch}
              disabled={matching}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-3xs hover:bg-slate-50 disabled:opacity-50 transition-all active:scale-98 cursor-pointer"
            >
              <RefreshCw className={`h-3 w-3 ${matching ? 'animate-spin text-slate-400' : 'text-slate-500'}`} />
              <span>{matching ? "Matching..." : "Run Matching"}</span>
            </button>
          )}
        </div>
      </div>

      {/* CORE BLANK SYSTEM CONFIG */}
      {!details && invoice?.poNumber && (
        <div className="flex items-center gap-2.5 p-3.5 border border-slate-100 rounded-xl bg-slate-50/50 text-xs font-semibold text-slate-500">
          <Info className="h-4 w-4 text-slate-400 shrink-0 stroke-[2.2]" />
          <span>Save your changes or click &quot;Run Matching&quot; to check this invoice against PO and GRN documents.</span>
        </div>
      )}

      {details && (
        <>
          {/* STAT MATRIX GRID */}
          <div className="grid gap-3 sm:grid-cols-3 text-sm">
            <Stat label="Invoice Total" value={formatMoney(details.invoiceTotal)} />
            <Stat label="PO Total" value={formatMoney(details.poTotal)} />
            {details.grnValue != null && (
              <Stat label="GRN Total" value={formatMoney(details.grnValue)} />
            )}
          </div>

          {/* MARGIN TOLERANCE REPORT */}
          {details.headerVariance != null && (
            <div className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl border ${
              details.headerMatch 
                ? "bg-emerald-50/40 border-emerald-100 text-emerald-800" 
                : "bg-red-50/40 border-red-100 text-red-800"
            }`}>
              {details.headerMatch ? (
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
              )}
              <span>
                Total Amount Variance: <span className="font-mono">{details.headerVariance.toFixed(2)}</span>
                {details.headerMatch ? " (Within limits)" : " (Exceeds limits)"}
              </span>
            </div>
          )}

          {/* EXCEPTION STACKS */}
          {details.exceptions?.length > 0 && (
            <div className="rounded-xl border border-red-200/60 bg-red-50/50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-red-900 uppercase tracking-wide">
                <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                <span>Discrepancies ({details.exceptions.length})</span>
              </div>
              <ul className="text-xs font-semibold text-red-700 space-y-1 list-none pl-0">
                {details.exceptions.map((msg, i) => (
                  <li key={i} className="flex gap-2 before:content-['•'] before:text-red-400 before:font-bold">
                    {msg}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* NESTED LINE MATRIX MODULE */}
          {details.lineMatches?.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-slate-200/80 shadow-3xs">
              <table className="min-w-full border-collapse text-xs text-left">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider select-none border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-2.5 font-bold">Line Description</th>
                    <th className="px-4 py-2.5 font-bold text-right">Invoice Amount</th>
                    <th className="px-4 py-2.5 font-bold text-right">PO Amount</th>
                    <th className="px-4 py-2.5 font-bold text-right">GRN Received Qty</th>
                    <th className="px-4 py-2.5 font-bold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70 font-semibold text-slate-600">
                  {details.lineMatches.map((line, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-2.5 font-bold text-slate-800">{line.description}</td>
                      <td className="px-4 py-2.5 text-right font-mono tabular-nums">{formatMoney(line.invoiceAmount)}</td>
                      <td className="px-4 py-2.5 text-right font-mono tabular-nums">{formatMoney(line.poAmount)}</td>
                      <td className="px-4 py-2.5 text-right font-mono tabular-nums">{line.grnReceivedQty ?? "—"}</td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                          line.status === "matched" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                            : line.status === "partial" 
                              ? "bg-amber-50 text-amber-700 border-amber-100" 
                              : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}>
                          {line.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {details.lineSummary && (
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide text-right">
              Line Matching Summary: <span className="text-emerald-600">{details.lineSummary.matched} matched</span> · <span className="text-amber-500">{details.lineSummary.partial} partial</span> · <span className="text-red-500">{details.lineSummary.exception} unmatched</span>
            </p>
          )}
        </>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-bold text-slate-900 mt-0.5 tabular-nums font-mono">{value}</p>
    </div>
  );
}

function formatMoney(n) {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);
}