"use client";

import Link from "next/link";
import { FiArrowRight, FiMinus, FiPlus, FiShoppingBag, FiTrash2 } from "react-icons/fi";

import Footer from "@/src/components/Footer";
import MenuItemImage from "@/src/components/MenuItemImage";
import Navbar from "@/src/components/Navbar";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { useCart } from "@/src/context/CartContext";

export default function CartPage() {
  const {
    cart,
    totalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

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
              Your Cart is Empty
            </h1>
            <p className="text-gray-500 text-lg mb-10 text-center max-w-md leading-relaxed">
              Looks like you haven't added any of our delicious dishes to your cart yet.
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
  // POPULATED CART STATE
  // --------------------------------------------------------
  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans selection:bg-orange-500 selection:text-white flex flex-col">
        <Navbar />

        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                Shopping Cart
              </h1>
              <p className="text-gray-500 mt-3 text-lg">
                Review your selected items before checkout
              </p>
            </div>
            <button
              onClick={clearCart}
              className="px-6 py-2.5 rounded-full text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <FiTrash2 size={16} />
              Clear Cart
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-6">
              {cart.map((item) => (
                <div
                  key={item.item_id}
                  className="bg-white rounded-[2rem] p-4 sm:p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center gap-6 relative group"
                >
                  {/* Item Image */}
                  <div className="shrink-0 relative overflow-hidden rounded-2xl w-full sm:w-32 h-32 bg-gray-50">
                    <MenuItemImage
                      category={item.category}
                      name={item.name}
                      itemId={item.item_id}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-slate-900 line-clamp-1 uppercase tracking-tight">
                        {item.name}
                      </h2>
                      <div className="text-orange-500 font-bold mt-1 text-lg">
                        Rs {item.price}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1.5 border border-gray-200">
                        <button
                          onClick={() => decreaseQuantity(item.item_id)}
                          className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-600 shadow-sm flex items-center justify-center hover:text-orange-500 hover:border-orange-500 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="font-semibold text-slate-900 w-6 text-center select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(item.item_id)}
                          className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-600 shadow-sm flex items-center justify-center hover:text-orange-500 hover:border-orange-500 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>

                      {/* Item Total & Remove */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-lg font-extrabold text-slate-900 whitespace-nowrap">
                          Rs {item.price * item.quantity}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.item_id)}
                          className="text-xs font-semibold text-red-400 hover:text-red-600 underline decoration-red-400/30 underline-offset-4 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm lg:sticky lg:top-28">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b border-gray-100 pb-4">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-8 text-gray-600">
                  <div className="flex justify-between items-center text-lg">
                    <span>Total Items</span>
                    <span className="font-medium text-slate-900">
                      {cart.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-900">
                      Rs {totalPrice}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>Taxes & Fees</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-2xl font-extrabold text-slate-900 border-t border-gray-100 pt-6 mb-8">
                  <span>Total</span>
                  <span className="text-orange-500">Rs {totalPrice}</span>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 group"
                >
                  Proceed to Checkout
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <p className="text-center text-xs text-gray-400 mt-4">
                  Secure checkout powered by Fusion Bites ERP
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