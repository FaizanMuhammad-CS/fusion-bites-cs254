"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  FiGrid, 
  FiShoppingBag, 
  FiUsers, 
  FiCreditCard, 
  FiLogOut 
} from "react-icons/fi";

import { clearSessionUser, getSessionUser } from "@/src/lib/session";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: FiGrid },
  { href: "/admin/orders", label: "Orders", icon: FiShoppingBag },
  { href: "/admin/users", label: "Users", icon: FiUsers },
  { href: "/admin/payments", label: "Payments", icon: FiCreditCard },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getSessionUser>>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
      setUser(getSessionUser());
    });
  }, []);

  // Hydration safety and role protection
  if (!mounted || !user || user.role !== "admin") {
    return null;
  }

  // Helper to extract initials for the avatar
  const getInitials = (name: string) => {
    if (!name) return "A";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <aside className="w-full md:w-72 bg-slate-950 border-r border-slate-900 md:h-screen md:sticky md:top-0 p-6 md:p-8 flex flex-col font-sans selection:bg-orange-500 selection:text-white z-20">
      
      {/* Brand / Logo */}
      <div className="flex items-center gap-4 mb-12 px-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-orange-400 text-white flex items-center justify-center font-extrabold text-xl shadow-lg shadow-orange-500/20 shrink-0">
          FB
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight leading-tight">ERP Admin</h2>
          <p className="text-[10px] font-bold tracking-[0.2em] text-orange-400 uppercase mt-0.5">Fusion Bites</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-2 flex-1">
        {adminLinks.map((link) => {
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin" || pathname === "/admin/"
              : pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                isActive
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <Icon 
                size={18} 
                className={isActive ? "text-white" : "text-slate-500 group-hover:text-slate-400 transition-colors"} 
              />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Actions (Pushed to bottom) */}
      <div className="mt-12">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/60 flex flex-col gap-5 shadow-inner shadow-white/5">
          
          {/* User Info */}
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold shrink-0">
              {getInitials(user.name)}
            </div>
            <div className="overflow-hidden pr-2">
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              clearSessionUser();
              router.replace("/login");
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-red-400 text-sm font-semibold hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-300 transition-colors active:scale-95"
          >
            <FiLogOut size={16} />
            <span>Sign Out</span>
          </button>
          
        </div>
      </div>

    </aside>
  );
}