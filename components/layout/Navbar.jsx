"use client";

import { Menu } from "lucide-react";

export default function Navbar({ onMenuOpen }) {
  return (
    <div className="w-full flex items-center justify-between px-4 md:px-8 select-none">

      {/* LEFT — hamburger (mobile only) + status indicator */}
      <div className="flex items-center gap-3">

        {/* Hamburger — visible only below lg */}
        <button
          type="button"
          id="sidebar-toggle"
          onClick={onMenuOpen}
          className="lg:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors duration-150"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 stroke-[2.2]" />
        </button>

        {/* Status indicator */}
        <div className="flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
          <p className="hidden sm:block text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">
            System Online
          </p>
        </div>
      </div>

    </div>
  );
}