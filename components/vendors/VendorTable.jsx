"use client";

import Link from "next/link";
import { ArrowRight, Trash2, Users2, UserPlus } from "lucide-react";
import VendorStatusBadge from "./VendorStatusBadge";

export default function VendorTable({ vendors, onDelete }) {
  if (!vendors?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center px-4 bg-white border border-dashed border-slate-200 rounded-2xl">
        <div className="h-11 w-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-3 shadow-3xs">
          <Users2 className="h-5 w-5 stroke-[1.8]" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">No vendors found</h3>
        <p className="text-xs text-slate-400 mt-0.5 max-w-xs mx-auto font-medium">
          You have not added any vendors yet.
        </p>
        <Link 
          href="/vendors/new" 
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-slate-800 active:scale-98"
        >
          <UserPlus className="h-3.5 w-3.5" />
          <span>Add Vendor</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
      <table className="min-w-full border-collapse text-sm text-left">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold uppercase tracking-wider text-slate-400 select-none">
            <th className="px-5 py-3.5 font-bold">Vendor Code</th>
            <th className="px-5 py-3.5 font-bold">Vendor Name</th>
            <th className="px-5 py-3.5 font-bold">GSTIN</th>
            <th className="px-5 py-3.5 font-bold">Status</th>
            <th className="relative px-5 py-3.5" aria-label="Management controls mapping" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80">
          {vendors.map((v) => (
            <tr key={v.id} className="group hover:bg-slate-50/60 transition-colors">
              <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-900 uppercase">
                {v.vendorCode}
              </td>
              <td className="max-w-[220px] truncate whitespace-nowrap px-5 py-3.5 font-semibold text-slate-700">
                {v.name}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                {v.gstin || <span className="font-sans font-normal text-slate-300 normal-case tracking-normal">Unassigned</span>}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5">
                <VendorStatusBadge
                  status={v.status}
                  onboardingStatus={v.onboardingStatus}
                />
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-right font-medium">
                <div className="inline-flex items-center gap-2">
                  <Link
                    href={`/vendors/${v.id}`}
                    className="inline-flex items-center gap-1 rounded-xl border border-transparent bg-transparent px-2.5 py-1.5 text-xs font-bold text-slate-700 transition-all group-hover:border-slate-200 group-hover:bg-white group-hover:shadow-3xs hover:text-slate-900"
                  >
                    <span>Edit</span>
                    <ArrowRight className="h-3 w-3 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(v.id)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-transparent text-slate-400 hover:border-red-100 hover:bg-red-50 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                      title="Delete vendor"
                    >
                      <Trash2 className="h-3.5 w-3.5 stroke-[1.8]" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}