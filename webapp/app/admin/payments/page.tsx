"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiLoader,
  FiAlertCircle,
  FiCreditCard,
} from "react-icons/fi";

import AdminSidebar from "@/src/components/AdminSidebar";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { fetchJson } from "@/src/lib/fetchJson";

type PaymentRow = {
  payment_id: number;
  order_id: number | null;
  amount: number;
  method: string;
  status: string;
  customer_name: string;
  payment_time: string;
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      void (async () => {
        try {
          const data = await fetchJson<PaymentRow[]>("/api/admin/payments");
          if (!cancelled) {
            setPayments(Array.isArray(data) ? data : []);
            setError("");
          }
        } catch (e) {
          console.error(e);
          if (!cancelled) {
            setError("Failed to load payments.");
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      })();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row font-sans text-slate-900 selection:bg-orange-500 selection:text-white">
        <AdminSidebar />

        <main className="flex-1 w-full max-w-[100vw] md:max-w-none p-6 md:p-10 lg:p-12 overflow-x-hidden space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 mb-3"
              >
                <FiArrowLeft size={16} />
                Back to dashboard
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <FiCreditCard size={22} />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                    Payments
                  </h1>
                  <p className="text-slate-500 text-sm md:text-base">
                    Payment records linked to orders (up to 500 recent).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3">
              <FiAlertCircle className="shrink-0" />
              <p className="font-medium text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2rem] border border-gray-100">
              <FiLoader className="animate-spin text-orange-500 mb-4" size={36} />
              <p className="text-slate-600 font-medium">Loading payments…</p>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-slate-200/30 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[720px]">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">
                        Payment
                      </th>
                      <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">
                        Order
                      </th>
                      <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">
                        Customer
                      </th>
                      <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">
                        Method
                      </th>
                      <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">
                        Status
                      </th>
                      <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">
                        Time
                      </th>
                      <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider text-right">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {payments.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="p-12 text-center text-slate-500 font-medium"
                        >
                          No payments found.
                        </td>
                      </tr>
                    ) : (
                      payments.map((p) => (
                        <tr
                          key={p.payment_id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="p-4 font-mono font-bold text-slate-900">
                            #{p.payment_id}
                          </td>
                          <td className="p-4 text-slate-700">
                            {p.order_id != null ? `#${p.order_id}` : "—"}
                          </td>
                          <td className="p-4 text-slate-700 max-w-[180px] truncate">
                            {p.customer_name || "—"}
                          </td>
                          <td className="p-4 text-slate-600 capitalize">
                            {p.method || "—"}
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                p.status === "Completed"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : p.status === "Failed"
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : "bg-amber-50 text-amber-800 border-amber-200"
                              }`}
                            >
                              {p.status || "—"}
                            </span>
                          </td>
                          <td className="p-4 text-slate-500 whitespace-nowrap">
                            {new Date(p.payment_time).toLocaleString()}
                          </td>
                          <td className="p-4 text-right font-extrabold text-slate-900 whitespace-nowrap">
                            Rs {Number(p.amount).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
