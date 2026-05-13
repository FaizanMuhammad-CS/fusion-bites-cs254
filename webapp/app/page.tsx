import Link from "next/link";
import { FiArrowRight, FiPlus } from "react-icons/fi";

import FeaturedDishImage from "@/src/components/FeaturedDishImage";
import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";
import {
  HOME_MENU_CATEGORY_CHIPS,
  menuCategoryHref,
} from "@/src/lib/homeMenuCategories";

type FeaturedItem =
  | {
      name: string;
      ingredients: string;
      priceRs: number;
      oldPriceRs?: number;
      image: { mode: "url"; src: string };
    }
  | {
      name: string;
      ingredients: string;
      priceRs: number;
      oldPriceRs?: number;
      image: {
        mode: "menu";
        category: string;
        /** Matches image file / MenuItems name under public/photos */
        imageName: string;
        itemId: number;
      };
    };

// PKR amounts; hero picks mirror the full menu currency (Rs)
const featuredItems: FeaturedItem[] = [
  {
    name: "Smoked BBQ Platter",
    ingredients: "Beef, spices, BBQ sauce, capsicum",
    priceRs: 7200,
    oldPriceRs: 8400,
    image: {
      mode: "url",
      src: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=900&q=80",
    },
  },
  {
    name: "Fusion Dynamite Burger",
    ingredients: "Chicken breast, cheddar, dynamite mayo",
    priceRs: 3750,
    oldPriceRs: 4500,
    image: {
      mode: "url",
      src: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
    },
  },
  {
    name: "Creamy Alfredo Pasta",
    ingredients: "Parmesan, garlic, herbs, chicken",
    priceRs: 5400,
    image: {
      mode: "url",
      // Reliable pasta hero (prior Unsplash id often 404s or blocks hotlinking)
      src: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=900&q=80",
    },
  },
  {
    name: "Crispy Spring Rolls",
    ingredients: "Vegetables, sweet chili, rice paper",
    priceRs: 2400,
    oldPriceRs: 3000,
    image: {
      mode: "menu",
      category: "Appetizers",
      imageName: "Vegetable Spring Rolls",
      itemId: 3,
    },
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans selection:bg-orange-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-slate-900">
              &ldquo;Exploring the Delights of <span className="text-orange-500">Fusion Cuisine</span>&rdquo;
            </h1>
            <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-lg">
              Experience a blend of vibrant flavors, modern culinary techniques, and a seamless digital ordering platform built for food lovers.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/menu"
                className="px-8 py-4 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 flex items-center gap-2"
              >
                Explore Menu <FiArrowRight />
              </Link>
              <Link
                href="/register"
                className="px-8 py-4 rounded-full bg-white text-slate-900 font-bold border-2 border-slate-200 hover:border-orange-500 hover:text-orange-600 transition-all duration-300 flex items-center gap-2"
              >
                <FiPlus className="text-orange-500" />
                Create account
              </Link>
            </div>
          </div>

          <div className="relative">
            {/* Bento Box Style Image Composition */}
            <div className="flex gap-4 items-stretch h-[500px]">
              <div className="w-1/2 rounded-[2rem] overflow-hidden shadow-2xl relative group">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80"
                  alt="Main Dish"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="w-1/2 flex flex-col gap-4">
                <div className="h-3/5 rounded-[2rem] overflow-hidden shadow-xl relative group">
                  <img
                    src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80"
                    alt="Side Dish 1"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="h-2/5 rounded-[2rem] bg-slate-900 p-6 flex flex-col justify-center relative overflow-hidden shadow-xl group">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <h3 className="text-white font-bold text-xl relative z-10">Fresh<br/>Ingredients</h3>
                  <p className="text-gray-400 text-sm mt-2 relative z-10">Sourced daily for premium quality.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Banner */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="rounded-[2.5rem] bg-slate-900 p-10 md:p-14 flex flex-col lg:flex-row items-center gap-10 shadow-2xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="lg:w-1/3 z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              What is the speciality of Fusion food?
            </h2>
          </div>
          <div className="lg:w-2/3 border-l-2 border-white/10 pl-0 lg:pl-10 z-10">
            <p className="text-gray-300 text-lg leading-relaxed">
              The specialty of our fusion food lies in its unique blend of flavors, textures, and cultural influences that create a truly captivating culinary experience. Every element contributes to the distinctiveness of our modern menu.
            </p>
          </div>
        </div>
      </section>

      {/* Top Categories */}
      <section className="max-w-7xl mx-auto px-6 pb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Top Categories</h2>
        <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
          {HOME_MENU_CATEGORY_CHIPS.map((cat) => (
            <Link
              key={cat}
              href={menuCategoryHref(cat)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 inline-flex items-center justify-center ${
                cat === "All"
                  ? "bg-slate-900 text-white shadow-md hover:bg-slate-800"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-orange-500 hover:text-orange-500"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Today's Menu Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Today&apos;s Menu</h2>
          <Link href="/menu" className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">
            View all dishes
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item) => (
            <article 
              key={item.name} 
              className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="relative rounded-2xl overflow-hidden mb-5">
                <FeaturedDishImage
                  {...(item.image.mode === "url"
                    ? {
                        mode: "url" as const,
                        src: item.image.src,
                        alt: item.name,
                        className:
                          "w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500",
                      }
                    : {
                        mode: "menu" as const,
                        category: item.image.category,
                        imageName: item.image.imageName,
                        itemId: item.image.itemId,
                        alt: item.name,
                        className:
                          "w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500",
                      })}
                />
              </div>
              <div className="px-2">
                <h3 className="font-bold text-gray-900 text-lg uppercase tracking-tight line-clamp-1">{item.name}</h3>
                <p className="text-xs text-gray-400 mt-1 mb-4 line-clamp-1">Ingredients: {item.ingredients}</p>
                
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-xs text-gray-400 font-medium">PRICE:</span>
                    <span className="font-bold text-orange-500">
                      Rs {item.priceRs.toLocaleString("en-PK")}
                    </span>
                    {item.oldPriceRs != null && (
                      <span className="text-xs text-gray-400 line-through">
                        Rs {item.oldPriceRs.toLocaleString("en-PK")}
                      </span>
                    )}
                  </div>
                  <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all shadow-sm">
                    <FiPlus size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Call to Action Reservation */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="border-t border-gray-200 pt-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold text-slate-900">Want to reserve a table?</h2>
            <p className="text-gray-500 mt-4 text-sm leading-relaxed">
              Remember that reservation policies can vary. It&apos;s important to read and understand our terms before making a reservation to ensure the best dining experience.
            </p>
          </div>
          <Link 
            href="/contact" 
            className="px-8 py-3.5 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 hover:shadow-lg transition-all whitespace-nowrap"
          >
            Book a Table
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}