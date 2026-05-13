"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiFileText,
  FiLoader,
  FiAlertCircle,
  FiHash,
} from "react-icons/fi";

import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { fetchJson } from "@/src/lib/fetchJson";
import { getSessionUser } from "@/src/lib/session";

type InvoiceDetail = {
  invoice_id: number;
  invoice_number: string;
  subtotal: number;
  tax: number;
  delivery_fee: number;
  total_amount: number;
  generated_at: string;
  order_id: number;
};

export default function InvoiceDetailPage() {
  const routeParams = useParams();
  const rawId = routeParams?.id;
  const idStr = Array.isArray(rawId) ? rawId[0] : rawId;

  const [data, setData] = useState<InvoiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      const num = Number(idStr);
      if (!Number.isFinite(num) || num <= 0) {
        setError("Invalid invoice.");
        setLoading(false);
        return;
      }

      void (async () => {
        const user = getSessionUser();
        if (!user) {
          if (!cancelled) {
            setError("Not signed in.");
            setLoading(false);
          }
          return;
        }
        try {
          const row = await fetchJson<InvoiceDetail>(
            `/api/invoices/${num}?user_id=${user.user_id}`
          );
          if (!cancelled) {
            setData(row);
          }
        } catch (e) {
          if (!cancelled) {
            setError(
              e instanceof Error ? e.message : "Could not load invoice."
            );
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
  }, [idStr]);

  return (
    <ProtectedRoute allowedRoles={["customer", "admin"]}>
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-slate-900 selection:bg-orange-500 selection:text-white">
        <Navbar />
        <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-12">
          <Link
            href="/invoices"
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 mb-8"
          >
            <FiArrowLeft size={16} />
            Back to invoices
          </Link>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-gray-100">
              <FiLoader className="animate-spin text-orange-500 mb-4" size={40} />
              <p className="text-slate-600 font-medium">Loading invoice…</p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex gap-3">
              <FiAlertCircle className="shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Unable to load invoice</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && data && (
            <article className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-slate-200/40 p-8 md:p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <FiFileText size={28} />
                </div>
                <div>
                  <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                    Invoice
                  </p>
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                    {data.invoice_number}
                  </h1>
                  <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                    <FiHash size={14} />
                    Order #{data.order_id}
                  </p>
                </div>
              </div>

              <dl className="space-y-4 border-t border-gray-100 pt-8">
                <div className="flex justify-between text-sm">
                  <dt className="text-slate-500 font-semibold">Issued</dt>
                  <dd className="font-medium text-slate-900">
                    {new Date(data.generated_at).toLocaleString()}
                  </dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-slate-500 font-semibold">Subtotal</dt>
                  <dd className="font-medium">
                    Rs {Number(data.subtotal).toLocaleString()}
                  </dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-slate-500 font-semibold">Tax</dt>
                  <dd className="font-medium">
                    Rs {Number(data.tax).toLocaleString()}
                  </dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-slate-500 font-semibold">Delivery</dt>
                  <dd className="font-medium">
                    Rs {Number(data.delivery_fee).toLocaleString()}
                  </dd>
                </div>
                <div className="flex justify-between text-lg font-extrabold border-t border-gray-100 pt-4 mt-4">
                  <dt className="text-slate-900">Total</dt>
                  <dd className="text-orange-600">
                    Rs {Number(data.total_amount).toLocaleString()}
                  </dd>
                </div>
              </dl>

              <p className="text-xs text-slate-400 mt-8">
                Invoice #{data.invoice_id} — Fusion Bites billing record.
              </p>
            </article>
          )}
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
