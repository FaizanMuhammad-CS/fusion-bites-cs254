import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend, FiUser } from "react-icons/fi";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-orange-500 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column - Contact Information */}
          <div className="lg:pr-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-orange-400 text-white flex items-center justify-center font-extrabold text-xl shadow-lg shadow-orange-500/30 mb-8">
              FB
            </div>
            
            <p className="text-orange-500 font-bold tracking-wider text-sm uppercase mb-3">
              Get In Touch
            </p>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
              We'd love to hear from you.
            </h1>
            <p className="text-gray-500 text-lg mb-10 leading-relaxed max-w-lg">
              Whether you have a question about our menu, want to make a large reservation, or just want to say hi, our team is ready to help.
            </p>

            <div className="space-y-8">
              {/* Address */}
              <div className="flex items-start gap-5 group">
                <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-sm text-orange-500 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:shadow-md transition-all">
                  <FiMapPin size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Visit Us</h3>
                  <p className="text-gray-500 leading-relaxed">
                    MM Alam Road, Gulberg III<br />
                    Lahore, Punjab, Pakistan
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-start gap-5 group">
                <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-sm text-orange-500 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:shadow-md transition-all">
                  <FiPhone size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Call or Email</h3>
                  <p className="text-gray-500 leading-relaxed">
                    +92 300 1234567<br />
                    support@fusionbites.com
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-5 group">
                <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-sm text-orange-500 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:shadow-md transition-all">
                  <FiClock size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Opening Hours</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Monday - Sunday<br />
                    12:00 PM - 1:00 AM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="relative">
            {/* Subtle decorative background blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-md bg-orange-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 border border-gray-100 shadow-xl shadow-slate-200/50 relative z-10">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Send a Message</h2>
              <p className="text-gray-500 mb-8">Fill out the form below and we'll get back to you shortly.</p>

              <form className="space-y-5">
                {/* Name Input */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-900"
                  />
                </div>

                {/* Email Input */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                  </div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-900"
                  />
                </div>

                {/* Message Input */}
                <div className="relative group">
                  <textarea
                    placeholder="How can we help you?"
                    required
                    rows={5}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-900 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 group mt-2"
                >
                  <span>Send Message</span>
                  <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}