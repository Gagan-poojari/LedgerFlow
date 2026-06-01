"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Filter, AlertCircle, Loader2, Coins, CalendarDays } from "lucide-react";
import PaymentTable from "@/components/payments/PaymentTable";
import { usePayments } from "@/hooks/usePayments";
import { PAYMENT_STATUSES } from "@/types";

export default function PaymentsPage() {
  const { list, loading, error } = usePayments();
  const [payments, setPayments] = useState([]);
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    const params = {};
    if (status) params.status = status;
    const data = await list(params);
    if (data?.payments) {
      setPayments(data.payments);
    }
  }, [list, status]);

  useEffect(() => {
    load();
  }, [load]);

  const pendingCount = payments.filter((p) => p.status === "pending").length;

  return (
    <div className="min-h-screen max-w-7xl mx-auto space-y-8 px-4 py-8 sm:px-6 lg:px-8 text-slate-900 selection:bg-slate-200">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Payments
          </h1>
          <p className="mt-1.5 text-sm font-medium text-slate-500">
            View and manage payments for approved invoices.
          </p>
        </div>

        {/* Pending badge */}
        <AnimatePresence>
          {pendingCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/60 text-xs font-bold text-amber-800 shadow-2xs"
            >
              <Coins className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
              <span>{pendingCount} Payments Pending</span>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Error message */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 text-sm font-medium text-red-700 bg-red-50/70 backdrop-blur-sm border border-red-200/60 rounded-xl px-4 py-3.5 shadow-sm">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-50/60 p-3 rounded-2xl border border-slate-200/60 backdrop-blur-sm">
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 stroke-[2.2] pointer-events-none" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200/80 bg-white pl-10 pr-10 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
          >
            <option value="">All Statuses</option>
            {PAYMENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </option>
            ))}
          </select>
          <span className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none border-l border-t border-slate-400 rotate-135 transform origin-center translate-x-[-2px] mt-[-3px] scale-50" />
        </div>

        {loading && (
          <div className="flex items-center gap-2 ml-auto pr-2 text-xs font-semibold text-slate-400 tracking-wide">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500" />
            Loading...
          </div>
        )}
      </div>

      {/* Payment list */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-300 hover:border-slate-300/60">
        <AnimatePresence mode="wait">
          {loading && !payments.length ? (
            <motion.div
              key="loading-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 space-y-4"
            >
              <div className="relative flex h-10 w-10 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-25" />
                <div className="h-6 w-6 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
              </div>
              <p className="text-sm font-medium text-slate-400 animate-pulse">
                Loading payments...
              </p>
            </motion.div>
          ) : !loading && payments.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center py-20 text-center px-4"
            >
              <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm mb-4">
                <CalendarDays className="h-6 w-6 stroke-[1.8]" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No payments yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto font-medium">
                No payments match your current filter.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="table-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-1"
            >
              <div className="px-5 pt-5 pb-3 border-b border-slate-100 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-slate-400 stroke-[2.2]" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Payments ({payments.length})
                </span>
              </div>
              <PaymentTable payments={payments} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}