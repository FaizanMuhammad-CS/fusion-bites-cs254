"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FiMapPin, 
  FiCreditCard, 
  FiDollarSign, 
  FiSmartphone, 
  FiShoppingBag, 
  FiArrowRight, 
  FiLoader,
  FiCheck
} from "react-icons/fi";

import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { useCart } from "@/src/context/CartContext";
import { fetchJson } from "@/src/lib/fetchJson";
import { getSessionUser } from "@/src/lib/session";

const PAYMENT_METHODS = [
  { id: "Cash", icon: FiDollarSign, label: "Cash on Delivery", description: "Pay when your food arrives" },
  { id: "Card", icon: FiCreditCard, label: "Credit/Debit Card", description: "Pay securely with your card" },
  { id: "Online", icon: FiSmartphone, label: "Online Wallet", description: "JazzCash, EasyPaisa, etc." },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  async function placeOrder() {
    if (!address.trim()) {
      alert("Please enter a delivery address.");
      return;
    }

    try {
      setLoading(true);

      const data = await fetchJson<{ order_id: number }>(
        "/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: getSessionUser()?.user_id,
            delivery_address: address,
            payment_method: paymentMethod,
            items: cart,
          }),
        }
      );

      clearCart();
      alert(`Order placed successfully! Order ID: ${data.order_id}`);
      router.push("/menu");

    } catch (error) {
      console.error(error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------------
  // EMPTY CART STATE
  // --------------------------------------------------------
  if (cart.length === 0) {
    return (
      <ProtectedRoute allowedRoles={["customer"]}>
        <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans selection:bg-orange-500 selection:text-white flex flex-col">
          <Navbar />
          <div className="flex-1 flex flex-col items-center justify-center py-20 px-6">
            <div className="w-32 h-32 bg-white rounded-full shadow-sm border border-orange-100 flex items-center justify-center mb-8 text-orange-200">
              <FiShoppingBag size={56} />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4 text-center">
              Checkout is Empty
            </h1>
            <p className="text-gray-500 text-lg mb-10 text-center max-w-md leading-relaxed">
              You need to add some items to your cart before proceeding to checkout.
            </p>
            <Link
              href="/menu"
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold transition-all hover:shadow-lg hover:shadow-orange-500/30 flex items-center gap-2 group"
            >
              Explore Menu
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  // --------------------------------------------------------
  // CHECKOUT STATE
  // --------------------------------------------------------
  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans selection:bg-orange-500 selection:text-white flex flex-col">
        <Navbar />

        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
          
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Checkout
            </h1>
            <p className="text-gray-500 mt-3 text-lg">
              Complete your order details below
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Form */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Address Section */}
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                    <FiMapPin size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Delivery Details</h2>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700 ml-1">
                    Complete Address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. House 123, Street 4, Phase 5, DHA..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-5 outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-900 resize-none"
                    rows={4}
                  />
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                    <FiCreditCard size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Payment Method</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {PAYMENT_METHODS.map((method) => {
                    const isSelected = paymentMethod === method.id;
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
                          isSelected 
                            ? "border-orange-500 bg-orange-50/30 shadow-md shadow-orange-500/10" 
                            : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 text-orange-500">
                            <FiCheck size={18} className="stroke-[3]" />
                          </div>
                        )}
                        <Icon 
                          size={24} 
                          className={`mb-3 ${isSelected ? "text-orange-500" : "text-gray-400"}`} 
                        />
                        <div className={`font-bold mb-1 ${isSelected ? "text-orange-700" : "text-slate-900"}`}>
                          {method.label}
                        </div>
                        <div className="text-xs text-gray-500 leading-snug">
                          {method.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm lg:sticky lg:top-28">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-gray-100 pb-4">
                  Order Summary
                </h2>

                {/* Micro Cart List */}
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 hide-scrollbar">
                  {cart.map((item) => (
                    <div key={item.item_id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-md">
                          {item.quantity}x
                        </span>
                        <span className="font-medium text-slate-700 line-clamp-1">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0">
                        Rs {item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 mb-8 text-gray-600 border-t border-gray-100 pt-6">
                  <div className="flex justify-between items-center text-lg">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-900">
                      Rs {totalPrice}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span>Delivery Fee</span>
                    <span className="font-medium text-green-500 uppercase text-sm tracking-wider">
                      Free
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-2xl font-extrabold text-slate-900 border-t border-gray-100 pt-6 mb-8">
                  <span>Total</span>
                  <span className="text-orange-500">Rs {totalPrice}</span>
                </div>

                <button
                  onClick={placeOrder}
                  disabled={loading}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin" size={20} />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Pay Rs {totalPrice}</span>
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                
                <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                  <FiCheck className="text-green-500" />
                  Secure checkout powered by Fusion Bites
                </p>
              </div>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}