"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiSearch, FiShoppingBag } from "react-icons/fi";

import Footer from "@/src/components/Footer";
import MenuItemImage from "@/src/components/MenuItemImage";
import Navbar from "@/src/components/Navbar";
import { useCart } from "@/src/context/CartContext";
import { fetchJson } from "@/src/lib/fetchJson";
import { getSessionUser } from "@/src/lib/session";

type MenuItem = {
  item_id: number;
  name: string;
  category: string;
  description: string;
  price: number;
};

export default function MenuPage() {
  const router = useRouter();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { addToCart, cart } = useCart();

  useEffect(() => {
    async function fetchMenu() {
      try {
        const data = await fetchJson<MenuItem[]>("/api/menu");
        setItems(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(items.map((item) => item.category));
    return ["All", ...Array.from(unique)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, search, selectedCategory]);

  const totalCartItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium animate-pulse">Preparing the menu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans selection:bg-orange-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative mt-4 max-w-7xl mx-auto px-6">
        <div className="relative rounded-[2.5rem] overflow-hidden h-72 md:h-96 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1800&q=80"
            alt="Fusion Bites menu hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
            <p className="text-orange-400 font-bold tracking-wider text-sm uppercase mb-3">
              Our Signature Collection
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight max-w-2xl">
              Crafted Dishes for <br /> Every Mood
            </h1>
            <p className="mt-4 text-gray-300 text-lg max-w-xl">
              Browse premium meals, quick bites, desserts, and drinks curated by our expert chefs.
            </p>
          </div>
        </div>
      </section>

      {/* Menu Header & Search */}
      <div className="max-w-7xl mx-auto px-6 mt-12 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Discover Menu</h2>
            <p className="text-gray-500 mt-2">Find your favorite cravings</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Search Bar */}
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" size={18} />
              </div>
              <input
                type="text"
                placeholder="Search dishes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
              />
            </div>
            
            {/* Cart Status Pill */}
            <div className="flex items-center gap-3 bg-white border border-gray-200 px-5 py-3 rounded-2xl shadow-sm w-full sm:w-auto">
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                <FiShoppingBag size={16} />
              </div>
              <div className="font-semibold text-gray-700">
                Cart: <span className="text-orange-500">{totalCartItems}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <section className="max-w-7xl mx-auto px-6 mb-10">
        <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-orange-500 hover:text-orange-500"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Menu Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <article
                key={item.item_id}
                className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
              >
                <div className="relative rounded-2xl overflow-hidden mb-5">
                  {/* Using a predictable image URL structure for the demo */}
                  <MenuItemImage
                    category={item.category}
                    name={item.name}
                    itemId={item.item_id}
                    alt={item.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-slate-900 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                    {item.category}
                  </span>
                </div>
                
                <div className="px-2 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 text-lg uppercase tracking-tight line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-2 mb-4 line-clamp-2 flex-1 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price</span>
                      <span className="font-extrabold text-lg text-slate-900">
                        Rs {item.price}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const user = getSessionUser();
                        if (!user || user.role !== "customer") {
                          router.push("/login");
                          return;
                        }
                        addToCart({
                          item_id: item.item_id,
                          name: item.name,
                          price: Number(item.price),
                          category: item.category,
                        });
                      }}
                      className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-95"
                      aria-label="Add to cart"
                    >
                      <FiPlus size={20} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-16 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <FiSearch className="text-gray-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No dishes found</h3>
            <p className="text-gray-500 mt-2 max-w-md">
              {`We couldn't find any dishes matching "${search}" in the ${selectedCategory} category. Try adjusting your filters.`}
            </p>
            <button 
              onClick={() => { setSearch(""); setSelectedCategory("All"); }}
              className="mt-6 px-6 py-2.5 rounded-full bg-orange-50 text-orange-600 font-semibold hover:bg-orange-100 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}