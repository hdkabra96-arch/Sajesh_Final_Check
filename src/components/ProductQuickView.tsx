import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, UserProfile } from '../types';
import { X, Heart, Shield, RotateCcw, Truck, Shirt } from 'lucide-react';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: 'M' | 'L' | 'XL' | 'XXL') => void;
  onToggleFavorite: (product: Product) => void;
  favorites: string[];
  userProfile: UserProfile | null;
}

export default function ProductQuickView({
  product,
  onClose,
  onAddToCart,
  onToggleFavorite,
  favorites,
  userProfile
}: ProductQuickViewProps) {
  const [selectedSize, setSelectedSize] = React.useState<'M' | 'L' | 'XL' | 'XXL'>('M');
  const [fitPreference, setFitPreference] = React.useState<'Standard Boxy' | 'Oversized Drape' | 'Sartorial Tight'>('Standard Boxy');
  const [activeImage, setActiveImage] = React.useState<string>('');

  React.useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [product?.id, product?.image]);

  React.useEffect(() => {
    if (userProfile && userProfile.preferredSize) {
      setSelectedSize(userProfile.preferredSize as any);
    } else {
      setSelectedSize('M');
    }
  }, [product?.id, userProfile?.preferredSize]);

  const allImages = React.useMemo(() => {
    if (!product) return [];
    const list = [product.image];
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach(img => {
        if (img && img.trim() && !list.includes(img)) {
          list.push(img);
        }
      });
    }
    return list;
  }, [product?.image, product?.images]);

  if (!product) return null;

  const isFavorite = favorites.includes(product.id);

  // Dynamic description mapping based on categories
  const getDescription = (categoryString: string) => {
    if (categoryString === 'Oversized') {
      return "Made with robust 280GSM long-staple cotton fibers, double-needle stitched cuffs, and an exactingly structured neckline designed to drop perfectly around the waist. Highly durable yet insanely soft to touch.";
    }
    if (categoryString === 'Polo') {
      return "Woven from a delicate lightweight silk and organic combed-cotton blend. Features a retro ribbed spread collar and hidden placket for extremely clean minimalism suited for smart-casual wear.";
    }
    return "Featuring custom digital prints inspired by architectural silhouettes and structures. Clean back hemline drape and screen-printed in our Milan studio using non-toxic water-based ink dabs.";
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
        {/* Backdrop Trigger close */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Modal Window Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[#fbf9f9] border border-black/15 shadow-2xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 relative z-10 rounded-none overflow-hidden"
          id="product-quickview-frame"
        >
          {/* Close trigger button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-white/90 border border-black/10 rounded-full flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors z-20 cursor-pointer"
            title="Close Quickview"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column (Product Image Showcase) */}
          <div className="md:col-span-6 bg-[#fbf9f9] aspect-[3/4] relative flex items-center justify-center overflow-hidden border-r border-black/5">
            <img
              src={activeImage || product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain transition-transform duration-1000 hover:scale-102"
            />

            {/* Floating Minimalist Multiple Image Thumbnail Track */}
            {allImages.length > 1 && (
              <div 
                id="product-gallery-track" 
                className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-[25] bg-white/60 backdrop-blur-md p-1.5 border border-black/5 rounded shadow-sm max-h-[75%] overflow-y-auto"
              >
                {allImages.map((img, idx) => {
                  const isActive = activeImage === img;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      className={`w-9 h-12 border transition-all cursor-pointer relative overflow-hidden shrink-0 ${
                        isActive 
                          ? 'border-black scale-105 ring-1 ring-black/15 shadow-sm' 
                          : 'border-transparent opacity-60 hover:opacity-100 hover:scale-102'
                      }`}
                      title={`View image ${idx + 1}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain bg-[#fbf9f9]" referrerPolicy="no-referrer" />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tag Overlay */}
            {product.isNew && (
              <span className="absolute top-4 left-4 bg-black text-white text-[9px] font-['Hanken_Grotesk'] font-bold tracking-widest px-3 py-1.5 uppercase z-[5]">
                NEW DESIGN Drops
              </span>
            )}
            {product.isLimited && (
              <span className="absolute top-4 left-4 bg-[#ba1a1a] text-white text-[9px] font-['Hanken_Grotesk'] font-bold tracking-widest px-3 py-1.5 uppercase z-[5]">
                LIMITED COLLECTIVE RELEASE
              </span>
            )}
          </div>

          {/* Right Column (Tailoring selection configuration panels) */}
          <div className="md:col-span-6 p-6 md:p-8 text-left flex flex-col justify-between">
            <div className="space-y-4">
              {/* Category tags */}
              <div className="flex justify-between items-baseline">
                <span className="font-['Hanken_Grotesk'] text-[10px] tracking-widest text-[#ba1a1a] font-bold uppercase">
                  {product.textColorCategory} • {product.category.toUpperCase()}
                </span>
                <span className="font-mono text-xs text-gray-400 uppercase">
                  IN STOCK SKU
                </span>
              </div>

              {/* Title Headings and Prices */}
              <h2 className="font-['Bodoni_Moda'] text-2xl md:text-3.5xl font-extrabold text-black tracking-tight leading-tight">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-3 pt-1 border-b border-black/5 pb-3">
                <span className="font-['Hanken_Grotesk'] text-2xl font-bold text-black">
                  ₹{product.price.toFixed(2)} INR
                </span>
                {product.originalPrice && (
                  <span className="font-['Hanken_Grotesk'] text-sm text-gray-400 line-through">
                    ₹{product.originalPrice.toFixed(2)}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="text-[10px] font-bold text-red-650 bg-red-50 px-2 py-0.5 rounded ml-2">
                    SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                )}
              </div>

              {/* Description Body paragraph */}
              <p className="font-['Hanken_Grotesk'] text-xs text-gray-650 leading-relaxed font-sans">
                {getDescription(product.category)}
              </p>

              {/* Specs parameters lists */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 py-2 text-[11px] text-gray-500 font-sans border-b border-black/5 pb-4">
                <span className="flex items-center gap-1.5">
                  <Shirt className="w-3.5 h-3.5 text-gray-450" />
                  Premium Cotton Linen
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-gray-450" />
                  Complementary air shipping
                </span>
                <span className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-gray-450" />
                  Secure 30-day returns
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-gray-450" />
                  Heritage authentic tag
                </span>
              </div>

              {/* Sizes Selector */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold tracking-widest text-[#5d5f5f] uppercase">
                  <span>SELECT ARCHITYPE SIZE</span>
                  <span className="underline hover:text-black cursor-pointer uppercase">SIZE DIRECTORY INCHES</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-11 border text-xs font-bold font-mono transition-all cursor-pointer ${
                          isSelected
                            ? 'border-black bg-black text-white'
                            : 'border-neutral-300 text-gray-600 hover:border-black'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fit profile Preference (Sartorial / Standard) */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                  Sartorial silhouette drape selector
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['Standard Boxy', 'Oversized Drape', 'Sartorial Tight'] as const).map((fit) => {
                    const isSelected = fitPreference === fit;
                    return (
                      <button
                        key={fit}
                        onClick={() => setFitPreference(fit)}
                        style={{ fontSize: '10px' }}
                        className={`py-2 text-center border font-bold uppercase tracking-wider cursor-pointer ${
                          isSelected
                            ? 'border-black bg-neutral-900 text-white'
                            : 'border-neutral-200 text-gray-500 hover:border-black'
                        }`}
                      >
                        {fit}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions Row: Add to Bag and Favourite slider */}
            <div className="flex gap-4 pt-6 mt-6 border-t border-black/10">
              <button
                onClick={() => {
                  onAddToCart(product, selectedSize);
                  onClose();
                }}
                className="flex-1 py-4 bg-black text-white hover:bg-neutral-850 font-['Hanken_Grotesk'] text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>ADD SILHOUETTE TO BAG</span>
              </button>

              <button
                onClick={() => onToggleFavorite(product)}
                className="w-14 h-14 border border-black/10 flex items-center justify-center hover:border-black transition-colors relative cursor-pointer"
                aria-label="Add to wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500 border-none' : 'text-gray-500'}`} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
