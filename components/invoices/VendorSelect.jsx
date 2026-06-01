"use client";

import { useEffect, useState } from "react";
import { Network } from "lucide-react";

export default function VendorSelect({ value, onChange, disabled }) {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/vendors?activeOnly=true&limit=100")
      .then((r) => r.json())
      .then((data) => setVendors(data.vendors || []))
      .catch(() => setVendors([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Network className="h-3.5 w-3.5 text-slate-400 stroke-[2.2]" />
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
          Associated Vendor
        </label>
      </div>
      <div className="relative">
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value || null)}
          disabled={disabled || loading}
          className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-sm font-bold text-slate-700 shadow-3xs transition-all focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer"
        >
          <option value="">{loading ? "Loading vendors..." : "— Select Vendor —"}</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>
              [{v.vendorCode}] — {v.name}
            </option>
          ))}
        </select>
        <span className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none border-l border-t border-slate-400 rotate-135 transform origin-center translate-x-[-2px] mt-[-3px] scale-50" />
      </div>
    </div>
  );
}