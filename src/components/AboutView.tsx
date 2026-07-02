import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Box, Compass } from 'lucide-react';

export default function AboutView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="pb-24 pt-8"
      id="about-view-container"
    >
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-black text-white py-24 md:py-36 px-6 md:px-16 mb-20">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-['Hanken_Grotesk'] text-xs font-bold tracking-[0.3em] text-gray-300 uppercase block"
          >
            OUR MANIFESTO
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-['Bodoni_Moda'] text-4xl md:text-6xl lg:text-7xl font-light tracking-tight leading-none"
          >
            Form. Fabric. Philosophy.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-['Hanken_Grotesk'] text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed pt-2"
          >
            DUODRIP was founded on a singular premise: the modern casual wardrobe deserves the same obsessive tailoring, curation, and fabric integrity historically reserved for luxury haute couture.
          </motion.p>
        </div>
      </section>

      {/* Philosophy Details grid */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-16 space-y-24">
        
        {/* Row 1: Split Text/Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="space-y-6">
            <span className="font-['Hanken_Grotesk'] text-[10px] font-bold tracking-[0.2em] text-[#ba1a1a] uppercase">01 / ARCHETYPES OF FIT</span>
            <h2 className="font-['Bodoni_Moda'] text-3xl md:text-4xl font-semibold text-black leading-tight">
              Designing the ultimate oversized silhouette.
            </h2>
            <p className="font-['Hanken_Grotesk'] text-sm text-gray-605 leading-relaxed">
              We spent eighteen months developing our signature cut. Unlike typical oversized apparel which merely scales up dimensions, DUODRIP garments are anatomically draped. We drop the shoulder seams, anchor the collar bands to prevent sag, and construct side vents for natural drape in motion.
            </p>
            <p className="font-['Hanken_Grotesk'] text-sm text-gray-605 leading-relaxed">
              Whether it is our heavy-weight loopback cotton or our micro-structured interlock weave, each piece holds its sculptural posture without sacrificing movement or comfort.
            </p>
          </div>
          <div className="aspect-[4/5] bg-neutral-100 overflow-hidden relative">
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000" 
              alt="Meticulous Fit Study" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/5" />
          </div>
        </div>

        {/* Row 2: Reverse Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="aspect-[4/5] bg-neutral-100 overflow-hidden relative lg:order-last">
            <img 
              src="https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=1000" 
              alt="Fabric Selection Detail" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/5" />
          </div>
          <div className="space-y-6 lg:text-right lg:items-end flex flex-col">
            <span className="font-['Hanken_Grotesk'] text-[10px] font-bold tracking-[0.2em] text-[#ba1a1a] uppercase">02 / OBSESSIVE CURATION</span>
            <h2 className="font-['Bodoni_Moda'] text-3xl md:text-4xl font-semibold text-black leading-tight">
              Sourced globally, crafted with precision.
            </h2>
            <p className="font-['Hanken_Grotesk'] text-sm text-gray-605 leading-relaxed">
              Every yard of fabric is carefully curated from elite mills. We source long-staple Egyptian cotton for absolute softness, loopback French Terries for robust structures, and eco-certified modal blends that feel like luxury silk but maintain everyday resilience.
            </p>
            <p className="font-['Hanken_Grotesk'] text-sm text-gray-605 leading-relaxed">
              Each drop explores curated silhouettes — minimalists, typography-driven word designs, dual-print statements, and bold backstory panels that transform everyday garments into pieces of conversational art.
            </p>
          </div>
        </div>

        {/* Dynamic Pillars section */}
        <div className="pt-12 border-t border-black/10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="font-['Hanken_Grotesk'] text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">OUR COMMITTMENT</span>
            <h3 className="font-['Bodoni_Moda'] text-3xl font-bold text-black">The DUODRIP Standard</h3>
            <p className="font-['Hanken_Grotesk'] text-xs text-gray-500">Every design choice we make is anchored to four fundamental pillars.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="border border-black/5 bg-neutral-50/40 p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mx-auto">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="font-['Hanken_Grotesk'] text-xs font-bold tracking-widest uppercase text-black">Unyielding Testing</h4>
              <p className="font-['Hanken_Grotesk'] text-xs text-gray-600 leading-relaxed">
                Garments undergo rigorous pre-shrunk testing, torque-resistance diagnostics, and multi-cycle dye stability runs to endure real-world wear.
              </p>
            </div>

            <div className="border border-black/5 bg-neutral-50/40 p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mx-auto">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-['Hanken_Grotesk'] text-xs font-bold tracking-widest uppercase text-black">Sartorial Detail</h4>
              <p className="font-['Hanken_Grotesk'] text-xs text-gray-600 leading-relaxed">
                From luxury bonded collars and custom branded zippers to dense split-stitch double-needle seams, every detail is engineered for lifetime use.
              </p>
            </div>

            <div className="border border-black/5 bg-neutral-50/40 p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mx-auto">
                <Box className="w-5 h-5" />
              </div>
              <h4 className="font-['Hanken_Grotesk'] text-xs font-bold tracking-widest uppercase text-black">Conscious Drops</h4>
              <p className="font-['Hanken_Grotesk'] text-xs text-gray-600 leading-relaxed">
                We operate on a strictly managed, low-volume release cycle. By avoiding fast-fashion mass production, we eliminate waste and maximize quality.
              </p>
            </div>

            <div className="border border-black/5 bg-neutral-50/40 p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mx-auto">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-['Hanken_Grotesk'] text-xs font-bold tracking-widest uppercase text-black">Global Vision</h4>
              <p className="font-['Hanken_Grotesk'] text-xs text-gray-600 leading-relaxed">
                Drawing silhouettes inspired by minimalist Tokyo streetculture, Swiss typography design, and classic Italian draping structures.
              </p>
            </div>
          </div>
        </div>

      </section>
    </motion.div>
  );
}
