"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  Loader2,
  Plus,
  Trash2,
  Package,
  ChevronUp,
  RefreshCw,
} from "lucide-react";
import { usePurchaseOrders } from "@/hooks/usePurchaseOrders";

const emptyLine = () => ({
  description: "",
  quantity: "1",
  unitPrice: "",
});

function formatInr(value) {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function suggestPoNumber(vendorCode) {
  const year = new Date().getFullYear();
  const suffix = String(Math.floor(1000 + Math.random() * 9000));
  const code = vendorCode?.replace(/[^A-Z0-9]/gi, "").slice(0, 8).toUpperCase();
  return code ? `PO-${year}-${code}-${suffix}` : `PO-${year}-${suffix}`;
}

const STATUS_STYLES = {
  open: "bg-sky-50 text-sky-700 border-sky-200/60",
  partially_matched: "bg-amber-50 text-amber-800 border-amber-200/60",
  fully_matched: "bg-emerald-50 text-emerald-800 border-emerald-200/60",
  closed: "bg-slate-100 text-slate-600 border-slate-200/60",
};

export default function VendorPurchaseOrders({ vendorId, vendorCode, disabled }) {
  const { list, create, loading, error } = usePurchaseOrders();
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [poNumber, setPoNumber] = useState("");
  const [lines, setLines] = useState([emptyLine()]);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const loadOrders = useCallback(async () => {
    if (!vendorId) return;
    const data = await list({ vendorId });
    setOrders(data);
  }, [list, vendorId]);

  useEffect(() => {
    loadOrders().catch(() => {});
  }, [loadOrders]);

  const lineTotal = useMemo(() => {
    return lines.reduce((sum, line) => {
      const qty = parseFloat(line.quantity) || 0;
      const price = parseFloat(line.unitPrice) || 0;
      return sum + qty * price;
    }, 0);
  }, [lines]);

  function updateLine(index, field, value) {
    setLines((prev) =>
      prev.map((line, i) => (i === index ? { ...line, [field]: value } : line))
    );
  }

  function addLine() {
    setLines((prev) => [...prev, emptyLine()]);
  }

  function removeLine(index) {
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  }

  function openCreateForm() {
    setFormError("");
    setSuccess("");
    setPoNumber(suggestPoNumber(vendorCode));
    setLines([emptyLine()]);
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    setSuccess("");

    try {
      const created = await create({
        poNumber: poNumber.trim(),
        vendorId,
        lineItems: lines.map((line) => ({
          description: line.description,
          quantity: parseFloat(line.quantity) || 0,
          unitPrice: parseFloat(line.unitPrice) || 0,
        })),
        totalAmount: Math.round(lineTotal * 100) / 100,
      });
      setSuccess(`Purchase order ${created.poNumber} created.`);
      setShowForm(false);
      await loadOrders();
    } catch (err) {
      setFormError(err.message);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-4 shadow-2xs">
      <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-slate-400 stroke-[2.2]" />
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Purchase Orders
            </h2>
          </div>
          <p className="text-[11px] font-medium text-slate-400">
            Create POs for this vendor so invoices can match against them.
          </p>
        </div>
        <button
          type="button"
          disabled={disabled || loading}
          onClick={() => (showForm ? setShowForm(false) : openCreateForm())}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-3xs hover:bg-slate-50 disabled:opacity-50 transition-all active:scale-98"
        >
          {showForm ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
          <span>{showForm ? "Cancel" : "New PO"}</span>
        </button>
      </div>

      {(error || formError) && (
        <div className="text-xs font-semibold text-red-700 bg-red-50/70 border border-red-200/60 rounded-xl px-3.5 py-2.5">
          {formError || error}
        </div>
      )}

      {success && (
        <div className="text-xs font-semibold text-emerald-700 bg-emerald-50/70 border border-emerald-200/60 rounded-xl px-3.5 py-2.5">
          {success}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-slate-200/80 bg-slate-50/40 p-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="PO Number"
              value={poNumber}
              onChange={setPoNumber}
              disabled={disabled || loading}
              placeholder="PO-2026-ACME-1001"
              required
            />
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                Order Total
              </label>
              <div className="rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-sm font-bold text-slate-900 tabular-nums">
                {formatInr(lineTotal)}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                Line Items
              </p>
              <button
                type="button"
                onClick={addLine}
                disabled={disabled || loading}
                className="text-[11px] font-bold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Add line
              </button>
            </div>

            <div className="space-y-2">
              {lines.map((line, index) => (
                <div
                  key={index}
                  className="grid gap-2 sm:grid-cols-[1fr_80px_100px_36px] items-end rounded-xl border border-slate-200/60 bg-white p-3"
                >
                  <Field
                    label={index === 0 ? "Description" : undefined}
                    value={line.description}
                    onChange={(v) => updateLine(index, "description", v)}
                    disabled={disabled || loading}
                    placeholder="Item or service"
                    required
                  />
                  <Field
                    label={index === 0 ? "Qty" : undefined}
                    type="number"
                    min="0"
                    step="any"
                    value={line.quantity}
                    onChange={(v) => updateLine(index, "quantity", v)}
                    disabled={disabled || loading}
                  />
                  <Field
                    label={index === 0 ? "Unit Price (₹)" : undefined}
                    type="number"
                    min="0"
                    step="any"
                    value={line.unitPrice}
                    onChange={(v) => updateLine(index, "unitPrice", v)}
                    disabled={disabled || loading}
                  />
                  <button
                    type="button"
                    onClick={() => removeLine(index)}
                    disabled={disabled || loading || lines.length <= 1}
                    className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30"
                    aria-label="Remove line"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={disabled || loading || lineTotal <= 0}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Package className="h-3.5 w-3.5" />
              )}
              <span>{loading ? "Creating..." : "Create Purchase Order"}</span>
            </button>
          </div>
        </form>
      )}

      {loading && orders.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Loading POs...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8 px-4 border border-dashed border-slate-200 rounded-xl">
          <Package className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No purchase orders yet</p>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Click New PO to add one for invoice matching.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200/80">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">PO Number</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Lines</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-slate-800">
                    {po.poNumber}
                  </td>
                  <td className="px-4 py-3 font-semibold tabular-nums text-slate-800">
                    {formatInr(po.totalAmount)}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs font-medium">
                    {po.lineItems?.length || 0}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex border rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        STATUS_STYLES[po.status] || STATUS_STYLES.open
                      }`}
                    >
                      {(po.status || "open").replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 font-medium">
                    {po.createdAt
                      ? new Date(po.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {orders.length > 0 && (
        <button
          type="button"
          onClick={() => loadOrders()}
          disabled={loading}
          className="text-[11px] font-bold text-slate-400 hover:text-slate-700 inline-flex items-center gap-1"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          Refresh list
        </button>
      )}
    </section>
  );
}

function Field({ label, value, onChange, type = "text", disabled, placeholder, required, min, step }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
        min={min}
        step={step}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 placeholder-slate-300 shadow-3xs transition-all focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:bg-slate-50"
      />
    </div>
  );
}
