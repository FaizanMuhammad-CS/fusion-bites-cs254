"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiLoader, FiShield } from "react-icons/fi";

import { getSessionUser } from "@/src/lib/session";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: Array<"customer" | "admin">;
};

export default function ProtectedRoute({
  children,
  allowedRoles = ["customer", "admin"],
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  // Memoize the roles array into a string primitive to safely use as a dependency
  const roleKey = allowedRoles.join(",");

  useEffect(() => {
    const user = getSessionUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(user.role as "customer" | "admin")) {
      router.replace(user.role === "admin" ? "/admin" : "/menu");
      return;
    }

    setAuthorized(true);
  }, [pathname, roleKey, router]);

  // Premium loading state while verifying access
  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center font-sans text-slate-900 selection:bg-orange-500 selection:text-white">
        <div className="flex flex-col items-center">
          
          {/* Branded Security Badge */}
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-600 to-orange-400 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 mb-6">
            <FiShield size={32} className="relative z-10" />
            <div className="absolute inset-0 rounded-2xl bg-white/20 animate-ping" style={{ animationDuration: '1.5s' }}></div>
          </div>
          
          <h2 className="text-2xl font-extrabold tracking-tight mb-2">Authenticating</h2>
          
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <FiLoader className="animate-spin text-orange-500" size={16} />
            <span>Verifying permissions...</span>
          </div>
          
        </div>
      </div>
    );
  }

  return <>{children}</>;
}