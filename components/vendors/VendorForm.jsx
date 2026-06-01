"use client";

import { useEffect, useState } from "react";
import { Landmark, Building2, Save, Loader2, Contact } from "lucide-react";

const empty = {
  vendorCode: "",
  name: "",
  email: "",
  phone: "",
  gstin: "",
  pan: "",
  tin: "",
  bankDetails: {
    accountNo: "",
    ifsc: "",
    bankName: "",
    branch: "",
  },
};

export default function VendorForm({ vendor, onSubmit, saving, submitLabel }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (!vendor) {
      setForm(empty);
      return;
    }
    setForm({
      vendorCode: vendor.vendorCode || "",
      name: vendor.name || "",
      email: vendor.email || "",
      phone: vendor.phone || "",
      gstin: vendor.gstin || "",
      pan: vendor.pan || "",
      tin: vendor.tin || "",
      bankDetails: {
        accountNo: vendor.bankDetails?.accountNo || "",
        ifsc: vendor.bankDetails?.ifsc || "",
        bankName: vendor.bankDetails?.bankName || "",
        branch: vendor.bankDetails?.branch || "",
      },
    });
  }, [vendor]);

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function setBank(field, value) {
    setForm((prev) => ({
      ...prev,
      bankDetails: { ...prev.bankDetails, [field]: value },
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit?.(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* SECTION I: PRIMARY IDENTITY LOGS */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 select-none">
          <Building2 className="h-4 w-4 text-slate-400 stroke-[2.2]" />
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Primary Details
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Vendor Code" value={form.vendorCode} onChange={(v) => setField("vendorCode", v)} disabled={saving} placeholder="e.g., VEN-2026-004" />
          <Field label="Vendor Name" value={form.name} onChange={(v) => setField("name", v)} disabled={saving} placeholder="e.g., Acme Infrastructure" />
          <Field label="Email Address" type="email" value={form.email} onChange={(v) => setField("email", v)} disabled={saving} placeholder="info@acme.org" />
          <Field label="Phone Number" value={form.phone} onChange={(v) => setField("phone", v)} disabled={saving} placeholder="e.g., +91 98765 43210" />
        </div>
      </section>

      {/* SECTION II: REGULATORY TAX STRUCTURES */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 select-none">
          <Contact className="h-4 w-4 text-slate-400 stroke-[2.2]" />
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Tax Details
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="GSTIN" value={form.gstin} onChange={(v) => setField("gstin", v)} disabled={saving} placeholder="15-character GSTIN" />
          <Field label="PAN Number" value={form.pan} onChange={(v) => setField("pan", v)} disabled={saving} placeholder="10-character PAN" />
          <Field label="TIN" value={form.tin} onChange={(v) => setField("tin", v)} disabled={saving} placeholder="Tax Identification Number" />
        </div>
      </section>

      {/* SECTION III: LIQUIDITY ROUTING MATRICES */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 select-none">
          <Landmark className="h-4 w-4 text-slate-400 stroke-[2.2]" />
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Bank Account Details
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Bank Account Number" value={form.bankDetails.accountNo} onChange={(v) => setBank("accountNo", v)} disabled={saving} placeholder="Account number" />
          <Field label="IFSC Code" value={form.bankDetails.ifsc} onChange={(v) => setBank("ifsc", v)} disabled={saving} placeholder="11-character IFSC" />
          <Field label="Bank Name" value={form.bankDetails.bankName} onChange={(v) => setBank("bankName", v)} disabled={saving} placeholder="e.g., State Bank of India" />
          <Field label="Branch Name" value={form.bankDetails.branch} onChange={(v) => setBank("branch", v)} disabled={saving} placeholder="Branch name" />
        </div>
      </section>

      {/* ACTION BLOCK */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-slate-800 disabled:opacity-50 active:scale-98 cursor-pointer"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5 text-slate-400" />}
          <span>{saving ? "Saving..." : submitLabel || "Save Vendor"}</span>
        </button>
      </div>
    </form>
  );
}

function Field({ label, value, onChange, type = "text", disabled, placeholder }) {
  return (
    <div className="space-y-1">
      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide select-none">{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 placeholder-slate-300 shadow-3xs transition-all focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
      />
    </div>
  );
}