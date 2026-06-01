"use client";

import { HandCoins, Download, Landmark } from "lucide-react";
import { downloadCsv } from "@/lib/export-csv";

function formatInr(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

export default function GstReport({ report }) {
  if (!report) return null;

  const { rows, totals } = report;

  function exportCsv() {
    downloadCsv("gst-summary.csv", rows, [
      { label: "GSTIN", get: (r) => r.gstin },
      { label: "Vendor Name", get: (r) => r.vendorName },
      { label: "Invoice Count", get: (r) => r.invoiceCount },
      { label: "Taxable Value (INR)", get: (r) => r.taxableValue },
      { label: "Tax Amount (INR)", get: (r) => r.taxAmount },
      { label: "Total Amount (INR)", get: (r) => r.totalAmount },
    ]);
  }

  return (
    <div className="space-y-5">
      {/* Summary bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 shadow-3xs">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-3xs">
            <Landmark className="h-4 w-4 stroke-[2]" />
          </div>
          <div className="text-sm font-semibold text-slate-600">
            <span>{totals.invoiceCount} Invoices</span>
            <span className="text-slate-300 mx-2 select-none">|</span>
            <span>Total Tax: <strong className="text-slate-900 font-bold tracking-tight">{formatInr(totals.taxAmount)}</strong></span>
            <span className="text-slate-300 mx-2 select-none">|</span>
            <span>Total Amount: <strong className="text-slate-900 font-bold tracking-tight">{formatInr(totals.totalAmount)}</strong></span>
          </div>
        </div>
        
        <button
          type="button"
          onClick={exportCsv}
          disabled={!rows?.length}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-98 cursor-pointer"
        >
          <Download className="h-3.5 w-3.5 text-slate-400" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* GST Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold uppercase tracking-wider text-slate-400 select-none">
              <th className="px-5 py-3.5 font-bold">GSTIN</th>
              <th className="px-5 py-3.5 font-bold">Vendor</th>
              <th className="px-5 py-3.5 font-bold text-center">Invoice Count</th>
              <th className="px-5 py-3.5 font-bold text-right">Taxable Value</th>
              <th className="px-5 py-3.5 font-bold text-right">GST Amount</th>
              <th className="px-5 py-3.5 font-bold text-right">Total Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80 font-semibold text-slate-600">
            {rows.map((row) => (
              <tr key={row.gstin} className="hover:bg-slate-50/60 transition-colors">
                <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-900 uppercase">
                  {row.gstin || <span className="text-slate-300 font-normal font-sans tracking-normal">Unregistered</span>}
                </td>
                <td className="max-w-[180px] truncate whitespace-nowrap px-5 py-3.5 text-slate-700">
                  {row.vendorName || "—"}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-center font-mono text-xs font-bold tabular-nums text-slate-500">
                  {row.invoiceCount}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-right font-mono font-bold text-slate-700 tabular-nums">
                  {formatInr(row.taxableValue)}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-right font-mono font-bold text-indigo-700 bg-indigo-50/15 group-hover:bg-indigo-50/30 tabular-nums">
                  {formatInr(row.taxAmount)}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-right font-mono font-bold text-slate-900 tabular-nums">
                  {formatInr(row.totalAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}