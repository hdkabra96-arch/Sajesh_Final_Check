import React from 'react';
import { motion } from 'framer-motion';
import { Lock, EyeOff, Scale, HelpCircle } from 'lucide-react';

export default function PrivacyView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-[1440px] mx-auto px-6 md:px-16 pb-24 pt-12"
      id="privacy-view-container"
    >
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header Title */}
        <div className="text-center space-y-4">
          <span className="font-['Hanken_Grotesk'] text-[10px] font-bold tracking-[0.3em] text-[#ba1a1a] uppercase">
            LEGAL MATTERS
          </span>
          <h1 className="font-['Bodoni_Moda'] text-4xl md:text-5xl font-light text-black tracking-tight">
            Privacy Policy
          </h1>
          <p className="font-['Hanken_Grotesk'] text-xs text-gray-500 max-w-lg mx-auto leading-relaxed">
            Last Updated: June 2026
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-black/10">
          <div className="flex flex-col items-center text-center p-4 space-y-3">
            <Lock className="w-6 h-6 text-black" />
            <span className="font-['Hanken_Grotesk'] text-[11px] font-bold tracking-widest text-black uppercase">Secure Enclaves</span>
            <p className="font-['Hanken_Grotesk'] text-[11px] text-gray-400">
              Checkout transactions and billing information are secured using industry-standard TLS encryption protocols.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4 space-y-3">
            <EyeOff className="w-6 h-6 text-black" />
            <span className="font-['Hanken_Grotesk'] text-[11px] font-bold tracking-widest text-black uppercase">Zero Selling</span>
            <p className="font-['Hanken_Grotesk'] text-[11px] text-gray-400">
              We never participate in data brokers. Your measurements, email records, and address metrics belong strictly to DUODRIP database systems.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4 space-y-3">
            <Scale className="w-6 h-6 text-black" />
            <span className="font-['Hanken_Grotesk'] text-[11px] font-bold tracking-widest text-black uppercase">Active Consent</span>
            <p className="font-['Hanken_Grotesk'] text-[11px] text-gray-400">
              Cookie configurations and marketing newsletter permissions require proactive manual authorization from your end.
            </p>
          </div>
        </div>

        {/* Detailed Sections Block */}
        <div className="max-w-2xl mx-auto space-y-6 font-['Hanken_Grotesk'] text-[#333333] text-sm md:text-base leading-relaxed py-4 text-left">
          <p className="first-letter:text-4xl first-letter:font-['Bodoni_Moda'] first-letter:font-light first-letter:float-left first-letter:mr-3 first-letter:text-black">
            At DUODRIP, your privacy matters. We collect only the information necessary to process orders, improve your shopping experience, and provide customer support. Your personal information is never sold or shared with third parties except where required for payment processing, shipping, or legal compliance.
          </p>
          <p>
            We are committed to keeping your data secure and ensuring a safe, transparent shopping experience for every customer.
          </p>
        </div>

        {/* Footer legal disclaimer */}
        <div className="bg-neutral-100 p-6 text-center text-xs text-gray-500 border border-black/5 font-mono">
          <HelpCircle className="w-4 h-4 text-gray-400 mx-auto mb-2" />
          <span>DUODRIP luxury essentials adheres strictly to high-standard consumer privacy practices. Thank you for your continued trust.</span>
        </div>
      </div>
    </motion.div>
  );
}
