"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiMail, FiLock, FiAlertCircle, FiArrowRight, FiLoader } from "react-icons/fi";
import { fetchJson } from "@/src/lib/fetchJson";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) {
      return;
    }

    try {
      const user = JSON.parse(rawUser) as {
        role: "admin" | "customer";
      };
      router.replace(user.role === "admin" ? "/admin" : "/menu");
    } catch {
      localStorage.removeItem("user");
    }
  }, [router]);

  async function handleLogin(e?: React.FormEvent) {
    if (e) e.preventDefault();
    
    try {
      setLoading(true);
      setError("");

      const data = await fetchJson<{ user: { role: "admin" | "customer" } }>(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/menu");
      }
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
      {/* Left Panel - Image Cover */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=80"
          alt="Fusion Bites food spread"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
        
        <div className="relative z-10 flex flex-col justify-end p-16 h-full w-full">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-orange-400 text-white flex items-center justify-center font-extrabold text-xl shadow-lg shadow-orange-500/30 mb-8">
            FB
          </div>
          <p className="text-orange-400 font-bold tracking-wider text-sm uppercase mb-3">
            Fusion Bites Platform
          </p>
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
            Order Smarter. <br />
            Eat Better.
          </h1>
          <p className="text-slate-300 text-lg max-w-md leading-relaxed border-l-2 border-orange-500 pl-4">
            A premium restaurant experience powered by seamless digital ordering and professional ERP operations.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-20 relative">
        {/* Subtle decorative background blob */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-gray-100 relative z-10">
          
          {/* Mobile Logo (hidden on desktop) */}
          <div className="lg:hidden w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-orange-400 text-white flex items-center justify-center font-extrabold text-xl shadow-lg shadow-orange-500/30 mb-8">
            FB
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-gray-500">Sign in to access your orders and account.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiMail className="text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
              </div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-900"
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiLock className="text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-900"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm animate-in fade-in slide-in-from-top-2">
                <FiAlertCircle className="shrink-0 mt-0.5" size={16} />
                <p className="font-medium leading-tight">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" size={20} />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 pt-8 border-t border-gray-100 text-center space-y-3">
            <p className="text-sm text-gray-500">
              New here?{" "}
              <Link
                href="/register"
                className="text-orange-500 font-bold hover:text-orange-600 transition-colors underline decoration-orange-500/30 underline-offset-4"
              >
                Create an account
              </Link>
            </p>
            <p className="text-sm text-gray-500">
              Just want to look around?{" "}
              <Link href="/menu" className="text-orange-500 font-bold hover:text-orange-600 transition-colors underline decoration-orange-500/30 underline-offset-4">
                Explore Menu
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}