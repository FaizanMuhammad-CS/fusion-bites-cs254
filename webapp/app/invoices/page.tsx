"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  FiFileText, 
  FiArrowRight, 
  FiClock, 
  FiLoader, 
  FiInbox,
  FiHash
} from "react-icons/fi";

import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { fetchJson } from "@/src/lib/fetchJson";
import { getSessionUser } from "@/src/lib/session";

type InvoiceListItem = {
  invoice_id: number;
  invoice_number: string;
  total_amount: number;
  generated_at: string;
  order_id: number;
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvoices() {
      const user = getSessionUser();
      if (!user) return;

      try {
        const data = await fetchJson<InvoiceListItem[]>(
          `/api/invoices?user_id=${user.user_id}`
        );
        setInvoices(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchInvoices();
  }, []);

  // --------------------------------------------------------
  // LOADING STATE
  // --------------------------------------------------------
  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["customer", "admin"]}>
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-slate-900">
          <Navbar />
          <div className="flex-1 flex flex-col items-center justify-center">
            <FiLoader className="animate-spin text-orange-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold">Loading Invoices</h2>
            <p className="text-gray-500 mt-2">Retrieving your billing history...</p>
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
    <ProtectedRoute allowedRoles={["customer", "admin"]}>
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-slate-900 selection:bg-orange-500 selection:text-white">
        <Navbar />
        
        <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
          
          {/* Header */}
          <div className="mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-orange-400 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 mb-6">
              <FiFileText size={24} />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Billing History</h1>
            <p className="text-gray-500 text-lg">View, download, and manage your past invoices.</p>
          </div>

          {/* Invoices List Container */}
          <section className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-slate-200/40 overflow-hidden">
            
            {invoices.length === 0 ? (
              
              // EMPTY STATE
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
                  <FiInbox size={48} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No Invoices Found</h3>
                <p className="text-gray-500 max-w-sm">
                  You haven&apos;t placed any orders yet. Once you do, your invoices will securely appear here.
                </p>
              </div>

            ) : (

              // POPULATED LIST
              <div className="divide-y divide-gray-50">
                {invoices.map((invoice) => (
                  <div 
                    key={invoice.invoice_id} 
                    className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-slate-50/80 transition-colors group"
                  >
                    
                    {/* Left: Invoice Info */}
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-orange-100 group-hover:text-orange-500 transition-colors shrink-0">
                        <FiFileText size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                          {invoice.invoice_number}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-gray-500 font-medium">
                          <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md text-slate-600">
                            <FiHash size={14} /> Order {invoice.order_id}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <FiClock size={14} /> 
                            {new Date(invoice.generated_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Amount & Action */}
                    <div className="flex items-center justify-between w-full md:w-auto gap-6 mt-2 md:mt-0">
                      <div className="text-left md:text-right">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total</p>
                        <p className="text-xl font-extrabold text-slate-900">
                          Rs {Number(invoice.total_amount).toLocaleString()}
                        </p>
                      </div>
                      
                      <Link
                        href={`/invoices/${invoice.invoice_id}`}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-95 shrink-0"
                      >
                        <span>View</span>
                        <FiArrowRight size={16} />
                      </Link>
                    </div>
                    
                  </div>
                ))}
              </div>
            )}
          </section>

        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
}