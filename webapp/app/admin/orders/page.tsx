"use client";

import { useEffect, useState } from "react";
import { 
  FiPackage, 
  FiClock, 
  FiDollarSign, 
  FiUser, 
  FiCreditCard, 
  FiActivity,
  FiLoader,
  FiInbox
} from "react-icons/fi";

import AdminSidebar from "@/src/components/AdminSidebar";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { fetchJson } from "@/src/lib/fetchJson";

type Order = {
  order_id: number;
  customer_name: string;
  total_amount: number;
  status: string;
  payment_method: string;
  order_time: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    try {
      const data = await fetchJson<Order[]>("/api/admin/orders");
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function updateStatus(order_id: number, status: string) {
    try {
      await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id, status }),
      });
      // Refresh the orders after successful update
      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  }

  // Helper to color-code the status dropdowns
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500/20";
      case "Out for Delivery":
        return "bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-500/20";
      case "Preparing":
        return "bg-orange-50 text-orange-700 border-orange-200 focus:ring-orange-500/20";
      case "Placed":
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 focus:ring-slate-500/20";
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row font-sans text-slate-900 selection:bg-orange-500 selection:text-white">
        
        <AdminSidebar />
        
        <main className="flex-1 w-full max-w-[100vw] md:max-w-none p-6 md:p-10 lg:p-12 overflow-x-hidden">
          
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Order Management</h1>
            <p className="text-slate-500 text-lg">Monitor live orders and update fulfillment statuses in real-time.</p>
          </div>

          {/* Table Card Container */}
          <section className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-slate-200/40 overflow-hidden relative">
            
            {loading ? (
              // Loading State
              <div className="flex flex-col items-center justify-center p-20 text-slate-500">
                <FiLoader className="animate-spin text-orange-500 mb-4" size={40} />
                <p className="font-semibold text-lg text-slate-700">Loading Orders</p>
                <p className="text-sm">Fetching the latest data from the server...</p>
              </div>
            ) : orders.length === 0 ? (
              // Empty State
              <div className="flex flex-col items-center justify-center p-20 text-slate-500 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                  <FiInbox size={32} className="text-slate-400" />
                </div>
                <p className="font-bold text-xl text-slate-900 mb-2">No orders found</p>
                <p className="text-slate-500 max-w-sm">It looks like there are no active orders at the moment. New orders will appear here automatically.</p>
              </div>
            ) : (
              // Data Table
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="py-5 px-6 font-bold text-xs uppercase tracking-wider text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-2"><FiPackage size={14} /> Order ID</div>
                      </th>
                      <th className="py-5 px-6 font-bold text-xs uppercase tracking-wider text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-2"><FiUser size={14} /> Customer</div>
                      </th>
                      <th className="py-5 px-6 font-bold text-xs uppercase tracking-wider text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-2"><FiDollarSign size={14} /> Amount</div>
                      </th>
                      <th className="py-5 px-6 font-bold text-xs uppercase tracking-wider text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-2"><FiCreditCard size={14} /> Payment</div>
                      </th>
                      <th className="py-5 px-6 font-bold text-xs uppercase tracking-wider text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-2"><FiActivity size={14} /> Status</div>
                      </th>
                      <th className="py-5 px-6 font-bold text-xs uppercase tracking-wider text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-2"><FiClock size={14} /> Time</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {orders.map((order) => {
                      const orderDate = new Date(order.order_time);
                      return (
                        <tr key={order.order_id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="py-4 px-6">
                            <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg text-sm">
                              #{order.order_id}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-semibold text-slate-800 whitespace-nowrap">
                            {order.customer_name}
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-900 whitespace-nowrap">
                            <span className="text-slate-400 text-sm mr-1">Rs</span>
                            {Number(order.total_amount).toLocaleString()}
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">
                              {order.payment_method}
                            </span>
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap">
                            <select
                              value={order.status}
                              onChange={(e) => updateStatus(order.order_id, e.target.value)}
                              className={`border text-sm font-bold rounded-xl px-4 py-2 outline-none transition-all shadow-sm cursor-pointer appearance-none ${getStatusStyles(order.status)}`}
                              style={{
                                backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22currentColor%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.75rem top 50%',
                                backgroundSize: '0.65rem auto',
                                paddingRight: '2.5rem'
                              }}
                            >
                              <option value="Placed">Placed</option>
                              <option value="Preparing">Preparing</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                          <td className="py-4 px-6 text-sm text-slate-500 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-700">{orderDate.toLocaleDateString()}</span>
                              <span className="text-xs">{orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

        </main>
      </div>
    </ProtectedRoute>
  );
}