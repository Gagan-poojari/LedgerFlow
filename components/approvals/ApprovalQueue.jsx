"use client";

import Link from "next/link";
import { ArrowUpRight, FolderHeart, ShieldCheck } from "lucide-react";
import ApprovalActions from "./ApprovalActions";
import InvoiceStatusBadge from "@/components/invoices/InvoiceStatusBadge";

function formatAmount(invoice) {
  const total = invoice.extractedData?.total;
  if (total == null) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: invoice.extractedData?.currency || "INR",
  }).format(total);
}

export default function ApprovalQueue({ items, onAction, acting }) {
  if (!items?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4 bg-white border border-dashed border-slate-200 rounded-2xl">
        <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-3 shadow-2xs">
          <ShieldCheck className="h-5 w-5 stroke-[1.8]" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">All caught up!</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto font-medium">
          There are no invoices waiting for your approval right now.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((inv) => (
        <article
          key={inv.id}
          className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all duration-300 hover:border-slate-300/80 hover:shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Link
                  href={`/invoices/${inv.id}`}
                  className="inline-flex items-center gap-1 text-base font-bold text-slate-900 tracking-tight hover:text-slate-700 underline underline-offset-2 decoration-transparent hover:decoration-slate-400 transition-all"
                >
                  <span>{inv.invoiceNumber || "No Invoice Number"}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="text-slate-800 font-bold">{inv.vendor?.name || "Unknown Vendor"}</span>
                <span className="text-slate-200 select-none">|</span>
                <span className="font-bold text-slate-900 tabular-nums">{formatAmount(inv)}</span>
              </div>

              {inv.currentStep && (
                <div className="inline-flex items-center gap-1.5 mt-2 rounded-lg bg-slate-50 border border-slate-100/80 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                  <FolderHeart className="h-3.5 w-3.5 text-slate-400 stroke-[2.2]" />
                  <span>
                    Required Approval Role: <strong className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">{inv.currentStep.role?.replace(/_/g, " ")}</strong>
                    {inv.currentStep.status === "escalated" && <span className="text-red-600 font-bold"> (Escalated)</span>}
                  </span>
                </div>
              )}
            </div>

            <InvoiceStatusBadge status={inv.status} />
          </div>

          {/* Action Buttons */}
          {inv.canAct && (
            <div className="mt-5 pt-4 border-t border-slate-100 animate-fade-in">
              <ApprovalActions
                invoiceId={inv.id}
                onComplete={onAction}
                disabled={acting}
              />
            </div>
          )}
        </article>
      ))}
    </div>
  );
}