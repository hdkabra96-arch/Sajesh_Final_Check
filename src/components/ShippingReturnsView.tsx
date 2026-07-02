import React from 'react';
import { motion } from 'framer-motion';
import { Truck, RefreshCw, HelpCircle, Check, X, Mail, Phone } from 'lucide-react';

export default function ShippingReturnsView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-[1440px] mx-auto px-6 md:px-16 pb-24 pt-12"
      id="shipping-returns-view-container"
    >
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header Title */}
        <div className="text-center space-y-4">
          <span className="font-['Hanken_Grotesk'] text-[10px] font-bold tracking-[0.3em] text-[#ba1a1a] uppercase">
            LOGISTICS & ASSISTANCE
          </span>
          <h1 className="font-['Bodoni_Moda'] text-4xl md:text-5xl font-light text-black tracking-tight">
            Shipping & Returns
          </h1>
          <p className="font-['Hanken_Grotesk'] text-xs text-gray-500 max-w-lg mx-auto leading-relaxed">
            All logistics, transit timelines, and our size exchange framework are detailed below.
          </p>
        </div>

        {/* Highlight Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-black/10">
          <div className="flex flex-col items-center text-center p-6 space-y-3 bg-neutral-50/50 hover:bg-neutral-50 border border-transparent hover:border-black/5 transition-all">
            <Truck className="w-6 h-6 text-black" />
            <span className="font-['Hanken_Grotesk'] text-[12px] font-bold tracking-widest text-black uppercase">Rapid Processing</span>
            <p className="font-['Hanken_Grotesk'] text-[11px] text-gray-500 max-w-sm">
              We process incoming streetwear orders within 1–3 business days, dispatching with premium national carriers.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 space-y-3 bg-neutral-50/50 hover:bg-neutral-50 border border-transparent hover:border-black/5 transition-all">
            <RefreshCw className="w-6 h-6 text-black" />
            <span className="font-['Hanken_Grotesk'] text-[12px] font-bold tracking-widest text-black uppercase">Size Exchange Only</span>
            <p className="font-['Hanken_Grotesk'] text-[11px] text-gray-500 max-w-sm">
              To prioritize sanitation and limited drop exclusivity, we offer standard size adjustments within 3 days.
            </p>
          </div>
        </div>

        {/* Content Columns: Shipping vs. Returns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
          {/* Shipping Policy Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-black/10 pb-3">
              <span className="text-black bg-black/5 w-8 h-8 rounded-full flex items-center justify-center font-['Bodoni_Moda'] font-light">1</span>
              <h2 className="font-['Bodoni_Moda'] text-2xl font-light text-black tracking-tight">
                Shipping Policy
              </h2>
            </div>
            
            <ul className="space-y-4 font-['Hanken_Grotesk'] text-gray-600 text-sm">
              <li className="flex gap-3 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] mt-2 shrink-0" />
                <span>
                  <strong>Processing Window:</strong> Orders are processed within 1–3 business days.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] mt-2 shrink-0" />
                <span>
                  <strong>Delivery Timelines:</strong> Delivery usually takes 3–7 business days depending on your location.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] mt-2 shrink-0" />
                <span>
                  <strong>Instant Tracking:</strong> Once your order is shipped, tracking details will be shared via WhatsApp, SMS, or email.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] mt-2 shrink-0" />
                <span>
                  <strong>Exceptions:</strong> Delivery timelines may vary during holidays, sales, or unforeseen circumstances.
                </span>
              </li>
            </ul>
          </div>

          {/* Returns & Exchanges Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-black/10 pb-3">
              <span className="text-black bg-black/5 w-8 h-8 rounded-full flex items-center justify-center font-['Bodoni_Moda'] font-light">2</span>
              <h2 className="font-['Bodoni_Moda'] text-2xl font-light text-black tracking-tight">
                Returns & Exchanges
              </h2>
            </div>

            <p className="font-['Hanken_Grotesk'] text-sm text-black font-semibold bg-neutral-100 p-3 italic">
              "At DUODRIP, we currently offer Size Exchange Only."
            </p>

            <div className="space-y-4 font-['Hanken_Grotesk']">
              {/* Approved Section */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-bold tracking-widest text-emerald-700 uppercase">ELIGIBILITY CONDITIONS</h4>
                <div className="flex items-start gap-2.5 text-xs text-neutral-700">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>Size exchange available within 3 days of delivery.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-neutral-700">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>Product must be unused, unwashed, and with original tags intact.</span>
                </div>
              </div>

              {/* Prohibited Section */}
              <div className="space-y-2.5 pt-2">
                <h4 className="text-[10px] font-bold tracking-widest text-[#ba1a1a] uppercase">RESTRICTION PROTOCOLS</h4>
                <div className="flex items-start gap-2.5 text-xs text-neutral-700">
                  <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-[#ba1a1a] shrink-0 mt-0.5">
                    <X className="w-3 h-3" />
                  </div>
                  <span>No returns of selected merch are accepted.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-neutral-700">
                  <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-[#ba1a1a] shrink-0 mt-0.5">
                    <X className="w-3 h-3" />
                  </div>
                  <span>No refund allocations (store credits or cash equivalents).</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-neutral-700">
                  <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-[#ba1a1a] shrink-0 mt-0.5">
                    <X className="w-3 h-3" />
                  </div>
                  <span>No exchanges after 3 days of order delivery.</span>
                </div>
              </div>

              <p className="text-xs text-neutral-500 pt-1 leading-relaxed">
                Customers must contact us within 3 days of receiving the order to request a size exchange.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Support Panel */}
        <div className="mt-12 bg-neutral-900 text-white p-8 md:p-12 border border-black/5 relative overflow-hidden">
          {/* Subtle logo vector trace */}
          <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.03] select-none font-['Bodoni_Moda'] text-9xl font-bold">
            DRIP
          </div>

          <div className="relative z-10 space-y-6 md:space-y-0 md:flex md:justify-between md:items-center">
            <div className="space-y-3">
              <span className="font-['Hanken_Grotesk'] text-[10px] font-bold tracking-[0.25em] text-[#ff4c4c] uppercase">
                EXCHANGE DEPARTMENT
              </span>
              <h3 className="font-['Bodoni_Moda'] text-3xl font-light tracking-tight text-white">
                Need Help?
              </h3>
              <p className="font-['Hanken_Grotesk'] text-xs text-gray-400 max-w-sm leading-relaxed">
                For exchange requests or order-related queries, connect with our care services.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:duodripin@gmail.com"
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-5 py-4 border border-white/10 transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4 text-gray-300" />
                <div className="text-left">
                  <span className="block text-[8px] font-bold uppercase text-gray-400 tracking-wider font-['Hanken_Grotesk']">EMAIL SUPPORT</span>
                  <span className="text-xs font-semibold font-['Hanken_Grotesk'] font-mono">duodripin@gmail.com</span>
                </div>
              </a>

              <a
                href="https://wa.me/917698597279"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-5 py-4 border border-white/10 transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4 text-gray-300" />
                <div className="text-left">
                  <span className="block text-[8px] font-bold uppercase text-gray-400 tracking-wider font-['Hanken_Grotesk']">WHATSAPP / MOBILE</span>
                  <span className="text-xs font-semibold font-['Hanken_Grotesk'] font-mono">+91 7698597279</span>
                </div>
              </a>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 mt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-500 font-mono gap-3">
            <span>DUODRIP – Style That Speaks. Build it proper and look better and beautiful.</span>
            <span className="text-gray-400">AVAILABLE 24/7 INTERACTIVE ASSISTANCE</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
