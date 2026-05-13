"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiLoader,
  FiAlertCircle,
  FiShoppingBag,
} from "react-icons/fi";

import AdminSidebar from "@/src/components/AdminSidebar";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { fetchJson } from "@/src/lib/fetchJson";

const ORDER_STATUSES = [
  "Placed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
] as const;

type OrderRow = {
  order_id: number;
  customer_name: string;
  total_amount: number;
  status: string;
  payment_method: string;
  order_time: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      void (async () => {
        try {
          const data = await fetchJson<OrderRow[]>(
            "/api/admin/orders?limit=500"
          );
          if (!cancelled) {
            setOrders(Array.isArray(data) ? data : []);
            setError("");
          }
        } catch (e) {
          console.error(e);
          if (!cancelled) {
            setError("Failed to load orders.");
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

  async function updateStatus(orderId: number, status: string) {
    setUpdatingId(orderId);
    try {
      await fetchJson<{ order_id: number; status: string }>(
        `/api/admin/orders/${orderId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === orderId ? { ...o, status } : o
        )
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  }

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
                  <FiShoppingBag size={22} />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                    All orders
                  </h1>
                  <p className="text-slate-500 text-sm md:text-base">
                    Update fulfillment status from the dropdown (up to 500 orders).
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
              <p className="text-slate-600 font-medium">Loading orders…</p>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-slate-200/30 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[860px]">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">
                        Order
                      </th>
                      <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">
                        Customer
                      </th>
                      <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">
                        Placed
                      </th>
                      <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider min-w-[200px]">
                        Status
                      </th>
                      <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">
                        Payment
                      </th>
                      <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider text-right">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {orders.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-12 text-center text-slate-500 font-medium"
                        >
                          No orders found.
                        </td>
                      </tr>
                    ) : (
                      orders.map((o) => (
                        <tr
                          key={o.order_id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="p-4 font-bold text-slate-900">
                            #{o.order_id}
                          </td>
                          <td className="p-4 text-slate-700 max-w-[200px] truncate">
                            {o.customer_name}
                          </td>
                          <td className="p-4 text-slate-500 whitespace-nowrap">
                            {new Date(o.order_time).toLocaleString()}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <select
                                value={o.status}
                                disabled={updatingId === o.order_id}
                                onChange={(e) =>
                                  updateStatus(o.order_id, e.target.value)
                                }
                                className="w-full max-w-[220px] rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500 disabled:opacity-50"
                              >
                                {ORDER_STATUSES.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                              {updatingId === o.order_id && (
                                <FiLoader
                                  className="animate-spin text-orange-500 shrink-0"
                                  size={18}
                                />
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-slate-600 capitalize">
                            {o.payment_method || "—"}
                          </td>
                          <td className="p-4 text-right font-extrabold text-slate-900 whitespace-nowrap">
                            Rs {Number(o.total_amount).toLocaleString()}
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
