"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { 
  FiUser, 
  FiMail, 
  FiShield, 
  FiShoppingBag, 
  FiCreditCard, 
  FiFileText,
  FiLoader,
  FiArrowRight
} from "react-icons/fi";

import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { fetchJson } from "@/src/lib/fetchJson";
import { getSessionUser } from "@/src/lib/session";

type ProfileData = {
  user_id: number;
  name: string;
  email: string;
  role: string;
  totalOrders: number;
  totalSpent: number;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const user = getSessionUser();
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchJson<ProfileData>(
          `/api/users/profile?user_id=${user.user_id}`
        );
        setProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  // Helper to get initials for the avatar
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // --------------------------------------------------------
  // LOADING STATE
  // --------------------------------------------------------
  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["customer"]}>
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-slate-900">
          <Navbar />
          <div className="flex-1 flex flex-col items-center justify-center">
            <FiLoader className="animate-spin text-orange-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold">Loading Profile</h2>
            <p className="text-gray-500 mt-2">Retrieving your account details...</p>
          </div>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  // --------------------------------------------------------
  // MAIN VIEW
  // --------------------------------------------------------
  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-slate-900 selection:bg-orange-500 selection:text-white">
        <Navbar />
        
        <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
          
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">My Profile</h1>
            <p className="text-gray-500 text-lg">Manage your account details and view your platform statistics.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: User Info */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* User Identity Card */}
              <section className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-slate-200/40 p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left relative overflow-hidden">
                {/* Decorative Background blob */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-orange-600 to-orange-400 text-white flex items-center justify-center text-3xl font-extrabold shadow-lg shadow-orange-500/30 shrink-0 z-10">
                  {getInitials(profile?.name || "")}
                </div>
                
                <div className="z-10 mt-2">
                  <h2 className="text-3xl font-extrabold text-slate-900">{profile?.name || "Unknown User"}</h2>
                  <p className="text-gray-500 mt-1 font-medium">{profile?.email}</p>
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-bold uppercase tracking-wider">
                    <FiShield size={14} />
                    {profile?.role ?? "customer"}
                  </div>
                </div>
              </section>

              {/* Detailed Info List */}
              <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Account Information</h3>
                <div className="space-y-6">
                  <InfoRow icon={FiUser} label="Full Name" value={profile?.name || "Loading..."} />
                  <InfoRow icon={FiMail} label="Email Address" value={profile?.email || "Loading..."} />
                </div>
              </section>
            </div>

            {/* Right Column: Stats & Actions */}
            <div className="space-y-8">
              
              {/* Stats Card */}
              <section className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-slate-200/40 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Lifetime Stats</h3>
                
                <div className="space-y-6">
                  {/* Total Orders */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3 text-gray-500 mb-2">
                      <FiShoppingBag size={18} />
                      <span className="font-semibold text-sm uppercase tracking-wider">Total Orders</span>
                    </div>
                    <p className="text-4xl font-extrabold text-slate-900">
                      {profile?.totalOrders ?? 0}
                    </p>
                  </div>

                  {/* Total Spent */}
                  <div className="p-5 rounded-2xl bg-orange-50 border border-orange-100">
                    <div className="flex items-center gap-3 text-orange-600/80 mb-2">
                      <FiCreditCard size={18} />
                      <span className="font-semibold text-sm uppercase tracking-wider">Total Spent</span>
                    </div>
                    <p className="text-4xl font-extrabold text-orange-600">
                      <span className="text-lg text-orange-500 mr-1">Rs</span>
                      {Number(profile?.totalSpent ?? 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </section>

              {/* Quick Action Card */}
              <section className="bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-900/20 p-8 relative overflow-hidden group text-white">
                <div className="absolute -right-8 -top-8 text-white/5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                  <FiFileText size={160} />
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">Need billing details?</h3>
                  <p className="text-slate-400 text-sm mb-6 max-w-[200px]">
                    Access and print invoices for all your past orders.
                  </p>
                  <Link
                    href="/invoices"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-95"
                  >
                    <span>View Invoices</span>
                    <FiArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </section>

            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
}

// --------------------------------------------------------
// SUB-COMPONENTS
// --------------------------------------------------------

function InfoRow({ icon: Icon, label, value }: { icon: IconType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
      <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="font-semibold text-slate-900 text-lg">{value}</p>
      </div>
    </div>
  );
}