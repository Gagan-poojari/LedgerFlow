"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare, ShieldAlert, GitFork, ClipboardList, Loader2 } from "lucide-react";
import ApprovalQueue from "@/components/approvals/ApprovalQueue";
import { useApprovals } from "@/hooks/useApprovals";

export default function ApprovalsPage() {
  const { fetchQueue, approve, loading, error } = useApprovals();
  const [items, setItems] = useState([]);

  const load = useCallback(async () => {
    const data = await fetchQueue();
    setItems(data.approvals || []);
  }, [fetchQueue]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAction(invoiceId, action, remarks) {
    await approve(invoiceId, action, remarks);
    await load();
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto space-y-8 px-4 py-8 sm:px-6 lg:px-8 text-slate-900 selection:bg-slate-200">
      
      {/* HEADER */}
      <header className="pb-6 border-b border-slate-100">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Approval Queue
        </h1>
        <p className="mt-1.5 text-sm font-medium text-slate-500">
          Review and approve or reject invoices assigned to you.
        </p>
      </header>

      {/* Approval rules */}
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 backdrop-blur-sm p-4 flex gap-4 items-start">
        <GitFork className="h-5 w-5 text-slate-400 stroke-[2.2] mt-0.5 shrink-0" />
        <div className="space-y-1.5 flex-1">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Approval Rules
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
            <span className="bg-white border border-slate-200/60 px-2.5 py-1 rounded-lg shadow-2xs">
              &lt; ₹10k <span className="text-slate-400 font-medium ml-1">Manager approval only</span>
            </span>
            <span className="bg-white border border-slate-200/60 px-2.5 py-1 rounded-lg shadow-2xs">
              ₹10k – ₹1L <span className="text-slate-400 font-medium ml-1">Needs manager + director</span>
            </span>
            <span className="bg-white border border-slate-200/60 px-2.5 py-1 rounded-lg shadow-2xs">
              &gt; ₹1L <span className="text-slate-400 font-medium ml-1">Needs manager, director & CFO</span>
            </span>
          </div>
        </div>
      </div>

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
              <ShieldAlert className="h-4 w-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Approval queue */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-300 hover:border-slate-300/60">
        <AnimatePresence mode="wait">
          {loading && !items.length ? (
            <motion.div 
              key="loading"
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
                Loading approvals...
              </p>
            </motion.div>
          ) : !loading && items.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center py-20 text-center px-4"
            >
              <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm mb-4">
                <ClipboardList className="h-6 w-6 stroke-[1.8]" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">All caught up!</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto font-medium">
                No invoices are waiting for your approval right now.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="queue"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-1"
            >
              <div className="px-5 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-slate-400 stroke-[2.2]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Pending Review ({items.length})
                  </span>
                </div>
                {loading && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500" />
                    Updating...
                  </div>
                )}
              </div>
              <ApprovalQueue items={items} onAction={handleAction} acting={loading} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}