"use client";

import { useCallback, useState } from "react";
import { UploadCloud, Hash, FileUp, Loader2 } from "lucide-react";

const ACCEPT = "image/jpeg,image/png,image/webp,image/tiff,application/pdf";

export default function InvoiceUploader({ onUpload, disabled }) {
  const [dragOver, setDragOver] = useState(false);
  const [poNumber, setPoNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFiles = useCallback(
    async (files) => {
      const file = files?.[0];
      if (!file || !onUpload) return;
      setIsProcessing(true);
      try {
        await onUpload(file, { poNumber: poNumber.trim() || undefined });
      } finally {
        setIsProcessing(false);
      }
    },
    [onUpload, poNumber]
  );

  const isIdle = disabled || isProcessing;

  return (
    <div className="space-y-5 max-w-xl">
      {/* REF INPUT LAYER */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Hash className="h-3.5 w-3.5 text-slate-400 stroke-[2.2]" />
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
            Purchase Order (PO) Number (Optional)
          </label>
        </div>
        <input
          type="text"
          value={poNumber}
          onChange={(e) => setPoNumber(e.target.value)}
          placeholder="e.g., PO-2026-8942"
          disabled={isIdle}
          className="w-full max-w-sm rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold placeholder-slate-400 shadow-3xs transition-all focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
        />
      </div>

      {/* DRAG AND DROP CONTAINER HOVER CONTEXT */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!isIdle) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (!isIdle) handleFiles(e.dataTransfer.files);
        }}
        className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
          dragOver
            ? "border-slate-900 bg-slate-50/80 scale-[1.01] shadow-xs"
            : "border-slate-200 bg-white shadow-2xs hover:border-slate-300"
        } ${isIdle ? "opacity-60 pointer-events-none bg-slate-50/50" : ""}`}
      >
        <div className="flex flex-col items-center justify-center">
          <div className={`h-12 w-12 rounded-2xl border flex items-center justify-center shadow-3xs mb-4 transition-transform ${dragOver ? 'scale-110 text-slate-900 border-slate-300' : 'text-slate-400 border-slate-100 bg-slate-50/50'}`}>
            {isProcessing ? (
              <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
            ) : (
              <UploadCloud className="h-6 w-6 stroke-[1.8]" />
            )}
          </div>
          
          <p className="text-sm font-bold text-slate-800">
            {isProcessing ? "Uploading and processing..." : "Drag and drop your invoice here, or click to browse"}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-400">
            Supports JPEG, PNG, WebP, TIFF, or PDF (Max 10MB)
          </p>
          
          <label className={`mt-5 inline-flex items-center gap-2 cursor-pointer rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-slate-800 active:scale-98 ${isIdle ? 'pointer-events-none' : ''}`}>
            <FileUp className="h-3.5 w-3.5" />
            <span>Browse files</span>
            <input
              type="file"
              accept={ACCEPT}
              className="hidden"
              disabled={isIdle}
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
        </div>
      </div>
    </div>
  );
}