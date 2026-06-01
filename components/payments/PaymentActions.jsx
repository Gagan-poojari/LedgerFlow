"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, MailCheck, Calendar, CreditCard, Landmark, Loader2 } from "lucide-react";
import { PAYMENT_METHODS } from "@/types";

export default function PaymentActions({ payment, onUpdate, saving }) {
  const [referenceNo, setReferenceNo] = useState(payment?.referenceNo || "");
  const [method, setMethod] = useState(payment?.method || "bank_transfer");
  const [paymentDate, setPaymentDate] = useState(
    payment?.paymentDate
      ? new Date(payment.paymentDate).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );

  if (!payment) return null;

  const isPending = payment.status === "pending";

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 shadow-inner backdrop-blur-xs">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-200/60">
        <CreditCard className="h-4 w-4 text-slate-400 stroke-[2.2]" />
        <h3 className="text-sm font-bold tracking-tight text-slate-900">Payment Processing</h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {/* PAYMENT METHOD SELECT */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
            Payment Method
          </label>
          <div className="relative">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              disabled={!isPending || saving}
              className="w-full appearance-none rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition-all focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer"
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </option>
              ))}
            </select>
            {isPending && (
              <span className="absolute right-3.5 top-1/2 h-3 w-3 -translate-y-1/2 pointer-events-none border-l border-t border-slate-400 rotate-135 transform origin-center scale-75 mt-[-2px]" />
            )}
          </div>
        </div>

        {/* REFERENCE NUMBER INPUT */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
            Reference / UTR Number
          </label>
          <div className="relative">
            <Landmark className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              disabled={!isPending || saving}
              className="w-full rounded-xl border border-slate-200/80 bg-white pl-10 pr-4 py-2.5 text-sm font-medium placeholder-slate-400 shadow-xs transition-all focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:bg-slate-100"
              placeholder="Unique Transaction Ref"
            />
          </div>
        </div>

        {/* PAYMENT DATE INPUT */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
            Payment Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              disabled={!isPending || saving}
              className="w-full rounded-xl border border-slate-200/80 bg-white pl-10 pr-4 py-2 text-sm font-semibold text-slate-700 shadow-xs transition-all focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:bg-slate-100"
            />
          </div>
        </div>
      </div>

      {/* Payment actions */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        {isPending && (
          <>
            <button
              type="button"
              disabled={saving || !referenceNo.trim()}
              onClick={() =>
                onUpdate({
                  status: "processed",
                  method,
                  referenceNo: referenceNo.trim(),
                  paymentDate,
                  sendAdvice: true,
                })
              }
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-emerald-900/10 transition-all duration-150 hover:bg-emerald-700 disabled:opacity-50 active:scale-98"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.2]" />}
              <span>Mark as Paid & Send Notification</span>
            </button>
            
            <button
              type="button"
              disabled={saving}
              onClick={() => onUpdate({ status: "failed", referenceNo })}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-red-900/10 transition-all duration-150 hover:bg-red-700 disabled:opacity-50 active:scale-98"
            >
              <XCircle className="h-3.5 w-3.5 stroke-[2.2]" />
              <span>Mark as Failed</span>
            </button>
          </>
        )}
        
        {payment.status === "processed" && !payment.adviceSent && (
          <button
            type="button"
            disabled={saving}
            onClick={() => onUpdate({ sendAdvice: true })}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MailCheck className="h-3.5 w-3.5 text-slate-500" />}
            <span>Resend Payment Notification</span>
          </button>
        )}

        {payment.adviceSent && (
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/40 rounded-lg px-3 py-1.5 shadow-2xs animate-fade-in">
            <MailCheck className="h-3.5 w-3.5 text-emerald-600 stroke-[2.5]" />
            <span>Payment notification sent to vendor.</span>
          </div>
        )}
      </div>
    </div>
  );
}