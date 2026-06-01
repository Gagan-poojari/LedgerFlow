export default function OcrMethodBadge({ method, aiEnhanced, requiresManualReview, confidence }) {
  const metaSuffix = confidence != null ? ` · ${confidence}%` : "";

  if (requiresManualReview) {
    return (
      <span className="inline-flex items-center border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 rounded-lg">
        Needs Manual Review
      </span>
    );
  }

  if (aiEnhanced || method === "gemini") {
    return (
      <span className="inline-flex items-center border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-800 rounded-lg shadow-3xs shadow-violet-900/5">
        AI Extraction {metaSuffix}
      </span>
    );
  }

  if (method === "pdf_text") {
    return (
      <span className="inline-flex items-center border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-800 rounded-lg">
        PDF Text Reader {metaSuffix}
      </span>
    );
  }

  if (method === "tesseract" || method === "tesseract_fallback") {
    return (
      <span className="inline-flex items-center border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 rounded-lg">
        Standard OCR {metaSuffix}
      </span>
    );
  }

  return null;
}