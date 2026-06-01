"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StatsCard from "@/components/dashboard/StatsCard";
import InvoiceAgingChart from "@/components/dashboard/InvoiceAgingChart";
import VendorAnalyticsChart from "@/components/dashboard/VendorAnalyticsChart";
import StatusBreakdown from "@/components/dashboard/StatusBreakdown";
import { useDashboard } from "@/hooks/useDashboard";

function formatInr(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  },
};

export default function DashboardPage() {
  const { stats, fetchStats, loading, error } = useDashboard();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const s = stats?.summary;

  const openPipelineCount = (stats?.invoicesByStatus || [])
    .filter((i) => ["uploaded", "validated", "pending_approval"].includes(i.status))
    .reduce((n, i) => n + i.count, 0);

  return (
    <div className="min-h-screen max-w-7xl mx-auto space-y-10 px-4 py-8 sm:px-6 lg:px-8 text-slate-900 selection:bg-slate-200">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="mt-1.5 text-sm font-medium text-slate-500">
            Overview of your invoices, payments, and vendors.
          </p>
        </div>
        
        <div className="flex items-center gap-3 text-sm">
          <Link
            href="/approvals"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 active:scale-98"
          >
            Approvals
          </Link>
          <Link
            href="/invoices/upload"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 font-semibold text-white shadow-md shadow-slate-900/10 transition-all duration-200 hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 active:scale-98"
          >
            Upload invoice
          </Link>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 text-sm font-medium text-red-700 bg-red-50/70 backdrop-blur-sm border border-red-200/60 rounded-xl px-4 py-3.5 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && !stats ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="relative flex h-10 w-10 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-25" />
            <div className="h-6 w-6 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
          </div>
          <p className="text-sm font-medium text-slate-500 tracking-wide animate-pulse">
            Loading dashboard...
          </p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              label="Outstanding AP"
              value={formatInr(s?.outstandingAmount)}
              subtext={`${s?.totalInvoices || 0} total invoices`}
            />
            <StatsCard
              label="Pending Approval"
              value={s?.pendingApproval ?? 0}
              subtext="Waiting for approval"
              accent="amber"
            />
            <StatsCard
              label="Payments Pending"
              value={s?.pendingPayments ?? 0}
              subtext={formatInr(s?.pendingPaymentAmount)}
              accent="blue"
            />
            <StatsCard
              label="Overdue Balance"
              value={s?.overdueCount ?? 0}
              subtext={formatInr(s?.overdueAmount)}
              accent={s?.overdueCount ? "red" : "default"}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              label="Paid (YTD)"
              value={formatInr(s?.paidAmount)}
              subtext={`${s?.paidInvoices || 0} paid invoices`}
              accent="emerald"
            />
            <StatsCard
              label="Match Exceptions"
              value={s?.matchExceptions ?? 0}
              subtext="Need manual review"
              accent={s?.matchExceptions ? "red" : "default"}
            />
            <StatsCard
              label="Active Vendors"
              value={s?.activeVendors ?? 0}
              subtext={`${s?.totalVendors || 0} total vendors`}
            />
            <StatsCard
              label="In Progress"
              value={openPipelineCount}
              subtext="Being reviewed or validated"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
            <section className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md hover:border-slate-300/60 transition-all duration-300">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-black transition-colors">
                  Invoice Aging
                </h2>
                <p className="text-xs font-medium text-slate-400 mt-0.5">
                  How long invoices have been pending
                </p>
              </div>
              <div className="w-full min-h-[300px] flex items-center justify-center">
                <InvoiceAgingChart data={stats?.aging} />
              </div>
            </section>

            <section className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md hover:border-slate-300/60 transition-all duration-300">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-black transition-colors">
                  Top Vendors by Spend
                </h2>
                <p className="text-xs font-medium text-slate-400 mt-0.5">
                  Total spending by vendor
                </p>
              </div>
              <div className="w-full min-h-[300px] flex items-center justify-center">
                <VendorAnalyticsChart data={stats?.vendorAnalytics} />
              </div>
            </section>
          </motion.div>

          <motion.div variants={itemVariants}>
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 max-w-xl shadow-sm hover:shadow-md hover:border-slate-300/60 transition-all duration-300">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Invoice Status
                </h2>
                <p className="text-xs font-medium text-slate-400 mt-0.5">
                  Current invoice counts by status
                </p>
              </div>
              <StatusBreakdown items={stats?.invoicesByStatus} />
            </section>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}