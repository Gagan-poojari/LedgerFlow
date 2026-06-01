"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldAlert, UserPlus } from "lucide-react";
import VendorForm from "@/components/vendors/VendorForm";
import { useVendors } from "@/hooks/useVendors";

export default function NewVendorPage() {
  const router = useRouter();
  const { create, loading, error } = useVendors();

  async function handleSubmit(form) {
    try {
      const vendor = await create(form);
      if (vendor?.id) {
        router.push(`/vendors/${vendor.id}`);
      }
    } catch (err) {
      // Error handling is cleanly routed through the hook state
      console.error("Failed to create vendor:", err);
    }
  }

  return (
    <div className="space-y-6 max-w-(--size-xl) mx-auto p-1">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-5 space-y-3 select-none">
        <Link 
          href="/vendors" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider transition-colors hover:text-slate-700 group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 stroke-[2.2]" />
          <span>Back to Vendors</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-3xs shrink-0">
            <UserPlus className="h-4 w-4 stroke-[2]" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Add New Vendor
            </h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              Enter the details of the new vendor below
            </p>
          </div>
        </div>
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

      {/* Vendor Form */}
      <div className="pt-2">
        <VendorForm 
          onSubmit={handleSubmit} 
          saving={loading} 
          submitLabel="Add Vendor" 
        />
      </div>

    </div>
  );
}