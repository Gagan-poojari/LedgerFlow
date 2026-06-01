"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { ArrowLeft, ShieldAlert, Building2, Terminal, Loader2, RefreshCw } from "lucide-react";
import VendorForm from "@/components/vendors/VendorForm";
import VendorStatusBadge from "@/components/vendors/VendorStatusBadge";
import OnboardingActions from "@/components/vendors/OnboardingActions";
import { useVendors } from "@/hooks/useVendors";
import { useAuth } from "@/hooks/useAuth";

export default function VendorDetailPage() {
  const { id } = useParams();
  const { getById, update, onboarding, loading, error } = useVendors();
  const { user } = useAuth();
  const [vendor, setVendor] = useState(null);
  const [isPending, startTransition] = useTransition();

  const load = useCallback(async () => {
    try {
      const data = await getById(id);
      setVendor(data);
    } catch (err) {
      console.error("Failed to load vendor details:", err);
    }
  }, [getById, id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave(form) {
    startTransition(async () => {
      try {
        const updated = await update(id, form);
        if (updated) setVendor(updated);
      } catch (err) {
        console.error("Failed to update vendor profile:", err);
      }
    });
  }

  async function handleOnboarding(action) {
    startTransition(async () => {
      try {
        const updated = await onboarding(id, action);
        if (updated) setVendor(updated);
      } catch (err) {
        console.error("Failed to update onboarding status:", err);
      }
    });
  }

  // Loading state
  if (loading && !vendor) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200/60 p-8 shadow-3xs animate-pulse select-none max-w-(--size-xl) mx-auto">
        <Loader2 className="h-6 w-6 text-slate-300 animate-spin" />
        <p className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          Loading vendor details...
        </p>
      </div>
    );
  }

  // Empty state
  if (!vendor) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4 select-none">
        <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
          <ShieldAlert className="h-5 w-5 stroke-[2]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Vendor not found</h3>
          <p className="text-xs text-slate-500 leading-normal">
            We could not find the requested vendor.
          </p>
        </div>
        <Link 
          href="/vendors" 
          className="inline-flex items-center justify-center w-full rounded-xl bg-slate-900 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-slate-800 active:scale-98"
        >
          Back to Vendors
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-(--size-xl) mx-auto p-1">
      
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between border-b border-slate-100 pb-5 select-none">
        <div className="space-y-3">
          <Link 
            href="/vendors" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider transition-colors hover:text-slate-700 group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 stroke-[2.2]" />
            <span>Back to Vendors</span>
          </Link>
          
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-3xs shrink-0 mt-0.5">
              <Building2 className="h-4 w-4 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                  {vendor.name}
                </h1>
                <div className="scale-95 origin-left">
                  <VendorStatusBadge
                    status={vendor.status}
                    onboardingStatus={vendor.onboardingStatus}
                  />
                </div>
              </div>
              <p className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-400 font-semibold bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60">
                <Terminal className="h-3 w-3 text-slate-400" />
                Code: {vendor.vendorCode}
              </p>
            </div>
          </div>
        </div>

        {/* Refresh */}
        <button
          type="button"
          onClick={load}
          disabled={loading || isPending}
          className="inline-flex self-start md:self-center items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-3xs hover:bg-slate-50 disabled:opacity-50 transition-all active:scale-98 cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-slate-400 ${(loading || isPending) ? "animate-spin text-slate-900" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/40 p-3.5 text-xs font-bold text-red-800 shadow-3xs animate-in fade-in slide-in-from-top-1 duration-200">
          <ShieldAlert className="h-4 w-4 text-red-600 shrink-0 mt-0.5 stroke-[2.2]" />
          <div className="space-y-0.5">
            <p className="tracking-tight uppercase text-[10px] tracking-wider text-red-500 font-extrabold">
              Error
            </p>
            <p className="font-semibold text-slate-600 leading-normal">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Onboarding Actions */}
      <div className={(loading || isPending) ? "opacity-60 pointer-events-none transition-opacity" : "transition-opacity"}>
        <OnboardingActions
          vendor={vendor}
          userRole={user?.role}
          loading={loading || isPending}
          onAction={handleOnboarding}
        />
      </div>

      {/* Vendor Form */}
      <div className={`pt-2 transition-opacity duration-150 ${(loading || isPending) ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
        <VendorForm
          vendor={vendor}
          onSubmit={handleSave}
          saving={loading || isPending}
          submitLabel="Save Vendor Changes"
        />
      </div>

    </div>
  );
}