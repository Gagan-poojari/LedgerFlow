"use client";

import Link from "next/link";
import { useEffect, useState, useDeferredValue } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Upload, FileText, AlertCircle, Loader2 } from "lucide-react";
import InvoiceTable from "@/components/invoices/InvoiceTable";
import { useInvoices } from "@/hooks/useInvoices";
import { INVOICE_STATUSES } from "@/types";

export default function InvoicesPage() {
  const { list, loading, error } = useInvoices();
  const [invoices, setInvoices] = useState([]);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  
  // Use deferred value for the search query to prevent input stuttering during state updates
  const deferredQ = useDeferredValue(q);

  useEffect(() => {
    let isMounted = true;
    const params = {};
    if (status) params.status = status;
    if (deferredQ.trim()) params.q = deferredQ.trim();

    list(params).then((data) => {
      if (isMounted && data?.invoices) {
        setInvoices(data.invoices);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [list, status, deferredQ]);

  return (
    <div className="min-h-screen max-w-7xl mx-auto space-y-8 px-4 py-8 sm:px-6 lg:px-8 text-slate-900 selection:bg-slate-200">
      
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Invoices
          </h1>
          <p className="mt-1.5 text-sm font-medium text-slate-500">
            View, track, and manage all your invoices.
          </p>
        </div>
        
        <Link
          href="/invoices/upload"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition-all duration-200 hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 active:scale-98"
        >
          <Upload className="h-4 w-4 stroke-[2.2]" />
          <span>Upload invoice</span>
        </Link>
      </header>

      {/* ERROR MESSAGE DISPLAY */}
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
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-50/60 p-3 rounded-2xl border border-slate-200/60 backdrop-blur-sm">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 stroke-[2.2]" />
          <input
            type="search"
            placeholder="Search vendor name, invoice reference or PO #..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-xl border border-slate-200/80 bg-white pl-10 pr-4 py-2.5 text-sm font-medium placeholder-slate-400 shadow-sm transition-all focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
        </div>

        <div className="relative min-w-[180px]">
          <Filter className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 stroke-[2.2] pointer-events-none" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200/80 bg-white pl-10 pr-10 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
          >
            <option value="">All Statuses</option>
            {INVOICE_STATUSES.map((s) => (
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
            Updating entries...
          </div>
        )}
      </div>

      {/* INVOICE LIST */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-300 hover:border-slate-300/60">
        <AnimatePresence mode="wait">
          {loading && !invoices.length ? (
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
                Loading invoices...
              </p>
            </motion.div>
          ) : !loading && invoices.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center py-20 text-center px-4"
            >
              <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm mb-4">
                <FileText className="h-6 w-6 stroke-[1.8]" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No matching invoices</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto font-medium">
                Try adjusting your search or filter.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="table-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <InvoiceTable invoices={invoices} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}