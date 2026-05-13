"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiMenu, FiShoppingBag, FiUser, FiX } from "react-icons/fi";

import { clearSessionUser, getSessionUser } from "@/src/lib/session";
import { useCart } from "@/src/context/CartContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Catalog" },
  { href: "/about", label: "Shop" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<ReturnType<typeof getSessionUser>>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useCart();

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
      setUser(getSessionUser());
    });
  }, []);

  // Hide top bar only on /admin/* where AdminSidebar is the primary chrome.
  // Admins still need the navbar on /dashboard, /menu, etc.
  if (mounted && user?.role === "admin" && pathname.startsWith("/admin")) {
    return null;
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 to-orange-400 text-white grid place-items-center font-extrabold text-lg shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-all duration-300">
            FB
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-gray-900 text-lg leading-none tracking-tight">FUSION BITES</h1>
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mt-0.5">Restaurant & ERP</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center bg-gray-50/80 p-1.5 rounded-full border border-gray-100">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-600 hover:text-orange-500 hover:bg-white/50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions & Profile */}
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative p-2.5 rounded-full bg-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border border-gray-100"
          >
            <FiShoppingBag size={20} />
            {mounted && cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-bold rounded-full min-w-[20px] h-[20px] px-1 flex items-center justify-center border-2 border-white shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>

          {mounted && user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/profile"
                className="px-4 py-2.5 rounded-full text-sm font-semibold bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100 transition-colors"
              >
                {user.name.split(" ")[0]}
              </Link>
              <button
                onClick={() => {
                  clearSessionUser();
                  router.replace("/login");
                }}
                className="px-4 py-2.5 rounded-full text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/register"
                className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-700 hover:text-orange-600 border border-gray-200 hover:border-orange-200 bg-white transition-colors"
              >
                Create account
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold bg-gray-900 text-white hover:bg-orange-500 transition-colors shadow-md hover:shadow-orange-500/25"
              >
                <FiUser size={16} />
                Sign In
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden p-2.5 rounded-full bg-gray-50 text-gray-700 hover:bg-orange-50 border border-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl py-4 px-6 flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${
                  isActive ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="h-px bg-gray-100 my-2"></div>
          {mounted && user ? (
            <>
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                My Profile
              </Link>
              <button
                onClick={() => {
                  clearSessionUser();
                  setMenuOpen(false);
                  router.replace("/login");
                }}
                className="w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-gray-50 border border-gray-200 text-center"
              >
                Create account
              </Link>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-2xl text-sm font-semibold bg-gray-900 text-white text-center mt-1 hover:bg-orange-500 transition-colors"
              >
                Sign In to Order
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}