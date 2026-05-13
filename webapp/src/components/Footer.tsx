import Link from "next/link";
import { FiFacebook, FiInstagram, FiMail, FiMapPin, FiPhone } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t-4 border-orange-500 relative overflow-hidden">
      {/* Subtle background glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-32 bg-orange-500/10 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:pr-8">
            <Link href="/" className="flex items-center gap-3 group inline-flex mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-orange-400 text-white grid place-items-center font-extrabold text-sm shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-all duration-300">
                FB
              </div>
              <div>
                <h3 className="font-bold text-white text-xl tracking-tight leading-none">FUSION BITES</h3>
                <p className="text-[10px] font-semibold text-orange-500 uppercase tracking-widest mt-1">Restaurant & ERP</p>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Experience the perfect blend of modern culinary excellence and powerful digital ordering. Premium quality, delivered fast.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/" className="text-slate-400 hover:text-orange-500 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-slate-400 hover:text-orange-500 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
                  Explore Menu
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-orange-500 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-orange-500 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Get in Touch</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-slate-400">
                <FiPhone className="text-orange-500 mt-0.5 shrink-0" size={16} />
                <span className="hover:text-white transition-colors cursor-pointer">+92 300 1234567</span>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <FiMail className="text-orange-500 mt-0.5 shrink-0" size={16} />
                <span className="hover:text-white transition-colors cursor-pointer">support@fusionbites.com</span>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <FiMapPin className="text-orange-500 mt-0.5 shrink-0" size={16} />
                <span>Lahore, Punjab<br/>Pakistan</span>
              </li>
            </ul>
          </div>

          {/* Hours & Social Column */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Opening Hours</h4>
            <ul className="space-y-3 text-sm text-slate-400 mb-8">
              <li className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span>Mon - Thu</span>
                <span className="text-white font-medium">12:00 PM - 11:00 PM</span>
              </li>
              <li className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span>Fri - Sun</span>
                <span className="text-orange-500 font-medium">12:00 PM - 01:00 AM</span>
              </li>
            </ul>
            
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all">
                <FiInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all">
                <FiFacebook size={18} />
              </a>
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all cursor-pointer font-bold text-[10px]">
                TK
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Fusion Bites. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}