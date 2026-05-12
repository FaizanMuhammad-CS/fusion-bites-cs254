"use client";

import { useEffect, useState } from "react";
import { 
  FiHash, 
  FiShoppingCart, 
  FiDollarSign, 
  FiCreditCard, 
  FiCheckCircle, 
  FiFileText, 
  FiActivity,
  FiLoader,
  FiAlertCircle,
  FiInbox
} from "react-icons/fi";

import AdminSidebar from "@/src/components/AdminSidebar";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { fetchJson } from "@/src/lib/fetchJson";

type PaymentRow = {
  payment_id: number;
  order_id: number;
  amount: number;
  method: string;
  status: string;
  transaction_reference: string;
  transaction_id: number | null;
  transaction_type: string | null;
  transaction_status: string | null;
  recorded_at: string | null;
};

export default function AdminPaymentsPage() {
  const [rows, setRows] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPayments() {
      try {
        setError("");
        setLoading(true);
        const data = await fetchJson<PaymentRow[]>("/api/admin/payments");
        setRows(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setRows([]);
        setError("Failed to load payments data. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, []);

  // Helper to dynamically colorize status badges
  const getBadgeStyle = (status: string | null) => {
    if (!status) return "bg-slate-100 text-slate-600 border-slate-200";
    
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus.includes("paid") || normalizedStatus.includes("success") || normalizedStatus.includes("completed")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-500/10";
    }
    if (normalizedStatus.includes("pending") || normalizedStatus.includes("processing")) {
      return "bg-amber-50 text-amber-700 border-amber-200 shadow-amber-500/10";
    }
    if (normalizedStatus.includes("failed") || normalizedStatus.includes("declined")) {
      return "bg-red-50 text-red-700 border-red-200 shadow-red-500/10";
    }
    
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row font-sans text-slate-900 selection:bg-orange-500 selection:text-white">
        
        <AdminSidebar />
        
        <main className="flex-1 w-full max-w-[100vw] md:max-w-none p-6 md:p-10 lg:p-12 overflow-x-hidden">
          
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Payments & Transactions</h1>
            <p className="text-slate-500 text-lg">Track payment methods, monitor statuses, and audit transaction records.</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3 shadow-sm shadow-red-500/5">
              <FiAlertCircle size={20} className="shrink-0 text-red-500" />
              <p className="font-medium text-sm">{error}</p>
            </div>
          )}

          {/* Table Card Container */}
          <section className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-slate-200/40 overflow-hidden relative">
            
            {loading ? (
              // Loading State
              <div className="flex flex-col items-center justify-center p-20 text-slate-500">
                <FiLoader className="animate-spin text-orange-500 mb-4" size={40} />
                <p className="font-semibold text-lg text-slate-700">Loading Transactions</p>
                <p className="text-sm">Securely fetching payment records...</p>
              </div>
            ) : rows.length === 0 && !error ? (
              // Empty State
              <div className="flex flex-col items-center justify-center p-20 text-slate-500 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                  <FiInbox size={32} className="text-slate-400" />
                </div>
                <p className="font-bold text-xl text-slate-900 mb-2">No payment records</p>
                <p className="text-slate-500 max-w-sm">No transactions have been processed yet. Processed payments will appear here.</p>
              </div>
            ) : rows.length > 0 ? (
              // Data Table
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[980px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="py-5 px-6 font-bold text-xs uppercase tracking-wider text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-2"><FiHash size={14} /> Pay ID</div>
                      </th>
                      <th className="py-5 px-6 font-bold text-xs uppercase tracking-wider text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-2"><FiShoppingCart size={14} /> Order</div>
                      </th>
                      <th className="py-5 px-6 font-bold text-xs uppercase tracking-wider text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-2"><FiDollarSign size={14} /> Amount</div>
                      </th>
                      <th className="py-5 px-6 font-bold text-xs uppercase tracking-wider text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-2"><FiCreditCard size={14} /> Method</div>
                      </th>
                      <th className="py-5 px-6 font-bold text-xs uppercase tracking-wider text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-2"><FiCheckCircle size={14} /> Status</div>
                      </th>
                      <th className="py-5 px-6 font-bold text-xs uppercase tracking-wider text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-2"><FiFileText size={14} /> Trans Ref</div>
                      </th>
                      <th className="py-5 px-6 font-bold text-xs uppercase tracking-wider text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-2"><FiActivity size={14} /> Trans Status</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {rows.map((row) => (
                      <tr key={row.payment_id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="py-4 px-6">
                          <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg text-sm">
                            #{row.payment_id}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-slate-500 hover:text-orange-500 cursor-pointer transition-colors">
                            #{row.order_id}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-900 whitespace-nowrap">
                          <span className="text-slate-400 text-sm mr-1">Rs</span>
                          {Number(row.amount).toLocaleString()}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">
                            {row.method}
                          </span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className={`inline-flex items-center justify-center px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border shadow-sm ${getBadgeStyle(row.status)}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className="text-sm font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                            {row.transaction_reference || "N/A"}
                          </span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className={`inline-flex items-center justify-center px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border shadow-sm ${getBadgeStyle(row.transaction_status)}`}>
                            {row.transaction_status || "N/A"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </section>

        </main>
      </div>
    </ProtectedRoute>
  );
}