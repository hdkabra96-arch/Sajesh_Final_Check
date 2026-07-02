import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, HeroSlide, CategoryItem } from '../types';
import { INITIAL_PRODUCTS } from '../data';
import { ChevronLeft, ChevronRight, Eye, Sparkles, Heart, Star } from 'lucide-react';
import InstagramFeed from './InstagramFeed';

import bandedTshirtBanner from '../assets/images/banded_tshirt_banner_1781972332675.jpg';

interface StorefrontViewProps {
  setActiveView: (view: 'storefront' | 'shop' | 'admin') => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: 'M' | 'L' | 'XL' | 'XXL') => void;
  onToggleFavorite: (product: Product) => void;
  favorites: string[];
  setCatalogFilter: (category: 'Oversized' | 'Polo' | 'Graphic' | 'Premium' | 'Minimalist' | null) => void;
  heroSlides: HeroSlide[];
  categories: CategoryItem[];
}

export default function StorefrontView({
  setActiveView,
  onQuickView,
  onAddToCart,
  onToggleFavorite,
  favorites,
  setCatalogFilter,
  heroSlides,
  categories
}: StorefrontViewProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [newsletterSuccess, setNewsletterSuccess] = React.useState(false);

  // Auto-slide every 6 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (heroSlides.length || 3));
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleCategoryClick = (category: 'Oversized' | 'Polo' | 'Graphic' | 'Premium' | 'Minimalist') => {
    setCatalogFilter(category);
    setActiveView('shop');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSuccess(false), 5000);
    }
  };

  const currentHero = heroSlides[currentSlide] || heroSlides[0];

  // Get the 4 featured products for "New Arrivals"
  const featuredProducts = INITIAL_PRODUCTS.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pb-16"
    >
      {/* Hero Slider Section */}
      <section className="relative h-[80vh] md:h-[85vh] overflow-hidden bg-black text-white" id="hero-slider-section">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${currentHero.bgUrl}')` }}
          >
            {/* Ambient Dark overlay matching design guideline (no generic purple gradients) */}
            <div className="absolute inset-0 bg-black/35" />
          </motion.div>
        </AnimatePresence>

        {/* Content Layout */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 z-10">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-['Hanken_Grotesk'] text-xs font-bold tracking-[0.3em] text-white/90 mb-4"
          >
            {currentHero.label}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-['Bodoni_Moda'] text-4xl md:text-7xl font-bold text-white mb-8 max-w-4xl tracking-tight leading-tight"
          >
            {currentHero.title}
          </motion.h1>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => {
              setCatalogFilter(null);
              setActiveView('shop');
            }}
            id="hero-shop-now-btn"
            className="px-12 py-4 bg-white text-black font-['Hanken_Grotesk'] text-xs font-semibold tracking-widest uppercase hover:bg-neutral-200 hover:scale-105 active:scale-95 transition-all duration-300 pointer-events-auto cursor-pointer"
          >
            {currentHero.buttonText}
          </motion.button>
        </div>

        {/* Slider Indicator Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-12 h-1 transition-all duration-300 ${
                index === currentSlide ? 'bg-white' : 'bg-white/30'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Featured Categories (The Core Archetypes) */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-16 py-20">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-12">
          <div>
            <h2 className="font-['Bodoni_Moda'] text-3xl md:text-5xl font-bold text-black tracking-tight" id="core-archetypes-title">Wear Your Story</h2>
            <p className="font-['Hanken_Grotesk'] text-sm text-gray-500 mt-2 font-medium">Distinct designs created to reflect your individuality.</p>
          </div>
          <button
            onClick={() => {
              setCatalogFilter(null);
              setActiveView('shop');
            }}
            id="view-all-concepts-btn"
            className="font-['Hanken_Grotesk'] text-xs font-bold tracking-widest uppercase border-b border-black hover:opacity-75 pb-0.5 mt-4 md:mt-0 transition-opacity"
          >
            VIEW ALL CATEGORIES
          </button>
        </div>

        {/* Dynamic Categories Grid from Admin settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 h-auto min-h-[450px]" id="categories-grid-container">
          {categories.map((cat, cIdx) => (
            <div
              key={`storefront-cat-${cat.id || cIdx}-${cIdx}`}
              onClick={() => handleCategoryClick(cat.category)}
              id={`category-card-${cat.category.toLowerCase()}`}
              className="group relative overflow-hidden bg-neutral-200 cursor-pointer h-[350px] md:h-[50vh] min-h-[420px]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url('${cat.bgUrl}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 z-10 w-full text-left">
                <h3 className="font-['Bodoni_Moda'] text-xl md:text-2xl font-semibold text-white mb-0.5">{cat.title}</h3>
                <p className="font-['Hanken_Grotesk'] text-[9px] tracking-widest text-white/80 uppercase mb-3">{cat.subtitle}</p>
                <span className="inline-block text-white font-['Hanken_Grotesk'] text-[10px] font-semibold tracking-widest uppercase border-b border-white pb-0.5 group-hover:translate-x-1.5 transition-transform duration-300">
                  {cat.buttonText}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="bg-[#f5f3f3] py-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-['Bodoni_Moda'] text-3xl md:text-5xl font-bold text-black tracking-tight">New Arrivals</h2>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setCatalogFilter(null);
                  setActiveView('shop');
                }}
                className="w-10 h-10 flex items-center justify-center border border-black/20 hover:bg-black hover:text-white transition-all cursor-pointer"
                title="Browse all products"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product, pIdx) => {
              const isFav = favorites.includes(product.id);
              return (
                <div key={`featured-prod-${product.id || pIdx}-${pIdx}`} className="group relative">
                  {/* Image container */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#fbf9f9] border border-black/5 mb-4 group/card flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-102"
                    />

                    {/* Quick Add Overlay on Hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm opacity-0 translate-y-4 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-300 flex flex-col gap-2 z-20">
                      <button
                        onClick={() => onQuickView(product)}
                        className="w-full py-2 bg-black text-white hover:bg-gray-850 font-['Hanken_Grotesk'] text-[10px] font-bold tracking-widest uppercase transition-colors cursor-pointer"
                      >
                        QUICK VIEW
                      </button>
                      <button
                        onClick={() => onAddToCart(product, 'M')}
                        className="w-full py-2 border border-black text-black hover:bg-black hover:text-white font-['Hanken_Grotesk'] text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer"
                      >
                        QUICK ADD (M)
                      </button>
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={() => onToggleFavorite(product)}
                      className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm shadow-sm flex items-center justify-center text-black transition-colors z-10"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                    </button>

                    {/* Top Right Badges */}
                    {product.isNew && (
                      <span className="absolute top-4 right-4 bg-black text-white text-[9px] font-['Hanken_Grotesk'] font-bold tracking-widest px-2.5 py-1 uppercase z-10">
                        NEW
                      </span>
                    )}
                    {product.isLimited && (
                      <span className="absolute top-4 right-4 bg-[#ba1a1a] text-white text-[9px] font-['Hanken_Grotesk'] font-bold tracking-widest px-2.5 py-1 uppercase z-10">
                        LIMITED
                      </span>
                    )}
                  </div>

                  {/* Product Details info block */}
                  <div className="flex flex-col gap-1 text-left px-1">
                    <p className="font-['Hanken_Grotesk'] text-[10px] tracking-widest text-gray-500 font-bold uppercase">
                      {product.textColorCategory}
                    </p>
                    <h3 className="font-['Hanken_Grotesk'] text-sm font-semibold text-black hover:underline cursor-pointer" onClick={() => onQuickView(product)}>
                      {product.name}
                    </h3>
                    <p className="font-['Hanken_Grotesk'] text-sm font-semibold text-black">
                      ₹{product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* New Banded T-shirt Showcase Banner */}
      <section className="bg-black text-white relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0">
          <img
            src={bandedTshirtBanner}
            alt="New Banded collar T-shirt premium showcase"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-65"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        </div>
        <div className="relative max-w-[1440px] mx-auto px-6 md:px-16 z-10 flex flex-col items-start text-left">
          <span className="font-['Hanken_Grotesk'] text-xs font-bold tracking-[0.3em] text-white/80 mb-4 uppercase">
            JUST IN
          </span>
          <h2 className="font-['Bodoni_Moda'] text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-xl leading-none">
            Elevated Essentials
          </h2>
          <p className="font-['Hanken_Grotesk'] text-sm md:text-base text-gray-300 mb-10 max-w-lg leading-relaxed">
            Premium oversized tees crafted for everyday comfort and effortless style
          </p>
          <button
            onClick={() => {
              setCatalogFilter(null);
              setActiveView('shop');
            }}
            className="px-10 py-4 bg-white text-black font-['Hanken_Grotesk'] text-xs font-bold tracking-widest uppercase hover:bg-neutral-200 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            DISCOVER THE DRIP
          </button>
        </div>
      </section>


      {/* Customer Reviews Section */}
      <section className="bg-neutral-50/60 py-24 border-t border-b border-black/5" id="customer-reviews-section">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
            
            {/* Left Score Card */}
            <div className="lg:col-span-1 space-y-6 text-left">
              <span className="font-['Hanken_Grotesk'] text-xs font-bold tracking-[0.3em] text-[#ba1a1a] uppercase">
                THE CIRCLE'S VOICE
              </span>
              <h2 className="font-['Bodoni_Moda'] text-3xl md:text-5xl font-bold text-black tracking-tight leading-tight">
                Appraised & Proven
              </h2>
              <p className="font-['Hanken_Grotesk'] text-sm text-gray-500 leading-relaxed max-w-sm">
                Real customer logs, verified order ratings, and sartorial feedback directly from our community archive.
              </p>
              
              <div className="pt-6 border-t border-black/10 flex items-center gap-6">
                <div>
                  <span className="font-['Bodoni_Moda'] text-5xl font-bold text-black">4.9</span>
                  <span className="text-gray-400 font-['Hanken_Grotesk'] text-sm ml-1 font-medium">/ 5.0</span>
                </div>
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 text-black fill-black" />
                    ))}
                  </div>
                  <span className="block font-['Hanken_Grotesk'] text-[10px] uppercase font-bold tracking-widest text-gray-400">
                    284 VERIFIED RATINGS
                  </span>
                </div>
              </div>
            </div>

            {/* Right Reviews Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Review 1 */}
              <div className="bg-white p-8 border border-black/5 hover:border-black/10 transition-all flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex gap-1 justify-start">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 text-black fill-black" />
                    ))}
                  </div>
                  <h4 className="font-['Hanken_Grotesk'] text-sm font-bold text-black tracking-tight text-left">
                    "Best oversized fit in the market"
                  </h4>
                  <p className="font-['Hanken_Grotesk'] text-xs text-gray-650 leading-relaxed text-left">
                    The heavy-weight loopback premium cotton falls exactly how it should. No sagging at the shoulders, and stays crisp after washes. Truly high-end streetwear.
                  </p>
                </div>
                <div className="pt-4 border-t border-black/5 flex items-center justify-between text-[10px] font-mono text-gray-400">
                  <span className="font-semibold text-black">Arjun Mehta</span>
                  <span>MUMBAI, IN</span>
                </div>
              </div>

              {/* Review 2 */}
              <div className="bg-white p-8 border border-black/5 hover:border-black/10 transition-all flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex gap-1 justify-start">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 text-black fill-black" />
                    ))}
                  </div>
                  <h4 className="font-['Hanken_Grotesk'] text-sm font-bold text-black tracking-tight text-left">
                    "Attention to detail is unreal"
                  </h4>
                  <p className="font-['Hanken_Grotesk'] text-xs text-gray-650 leading-relaxed text-left">
                    Obsessed with the banded collar tees. The split hems are clean, fabric thickness feels exceptionally luxurious and breathable. Ordered my third color.
                  </p>
                </div>
                <div className="pt-4 border-t border-black/5 flex items-center justify-between text-[10px] font-mono text-gray-400">
                  <span className="font-semibold text-black">Riya Sharma</span>
                  <span>NEW DELHI, IN</span>
                </div>
              </div>

              {/* Review 3 */}
              <div className="bg-white p-8 border border-black/5 hover:border-black/10 transition-all flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex gap-1 justify-start">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 text-black fill-black" />
                    ))}
                  </div>
                  <h4 className="font-['Hanken_Grotesk'] text-sm font-bold text-black tracking-tight text-left">
                    "Understated elegance"
                  </h4>
                  <p className="font-['Hanken_Grotesk'] text-xs text-gray-650 leading-relaxed text-left">
                    DUODRIP perfected the minimalist clean aesthetic. Fast delivery, beautiful heavy premium container box, and size charts are spot on.
                  </p>
                </div>
                <div className="pt-4 border-t border-black/5 flex items-center justify-between text-[10px] font-mono text-gray-400">
                  <span className="font-semibold text-black">Karan Malhotra</span>
                  <span>BENGALURU, IN</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Curated Instagram Feed Section */}
      <InstagramFeed />

      {/* Brand Story Section */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-16 py-24 flex flex-col md:flex-row items-center gap-16 md:gap-24">
        {/* Left Aspect Square Cover Image */}
        <div className="flex-1 w-full">
          <div className="relative aspect-square w-full">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuClPwawevFJgn_YrHJEvCPbRdHAROT2QkUGpnoiHTJzd3fGJcWS3kSxjeH696Z2EZ2bq3MVLGiuLK2cNNIwN0Pf6Atgx45jiHWj6B05TWmbwjnX8tQCFg-_XHeERb0jfr_HpvhxdoeWoPSMKTj-sWw-FMNL4p-HuTFQ4bfKcsMH--i_cdM3l2rZhzOecW5FevU1otbrKBfE6dcNafwAxvFpjYIKvnUpYojAYs1Rmh2dNgjSBWBE5KFc-GlzsoqPvz31jJEGWKIqgciU"
              alt="Story Cover Black Tailor Hands"
              referrerPolicy="no-referrer"
            />
            {/* Elegant square badge on desktop */}
            <div className="absolute -bottom-8 -right-8 w-44 h-44 bg-black p-8 hidden md:flex flex-col justify-center text-white select-none">
              <span className="font-['Bodoni_Moda'] text-3xl font-light">Est.</span>
              <span className="font-['Bodoni_Moda'] text-4xl font-bold tracking-tight">2026</span>
            </div>
          </div>
        </div>

        {/* Brand Text Columns */}
        <div className="flex-1 flex flex-col gap-6 text-left">
          <span className="font-['Hanken_Grotesk'] text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">
            OUR PHILOSOPHY
          </span>
          <h2 className="font-['Bodoni_Moda'] text-3xl md:text-5xl font-bold text-black leading-tight tracking-tight">
            Where Comfort Meets Character
          </h2>
          <p className="font-['Hanken_Grotesk'] text-base md:text-lg text-gray-650 max-w-lg leading-relaxed">
            At DUODRIP, we believe great style starts with comfort. Every piece is designed to blend premium quality, modern aesthetics, and effortless wearability. From minimal essentials to statement graphics, our collections are made to help you wear your story with confidence.
          </p>

          <div className="grid grid-cols-2 gap-8 my-4">
            <div>
              <h4 className="font-['Hanken_Grotesk'] text-xs font-bold text-black tracking-widest uppercase mb-2">PREMIUM QUALITY</h4>
              <p className="font-['Hanken_Grotesk'] text-sm text-gray-600 leading-relaxed">
                Soft fabrics, durable prints, and attention to every detail.
              </p>
            </div>
            <div>
              <h4 className="font-['Hanken_Grotesk'] text-xs font-bold text-black tracking-widest uppercase mb-2">DESIGNED TO LAST</h4>
              <p className="font-['Hanken_Grotesk'] text-sm text-gray-600 leading-relaxed">
                Built for everyday wear without compromising comfort or style.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setCatalogFilter(null);
              setActiveView('shop');
            }}
            id="story-explore-craft-btn"
            className="self-start px-10 py-4 border border-black text-black font-['Hanken_Grotesk'] text-xs font-semibold tracking-widest hover:bg-black hover:text-white transition-all duration-300 pointer-events-auto cursor-pointer"
          >
            EXPLORE OUR STORY
          </button>
        </div>
      </section>

      {/* Newsletter Community Section */}
      <section className="bg-black text-white py-20 text-center px-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          <h2 className="font-['Bodoni_Moda'] text-3xl md:text-4xl font-semibold tracking-tight">Join the Archive</h2>
          <p className="font-['Hanken_Grotesk'] text-gray-400 text-sm md:text-base leading-relaxed">
            Receive early access to seasonal collections, private drop archives, and tailored sartorial updates directly to your inbox.
          </p>

          {newsletterSuccess ? (
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="p-6 bg-neutral-900 border border-neutral-800 rounded flex flex-col items-center gap-2"
            >
              <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
              <span className="font-['Hanken_Grotesk'] text-sm font-semibold tracking-wider text-green-400">
                REGISTRATION SUBMITTED SUCCESSFULLY
              </span>
              <p className="text-xs text-gray-400">You are now part of the private DUODRIP archive circle.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col md:flex-row gap-4 mt-4">
              <input
                type="email"
                required
                placeholder="YOUR EMAIL ADDRESS"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 bg-transparent border-b border-white/30 text-white focus:border-white outline-none py-4 font-['Hanken_Grotesk'] text-xs tracking-widest uppercase focus:outline-none placeholder-gray-500"
              />
              <button
                type="submit"
                id="newsletter-subscribe-btn"
                className="px-10 py-4 bg-white text-black font-['Hanken_Grotesk'] text-xs font-semibold tracking-widest hover:bg-neutral-200 transition-colors uppercase self-center md:self-auto cursor-pointer"
              >
                SUBSCRIBE
              </button>
            </form>
          )}
        </div>
      </section>
    </motion.div>
  );
}
