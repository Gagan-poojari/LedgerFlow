"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, AlertCircle, CheckCircle2, Cpu, Loader2 } from "lucide-react";
import InvoiceUploader from "@/components/invoices/InvoiceUploader";
import { useInvoices } from "@/hooks/useInvoices";

export default function InvoiceUploadPage() {
  const router = useRouter();
  const { upload, loading, error } = useInvoices();
  const [message, setMessage] = useState("");

  async function handleUpload(file, extras) {
    setMessage("");
    const invoice = await upload(file, extras);
    setMessage("Upload complete. OCR finished - review extracted fields.");
    router.push(`/invoices/${invoice.id}`);
  }

  return (
    <div className="min-h-screen max-w-3xl mx-auto space-y-8 px-4 py-8 sm:px-6 lg:px-8 text-slate-900 selection:bg-slate-200">
      
      {/* HEADER */}
      <header className="pb-6 border-b border-slate-100">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Upload Invoice
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500 leading-relaxed max-w-xl">
          Upload your invoices as images or multi-page PDFs to automatically extract invoice data.
        </p>
      </header>

      {/* PIPELINE INFO BLOCK */}
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 backdrop-blur-sm p-4 flex gap-3.5 items-start">
        <Cpu className="h-5 w-5 text-slate-400 stroke-[2.2] mt-0.5 shrink-0" />
        <div className="text-xs font-medium text-slate-500 space-y-1">
          <p>
            <span className="font-bold text-slate-700">AI-Powered Extraction:</span> We automatically read invoice details from your uploaded files. To enable advanced AI extraction, set up your:
          </p>
        </div>
      </div>

      {/* MESSAGES LAYER (NOTIFICATIONS) */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 text-sm font-medium text-red-700 bg-red-50/70 backdrop-blur-sm border border-red-200/60 rounded-xl px-4 py-3.5 shadow-sm">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {message && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 text-sm font-medium text-emerald-700 bg-emerald-50/70 backdrop-blur-sm border border-emerald-200/60 rounded-xl px-4 py-3.5 shadow-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploader container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 transition-all duration-300 hover:border-slate-300/60">
        <InvoiceUploader onUpload={handleUpload} disabled={loading} />
      </div>

      {/* Loading indicator */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-3.5 justify-center bg-slate-900 text-white rounded-2xl px-6 py-4 shadow-xl shadow-slate-950/20 max-w-md mx-auto"
          >
            <Loader2 className="h-5 w-5 animate-spin text-slate-300 shrink-0 stroke-[2.5]" />
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-tight">Reading Invoice Details</span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                Processing OCR analysis. This might take up to a minute.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}