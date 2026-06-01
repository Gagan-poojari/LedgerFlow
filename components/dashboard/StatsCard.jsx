"use client";

import { motion } from "framer-motion";

export default function StatsCard({ label, value, subtext, accent, icon: Icon }) {
  const accents = {
    default: "border-slate-200/80 bg-white hover:border-slate-300/80 hover:shadow-md",
    amber: "border-amber-200/60 bg-gradient-to-br from-amber-50/60 to-white hover:border-amber-300/60 hover:shadow-md hover:shadow-amber-100/50",
    emerald: "border-emerald-200/60 bg-gradient-to-br from-emerald-50/60 to-white hover:border-emerald-300/60 hover:shadow-md hover:shadow-emerald-100/50",
    red: "border-red-200/60 bg-gradient-to-br from-red-50/60 to-white hover:border-red-300/60 hover:shadow-md hover:shadow-red-100/50",
    blue: "border-blue-200/60 bg-gradient-to-br from-blue-50/60 to-white hover:border-blue-300/60 hover:shadow-md hover:shadow-blue-100/50",
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`rounded-2xl border p-5 transition-all duration-300 shadow-sm cursor-default ${accents[accent] || accents.default}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </p>
        {Icon && (
          <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
            <Icon className="h-4 w-4 text-slate-400 stroke-[1.8]" />
          </div>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
        {value}
      </p>
      {subtext && (
        <p className="mt-1.5 text-xs font-medium text-slate-400">
          {subtext}
        </p>
      )}
    </motion.div>
  );
}