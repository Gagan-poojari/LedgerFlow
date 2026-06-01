"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DollarSign } from "lucide-react";

function formatInr(value) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
  return `₹${value}`;
}

export default function VendorAnalyticsChart({ data }) {
  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4 bg-white border border-dashed border-slate-200 rounded-2xl">
        <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-3 shadow-2xs">
          <DollarSign className="h-5 w-5 stroke-[1.8]" />
        </div>
        <p className="text-xs font-bold text-slate-800">No vendor data yet</p>
        <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Vendor spending data will appear once invoices are processed.</p>
      </div>
    );
  }

  const chartData = data.map((v) => ({
    name: v.vendorCode || v.name?.slice(0, 12) || "Vendor",
    totalAmount: v.totalAmount,
    invoiceCount: v.invoiceCount,
  }));

  return (
    <div className="w-full h-[280px] bg-white p-2 rounded-xl">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 8, right: 16, left: -10, bottom: 4 }}
        >
          <defs>
            <linearGradient id="vendorBarGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#475569" stopOpacity={0.85} />
              <stop offset="100%" stopColor="#1e293b" stopOpacity={0.95} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" horizontal={false} />
          <XAxis 
            type="number" 
            tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} 
            tickFormatter={formatInr}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={85}
            tick={{ fontSize: 11, fill: '#475569', fontWeight: 700 }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: '#f8fafc', opacity: 0.6 }}
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.96)',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
              padding: '10px 12px'
            }}
            labelStyle={{ fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}
            itemStyle={{ fontSize: '12px', fontWeight: 600, padding: 0 }}
            formatter={(value, name) => [
              <span key="val" className="font-bold text-slate-900">{name === "totalAmount" ? formatInr(value) : value}</span>,
              <span key="lbl" className="text-slate-400 font-medium">{name === "totalAmount" ? "Total Spent" : "Invoices"}</span>,
            ]}
          />
          <Bar
            dataKey="totalAmount"
            fill="url(#vendorBarGrad)"
            name="totalAmount"
            radius={[0, 5, 5, 0]}
            barSize={18}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}