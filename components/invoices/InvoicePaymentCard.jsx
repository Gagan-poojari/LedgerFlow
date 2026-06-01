"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Sparkles, ArrowUpRight, HandCoins } from "lucide-react";
import PaymentStatusBadge from "@/components/payments/PaymentStatusBadge";

export default function InvoicePaymentCard({ invoiceId, invoiceStatus }) {
  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!invoiceId || !["approved", "paid"].includes(invoiceStatus)) return;
    
    setIsLoading(true);
    fetch(`/api/invoices/${invoiceId}/payment`)
      .then((r) => r.json())
      .then((d) => setPayment(d.payment))
      .catch(() => setPayment(null))
      .finally(() => setIsLoading(false));
  }, [invoiceId, invoiceStatus]);

  if (!["approved", "paid"].includes(invoiceStatus)) return null;

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 flex items-center gap-3 animate-pulse">
        <div className="h-4 w-4 rounded-full bg-slate-200" />
        <div className="h-4 bg-slate-200 rounded w-1/3" />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/40 p-4 flex items-start gap-3">
        <Sparkles className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
        <p className="text-xs font-medium text-slate-500 leading-normal">
          No active payment record found. Remittance structures clear and populate automatically down-stream upon absolute administrative approval.
        </p>
      </div>
    );
  }

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 flex flex-wrap items-center justify-between gap-4 shadow-2xs transition-all hover:border-slate-300 hover:shadow-xs">
      <div className="flex items-center gap-3.5">
        <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
          <HandCoins className="h-5 w-5 stroke-[1.8]" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Request Payload</p>
          <p className="text-xl font-bold tracking-tight text-slate-900 mt-0.5 tabular-nums">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(payment.amount)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 self-end sm:self-auto ml-auto sm:ml-0">
        <PaymentStatusBadge status={payment.status} />
        <Link
          href={`/payments/${payment.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 shadow-3xs hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-98"
        >
          <span>Manage Request</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
}