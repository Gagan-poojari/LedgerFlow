"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  FileText, 
  Eye, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Send, 
  Layers, 
  Terminal 
} from "lucide-react";

import InvoiceStatusBadge from "@/components/invoices/InvoiceStatusBadge";
import OCRResultEditor from "@/components/invoices/OCRResultEditor";
import ValidationPanel from "@/components/invoices/ValidationPanel";
import MatchPanel from "@/components/invoices/MatchPanel";
import MatchStatusBadge from "@/components/invoices/MatchStatusBadge";
import ApprovalChain from "@/components/approvals/ApprovalChain";
import ApprovalActions from "@/components/approvals/ApprovalActions";
import InvoicePaymentCard from "@/components/invoices/InvoicePaymentCard";
import OcrMethodBadge from "@/components/invoices/OcrMethodBadge";

import { useInvoices } from "@/hooks/useInvoices";
import { useApprovals } from "@/hooks/useApprovals";
import { useAuth } from "@/hooks/useAuth";

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const { getById, update, runMatch, reocr, loading, error } = useInvoices();
  const { submitForApproval, approve, loading: approvalLoading } = useApprovals();
  const { user } = useAuth();
  const [invoice, setInvoice] = useState(null);
  const [saved, setSaved] = useState(false);

  const pendingStep = invoice?.approvalChain?.find((s) => s.status === "pending");
  const userCanApprove =
    invoice?.status === "pending_approval" &&
    pendingStep &&
    (user?.role === "admin" || user?.role === pendingStep.role);

  const load = useCallback(async () => {
    const data = await getById(id);
    setInvoice(data);
  }, [getById, id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave(payload) {
    setSaved(false);
    const updated = await update(id, payload);
    setInvoice(updated);
    setSaved(true);
  }

  if (loading && !invoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <div className="relative flex h-10 w-10 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-25" />
          <div className="h-6 w-6 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
        </div>
        <p className="text-sm font-medium text-slate-500 tracking-wide animate-pulse">
          Loading invoice...
        </p>
      </div>
    );
  }

  if (!invoice && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm mb-4">
          <FileText className="h-6 w-6 stroke-[1.8]" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Invoice not found</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xs font-medium">
          We could not find the requested invoice.
        </p>
        <Link 
          href="/invoices" 
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to list
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto space-y-8 px-4 py-8 sm:px-6 lg:px-8 text-slate-900 selection:bg-slate-200">
      
      {/* HEADER SECTION */}
      <header className="pb-6 border-b border-slate-100 space-y-3">
        <Link 
          href="/invoices" 
          className="group inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Invoices</span>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {invoice.invoiceNumber || "Draft Invoice"}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <InvoiceStatusBadge status={invoice.status} />
              <MatchStatusBadge status={invoice.matchStatus} matchType={invoice.matchType} />
              <OcrMethodBadge
                method={invoice.ocrMethod}
                aiEnhanced={invoice.aiEnhanced}
                requiresManualReview={invoice.requiresManualReview}
                confidence={invoice.ocrConfidence}
              />
            </div>
          </div>

          {invoice.uploadedFile?.originalName && (
            <div className="flex items-center gap-2 text-xs font-semibold bg-slate-50 border border-slate-200/60 rounded-xl p-2.5 shadow-sm self-start md:self-auto">
              <span className="text-slate-400 max-w-[180px] truncate">
                {invoice.uploadedFile.originalName}
              </span>
              <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-slate-200">
                <a
                  href={`/api/invoices/${invoice.id}/file`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 bg-white border border-slate-200 shadow-2xs px-2 py-1 rounded-md transition-colors"
                >
                  <Eye className="h-3 w-3 stroke-[2.2]" />
                  <span>View Original</span>
                </a>
                <button
                  type="button"
                  disabled={loading}
                  onClick={async () => {
                    const updated = await reocr(id);
                    setInvoice(updated);
                  }}
                  className="inline-flex items-center gap-1 text-violet-600 hover:text-violet-700 hover:bg-violet-50 px-2 py-1 rounded-md transition-colors disabled:opacity-50 font-bold"
                >
                  <RefreshCw className={`h-3 w-3 stroke-[2.2] ${loading ? 'animate-spin' : ''}`} />
                  <span>Re-run OCR</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* GLOBAL SYSTEM MESSAGES */}
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

        {saved && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 text-sm font-medium text-emerald-700 bg-emerald-50/70 backdrop-blur-sm border border-emerald-200/60 rounded-xl px-4 py-3.5 shadow-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Invoice updated successfully.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CORE WORKFLOW MODULES LAYOUT */}
      <div className="space-y-6">
        
        {/* Validation Panel */}
        <ValidationPanel
          errors={invoice.validationErrors}
          warnings={invoice.validationWarnings}
        />

        {/* Three-Way Matching */}
        <MatchPanel
          invoice={invoice}
          matching={loading}
          onRunMatch={async () => {
            const updated = await runMatch(id);
            setInvoice(updated);
          }}
        />

        {/* Approval Section */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-6 transition-all duration-300 hover:border-slate-300/60">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Layers className="h-4 w-4 text-slate-400 stroke-[2.2]" />
              <h2 className="text-lg font-bold tracking-tight text-slate-900">
                Approval Details
              </h2>
            </div>
            {invoice.status === "validated" && (
              <button
                type="button"
                disabled={approvalLoading}
                onClick={async () => {
                  const updated = await submitForApproval(id);
                  setInvoice(updated);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-slate-900/10 transition-all duration-200 hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 active:scale-98 disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5 stroke-[2.2]" />
                <span>Submit for approval</span>
              </button>
            )}
          </div>

          <ApprovalChain chain={invoice.approvalChain} />

          {userCanApprove && (
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 mt-4">
              <ApprovalActions
                invoiceId={id}
                disabled={approvalLoading}
                onComplete={async (invoiceId, action, remarks) => {
                  const updated = await approve(invoiceId, action, remarks);
                  setInvoice(updated);
                }}
              />
            </div>
          )}

          {(invoice.status === "approved" || invoice.status === "paid") && (
            <div className="pt-4 border-t border-slate-100">
              <InvoicePaymentCard
                invoiceId={invoice.id}
                invoiceStatus={invoice.status}
              />
            </div>
          )}
        </section>

        {/* Editor & Raw Text */}
        <div className="grid gap-6 lg:grid-cols-2">
          
          <OCRResultEditor
            invoice={invoice}
            onSave={handleSave}
            saving={loading}
          />

          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col h-full min-h-[580px] transition-all duration-300 hover:border-slate-300/60">
            <div className="mb-4 flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <Terminal className="h-4 w-4 text-slate-400 stroke-[2.2]" />
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">Extracted Text</h2>
                <p className="text-[11px] text-slate-400 font-medium">Original text extracted from the document</p>
              </div>
            </div>
            
            <div className="flex-1 bg-slate-950 rounded-xl p-4 border border-slate-800 shadow-inner overflow-hidden relative group">
              <div className="absolute right-3 top-3 bg-slate-900 text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider px-2 py-1 rounded border border-slate-800 select-none opacity-60 group-hover:opacity-100 transition-opacity">
                UTF-8
              </div>
              <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap h-full max-h-[460px] overflow-auto leading-relaxed scrollbar-thin scrollbar-thumb-slate-800 pr-2">
                {invoice.rawOcrText || "// No text extracted from this document."}
              </pre>
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}