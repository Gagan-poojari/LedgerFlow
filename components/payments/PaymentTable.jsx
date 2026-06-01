"use client";

import Link from "next/link";
import { FileText, ArrowUpRight } from "lucide-react";
import PaymentStatusBadge from "./PaymentStatusBadge";

function formatMoney(amount) {
  if (amount == null) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PaymentTable({ payments }) {
  if (!payments?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-white border border-dashed border-slate-200 rounded-2xl m-1">
        <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shadow-2xs mb-3">
          <FileText className="h-5 w-5 stroke-[1.8]" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">No payments found</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto font-medium">
          Payments will appear here once invoices are approved.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse whitespace-nowrap">
        <thead>
          <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 select-none">
            <th className="px-5 py-3.5 font-bold">Invoice Number</th>
            <th className="px-5 py-3.5 font-bold">Vendor</th>
            <th className="px-5 py-3.5 font-bold">Amount</th>
            <th className="px-5 py-3.5 font-bold">Payment Method</th>
            <th className="px-5 py-3.5 font-bold">Status</th>
            <th className="px-5 py-3.5 font-bold">Payment Date</th>
            <th className="px-5 py-3.5 font-bold text-right" aria-label="Actions" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
          {payments.map((p) => (
            <tr key={p.id} className="group hover:bg-slate-50/60 transition-colors">
              {/* INVOICE REF */}
              <td className="px-5 py-3.5 font-bold text-slate-900 tracking-tight">
                {p.invoice?.invoiceNumber || "—"}
              </td>
              
              {/* VENDOR */}
              <td className="px-5 py-3.5 font-semibold text-slate-600">
                {p.vendor?.name || "—"}
              </td>
              
              {/* AMOUNT */}
              <td className="px-5 py-3.5 font-bold text-slate-900 tabular-nums">
                {formatMoney(p.amount)}
              </td>
              
              {/* METHOD */}
              <td className="px-5 py-3.5 text-xs font-semibold text-slate-500 capitalize">
                {p.method ? p.method.replace(/_/g, " ") : "—"}
              </td>
              
              {/* BADGE COMPONENT LINK */}
              <td className="px-5 py-3.5">
                <PaymentStatusBadge status={p.status} />
              </td>
              
              {/* TIMESTAMPS */}
              <td className="px-5 py-3.5 text-xs text-slate-400 font-semibold tabular-nums">
                {formatDate(p.paymentDate)}
              </td>
              
              {/* LINK CTA BUTTON */}
              <td className="px-5 py-3.5 text-right">
                <Link
                  href={`/payments/${p.id}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:text-slate-900 group-hover:border-slate-300"
                >
                  <span>Manage</span>
                  <ArrowUpRight className="h-3 w-3 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}