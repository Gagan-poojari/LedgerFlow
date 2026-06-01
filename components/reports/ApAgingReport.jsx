"use client";

import Link from "next/link";
import { ArrowUpRight, BarChart3, Download, AlertTriangle } from "lucide-react";
import { downloadCsv } from "@/lib/export-csv";

function formatInr(n, precision = 0) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: precision,
  }).format(n || 0);
}

export default function ApAgingReport({ report }) {
  if (!report) return null;

  const { rows, summary } = report;

  function exportCsv() {
    downloadCsv("ap-aging.csv", rows, [
      { label: "Invoice Number", get: (r) => r.invoiceNumber },
      { label: "Vendor", get: (r) => r.vendorName },
      { label: "Amount (INR)", get: (r) => r.amount },
      { label: "Aging Bracket", get: (r) => `${r.bucket} days` },
      { label: "Days Open", get: (r) => r.daysOpen },
      { label: "Due Date", get: (r) => r.dueDate },
      { label: "Status", get: (r) => r.status },
    ]);
  }

  return (
    <div className="space-y-5">
      {/* Summary bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 shadow-3xs">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-3xs">
            <BarChart3 className="h-4 w-4 stroke-[2]" />
          </div>
          <div className="text-sm font-semibold text-slate-600">
            <span>{summary.count} Open Invoices</span>
            <span className="text-slate-300 mx-2 select-none">|</span>
            <span className="text-slate-900 font-bold tracking-tight">
              Total Amount: {formatInr(summary.totalAmount)}
            </span>
            {summary.overdueCount > 0 && (
              <>
                <span className="text-slate-300 mx-2 select-none">|</span>
                <span className="inline-flex items-center gap-1 font-bold text-red-600">
                  <AlertTriangle className="h-3.5 w-3.5 fill-red-50 stroke-[2.5]" />
                  {summary.overdueCount} Overdue
                </span>
              </>
            )}
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

      {/* Aging Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold uppercase tracking-wider text-slate-400 select-none">
              <th className="px-5 py-3.5 font-bold">Invoice ID</th>
              <th className="px-5 py-3.5 font-bold">Vendor</th>
              <th className="px-5 py-3.5 font-bold text-right">Amount</th>
              <th className="px-5 py-3.5 font-bold">Aging Bracket</th>
              <th className="px-5 py-3.5 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80 font-semibold text-slate-600">
            {rows.map((row) => (
              <tr 
                key={row.invoiceId} 
                className={`group transition-colors ${row.isOverdue ? "bg-red-50/30 hover:bg-red-50/60" : "hover:bg-slate-50/60"}`}
              >
                <td className="whitespace-nowrap px-5 py-3.5 font-bold text-slate-900 tracking-tight">
                  <Link
                    href={`/invoices/${row.invoiceId}`}
                    className="inline-flex items-center gap-1 hover:text-slate-700 underline underline-offset-2 decoration-transparent hover:decoration-slate-400 transition-colors"
                  >
                    <span>{row.invoiceNumber || "No Invoice Number"}</span>
                    <ArrowUpRight className="h-3 w-3 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </td>
                <td className="max-w-[200px] truncate whitespace-nowrap px-5 py-3.5">
                  {row.vendorName || "—"}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-right font-mono font-bold text-slate-900 tabular-nums">
                  {formatInr(row.amount, 2)}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-xs font-bold tracking-wide">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md border ${
                    row.isOverdue 
                      ? "bg-red-50 text-red-700 border-red-100" 
                      : "bg-slate-50 text-slate-600 border-slate-200/60"
                  }`}>
                    {row.bucket} Days Open
                  </span>
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 capitalize text-xs font-bold">
                  <span className={`inline-flex h-2 w-2 rounded-full mr-2 ${
                    row.status === "approved" || row.status === "paid" ? "bg-emerald-500" : "bg-amber-400"
                  }`} />
                  <span className="text-slate-700">{row.status?.replace(/_/g, " ")}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}