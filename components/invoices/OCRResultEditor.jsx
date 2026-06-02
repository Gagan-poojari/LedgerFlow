"use client";

import { useEffect, useState } from "react";
import { FileEdit, Save, ShieldCheck, Loader2 } from "lucide-react";
import VendorSelect from "./VendorSelect";
import OcrMethodBadge from "./OcrMethodBadge";

function toDateInput(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function OCRResultEditor({ invoice, onSave, saving }) {
  const [form, setForm] = useState({
    invoiceNumber: "",
    poNumber: "",
    grnNumber: "",
    invoiceDate: "",
    dueDate: "",
    subtotal: "",
    tax: "",
    total: "",
    currency: "INR",
    gstin: "",
    pan: "",
    vendorId: "",
  });

  useEffect(() => {
    if (!invoice) return;
    const ex = invoice.extractedData || {};
    setForm({
      invoiceNumber: invoice.invoiceNumber || "",
      poNumber: invoice.poNumber || "",
      grnNumber: invoice.grnNumber || "",
      invoiceDate: toDateInput(ex.invoiceDate),
      dueDate: toDateInput(ex.dueDate),
      subtotal: ex.subtotal ?? "",
      tax: ex.tax ?? "",
      total: ex.total ?? "",
      currency: ex.currency || "INR",
      gstin: ex.gstin || "",
      pan: ex.pan || "",
      vendorId: invoice.vendorId || "",
    });
  }, [invoice]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave?.({
      invoiceNumber: form.invoiceNumber,
      poNumber: form.poNumber,
      grnNumber: form.grnNumber,
      vendorId: form.vendorId || null,
      extractedData: {
        invoiceDate: form.invoiceDate || null,
        dueDate: form.dueDate || null,
        subtotal: form.subtotal === "" ? null : Number(form.subtotal),
        tax: form.tax === "" ? null : Number(form.tax),
        total: form.total === "" ? null : Number(form.total),
        currency: form.currency,
        gstin: form.gstin?.trim() || null,
        pan: form.pan?.trim() || null,
        lineItems: invoice?.extractedData?.lineItems || [],
      },
      markValidated: true,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <FileEdit className="h-4 w-4 text-slate-400 stroke-[2.2]" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Invoice Data Editor</h2>
        </div>
        <OcrMethodBadge
          method={invoice?.ocrMethod}
          aiEnhanced={invoice?.aiEnhanced}
          requiresManualReview={invoice?.requiresManualReview}
          confidence={invoice?.ocrConfidence}
        />
      </div>

      {/* Confidence Score Bar */}
      {invoice?.ocrConfidence != null && (
        <div className="space-y-1.5 bg-slate-50/50 p-3 border border-slate-100 rounded-xl">
          <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wide">
            <span>OCR Confidence Score</span>
            <span className="font-mono text-slate-800">{invoice.ocrConfidence}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200/60 overflow-hidden shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-500 ${invoice.ocrConfidence >= 85
                  ? "bg-emerald-500"
                  : invoice.ocrConfidence >= 60
                    ? "bg-amber-500"
                    : "bg-red-500"
                }`}
              style={{ width: `${Math.min(100, invoice.ocrConfidence)}%` }}
            />
          </div>
        </div>
      )}

      {/* Vendor Select */}
      <div className="p-4 bg-slate-50/40 border border-slate-200/60 rounded-2xl">
        <VendorSelect
          value={form.vendorId}
          onChange={(v) => handleChange("vendorId", v)}
          disabled={saving}
        />
      </div>

      {/* Fields Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Invoice Number" value={form.invoiceNumber} onChange={(v) => handleChange("invoiceNumber", v)} disabled={saving} />
        <Field label="PO Number" value={form.poNumber} onChange={(v) => handleChange("poNumber", v)} disabled={saving} />
        <Field label="GRN Number" value={form.grnNumber} onChange={(v) => handleChange("grnNumber", v)} disabled={saving} />
        <Field label="Invoice Date" type="date" value={form.invoiceDate} onChange={(v) => handleChange("invoiceDate", v)} disabled={saving} />
        <Field label="Due Date" type="date" value={form.dueDate} onChange={(v) => handleChange("dueDate", v)} disabled={saving} />
        <Field label="Subtotal" type="number" value={form.subtotal} onChange={(v) => handleChange("subtotal", v)} disabled={saving} />
        <Field label="Tax Amount" type="number" value={form.tax} onChange={(v) => handleChange("tax", v)} disabled={saving} />
        <Field label="Total Amount" type="number" value={form.total} onChange={(v) => handleChange("total", v)} disabled={saving} />
        <Field label="Currency" value={form.currency} onChange={(v) => handleChange("currency", v)} disabled={saving} />
        {/* <Field label="GSTIN" value={form.gstin} onChange={(v) => handleChange("gstin", v)} disabled={saving} /> */}
        {/* <Field label="PAN Number" value={form.pan} onChange={(v) => handleChange("pan", v)} disabled={saving} /> */}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="GSTIN" value={form.gstin} onChange={(v) => handleChange("gstin", v)} disabled={saving} />
        <Field label="PAN Number" value={form.pan} onChange={(v) => handleChange("pan", v)} disabled={saving} />
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-slate-800 disabled:opacity-50 active:scale-98 cursor-pointer"
        >
          {saving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <ShieldCheck className="h-3.5 w-3.5 text-slate-300" />
          )}
          <span>{saving ? "Saving..." : "Save & Approve Data"}</span>
        </button>
      </div>
    </form>
  );
}

function Field({ label, value, onChange, type = "text", disabled }) {
  return (
    <div className="space-y-1">
      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-3xs transition-all focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
      />
    </div>
  );
}