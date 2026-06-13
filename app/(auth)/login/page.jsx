"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Lock, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || "Invalid credentials provided.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 px-4 select-none">
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-8 shadow-xs border border-slate-200/80 space-y-6">
        
        {/* APP IDENTITY HEADER */}
        <div className="text-center space-y-1.5 pb-2">
          <div className="inline-flex h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-3xs mx-auto mb-1">
            <ShieldCheck className="h-5 w-5 stroke-[2]" />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            LedgerFlow AP Automation
          </h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Accounts Payable & Invoices
          </p>
        </div>

        {/* COMPLIANCE WARNINGS BLOCK */}
        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/40 p-3.5 text-xs font-bold text-red-800 shadow-3xs">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5 stroke-[2.2]" />
            <div className="space-y-0.5">
              <p className="tracking-tight uppercase text-[10px] tracking-wider text-red-500 font-extrabold">Authentication Failed</p>
              <p className="font-semibold text-slate-600 leading-normal">{error}</p>
            </div>
          </div>
        )}

        {/* AUTHENTICATION CONTROL INPUT FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-slate-500 transition-colors">
                <Mail className="h-4 w-4 stroke-[2]" />
              </div>
              <input
                type="email"
                required
                autoComplete="email"
                disabled={submitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="identity@enterprise.com"
                className="w-full rounded-xl border border-slate-200/80 bg-white pl-10 pr-3.5 py-2 text-sm font-semibold text-slate-800 placeholder-slate-300 shadow-3xs transition-all focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                Password
              </label>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-slate-500 transition-colors">
                <Lock className="h-4 w-4 stroke-[2]" />
              </div>
              <input
                type="password"
                required
                autoComplete="current-password"
                disabled={submitting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-slate-200/80 bg-white pl-10 pr-3.5 py-2 text-sm font-semibold text-slate-800 placeholder-slate-300 shadow-3xs transition-all focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-slate-800 disabled:opacity-50 active:scale-98 cursor-pointer mt-2"
          >
            {submitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <span>Log In</span>
            )}
          </button>
        </form>

        {/* REGISTRATION LINKS */}
        <div className="pt-2 text-center border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-400">
            New user?{" "}
            <Link 
              href="/register" 
              className="font-bold text-slate-900 underline underline-offset-2 decoration-transparent hover:decoration-slate-400 transition-colors ml-0.5"
            >
              Sign Up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}