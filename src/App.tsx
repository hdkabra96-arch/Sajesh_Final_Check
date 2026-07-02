import React from 'react';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, HERO_SLIDES, INITIAL_CATEGORIES } from './data';
import { Product, CartItem, RecentOrder, ActiveView, HeroSlide, CategoryItem, UserProfile } from './types';
import {
  fetchProductsFromDb,
  upsertProductInDb,
  deleteProductFromDb,
  fetchOrdersFromDb,
  insertOrderInDb,
  updateOrderStatusInDb,
  fetchHeroSlidesFromDb,
  saveHeroSlidesToDb,
  fetchCategoriesFromDb,
  saveCategoriesToDb,
  fetchUserProfilesFromDb,
  upsertUserProfileInDb
} from './supabaseClient';

// Importing Custom Layout Subcomponents
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StorefrontView from './components/StorefrontView';
import ShopView from './components/ShopView';
import AdminView from './components/AdminView';
import AdminLoginForm from './components/AdminLoginForm';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import PrivacyView from './components/PrivacyView';
import ShippingReturnsView from './components/ShippingReturnsView';
import CartDrawer from './components/CartDrawer';
import ProductQuickView from './components/ProductQuickView';
import UserProfileModal from './components/UserProfileModal';

import { Sparkles, Heart, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  // Navigation State
  const [activeView, setActiveView] = React.useState<ActiveView>('storefront');

  // Scroll to top on view changes
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [activeView]);

  // Hero Banners and Categories dynamic configurations
  const [heroSlides, setHeroSlides] = React.useState<HeroSlide[]>(() => {
    const cached = localStorage.getItem('duodrip_hero_slides');
    return cached ? JSON.parse(cached) : [];
  });

  const [categories, setCategories] = React.useState<CategoryItem[]>(() => {
    const cached = localStorage.getItem('duodrip_categories');
    return cached ? JSON.parse(cached) : INITIAL_CATEGORIES;
  });

  const updateHeroSlides = async (newSlides: HeroSlide[]) => {
    setHeroSlides(newSlides);
    localStorage.setItem('duodrip_hero_slides', JSON.stringify(newSlides));
    await saveHeroSlidesToDb(newSlides);
  };

  const updateCategories = async (newCategories: CategoryItem[]) => {
    setCategories(newCategories);
    localStorage.setItem('duodrip_categories', JSON.stringify(newCategories));
    await saveCategoriesToDb(newCategories);
  };

  // Core Dynamic Collections state (allows Admin panel edits to propagate instantly!)
  const [products, setProductsState] = React.useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrdersState] = React.useState<RecentOrder[]>(INITIAL_ORDERS);

  // Sync state with Supabase on mount
  React.useEffect(() => {
    async function syncSupabaseData() {
      try {
        console.log('🔄 Syncing storefront data with Supabase...');
        const dbProducts = await fetchProductsFromDb();
        const dbOrders = await fetchOrdersFromDb();
        const dbSlides = await fetchHeroSlidesFromDb();
        const dbCategories = await fetchCategoriesFromDb();
        const dbUserProfiles = await fetchUserProfilesFromDb();

        if (dbUserProfiles && dbUserProfiles.length > 0) {
          setUserProfiles(dbUserProfiles);
        }

        if (dbProducts && dbProducts.length > 0) {
          setProductsState(dbProducts);
        } else if (dbProducts && dbProducts.length === 0) {
          console.log('🌱 Seeding initial products to Supabase...');
          for (const p of INITIAL_PRODUCTS) {
            await upsertProductInDb(p);
          }
          setProductsState(INITIAL_PRODUCTS);
        }

        if (dbOrders && dbOrders.length > 0) {
          setOrdersState(dbOrders);
        } else if (dbOrders && dbOrders.length === 0) {
          console.log('🌱 Seeding initial orders to Supabase...');
          for (const o of INITIAL_ORDERS) {
            await insertOrderInDb(o);
          }
          setOrdersState(INITIAL_ORDERS);
        }

        if (dbSlides && dbSlides.length > 0) {
          setHeroSlides(dbSlides);
        } else if (dbSlides && dbSlides.length === 0) {
          console.log('🌱 Seeding initial slides to Supabase...');
          await saveHeroSlidesToDb(HERO_SLIDES);
          setHeroSlides(HERO_SLIDES);
        } else if (!dbSlides) {
          // If fetch failed and we have nothing cached, use HERO_SLIDES as fallback
          const cached = localStorage.getItem('duodrip_hero_slides');
          if (!cached) {
            setHeroSlides(HERO_SLIDES);
          }
        }

        if (dbCategories && dbCategories.length > 0) {
          setCategories(dbCategories);
        } else if (dbCategories && dbCategories.length === 0) {
          console.log('🌱 Seeding initial categories to Supabase...');
          await saveCategoriesToDb(INITIAL_CATEGORIES);
          setCategories(INITIAL_CATEGORIES);
        }
      } catch (err) {
        console.error('❌ Supabase synchronization failed:', err);
      }
    }
    syncSupabaseData();
  }, []);

  // Setters that also synchronize with Supabase database!
  const setProducts = (value: React.SetStateAction<Product[]>) => {
    setProductsState((prev) => {
      const next = typeof value === 'function' ? (value as Function)(prev) : value;
      
      // Sync mutations to database
      if (next.length > prev.length) {
        const added = next.filter(p => !prev.some(old => old.id === p.id));
        added.forEach(p => upsertProductInDb(p));
      } else if (next.length < prev.length) {
        const deleted = prev.filter(old => !next.some(p => p.id === old.id));
        deleted.forEach(p => deleteProductFromDb(p.id));
      } else {
        next.forEach((p) => {
          const old = prev.find(o => o.id === p.id);
          if (old && JSON.stringify(old) !== JSON.stringify(p)) {
            upsertProductInDb(p);
          }
        });
      }
      return next;
    });
  };

  const setOrders = (value: React.SetStateAction<RecentOrder[]>) => {
    setOrdersState((prev) => {
      const next = typeof value === 'function' ? (value as Function)(prev) : value;

      // Sync mutations to database
      if (next.length > prev.length) {
        const added = next.filter(o => !prev.some(old => old.id === o.id));
        added.forEach(o => insertOrderInDb(o));
      } else {
        next.forEach((o) => {
          const old = prev.find(oldOrder => oldOrder.id === o.id);
          if (old && old.status !== o.status) {
            updateOrderStatusInDb(o.id, o.status);
          }
        });
      }
      return next;
    });
  };


  // Cart Bag State
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [cartDrawerOpen, setCartDrawerOpen] = React.useState(false);

  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = React.useState<boolean>(false);

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    triggerToast("Administrative session verified. Systems authorized.");
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    triggerToast("Administrative session closed. Systems secured.");
  };

  // User Profile State loaded from local database memory
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(() => {
    const cached = localStorage.getItem('duodrip_user_profile');
    return cached ? JSON.parse(cached) : null;
  });
  const [userProfiles, setUserProfiles] = React.useState<UserProfile[]>([]);
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);

  const handleSaveProfile = async (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('duodrip_user_profile', JSON.stringify(profile));
    triggerToast(`Customer Profile for ${profile.name} saved successfully.`);

    setUserProfiles((prev) => {
      const exists = prev.some(p => p.email === profile.email);
      if (exists) {
        return prev.map(p => p.email === profile.email ? profile : p);
      } else {
        return [profile, ...prev];
      }
    });

    await upsertUserProfileInDb(profile);
  };

  const handleLogoutProfile = () => {
    setUserProfile(null);
    localStorage.removeItem('duodrip_user_profile');
    triggerToast("Customer Profile disconnected.");
  };

  // Favorites/Wishlist State
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [showFavoritesToast, setShowFavoritesToast] = React.useState(false);
  const [favoritesToastMsg, setFavoritesToastMsg] = React.useState('');

  // Quick View State
  const [quickViewProduct, setQuickViewProduct] = React.useState<Product | null>(null);

  // Catalog global category pre-filter
  const [catalogFilter, setCatalogFilter] = React.useState<'Oversized' | 'Polo' | 'Graphic' | 'Premium' | 'Minimalist' | null>(null);

  // Search filter
  const [globalSearchTerm, setGlobalSearchTerm] = React.useState('');

  // Temporary Success indicator Toast
  const [toastMessage, setToastMessage] = React.useState('');
  const [showToast, setShowToast] = React.useState(false);

  // Trigger smooth success notifications
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Add Item to Shopping Bag
  const handleAddToCart = (product: Product, size: 'M' | 'L' | 'XL' | 'XXL') => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prevCart, { product, selectedSize: size, quantity: 1 }];
      }
    });

    triggerToast(`Added 1x ${product.name} (Size ${size}) to Bag.`);
  };

  // Adjust Shopping Bag quantites
  const handleUpdateCartQuantity = (productId: string, size: string, change: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId && item.selectedSize === size) {
            const nextQty = item.quantity + change;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  // Remove Item from Shopping Bag
  const handleRemoveCartItem = (productId: string, size: string) => {
    setCart((prevCart) => prevCart.filter(item => !(item.product.id === productId && item.selectedSize === size)));
    triggerToast("Removed item from bag.");
  };

  // Clear Bag on checkout finalization
  const handleClearCart = () => {
    setCart([]);
  };

  // Add Checkout order into Log Database dynamically!
  const handleAddOrder = (newOrderData: {
    customerName: string;
    productName: string;
    amount: number;
    phone?: string;
    email?: string;
    address?: string;
    productId?: string;
    size?: string;
    color?: string;
    quantity?: number;
    whatsAppSent?: boolean;
    status?: 'Shipped' | 'Processing' | 'Delivered' | 'Hold' | 'Pending';
  }) => {
    const initials = newOrderData.customerName
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const newOrder: RecentOrder = {
      id: `STM-${Math.floor(100000 + Math.random() * 900000)}`,
      customerInitial: initials || "C",
      customerName: newOrderData.customerName,
      productName: newOrderData.productName,
      amount: newOrderData.amount,
      status: newOrderData.status || 'Pending',
      date: new Date().toISOString().split('T')[0],
      phone: newOrderData.phone,
      email: newOrderData.email,
      address: newOrderData.address,
      productId: newOrderData.productId,
      size: newOrderData.size,
      color: newOrderData.color,
      quantity: newOrderData.quantity,
      whatsAppSent: newOrderData.whatsAppSent ?? true
    };

    setOrders((prev) => [newOrder, ...prev]);
  };

  // Favourites Wishlist Toggle
  const handleToggleFavorite = (product: Product) => {
    setFavorites((prev) => {
      const isFav = prev.includes(product.id);
      if (isFav) {
        setFavoritesToastMsg(`Removed ${product.name} from Wishlist.`);
        setShowFavoritesToast(true);
        setTimeout(() => setShowFavoritesToast(false), 3000);
        return prev.filter((id) => id !== product.id);
      } else {
        setFavoritesToastMsg(`Added ${product.name} to Wishlist.`);
        setShowFavoritesToast(true);
        setTimeout(() => setShowFavoritesToast(false), 3000);
        return [...prev, product.id];
      }
    });
  };

  // Direct wishlist view triggers shop mode with filtered items or a prompt toast
  const handleFavoritesClick = () => {
    if (favorites.length === 0) {
      triggerToast("Your Wishlist is empty. Explore products to add favorites.");
    } else {
      setActiveView('shop');
      triggerToast(`Showing your ${favorites.length} saved favorites in shop.`);
    }
  };

  // Search proxy selector
  const handleGlobalSearch = (term: string) => {
    setGlobalSearchTerm(term);
    if (activeView !== 'shop') {
      setActiveView('shop');
    }
  };

  // Total items in bag count
  const cartItemCount = React.useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Combined product filter source for Shop
  const finalFilteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      const matchSearch = globalSearchTerm
        ? p.name.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
          (p.color && p.color.toLowerCase().includes(globalSearchTerm.toLowerCase())) ||
          p.textColorCategory.toLowerCase().includes(globalSearchTerm.toLowerCase())
        : true;

      // Also filter search-driven favorites if requested
      return matchSearch;
    });
  }, [products, globalSearchTerm]);

  return (
    <div className="flex flex-col min-h-screen bg-[#fbf9f9] text-neutral-900 overflow-x-hidden relative">
      {/* Main Orchestrated View Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={(v) => {
          setActiveView(v);
          setGlobalSearchTerm(''); // Clear term on navigation
        }}
        cartCount={cartItemCount}
        onCartClick={() => setCartDrawerOpen(true)}
        favoritesCount={favorites.length}
        onFavoritesClick={handleFavoritesClick}
        onSearch={handleGlobalSearch}
        userProfile={userProfile}
        onProfileClick={() => setProfileModalOpen(true)}
      />

      {/* Floating Action Notifications alerts (Bag & Fav) */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 left-8 z-[100] bg-black text-white p-4 shadow-2xl flex items-center gap-3 border border-neutral-800"
          >
            <Bell className="w-4 h-4 text-green-400" />
            <span className="font-['Hanken_Grotesk'] text-xs font-bold tracking-widest uppercase text-left">
              {toastMessage}
            </span>
          </motion.div>
        )}

        {showFavoritesToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 left-8 z-[100] bg-[#ba1a1a] text-white p-4 shadow-2xl flex items-center gap-3 border border-red-750"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span className="font-['Hanken_Grotesk'] text-xs font-bold tracking-widest uppercase text-left">
              {favoritesToastMsg}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Context Section Switch Frame */}
      <div className="flex-1 mt-28">
        <AnimatePresence mode="wait">
          {activeView === 'storefront' && (
            <div key="storefront-wrap">
              <StorefrontView
                setActiveView={setActiveView}
                onQuickView={setQuickViewProduct}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
                setCatalogFilter={setCatalogFilter}
                heroSlides={heroSlides}
                categories={categories}
              />
            </div>
          )}

          {activeView === 'shop' && (
            <div key="shop-wrap">
              <ShopView
                products={finalFilteredProducts}
                onQuickView={setQuickViewProduct}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
                initialCategoryFilter={catalogFilter}
                setInitialCategoryFilter={setCatalogFilter}
              />
            </div>
          )}

          {activeView === 'admin' && (
            <div key="admin-wrap">
              {isAdminLoggedIn ? (
                <AdminView
                  products={products}
                  setProducts={setProducts}
                  orders={orders}
                  setOrders={setOrders}
                  heroSlides={heroSlides}
                  setHeroSlides={updateHeroSlides}
                  categories={categories}
                  setCategories={updateCategories}
                  userProfiles={userProfiles}
                  onAdminLogout={handleAdminLogout}
                />
              ) : (
                <AdminLoginForm onLoginSuccess={handleAdminLoginSuccess} />
              )}
            </div>
          )}

          {activeView === 'about' && (
            <div key="about-wrap">
              <AboutView />
            </div>
          )}

          {activeView === 'contact' && (
            <div key="contact-wrap">
              <ContactView />
            </div>
          )}

          {activeView === 'privacy' && (
            <div key="privacy-wrap">
              <PrivacyView />
            </div>
          )}

          {activeView === 'shipping-returns' && (
            <div key="shipping-returns-wrap">
              <ShippingReturnsView />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Shared Global Layout Footer */}
      <Footer setActiveView={setActiveView} />

      {/* Shopping Cart Drawer Side panel */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onAddOrder={handleAddOrder}
        userProfile={userProfile}
        onSaveProfile={handleSaveProfile}
        onOpenProfileModal={() => setProfileModalOpen(true)}
      />

      {/* Dynamic Popover Product Quickview Modal */}
      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
        favorites={favorites}
        userProfile={userProfile}
      />

      {/* Shared Global Layout Customer Profile Center Modal */}
      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        userProfile={userProfile}
        onSaveProfile={handleSaveProfile}
        onLogoutProfile={handleLogoutProfile}
        orders={orders}
      />
    </div>
  );
}
