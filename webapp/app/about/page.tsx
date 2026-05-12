import { 
  FiCheckCircle, 
  FiTrendingUp, 
  FiUsers, 
  FiAward 
} from "react-icons/fi";

import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";

const highlights = [
  "Restaurant-style premium quality dishes",
  "Fast and reliable delivery tracking",
  "Seamless customer ordering workflow",
  "Data-driven admin ERP operations",
];

const stats = [
  { label: "Happy Customers", value: "10k+", icon: FiUsers },
  { label: "Orders Delivered", value: "50k+", icon: FiTrendingUp },
  { label: "Quality Awards", value: "15+", icon: FiAward },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-slate-900 selection:bg-orange-500 selection:text-white">
      <Navbar />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Content Column */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-600 font-bold text-xs uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              About Fusion Bites
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-slate-900">
              Modern Dining, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">
                Powered by Tech.
              </span>
            </h1>
            
            <p className="text-lg text-slate-500 leading-relaxed mb-8">
              Fusion Bites is a smart restaurant platform combining elegant dining, 
              frictionless online ordering, and ERP-grade business operations to deliver 
              an unforgettable culinary experience.
            </p>
            
            <ul className="space-y-4">
              {highlights.map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-slate-700 font-medium bg-white p-4 rounded-2xl border border-gray-100 shadow-sm shadow-slate-200/20">
                  <div className="text-orange-500 shrink-0">
                    <FiCheckCircle size={20} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Image Column */}
          <div className="relative group">
            {/* Decorative background blur */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-orange-500/20 to-orange-300/20 rounded-[3rem] blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-70 pointer-events-none"></div>
            
            {/* Image Wrapper */}
            <div className="relative rounded-[2.5rem] overflow-hidden border border-white/50 shadow-2xl shadow-slate-300/50 aspect-[4/5] md:aspect-square lg:aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80"
                alt="Fusion Bites restaurant interior"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Image Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/0 to-slate-900/0"></div>
            </div>
          </div>
          
        </section>

        {/* Stats Banner */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-900/20 relative overflow-hidden">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 text-white">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="flex flex-col items-center text-center space-y-3 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-2">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-4xl font-extrabold tracking-tight">{stat.value}</h3>
                    <p className="text-slate-400 font-medium tracking-wide uppercase text-sm">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}