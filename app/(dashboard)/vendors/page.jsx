"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Search, SlidersHorizontal, UserPlus, ShieldAlert, Loader2 } from "lucide-react";
import VendorTable from "@/components/vendors/VendorTable";
import { useVendors } from "@/hooks/useVendors";
import { useAuth } from "@/hooks/useAuth";
import { VENDOR_STATUSES } from "@/types";

export default function VendorsPage() {
  const { list, remove, loading, error } = useVendors();
  const { user } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [isPending, startTransition] = useTransition();

  const load = useCallback(async () => {
    const params = {};
    if (q.trim()) params.q = q.trim();
    if (status) params.status = status;
    
    try {
      const data = await list(params);
      setVendors(data?.vendors || []);
    } catch (err) {
      console.error("Failed to load vendors:", err);
    }
  }, [list, q, status]);

  useEffect(() => {
    // Debounce or raw transition handling can wrap this if typing performance scales down
    load();
  }, [load]);

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this vendor?")) return;
    try {
      await remove(id);
      await load();
    } catch (err) {
      console.error("Failed to delete vendor:", err);
    }
  }

  const canDelete = user?.role === "admin" || user?.role === "vendor_manager";

  return (
    <div className="space-y-6 max-w-(--size-xl) mx-auto p-1">
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 select-none">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Vendors
          </h1>
          <p className="mt-0.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Manage your vendor contacts and details
          </p>
        </div>
        <Link
          href="/vendors/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-slate-800 active:scale-98 cursor-pointer self-start sm:self-center"
        >
          <UserPlus className="h-3.5 w-3.5 text-slate-400" />
          <span>Add Vendor</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-50/60 border border-slate-200/60 rounded-xl p-3 shadow-3xs select-none">
        {/* Search bar */}
        <div className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4 stroke-[2.2]" />
          </div>
          <input
            type="search"
            placeholder="Search by name, ID, or GSTIN..."
            value={q}
            onChange={(e) => startTransition(() => setQ(e.target.value))}
            className="w-full rounded-xl border border-slate-200/90 bg-white pl-10 pr-3.5 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 shadow-3xs transition-all focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
        </div>

        {/* Status dropdown */}
        <div className="relative min-w-[160px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <SlidersHorizontal className="h-3.5 w-3.5 stroke-[2.2]" />
          </div>
          <select
            value={status}
            onChange={(e) => startTransition(() => setStatus(e.target.value))}
            className="w-full appearance-none rounded-xl border border-slate-200/90 bg-white pl-9 pr-8 py-2 text-xs font-bold text-slate-700 shadow-3xs transition-all focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
          >
            <option value="">All Statuses</option>
            {VENDOR_STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize font-semibold">
                {s}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 font-sans text-[10px] font-bold">
            ▼
          </div>
        </div>

        {/* Loading state */}
        {(loading || isPending) && (
          <div className="inline-flex items-center gap-1.5 px-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider animate-pulse ml-auto">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500" />
            <span>Searching...</span>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/40 p-3.5 text-xs font-bold text-red-800 shadow-3xs animate-in fade-in slide-in-from-top-1">
          <ShieldAlert className="h-4 w-4 text-red-600 shrink-0 mt-0.5 stroke-[2.2]" />
          <div className="space-y-0.5">
            <p className="tracking-tight uppercase text-[10px] tracking-wider text-red-500 font-extrabold">Error</p>
            <p className="font-semibold text-slate-600 leading-normal">{error}</p>
          </div>
        </div>
      )}

      {/* Vendor table */}
      <div className={`transition-opacity duration-150 ${(loading || isPending) && !vendors.length ? "opacity-100" : isPending ? "opacity-60" : "opacity-100"}`}>
        {loading && !vendors.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-slate-200/60 rounded-2xl shadow-3xs animate-pulse select-none">
            <Loader2 className="h-6 w-6 text-slate-300 animate-spin" />
            <p className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              Loading vendors...
            </p>
          </div>
        ) : (
          <VendorTable
            vendors={vendors}
            onDelete={canDelete ? handleDelete : undefined}
          />
        )}
      </div>

    </div>
  );
}