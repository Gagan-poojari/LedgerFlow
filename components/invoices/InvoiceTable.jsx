"use client";

import Link from "next/link";
import { ArrowRight, FileStack, UploadCloud } from "lucide-react";
import InvoiceStatusBadge from "./InvoiceStatusBadge";
import MatchStatusBadge from "./MatchStatusBadge";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function formatAmount(invoice) {
  const total = invoice.extractedData?.total;
  if (total == null) return "—";
  const currency = invoice.extractedData?.currency || "INR";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(total);
}

export default function InvoiceTable({ invoices }) {
  if (!invoices?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center px-4 bg-white border border-dashed border-slate-200 rounded-2xl">
        <div className="h-11 w-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-3 shadow-3xs">
          <FileStack className="h-5 w-5 stroke-[1.8]" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">No invoices found</h3>
        <p className="text-xs text-slate-400 mt-0.5 max-w-xs mx-auto font-medium">
          You have not uploaded any invoices yet.
        </p>
        <Link 
          href="/invoices/upload" 
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-slate-800 active:scale-98"
        >
          <UploadCloud className="h-3.5 w-3.5" />
          <span>Upload invoice</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
      <table className="min-w-full border-collapse text-sm text-left">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold uppercase tracking-wider text-slate-400 select-none">
            <th className="px-5 py-3.5 font-bold">Invoice ID</th>
            <th className="px-5 py-3.5 font-bold">Vendor</th>
            <th className="px-5 py-3.5 font-bold">Amount</th>
            <th className="px-5 py-3.5 font-bold">Status</th>
            <th className="px-5 py-3.5 font-bold">PO Matching</th>
            <th className="px-5 py-3.5 font-bold">Date Uploaded</th>
            <th className="relative px-5 py-3.5" aria-label="Actions interface" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80">
          {invoices.map((inv) => (
            <tr key={inv.id} className="group hover:bg-slate-50/60 transition-colors">
              <td className="whitespace-nowrap px-5 py-3.5 font-bold text-slate-900 tracking-tight">
                {inv.invoiceNumber || <span className="text-slate-300 font-normal">Unassigned</span>}
              </td>
              <td className="max-w-[180px] truncate whitespace-nowrap px-5 py-3.5 font-semibold text-slate-600">
                {inv.vendor?.name || "—"}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 font-bold text-slate-800 tabular-nums">
                {formatAmount(inv)}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5">
                <InvoiceStatusBadge status={inv.status} />
              </td>
              <td className="whitespace-nowrap px-5 py-3.5">
                <MatchStatusBadge status={inv.matchStatus} matchType={inv.matchType} />
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold text-slate-400 tabular-nums">
                {formatDate(inv.createdAt)}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-right">
                <Link
                  href={`/invoices/${inv.id}`}
                  className="inline-flex items-center gap-1 rounded-xl border border-transparent bg-transparent px-2.5 py-1.5 text-xs font-bold text-slate-700 transition-all group-hover:border-slate-200 group-hover:bg-white group-hover:shadow-3xs hover:text-slate-900"
                >
                  <span>View details</span>
                  <ArrowRight className="h-3 w-3 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}