"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  UploadCloud,
  Users,
  CheckSquare,
  CreditCard,
  BarChart3,
  X,
  LogOut,
  User,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/invoices/upload", label: "Upload", icon: UploadCloud },
  { href: "/vendors", label: "Vendors", icon: Users },
  { href: "/approvals", label: "Approvals", icon: CheckSquare },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

function NavLinks({ onNavigate }) {
  const pathname = usePathname();

  return (
    <>
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const active =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold transition-all duration-200 ${
              active
                ? "text-slate-900"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            {/* Active highlight pill */}
            {active && (
              <motion.div
                layoutId="activeNav"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200/60 shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                style={{ zIndex: 0 }}
              />
            )}

            <span className="relative z-10 flex shrink-0 items-center justify-center">
              <IconComponent
                className={`h-[16px] w-[16px] stroke-[2] transition-all duration-200 ${
                  active
                    ? "text-slate-800"
                    : "text-slate-300 group-hover:text-slate-500"
                }`}
              />
            </span>

            <span className="relative z-10 tracking-tight flex-1">{item.label}</span>

            {active && (
              <ChevronRight className="relative z-10 h-3 w-3 text-slate-300" />
            )}
          </Link>
        );
      })}
    </>
  );
}

function SidebarInner({ onNavigate, showClose, onClose }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden select-none">
      <div className="shrink-0 space-y-6">
        {/* BRAND + CLOSE */}
        <div className="px-5 pt-5 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-sm shadow-slate-900/25 font-black text-sm tracking-wider shrink-0">
                AP
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-900 tracking-tight leading-tight">
                  Templegate
                </p>
                <p className="text-[10px] font-semibold text-slate-400 leading-tight mt-0.5">
                  AP Automation
                </p>
              </div>
            </div>

            {/* Close button — only rendered in mobile drawer */}
            {showClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-4 w-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="px-5">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
      </div>

      {/* NAVIGATION LINKS — scrolls when content overflows */}
      <nav className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-0.5 px-3 py-2 relative">
        <NavLinks onNavigate={onNavigate} />
      </nav>

      {/* USER INFO + LOGOUT */}
      <div className="shrink-0 p-5 space-y-3 flex gap-2">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        <AnimatePresence mode="wait">
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-3 p-2 rounded-xl bg-slate-50/50 border border-slate-100/50"
            >
              {/* Avatar */}
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-slate-200 to-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-500 shadow-sm shrink-0">
                <User className="h-4 w-4 stroke-[2]" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-slate-800 tracking-tight leading-tight truncate">
                  {user.name || "User"}
                </p>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5 leading-tight capitalize truncate">
                  {user.role?.replace("_", " ") || "member"}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          id="logout-btn"
          onClick={() => logout?.()}
          className="w-full flex items-center justify-center gap-2 px-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-600 hover:bg-red-50/80 border border-transparent hover:border-red-200/60 transition-all duration-200 cursor-pointer group"
        >
          <LogOut className="h-3.5 w-3.5 stroke-[2] text-red-400 group-hover:text-red-500 transition-colors" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  // Close mobile drawer on route change
  useEffect(() => {
    onClose?.();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* DESKTOP SIDEBAR — always visible on lg+ */}
      <aside className="hidden lg:flex w-[260px] h-screen shrink-0 flex-col overflow-hidden border-r border-slate-200/60 bg-white/95 backdrop-blur-sm">
        <SidebarInner showClose={false} />
      </aside>

      {/* MOBILE / TABLET DRAWER — slide in from left on smaller screens */}
      <AnimatePresence>
        {isOpen && (
          <div className="lg:hidden fixed inset-0 z-50">

            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />

            {/* Drawer panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-white border-r border-slate-200/60 shadow-2xl flex flex-col"
            >
              <SidebarInner
                showClose
                onClose={onClose}
                onNavigate={onClose}
              />
            </motion.div>

          </div>
        )}
      </AnimatePresence>
    </>
  );
}