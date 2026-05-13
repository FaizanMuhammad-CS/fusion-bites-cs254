"use client";

import { useEffect, useState } from "react";
import { 
  FiShoppingBag, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiLoader, 
  FiInbox,
  FiCreditCard
} from "react-icons/fi";

import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { fetchJson } from "@/src/lib/fetchJson";
import { getSessionUser } from "@/src/lib/session";

type OrderHistoryItem = {
  order_id: number;
  order_time: string;
  status: string;
  total_amount: number;
  payment_method: string | null;
  payment_status: string | null;
};

// Helper function to render colorful status badges
const renderStatusBadge = (status: string) => {
  const s = (status || "").toLowerCase();
  
  if (s.includes("complet") || s.includes("deliver")) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold uppercase tracking-wider border border-green-100">
        <FiCheckCircle size={14} /> {status}
      </span>
    );
  }
  
  if (s.includes("cancel") || s.includes("fail")) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider border border-red-100">
        <FiXCircle size={14} /> {status}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-wider border border-orange-100">
      <FiClock size={14} /> {status}
    </span>
  );
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const user = getSessionUser();
      if (!user) return;

      try {
        const data = await fetchJson<OrderHistoryItem[]>(
          `/api/orders/history?user_id=${user.user_id}`
        );
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

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
            <h2 className="text-2xl font-bold">Loading Orders</h2>
            <p className="text-gray-500 mt-2">Retrieving your order history...</p>
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
        
        <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
          
          {/* Header */}
          <div className="mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-orange-400 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 mb-6">
              <FiShoppingBag size={24} />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Order History</h1>
            <p className="text-gray-500 text-lg">Track your recent purchases and their fulfillment status.</p>
          </div>

          {/* Orders Table Container */}
          <section className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-slate-200/40 overflow-hidden">
            
            {orders.length === 0 ? (
              
              // EMPTY STATE
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
                  <FiInbox size={48} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No Orders Yet</h3>
                <p className="text-gray-500 max-w-sm">
                  Looks like you haven&apos;t placed any orders. Head over to the menu to discover delicious meals!
                </p>
              </div>

            ) : (

              // POPULATED TABLE
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-gray-100">
                    <tr>
                      <th className="p-6 text-sm font-bold text-slate-400 uppercase tracking-wider">Order Details</th>
                      <th className="p-6 text-sm font-bold text-slate-400 uppercase tracking-wider">Date & Time</th>
                      <th className="p-6 text-sm font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="p-6 text-sm font-bold text-slate-400 uppercase tracking-wider">Payment</th>
                      <th className="p-6 text-sm font-bold text-slate-400 uppercase tracking-wider text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                      <tr 
                        key={order.order_id} 
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        {/* Order ID */}
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-orange-100 group-hover:text-orange-500 transition-colors">
                              <span className="font-bold">#</span>
                            </div>
                            <span className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                              {order.order_id}
                            </span>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="p-6 text-gray-500 font-medium">
                          {new Date(order.order_time).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </td>

                        {/* Status */}
                        <td className="p-6">
                          {renderStatusBadge(order.status)}
                        </td>

                        {/* Payment */}
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <FiCreditCard className="text-gray-400" />
                            <span className="text-slate-700 font-medium capitalize">
                              {order.payment_method ?? "N/A"}
                            </span>
                            {order.payment_status && (
                              <span className="ml-2 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
                                {order.payment_status}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Total Amount */}
                        <td className="p-6 text-right">
                          <span className="text-xl font-extrabold text-slate-900">
                            <span className="text-sm text-gray-400 mr-1">Rs</span>
                            {Number(order.total_amount).toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
}