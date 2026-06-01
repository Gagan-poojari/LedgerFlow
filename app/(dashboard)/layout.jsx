"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/50 text-slate-800 antialiased">

      {/* Sidebar — handles its own desktop/mobile rendering */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">

        {/* Mobile-only top bar */}
        <header className="lg:hidden sticky top-0 z-40 flex h-14 items-center px-4 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
          <button
            type="button"
            id="sidebar-toggle"
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-1 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all duration-150"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 stroke-[2.2]" />
          </button>
          <div className="ml-3 flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-black tracking-wider">
              TG
            </div>
            <span className="text-sm font-bold text-slate-900 tracking-tight">Templegate</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 outline-none">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
