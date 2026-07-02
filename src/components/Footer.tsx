import React from 'react';
import { ActiveView } from '../types';

interface FooterProps {
  setActiveView: (view: ActiveView) => void;
}

export default function Footer({ setActiveView }: FooterProps) {
  return (
    <footer className="w-full bg-[#efeded] border-t border-black/10 mt-auto">
      {/* Upper Footer Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-16 py-16 max-w-[1440px] mx-auto">
        <div className="flex flex-col gap-4">
          <h3 className="font-['Bodoni_Moda'] text-2xl font-bold tracking-widest text-black">DUODRIP</h3>
          <p className="font-['Hanken_Grotesk'] text-sm text-gray-600 max-w-xs leading-relaxed">
            Premium Streetwear. Timeless Comfort.<br />Designed beyond basics. Made for everyday expression.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-['Hanken_Grotesk'] text-xs font-bold tracking-widest text-black uppercase">ASSISTANCE</h4>
          <button onClick={() => setActiveView('contact')} className="text-left font-['Hanken_Grotesk'] text-sm text-gray-600 hover:text-black transition-colors cursor-pointer">
            Contact Us
          </button>
          <button onClick={() => setActiveView('privacy')} className="text-left font-['Hanken_Grotesk'] text-sm text-gray-600 hover:text-black transition-colors cursor-pointer">
            Privacy Policy
          </button>
          <button onClick={() => setActiveView('shipping-returns')} className="text-left font-['Hanken_Grotesk'] text-sm text-gray-600 hover:text-black transition-colors cursor-pointer">
            Shipping & Returns
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-['Hanken_Grotesk'] text-xs font-bold tracking-widest text-black uppercase">NEWSLETTER</h4>
          <p className="font-['Hanken_Grotesk'] text-sm text-gray-600 leading-relaxed">
            Join the collective archive. Get priority updates on exclusive seasonal drops and design studies.
          </p>
          <div className="flex border-b border-black/30 pb-2">
            <input
              type="email"
              placeholder="YOUR EMAIL"
              className="bg-transparent border-none w-full text-xs font-['Hanken_Grotesk'] tracking-widest focus:outline-none"
            />
            <button className="font-['Hanken_Grotesk'] text-xs font-bold tracking-widest hover:opacity-75 transition-opacity">
              JOIN
            </button>
          </div>
        </div>
      </div>

      {/* Under Footer - Logo Rights */}
      <div className="border-t border-black/5 px-6 md:px-16 py-8 max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-['Hanken_Grotesk'] text-[10px] tracking-widest text-gray-500 uppercase">
          © {new Date().getFullYear()} DUODRIP LUXURY ESSENTIALS. ALL RIGHTS RESERVED.
        </p>
        <button
          onClick={() => setActiveView('admin')}
          className="font-['Hanken_Grotesk'] text-[9px] tracking-widest text-gray-400 hover:text-black transition-colors uppercase cursor-pointer"
        >
          DUODRIP
        </button>
      </div>
    </footer>
  );
}
