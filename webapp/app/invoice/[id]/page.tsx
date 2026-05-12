"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  FiPrinter, 
  FiUser, 
  FiMail, 
  FiHash, 
  FiCreditCard, 
  FiCalendar, 
  FiFileText,
  FiLoader,
  FiAlertCircle,
  FiCheckCircle,
  FiClock
} from "react-icons/fi";

import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { fetchJson } from "@/src/lib/fetchJson";

type InvoiceItem = {
  quantity: number;
  item_price: number;
  subtotal: number;
  name: string;
};

type InvoiceDetails = {
  invoice_id: number;
  invoice_number: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  generated_at: string;
  order_id: number;
  delivery_address: string;
  order_time: string;
  customer_name: string;
  customer_email: string;
  payment_method: string;
  payment_status: string;
  transaction_reference: string;
  items: InvoiceItem[];
};

export default function InvoiceDetailsPage() {
  const params = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<InvoiceDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvoice() {
      try {
        const data = await fetchJson<InvoiceDetails>(`/api/invoices/${params.id}`);
        setInvoice(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchInvoice();
  }, [params.id]);

  // Status Badge Helper
  const renderStatusBadge = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s === "paid" || s === "completed") {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-sm font-bold uppercase tracking-wider">
          <FiCheckCircle size={16} /> Paid
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-bold uppercase tracking-wider">
        <FiClock size={16} /> Pending
      </span>
    );
  };

  // --------------------------------------------------------
  // LOADING STATE
  // --------------------------------------------------------
  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["customer", "admin"]}>
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
          <div className="print:hidden"><Navbar /></div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <FiLoader className="animate-spin text-orange-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-slate-900">Loading Document</h2>
            <p className="text-gray-500 mt-2">Retrieving invoice details...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // --------------------------------------------------------
  // ERROR STATE
  // --------------------------------------------------------
  if (!invoice || (invoice as any).error) {
    return (
      <ProtectedRoute allowedRoles={["customer", "admin"]}>
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
          <div className="print:hidden"><Navbar /></div>
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
              <FiAlertCircle size={32} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Invoice Not Found</h2>
            <p className="text-gray-500 max-w-md">
              We couldn't locate this invoice. It may have been deleted or the ID is incorrect.
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // --------------------------------------------------------
  // INVOICE VIEW
  // --------------------------------------------------------
  return (
    <ProtectedRoute allowedRoles={["customer", "admin"]}>
      <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-orange-500 selection:text-white flex flex-col print:bg-white print:min-h-0">
        
        <div className="print:hidden"><Navbar /></div>

        <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 print:p-0 print:py-0">
          
          {/* Action Bar (Hidden on Print) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 print:hidden">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Invoice Viewer</h1>
              <p className="text-gray-500">View or print your receipt</p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-lg shadow-slate-900/20 flex items-center gap-2 group w-full sm:w-auto justify-center"
            >
              <FiPrinter className="group-hover:-translate-y-0.5 transition-transform" />
              Print Invoice
            </button>
          </div>

          {/* Actual Invoice Document */}
          <section className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-slate-200/50 p-8 md:p-12 print:border-none print:shadow-none print:p-0 print:rounded-none">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-600 to-orange-400 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-orange-500/30 print:shadow-none">
                  FB
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Fusion Bites</h2>
                  <p className="text-gray-500 text-sm">MM Alam Road, Lahore, PK</p>
                </div>
              </div>
              
              <div className="text-left md:text-right">
                <h1 className="text-4xl font-extrabold text-slate-200 uppercase tracking-widest print:text-black">Invoice</h1>
                <p className="text-slate-900 font-bold mt-1 text-lg">{invoice.invoice_number}</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8 border-b border-gray-100">
              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</p>
                <Info icon={FiUser} label="Customer" value={invoice.customer_name} />
                <Info icon={FiMail} label="Email" value={invoice.customer_email} />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Details</p>
                  {renderStatusBadge(invoice.payment_status)}
                </div>
                <Info icon={FiHash} label="Order ID" value={`#${invoice.order_id}`} />
                <Info icon={FiCalendar} label="Date" value={new Date(invoice.generated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} />
                <Info icon={FiCreditCard} label="Payment" value={invoice.payment_method ?? "N/A"} />
                {invoice.transaction_reference && (
                  <Info icon={FiFileText} label="Ref" value={invoice.transaction_reference} />
                )}
              </div>
            </div>

            {/* Items Table */}
            <div className="py-8">
              <div className="rounded-2xl border border-gray-100 overflow-hidden print:border-gray-300">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-sm font-bold text-slate-600 uppercase tracking-wider print:bg-gray-100">
                    <tr>
                      <th className="p-4 border-b border-gray-100 print:border-gray-300">Item Description</th>
                      <th className="p-4 border-b border-gray-100 print:border-gray-300 text-center">Qty</th>
                      <th className="p-4 border-b border-gray-100 print:border-gray-300 text-right">Price</th>
                      <th className="p-4 border-b border-gray-100 print:border-gray-300 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 print:divide-gray-200">
                    {invoice.items.map((item, index) => (
                      <tr key={index} className="text-slate-800">
                        <td className="p-4 font-medium">{item.name}</td>
                        <td className="p-4 text-center text-gray-600">{item.quantity}</td>
                        <td className="p-4 text-right text-gray-600">Rs {Number(item.item_price).toLocaleString()}</td>
                        <td className="p-4 text-right font-bold text-slate-900">Rs {Number(item.subtotal).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals Box */}
            <div className="flex justify-end pt-4 pb-8">
              <div className="w-full md:w-80 space-y-3 bg-slate-50 p-6 rounded-2xl print:bg-transparent print:p-0">
                <TotalRow label="Subtotal" value={invoice.subtotal} />
                <TotalRow label="Tax (GST)" value={invoice.tax_amount} />
                <div className="pt-3 mt-3 border-t-2 border-slate-200 print:border-black">
                  <TotalRow label="Total Amount" value={invoice.total_amount} bold />
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="text-center pt-8 border-t border-gray-100 text-gray-400 text-sm">
              <p>Thank you for dining with Fusion Bites. We hope to see you again soon!</p>
              <p className="mt-1 print:hidden">If you have any questions about this invoice, contact support@fusionbites.com</p>
            </div>
            
          </section>
        </main>

        <div className="print:hidden"><Footer /></div>
      </div>
    </ProtectedRoute>
  );
}

// --------------------------------------------------------
// SUB-COMPONENTS
// --------------------------------------------------------

function Info({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 print:hidden">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="font-semibold text-slate-900 line-clamp-1">{value}</p>
      </div>
    </div>
  );
}

function TotalRow({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: number;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={`${bold ? "font-bold text-slate-900 text-lg" : "text-slate-500 font-medium"}`}>
        {label}
      </span>
      <span className={`${bold ? "font-extrabold text-orange-500 text-2xl" : "font-semibold text-slate-900"}`}>
        Rs {Number(value).toLocaleString()}
      </span>
    </div>
  );
}