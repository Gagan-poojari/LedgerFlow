"use client";

import Link from "next/link";
import { ArrowUpRight, ShieldAlert, AlertTriangle, BadgeAlert, Layers3 } from "lucide-react";

export default function ExceptionsReport({ report }) {
  if (!report) return null;

  const { validation, matching, rejections, summary } = report;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="p-4 rounded-2xl border border-red-200/60 bg-red-50/20 text-sm font-semibold text-slate-600 flex items-center gap-2.5 shadow-3xs">
        <ShieldAlert className="h-4 w-4 text-red-500 stroke-[2.2]" />
        <span>
          System Alert Log: <strong className="font-bold text-slate-900">{summary.total} Total Issues</strong>
          <span className="text-slate-300 mx-2 select-none">·</span>
          <span className="font-medium text-slate-500">{summary.validationCount} validation errors</span>
          <span className="text-slate-300 mx-2 select-none">·</span>
          <span className="font-medium text-slate-500">{summary.matchingCount} matching issues</span>
          <span className="text-slate-300 mx-2 select-none">·</span>
          <span className="font-medium text-slate-500">{summary.rejectionCount} rejected invoices</span>
        </span>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        <Section title="Validation Errors" count={validation.length} icon={BadgeAlert}>
          <div className="grid gap-3 sm:grid-cols-2">
            {validation.map((item) => (
              <ExceptionCard key={item.invoiceId} invoiceId={item.invoiceId} invoiceNumber={item.invoiceNumber}>
                {item.errors?.length > 0 && (
                  <ul className="mt-2 text-xs font-semibold text-red-700 space-y-1.5 list-none pl-0">
                    {item.errors.map((e, i) => (
                      <li key={i} className="flex gap-1.5 items-start before:content-['•'] before:text-red-400 before:font-bold">
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </ExceptionCard>
            ))}
          </div>
        </Section>

        <Section title="3-Way Matching Issues" count={matching.length} icon={Layers3}>
          <div className="grid gap-3 sm:grid-cols-2">
            {matching.map((item) => (
              <ExceptionCard 
                key={item.invoiceId} 
                invoiceId={item.invoiceId} 
                invoiceNumber={item.invoiceNumber}
                badge={
                  <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                    {item.matchStatus} {item.matchType && `(${item.matchType})`}
                  </span>
                }
              >
                {item.exceptions?.length > 0 && (
                  <ul className="mt-2 text-xs font-semibold text-amber-800 space-y-1.5 list-none pl-0">
                    {item.exceptions.map((e, i) => (
                      <li key={i} className="flex gap-1.5 items-start before:content-['•'] before:text-amber-400 before:font-bold">
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </ExceptionCard>
            ))}
          </div>
        </Section>

        <Section title="Rejected Invoices" count={rejections.length} icon={AlertTriangle}>
          <div className="grid gap-3 sm:grid-cols-2">
            {rejections.map((item) => (
              <ExceptionCard key={item.invoiceId} invoiceId={item.invoiceId} invoiceNumber={item.invoiceNumber}>
                {item.remarks && (
                  <blockquote className="mt-2 text-xs font-medium text-slate-500 pl-2 border-l-2 border-slate-200 italic bg-slate-50/50 py-1 rounded-r-md">
                    &ldquo;{item.remarks}&rdquo;
                  </blockquote>
                )}
              </ExceptionCard>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, count, icon: Icon, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
        <Icon className="h-4 w-4 text-slate-400 stroke-[2.2]" />
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">
          {title} <span className="text-slate-400 font-normal ml-0.5">({count})</span>
        </h3>
      </div>
      {!count ? (
        <div className="py-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/30">
          <p className="text-xs font-semibold text-slate-400">No issues found in this category.</p>
        </div>
      ) : (
        children
      )}
    </div>
  );
}

function ExceptionCard({ invoiceId, invoiceNumber, badge, children }) {
  return (
    <div className="group rounded-xl border border-slate-200/80 bg-white p-4 shadow-3xs transition-all hover:border-slate-300 hover:shadow-2xs">
      <div className="flex items-center justify-between gap-3">
        <Link 
          href={`/invoices/${invoiceId}`} 
          className="inline-flex items-center gap-1 text-sm font-bold text-slate-900 hover:text-slate-700 underline underline-offset-2 decoration-transparent hover:decoration-slate-400 transition-colors"
        >
          <span>{invoiceNumber || "No Invoice Number"}</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
        {badge}
      </div>
      {children}
    </div>
  );
}