"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Landmark, Receipt, Calendar, MailCheck, ShieldAlert, FileText } from "lucide-react";
import PaymentStatusBadge from "@/components/payments/PaymentStatusBadge";
import PaymentActions from "@/components/payments/PaymentActions";
import { usePayments } from "@/hooks/usePayments";

function formatMoney(amount) {
  if (amount == null) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

export default function PaymentDetailPage() {
  const { id } = useParams();
  const { getById, update, loading, error } = usePayments();
  const [payment, setPayment] = useState(null);

  const load = useCallback(async () => {
    const data = await getById(id);
    setPayment(data);
  }, [getById, id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUpdate(payload) {
    const updated = await update(id, payload);
    setPayment(updated);
  }

  if (loading && !payment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="relative flex h-10 w-10 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-25" />
          <div className="h-6 w-6 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
        </div>
        <p className="text-sm font-medium text-slate-400 tracking-wide animate-pulse">
          Loading payment details...
        </p>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4 max-w-md mx-auto">
        <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm mb-4">
          <ShieldAlert className="h-6 w-6 stroke-[1.8]" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Payment not found</h3>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          The requested payment could not be found.
        </p>
        <Link 
          href="/payments" 
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs transition-all hover:bg-slate-50"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Payments
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-3xl mx-auto space-y-8 px-4 py-8 sm:px-6 text-slate-900 selection:bg-slate-200">
      
      {/* Header */}
      <header className="pb-6 border-b border-slate-100 space-y-3">
        <Link 
          href="/payments" 
          className="group inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Payments</span>
        </Link>
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                {formatMoney(payment.amount)}
              </h1>
              <PaymentStatusBadge status={payment.status} />
            </div>
            
            <p className="text-sm font-medium text-slate-500">
              Linked Invoice:{" "}
              <Link
                href={`/invoices/${payment.invoiceId}`}
                className="font-bold text-slate-800 underline underline-offset-2 hover:text-slate-900 transition-colors"
              >
                {payment.invoice?.invoiceNumber || `#${payment.invoiceId}`}
              </Link>
              <span className="text-slate-300 px-2 select-none">·</span>
              <span className="font-semibold text-slate-700">{payment.vendor?.name}</span>
            </p>
          </div>
        </div>
      </header>

      {/* Feedback Banner */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 text-sm font-medium text-red-700 bg-red-50/70 backdrop-blur-sm border border-red-200/60 rounded-xl px-4 py-3.5 shadow-sm">
              <ShieldAlert className="h-4 w-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Details */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <FileText className="h-4 w-4 text-slate-400 stroke-[2.2]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Payment Details
          </h2>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
          {/* METHOD */}
          <div className="bg-slate-50/40 border border-slate-100/70 rounded-xl p-3 flex gap-3 items-start">
            <Landmark className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <dt className="text-xs font-bold text-slate-400 uppercase tracking-wide">Payment Method</dt>
              <dd className="font-semibold text-slate-700 capitalize mt-0.5">
                {payment.method ? payment.method.replace(/_/g, " ") : "Not selected"}
              </dd>
            </div>
          </div>

          {/* REFERENCE */}
          <div className="bg-slate-50/40 border border-slate-100/70 rounded-xl p-3 flex gap-3 items-start">
            <Receipt className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <dt className="text-xs font-bold text-slate-400 uppercase tracking-wide">UTR Reference</dt>
              <dd className="font-mono font-bold text-xs text-slate-800 mt-1 tracking-tight break-all">
                {payment.referenceNo || "—"}
              </dd>
            </div>
          </div>

          {/* PAYMENT DATE */}
          <div className="bg-slate-50/40 border border-slate-100/70 rounded-xl p-3 flex gap-3 items-start">
            <Calendar className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <dt className="text-xs font-bold text-slate-400 uppercase tracking-wide">Payment Date</dt>
              <dd className="font-semibold text-slate-700 mt-0.5 tabular-nums">
                {payment.paymentDate
                  ? new Date(payment.paymentDate).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"}
              </dd>
            </div>
          </div>

          {/* ADVICE SENT */}
          <div className="bg-slate-50/40 border border-slate-100/70 rounded-xl p-3 flex gap-3 items-start">
            <MailCheck className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <dt className="text-xs font-bold text-slate-400 uppercase tracking-wide">Email Notification</dt>
              <dd className="mt-0.5">
                <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-md ${
                  payment.adviceSent 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" 
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {payment.adviceSent ? "Sent" : "Not Sent"}
                </span>
              </dd>
            </div>
          </div>
        </dl>
      </section>

      {/* Actions */}
      <PaymentActions
        payment={payment}
        onUpdate={handleUpdate}
        saving={loading}
      />
      
    </div>
  );
}