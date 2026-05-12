"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FiShoppingCart, 
  FiUsers, 
  FiCreditCard, 
  FiDollarSign, 
  FiArrowRight, 
  FiActivity,
  FiLoader,
  FiAlertCircle
} from "react-icons/fi";

import AdminSidebar from "@/src/components/AdminSidebar";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { fetchJson } from "@/src/lib/fetchJson";

type AdminStats = {
  totalOrders: number;
  totalUsers: number;
  totalPayments: number;
  totalRevenue: number;
};

type RecentOrder = {
  order_id: number;
  customer_name: string;
  total_amount: number;
  status: string;
  payment_method: string;
  order_time: string;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setError("");
        setLoading(true);
        const [statsData, ordersData] = await Promise.all([
          fetchJson<AdminStats>("/api/admin/stats"),
          fetchJson<RecentOrder[]>("/api/admin/orders"),
        ]);

        setStats(statsData);
        setRecentOrders(Array.isArray(ordersData) ? ordersData.slice(0, 6) : []);
      } catch (error) {
        console.error(error);
        setError("Failed to load dashboard data. Please refresh to try again.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Helper to dynamically colorize status badges for recent orders
  const getBadgeStyle = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized.includes("delivered")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (normalized.includes("out for delivery")) return "bg-blue-50 text-blue-700 border-blue-200";
    if (normalized.includes("preparing")) return "bg-orange-50 text-orange-700 border-orange-200";
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row font-sans text-slate-900 selection:bg-orange-500 selection:text-white">
        <AdminSidebar />

        <main className="flex-1 w-full max-w-[100vw] md:max-w-none p-6 md:p-10 lg:p-12 overflow-x-hidden space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-600 font-bold text-xs uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                Operations Overview
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Admin Dashboard</h1>
              <p className="text-slate-500 text-lg">Operational, user, and revenue intelligence in one place.</p>
            </div>
            <Link
              href="/admin/payments"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-orange-500 transition-colors shadow-lg hover:shadow-orange-500/25 shrink-0"
            >
              View Payments
              <FiArrowRight size={18} />
            </Link>
          </div>

          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3 shadow-sm shadow-red-500/5">
              <FiAlertCircle size={20} className="shrink-0 text-red-500" />
              <p className="font-medium text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-slate-200/40">
              <FiLoader className="animate-spin text-orange-500 mb-4" size={40} />
              <p className="font-semibold text-lg text-slate-700">Aggregating Data</p>
              <p className="text-sm">Loading your dashboard metrics...</p>
            </div>
          ) : (
            <>
              {/* KPI Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard 
                  title="Total Orders" 
                  value={stats?.totalOrders ?? 0} 
                  icon={FiShoppingCart} 
                />
                <StatCard 
                  title="Total Users" 
                  value={stats?.totalUsers ?? 0} 
                  icon={FiUsers} 
                />
                <StatCard 
                  title="Total Payments" 
                  value={stats?.totalPayments ?? 0} 
                  icon={FiCreditCard} 
                />
                <StatCard 
                  title="Total Revenue" 
                  value={`Rs ${(stats?.totalRevenue ?? 0).toLocaleString()}`} 
                  icon={FiDollarSign} 
                  accent 
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Revenue Chart Placeholder */}
                <section className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-slate-200/40 p-6 md:p-8 flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <FiActivity className="text-orange-500" />
                      Revenue Activity
                    </h2>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">Last 7 Days</span>
                  </div>
                  
                  <div className="flex-1 min-h-[240px] rounded-2xl bg-gradient-to-tr from-slate-50 to-white border border-slate-100 flex items-end gap-3 p-6 group">
                    {[35, 52, 41, 68, 56, 74, 62, 80].map((h, idx) => (
                      <div key={idx} className="flex-1 flex flex-col justify-end h-full group/bar">
                        <div 
                          style={{ height: `${h}%` }} 
                          className="w-full rounded-t-lg bg-orange-100 group-hover/bar:bg-orange-500 transition-colors duration-300 relative"
                        >
                          {/* Tooltip on hover */}
                          <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-lg pointer-events-none transition-opacity whitespace-nowrap">
                            Rs {(h * 1200).toLocaleString()}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Recent Orders Table */}
                <section className="lg:col-span-1 bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-slate-200/40 flex flex-col overflow-hidden">
                  <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                      View All
                    </Link>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                    {recentOrders.length === 0 ? (
                      <div className="p-10 text-center text-slate-500">
                        No orders available yet.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-50">
                        {recentOrders.map((order) => (
                          <div key={order.order_id} className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-slate-900">#{order.order_id}</span>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getBadgeStyle(order.status)}`}>
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-slate-600 truncate max-w-[150px]">
                                {order.customer_name}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-slate-900">
                                <span className="text-slate-400 text-xs mr-1">Rs</span>
                                {Number(order.total_amount).toLocaleString()}
                              </p>
                              <p className="text-xs font-medium text-slate-400 mt-0.5">
                                {order.payment_method}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>

              </div>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

// Sub-component for KPI Cards
function StatCard({
  title,
  value,
  icon: Icon,
  accent = false,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-xl shadow-slate-200/20 p-6 flex items-start justify-between group hover:-translate-y-1 transition-transform duration-300">
      <div>
        <p className="text-sm font-bold text-slate-400 tracking-wide uppercase mb-2">{title}</p>
        <p className={`text-3xl font-extrabold ${accent ? "text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400" : "text-slate-900"}`}>
          {value}
        </p>
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${accent ? "bg-orange-50 text-orange-500" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600"} transition-colors`}>
        <Icon size={24} />
      </div>
    </div>
  );
}