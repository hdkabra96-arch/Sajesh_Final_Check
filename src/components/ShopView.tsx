import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, FilterState, SortingType } from '../types';
import { Heart, SlidersHorizontal, RefreshCw, ShoppingCart, ShoppingBag, ArrowUpDown, ChevronDown } from 'lucide-react';

interface ShopViewProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: 'M' | 'L' | 'XL' | 'XXL') => void;
  onToggleFavorite: (product: Product) => void;
  favorites: string[];
  initialCategoryFilter: 'Oversized' | 'Polo' | 'Graphic' | 'Premium' | 'Minimalist' | null;
  setInitialCategoryFilter: (category: 'Oversized' | 'Polo' | 'Graphic' | 'Premium' | 'Minimalist' | null) => void;
}

const AVAILABLE_SIZES = ['M', 'L', 'XL', 'XXL'] as const;

export default function ShopView({
  products,
  onQuickView,
  onAddToCart,
  onToggleFavorite,
  favorites,
  initialCategoryFilter,
  setInitialCategoryFilter
}: ShopViewProps) {
  // Filters State
  const [filters, setFilters] = React.useState<FilterState>({
    inStock: false,
    preOrder: false,
    selectedSize: null,
    selectedColors: [],
    maxPrice: 1500,
  });

  const [sorting, setSorting] = React.useState<SortingType>('Newest');
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);

  // Clear filters
  const handleClearFilters = () => {
    setFilters({
      inStock: false,
      preOrder: false,
      selectedSize: null,
      selectedColors: [],
      maxPrice: 1500,
    });
    setInitialCategoryFilter(null);
  };

  const handleSizeClick = (size: 'M' | 'L' | 'XL' | 'XXL') => {
    setFilters(prev => ({
      ...prev,
      selectedSize: prev.selectedSize === size ? null : size,
    }));
  };

  // Filter and Sort the product list
  const filteredProducts = React.useMemo(() => {
    return products
      .filter((p) => {
        // Category Filter
        if (initialCategoryFilter && p.category !== initialCategoryFilter) {
          return false;
        }
        // In-Stock Availability
        if (filters.inStock && !p.inStock) {
          return false;
        }
        // Pre-Order Availability
        if (filters.preOrder && !p.preOrder) {
          return false;
        }
        // Size Filter
        if (filters.selectedSize && !p.sizes.includes(filters.selectedSize)) {
          return false;
        }
        // Price Filter
        if (p.price > filters.maxPrice) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sorting === 'PriceHighToLow') {
          return b.price - a.price;
        }
        if (sorting === 'PriceLowToHigh') {
          return a.price - b.price;
        }
        if (sorting === 'BestSellers') {
          // pre-defined premium items
          return (b.isLimited ? 1 : 0) - (a.isLimited ? 1 : 0);
        }
        // "Newest" sort: default ordering or isNew priority
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      });
  }, [products, initialCategoryFilter, filters, sorting]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-[1440px] mx-auto px-6 md:px-16 pt-24 pb-16"
    >
      {/* Category Header Banner */}
      <div className="relative bg-[#efeded] border border-black/5 py-12 px-8 mb-10 text-left overflow-hidden">
        <div className="absolute right-0 top-0 opacity-15 hidden md:block">
          <span className="font-['Bodoni_Moda'] text-9xl font-bold italic select-none">
            Essentials
          </span>
        </div>
        <span className="font-['Hanken_Grotesk'] text-[10px] tracking-widest text-gray-500 font-bold uppercase">
          DUODRIP ARCHIVE COLLECTION
        </span>
        <h1 className="font-['Bodoni_Moda'] text-4xl md:text-5xl font-black text-black tracking-tight mt-1">
          {initialCategoryFilter ? `${initialCategoryFilter} Collection` : 'Oversized Essentials'}
        </h1>
        <p className="font-['Hanken_Grotesk'] text-sm text-gray-600 mt-2 max-w-xl">
          Designed with boxy luxury drapes, tight heavyweight mock necks, and high stroke fabric weaves built to endure seasonless lifetimes.
        </p>

        {initialCategoryFilter && (
          <button
            onClick={() => setInitialCategoryFilter(null)}
            className="mt-4 px-4 py-1.5 bg-black text-white font-['Hanken_Grotesk'] text-[10px] font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors"
          >
            Clear Category Filter: {initialCategoryFilter} ✕
          </button>
        )}
      </div>

      {/* Mobile filter toggles */}
      <div className="flex md:hidden justify-between items-center py-4 border-b border-black/10 mb-6">
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="flex items-center gap-2 font-['Hanken_Grotesk'] text-xs font-semibold tracking-widest uppercase cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter & Size
        </button>

        <div className="relative">
          <select
            value={sorting}
            onChange={(e) => setSorting(e.target.value as SortingType)}
            className="none select-none bg-transparent font-['Hanken_Grotesk'] text-xs font-semibold tracking-widest uppercase focus:outline-none cursor-pointer"
          >
            <option value="Newest">Newest Drops</option>
            <option value="BestSellers">Best Sellers</option>
            <option value="PriceLowToHigh">Price: Low-High</option>
            <option value="PriceHighToLow">Price: High-Low</option>
          </select>
        </div>
      </div>

      {/* Main Grid Structure (Filters + Cards Side by Side) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Left Side Filters (Desktop only, or sticky) */}
        <aside className={`md:block col-span-1 border-r border-black/5 pr-6 ${
          mobileFilterOpen ? 'block' : 'hidden'
        } space-y-8 text-left`}>
          {/* Header Action */}
          <div className="flex justify-between items-center pb-4 border-b border-black/5">
            <h2 className="font-['Hanken_Grotesk'] text-xs font-bold tracking-widest uppercase text-black">
              FILTER PRODUCTS
            </h2>
            <button
              onClick={handleClearFilters}
              id="clear-filters-btn"
              className="flex items-center gap-1.5 font-['Hanken_Grotesk'] text-[10px] tracking-widest font-semibold hover:text-black text-gray-500 hover:underline transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              RESET
            </button>
          </div>

          {/* Availability (Checkboxes) */}
          <div className="space-y-3">
            <h3 className="font-['Hanken_Grotesk'] text-xs font-semibold tracking-widest uppercase text-black">
              Availability
            </h3>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => setFilters(p => ({ ...p, inStock: e.target.checked }))}
                  className="rounded border-gray-300 text-black focus:ring-black w-4 h-4"
                />
                <span className="font-['Hanken_Grotesk'] text-xs font-medium text-gray-700">IN STOCK ONLY</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filters.preOrder}
                  onChange={(e) => setFilters(p => ({ ...p, preOrder: e.target.checked }))}
                  className="rounded border-gray-300 text-black focus:ring-black w-4 h-4"
                />
                <span className="font-['Hanken_Grotesk'] text-xs font-medium text-gray-700">PRE-ORDER ONLY</span>
              </label>
            </div>
          </div>

          {/* Size Swatches */}
          <div className="space-y-4">
            <h3 className="font-['Hanken_Grotesk'] text-xs font-semibold tracking-widest uppercase text-black">
              Sizes
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {AVAILABLE_SIZES.map((size) => {
                const isActive = filters.selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => handleSizeClick(size)}
                    className={`h-11 border text-[11px] font-['Hanken_Grotesk'] font-bold tracking-widest transition-all cursor-pointer ${
                      isActive
                        ? 'border-black bg-black text-white'
                        : 'border-neutral-300 bg-white text-gray-850 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-['Hanken_Grotesk'] text-xs font-semibold tracking-widest uppercase text-black">
                Max Price
              </h3>
              <span className="font-['Hanken_Grotesk'] text-xs font-bold text-black border border-current px-2 py-0.5">
                ₹{filters.maxPrice} INR
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="1500"
              step="50"
              value={filters.maxPrice}
              onChange={(e) => setFilters(p => ({ ...p, maxPrice: parseInt(e.target.value) }))}
              className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black"
            />
            <div className="flex justify-between text-[10px] font-mono text-gray-500">
              <span>₹100</span>
              <span>₹800</span>
              <span>₹1500</span>
            </div>
          </div>
        </aside>

        {/* Right Side Products (Cards Grid with Sort bar) */}
        <section className="col-span-1 md:col-span-3 text-left">
          {/* Header Action panel */}
          <div className="hidden md:flex justify-between items-center pb-4 border-b border-black/5 mb-8">
            <span className="font-['Hanken_Grotesk'] text-xs font-semibold text-gray-500 tracking-wider">
              SHOWING <strong className="text-black">{filteredProducts.length}</strong> PREMIUM ARCHETYPE ITEMS
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <span className="font-['Hanken_Grotesk'] text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                SORT BY
              </span>
              <div className="relative inline-block border border-black/10 px-3 py-1.5 bg-white">
                <select
                  value={sorting}
                  onChange={(e) => setSorting(e.target.value as SortingType)}
                  className="bg-transparent border-none font-['Hanken_Grotesk'] text-xs font-semibold tracking-widest uppercase focus:outline-none cursor-pointer pr-1"
                >
                  <option value="Newest">Newest Drops</option>
                  <option value="BestSellers">Best Sellers</option>
                  <option value="PriceLowToHigh">Price: Low to High</option>
                  <option value="PriceHighToLow">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, pIdx) => {
                const isFav = favorites.includes(product.id);
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    key={`shop-prod-${product.id || pIdx}-${pIdx}`}
                    className="group flex flex-col h-full"
                    id={`product-card-${product.id}`}
                  >
                    {/* Visual Card Image */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#fbf9f9] border border-black/5 mb-4 group/card flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-102"
                      />

                      {/* Stock Info pill */}
                      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
                        {!product.inStock && product.preOrder && (
                          <span className="bg-orange-600 text-white text-[8px] font-bold tracking-widest px-2 py-0.5 uppercase">
                            PRE-ORDER
                          </span>
                        )}
                        {!product.inStock && !product.preOrder && (
                          <span className="bg-neutral-600 text-white text-[8px] font-bold tracking-widest px-2 py-0.5 uppercase">
                            SOLD OUT
                          </span>
                        )}
                      </div>

                      {/* Quick Add Overlay on Hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm opacity-0 translate-y-4 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-300 flex flex-col gap-1.5 z-20">
                        {product.inStock ? (
                          <>
                            <div className="flex gap-1 justify-center py-1">
                              {product.sizes.map(size => (
                                <button
                                  key={size}
                                  onClick={() => onAddToCart(product, size)}
                                  className="w-6 h-6 rounded-full border border-black/10 hover:border-black text-[9px] font-bold flex items-center justify-center transition-colors hover:bg-black hover:text-white cursor-pointer"
                                  title={`Quick Add size ${size}`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                            <button
                              onClick={() => onQuickView(product)}
                              className="w-full py-2 bg-black text-white hover:bg-neutral-800 font-['Hanken_Grotesk'] text-[10px] font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              QUICK ADD / CUSTOM
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => onQuickView(product)}
                            className="w-full py-2 bg-neutral-900 text-white disabled:opacity-50 font-['Hanken_Grotesk'] text-[10px] font-bold tracking-widest uppercase"
                          >
                            {product.preOrder ? "PRE-ORDER RESERVATION" : "SOLD OUT ARCHIVE"}
                          </button>
                        )}
                      </div>

                      {/* Side Actions (Favorite Toggler) */}
                      <button
                        onClick={() => onToggleFavorite(product)}
                        className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-sm flex items-center justify-center text-black transition-colors z-10"
                        aria-label="Add to Favorites"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500 border-none' : 'text-gray-705'}`} />
                      </button>

                      {/* New/Discount Badges */}
                      {product.originalPrice && (
                        <span className="absolute top-4 right-4 bg-red-600 text-white text-[9px] font-bold tracking-widest px-2 py-0.5 uppercase z-10">
                          SALE
                        </span>
                      )}
                    </div>

                    {/* Meta info layout */}
                    <div className="flex flex-col gap-1 px-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-['Hanken_Grotesk'] text-[10px] tracking-widest text-gray-500 font-bold uppercase">
                          {product.textColorCategory}
                        </span>
                        <span className="font-mono text-[9px] text-gray-400">
                          {product.sizes.join(', ')}
                        </span>
                      </div>
                      <h3
                        onClick={() => onQuickView(product)}
                        className="font-['Hanken_Grotesk'] text-sm font-semibold text-black cursor-pointer hover:underline truncate"
                      >
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-['Hanken_Grotesk'] text-sm font-bold text-black">
                          ₹{product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="font-['Hanken_Grotesk'] text-xs text-gray-450 line-through">
                            ₹{product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredProducts.length === 0 && (
              <div className="col-span-full py-20 text-center flex flex-col items-center justify-center border border-dashed border-black/10 rounded-lg p-6">
                <RefreshCw className="w-8 h-8 text-gray-400 rotate-12 mb-4 animate-spin-slow" />
                <h3 className="font-['Bodoni_Moda'] text-2xl font-bold text-black mb-2">No silhouette matched</h3>
                <p className="font-['Hanken_Grotesk'] text-sm text-gray-500 mb-6 max-w-sm">
                  We currently do not hold inventory matching these price or size criteria. Try adjusting the toggles.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2.5 bg-black text-white font-['Hanken_Grotesk'] text-xs font-semibold tracking-widest uppercase hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </motion.div>
        </section>
      </div>
    </motion.div>
  );
}
