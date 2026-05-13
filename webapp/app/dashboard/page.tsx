"use client";

import { useEffect, useState } from "react";
import { 
  FiPackage, 
  FiDollarSign, 
  FiTrendingUp, 
  FiPieChart, 
  FiCreditCard, 
  FiSmartphone, 
  FiLoader,
  FiAlertCircle
} from "react-icons/fi";

import Navbar from "@/src/components/Navbar";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { fetchJson } from "@/src/lib/fetchJson";

type TopItem = {
  name: string;
  totalSold: number;
};

type PaymentStat = {
  method: string;
  total: number;
};

type DashboardData = {
  totalOrders: number;
  totalRevenue: number;
  topItems: TopItem[];
  paymentStats: PaymentStat[];
};

// Helper function to assign icons to payment methods dynamically
const getPaymentIcon = (method: string) => {
  const m = method.toLowerCase();
  if (m.includes("card")) return FiCreditCard;
  if (m.includes("online") || m.includes("wallet")) return FiSmartphone;
  return FiDollarSign;
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const result = await fetchJson<DashboardData>("/api/dashboard/stats");
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  // --------------------------------------------------------
  // LOADING STATE
  // --------------------------------------------------------
  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
          <Navbar />
          <div className="flex-1 flex flex-col items-center justify-center">
            <FiLoader className="animate-spin text-orange-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-slate-900">Loading Analytics</h2>
            <p className="text-gray-500 mt-2">Fetching the latest platform data...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // --------------------------------------------------------
  // ERROR STATE
  // --------------------------------------------------------
  if (!data) {
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
          <Navbar />
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
              <FiAlertCircle size={32} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Failed to load dashboard</h2>
            <p className="text-gray-500 max-w-md">
              We couldn&apos;t connect to the analytics server. Please refresh the page or try again later.
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // --------------------------------------------------------
  // MAIN DASHBOARD
  // --------------------------------------------------------
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-orange-500 selection:text-white flex flex-col">
        <Navbar />

        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
          
          {/* Header */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-sm">
                  <FiTrendingUp size={20} />
                </div>
                <p className="text-orange-600 font-bold tracking-wider text-sm uppercase">
                  Admin Portal
                </p>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                Business Analytics
              </h1>
            </div>
            <p className="text-gray-500 font-medium">
              Real-time platform insights
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Total Orders Card */}
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center shrink-0">
                <FiPackage size={36} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-500 mb-1">Total Orders</h2>
                <div className="text-5xl font-extrabold text-slate-900 tracking-tight">
                  {data.totalOrders.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Total Revenue Card */}
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-500/20 flex items-center justify-center shrink-0">
                <FiDollarSign size={36} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-500 mb-1">Total Revenue</h2>
                <div className="text-5xl font-extrabold text-slate-900 tracking-tight">
                  <span className="text-2xl text-orange-500 mr-1">Rs</span>
                  {data.totalRevenue.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Top Selling Items */}
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col h-full">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-50">
                <FiTrendingUp className="text-orange-500" size={24} />
                <h2 className="text-2xl font-bold text-slate-900">Top Selling Items</h2>
              </div>

              <div className="space-y-4 flex-1">
                {data.topItems.length > 0 ? (
                  data.topItems.map((item, index) => (
                    <div
                      key={item.name}
                      className="flex justify-between items-center p-4 rounded-2xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-sm font-bold group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                          {index + 1}
                        </div>
                        <span className="text-lg font-bold text-slate-800">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Sold</span>
                        <span className="text-xl font-extrabold text-orange-500 bg-orange-50 px-3 py-1 rounded-xl">
                          {item.totalSold}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-10 font-medium">
                    No sales data available yet.
                  </div>
                )}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col h-full">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-50">
                <FiPieChart className="text-orange-500" size={24} />
                <h2 className="text-2xl font-bold text-slate-900">Payment Breakdown</h2>
              </div>

              <div className="space-y-4 flex-1">
                {data.paymentStats.length > 0 ? (
                  data.paymentStats.map((payment) => {
                    const Icon = getPaymentIcon(payment.method);
                    return (
                      <div
                        key={payment.method}
                        className="flex justify-between items-center p-4 rounded-2xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                            <Icon size={24} />
                          </div>
                          <span className="text-lg font-bold text-slate-800 capitalize">
                            {payment.method}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Orders</span>
                          <span className="text-xl font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-xl group-hover:bg-slate-200 transition-colors">
                            {payment.total}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-gray-400 py-10 font-medium">
                    No payment data available yet.
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}