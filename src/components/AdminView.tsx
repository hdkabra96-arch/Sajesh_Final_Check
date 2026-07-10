import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, RecentOrder, AdminSection, HeroSlide, CategoryItem, UserProfile } from '../types';
import { InstagramPost, PRESET_IG_POSTS, generateFeedForUsername } from './InstagramFeed';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Users,
  Percent,
  Plus,
  Trash2,
  Edit2,
  Check,
  ChevronRight,
  Filter,
  BarChart,
  ShoppingBag as BagIcon,
  RefreshCw,
  Search,
  Eye,
  ExternalLink,
  Upload,
  Instagram,
  Link2,
  LogOut,
  Sparkles,
  RefreshCcw,
  PlusCircle,
  Lock,
  X
} from 'lucide-react';

interface AdminViewProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: RecentOrder[];
  setOrders: React.Dispatch<React.SetStateAction<RecentOrder[]>>;
  heroSlides: HeroSlide[];
  setHeroSlides: (slides: HeroSlide[]) => void;
  categories: CategoryItem[];
  setCategories: (categories: CategoryItem[]) => void;
  userProfiles?: UserProfile[];
  onAdminLogout?: () => void;
}

export default function AdminView({
  products,
  setProducts,
  orders,
  setOrders,
  heroSlides,
  setHeroSlides,
  categories,
  setCategories,
  userProfiles = [],
  onAdminLogout
}: AdminViewProps) {
  const [activeSection, setActiveSection] = React.useState<AdminSection>('dashboard');
  const [customerTab, setCustomerTab] = React.useState<'registered' | 'invoice'>('registered');

  // Instagram Configuration Management States
  const [igEnabled, setIgEnabled] = React.useState<boolean>(() => {
    return localStorage.getItem('duodrip_ig_enabled') !== 'false';
  });
  const [igConnected, setIgConnected] = React.useState<boolean>(() => {
    return localStorage.getItem('duodrip_ig_connected') === 'true';
  });
  const [igUsername, setIgUsername] = React.useState<string>(() => {
    return localStorage.getItem('duodrip_ig_username') || 'duodrip_official';
  });
  const [igToken, setIgToken] = React.useState<string>(() => {
    return localStorage.getItem('duodrip_ig_token') || '';
  });
  const [igClientId, setIgClientId] = React.useState<string>(() => {
    return localStorage.getItem('duodrip_ig_client_id') || '4920159480159';
  });
  const [igClientSecret, setIgClientSecret] = React.useState<string>(() => {
    return localStorage.getItem('duodrip_ig_client_secret') || '';
  });
  const [igFbPage, setIgFbPage] = React.useState<string>(() => {
    return localStorage.getItem('duodrip_ig_fb_page') || 'DUODRIP Swiss Brand';
  });
  const [igLimit, setIgLimit] = React.useState<number>(() => {
    return Number(localStorage.getItem('duodrip_ig_limit')) || 12;
  });
  const [igSpeed, setIgSpeed] = React.useState<number>(() => {
    return Number(localStorage.getItem('duodrip_ig_speed')) || 3000;
  });
  const [igAutoplay, setIgAutoplay] = React.useState<boolean>(() => {
    return localStorage.getItem('duodrip_ig_autoplay') !== 'false';
  });
  const [igArrows, setIgArrows] = React.useState<boolean>(() => {
    return localStorage.getItem('duodrip_ig_arrows') !== 'false';
  });
  const [igDots, setIgDots] = React.useState<boolean>(() => {
    return localStorage.getItem('duodrip_ig_dots') !== 'false';
  });
  const [igFilter, setIgFilter] = React.useState<'both' | 'posts' | 'reels'>(() => {
    return (localStorage.getItem('duodrip_ig_filter') || 'both') as 'both' | 'posts' | 'reels';
  });
  const [igAutoSync, setIgAutoSync] = React.useState<boolean>(() => {
    return localStorage.getItem('duodrip_ig_autosync') !== 'false';
  });
  const [igLastSync, setIgLastSync] = React.useState<string>(() => {
    return localStorage.getItem('duodrip_ig_last_sync') || 'Never synchronized';
  });
  const [igPosts, setIgPosts] = React.useState<InstagramPost[]>(() => {
    const saved = localStorage.getItem('duodrip_ig_posts');
    return saved ? JSON.parse(saved) : PRESET_IG_POSTS;
  });

  // Moderation Lists
  const [igHiddenIds, setIgHiddenIds] = React.useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('duodrip_ig_hidden_ids') || '[]');
  });
  const [igPinnedIds, setIgPinnedIds] = React.useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('duodrip_ig_pinned_ids') || '[]');
  });
  const [igApprovedIds, setIgApprovedIds] = React.useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('duodrip_ig_approved_ids') || '[]');
  });
  const [igApprovalRequired, setIgApprovalRequired] = React.useState<boolean>(() => {
    return localStorage.getItem('duodrip_ig_approval_required') === 'true';
  });

  // Simulator indicators
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [showOauthPopup, setShowOauthPopup] = React.useState(false);
  const [oauthStep, setOauthStep] = React.useState(1);

  // State to simulate adding a new post in IG from Admin
  const [showIgAddModal, setShowIgAddModal] = React.useState(false);
  const [newIgPost, setNewIgPost] = React.useState<{
    type: 'post' | 'reel';
    mediaUrl: string;
    caption: string;
    likeCount: number;
    commentCount: number;
  }>({
    type: 'post',
    mediaUrl: '',
    caption: '',
    likeCount: 220,
    commentCount: 14
  });

  const updateIgEnabled = (val: boolean) => {
    setIgEnabled(val);
    localStorage.setItem('duodrip_ig_enabled', String(val));
  };

  const updateIgConnected = (val: boolean) => {
    setIgConnected(val);
    localStorage.setItem('duodrip_ig_connected', String(val));
    if (!val) {
      localStorage.removeItem('duodrip_ig_token');
      setIgToken('');
    }
  };

  const updateIgUsername = (val: string) => {
    setIgUsername(val);
    localStorage.setItem('duodrip_ig_username', val);
    
    // Automatically regenerate feed for the update
    const generated = generateFeedForUsername(val);
    setIgPosts(generated);
    localStorage.setItem('duodrip_ig_posts', JSON.stringify(generated));
    localStorage.setItem('duodrip_ig_posts_for_username', val);

    // Auto-approve all newly generated posts and clear old blacklisted/pinned post IDs
    const generatedIds = generated.map(p => p.id);
    setIgApprovedIds(generatedIds);
    localStorage.setItem('duodrip_ig_approved_ids', JSON.stringify(generatedIds));
    setIgHiddenIds([]);
    localStorage.setItem('duodrip_ig_hidden_ids', JSON.stringify([]));
    setIgPinnedIds([]);
    localStorage.setItem('duodrip_ig_pinned_ids', JSON.stringify([]));
    setIgApprovalRequired(false);
    localStorage.setItem('duodrip_ig_approval_required', 'false');

    const now = new Date();
    const formatted = now.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    setIgLastSync(formatted);
    localStorage.setItem('duodrip_ig_last_sync', formatted);
  };

  const updateIgToken = (val: string) => {
    setIgToken(val);
    localStorage.setItem('duodrip_ig_token', val);
  };

  const updateIgClientId = (val: string) => {
    setIgClientId(val);
    localStorage.setItem('duodrip_ig_client_id', val);
  };

  const updateIgClientSecret = (val: string) => {
    setIgClientSecret(val);
    localStorage.setItem('duodrip_ig_client_secret', val);
  };

  const updateIgFbPage = (val: string) => {
    setIgFbPage(val);
    localStorage.setItem('duodrip_ig_fb_page', val);
  };

  const updateIgLimit = (val: number) => {
    setIgLimit(val);
    localStorage.setItem('duodrip_ig_limit', String(val));
  };

  const updateIgSpeed = (val: number) => {
    setIgSpeed(val);
    localStorage.setItem('duodrip_ig_speed', String(val));
  };

  const updateIgAutoplay = (val: boolean) => {
    setIgAutoplay(val);
    localStorage.setItem('duodrip_ig_autoplay', String(val));
  };

  const updateIgArrows = (val: boolean) => {
    setIgArrows(val);
    localStorage.setItem('duodrip_ig_arrows', String(val));
  };

  const updateIgDots = (val: boolean) => {
    setIgDots(val);
    localStorage.setItem('duodrip_ig_dots', String(val));
  };

  const updateIgFilter = (val: 'both' | 'posts' | 'reels') => {
    setIgFilter(val);
    localStorage.setItem('duodrip_ig_filter', val);
  };

  const updateIgAutoSync = (val: boolean) => {
    setIgAutoSync(val);
    localStorage.setItem('duodrip_ig_autosync', String(val));
  };

  const updateIgLastSync = (val: string) => {
    setIgLastSync(val);
    localStorage.setItem('duodrip_ig_last_sync', val);
  };

  const updateIgPostsList = (updated: InstagramPost[]) => {
    setIgPosts(updated);
    localStorage.setItem('duodrip_ig_posts', JSON.stringify(updated));
  };

  // Moderation Toggle Updates
  const toggleHidden = (id: string) => {
    const list = igHiddenIds.includes(id) 
      ? igHiddenIds.filter(item => item !== id)
      : [...igHiddenIds, id];
    setIgHiddenIds(list);
    localStorage.setItem('duodrip_ig_hidden_ids', JSON.stringify(list));
  };

  const togglePinned = (id: string) => {
    const list = igPinnedIds.includes(id)
      ? igPinnedIds.filter(item => item !== id)
      : [...igPinnedIds, id];
    setIgPinnedIds(list);
    localStorage.setItem('duodrip_ig_pinned_ids', JSON.stringify(list));
  };

  const toggleApproved = (id: string) => {
    const list = igApprovedIds.includes(id)
      ? igApprovedIds.filter(item => item !== id)
      : [...igApprovedIds, id];
    setIgApprovedIds(list);
    localStorage.setItem('duodrip_ig_approved_ids', JSON.stringify(list));
  };

  const updateIgApprovalRequired = (val: boolean) => {
    setIgApprovalRequired(val);
    localStorage.setItem('duodrip_ig_approval_required', String(val));
  };

  // Reorder index values
  const movePostIndex = (index: number, direction: 'up' | 'down') => {
    const updated = [...igPosts];
    if (direction === 'up' && index > 0) {
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
    } else if (direction === 'down' && index < updated.length - 1) {
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
    }
    updateIgPostsList(updated);
  };


  // New product form inputs
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const [newCategory, setNewCategory] = React.useState<'Oversized' | 'Polo' | 'Graphic'>('Oversized');
  const [newPrice, setNewPrice] = React.useState('95');
  const [newColor, setNewColor] = React.useState('');
  const defaultPlaceholderImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYbK_UuKBWtAJL2QwAfAkaH3R7bDra5dEtzXexcwtsyWbmcWQQ9mOi1cHBdlgKFbhjEdO1anXte-mgwCshluRttRAlvn8iVpXZKAxM4iVRy7QwUgJsqrztTVSJlSdPKOkhTxYtLdH1qymlanQ7JCS7sfQqIT1EhhOdEN17BgtmybNnrbe4gdWHbgK43eInJyB23cNcrqLlsemhzMR4a7U9VSpXXCACRfaiy0qakJYwaFurVsA287L1KU_Hqr34GUzbcX4pz1DEDmhv';
  const [newFormImages, setNewFormImages] = React.useState<string[]>([defaultPlaceholderImg, '', '', '', '']);
  const [newColorHex, setNewColorHex] = React.useState('');
  const [newSizes, setNewSizes] = React.useState<('M' | 'L' | 'XL' | 'XXL')[]>(['M', 'L', 'XL', 'XXL']);
  const [newCategoryLabel, setNewCategoryLabel] = React.useState('ESSENTIALS');

  // Full product edit modal state
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [editForm, setEditForm] = React.useState<{
    name: string;
    category: 'Oversized' | 'Polo' | 'Graphic';
    price: string;
    originalPrice: string;
    textColorCategory: string;
    color: string;
    colorHex: string;
    image: string;
    images: string[];
    isNew: boolean;
    isLimited: boolean;
    inStock: boolean;
    preOrder: boolean;
    sizes: ('M' | 'L' | 'XL' | 'XXL')[];
  }>({
    name: '',
    category: 'Oversized',
    price: '',
    originalPrice: '',
    textColorCategory: '',
    color: '',
    colorHex: '',
    image: '',
    images: [],
    isNew: false,
    isLimited: false,
    inStock: true,
    preOrder: false,
    sizes: []
  });

  // Filter orders state
  const [orderQuery, setOrderQuery] = React.useState('');

  // Tooltip tracking for CSS Custom SVG Chart
  const [hoveredBar, setHoveredBar] = React.useState<number | null>(null);

  // Stats calculation
  const totalRevenue = React.useMemo(() => {
    return orders.reduce((sum, order) => sum + order.amount, 45300); // Base historical + current
  }, [orders]);

  const totalOrdersCount = React.useMemo(() => {
    return orders.length + 353;
  }, [orders]);

  // Handle Inventory state changes
  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleToggleStock = (productId: string) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const inStock = !p.inStock;
          return { ...p, inStock, preOrder: inStock ? false : p.preOrder };
        }
        return p;
      })
    );
  };

  const handleTogglePreOrder = (productId: string) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const preOrder = !p.preOrder;
          return { ...p, preOrder, inStock: preOrder ? false : p.inStock };
        }
        return p;
      })
    );
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const finalImages = newFormImages.filter(Boolean);
    const newProduct: Product = {
      id: `prod-custom-${Date.now()}`,
      name: newName,
      category: newCategory,
      price: parseFloat(newPrice) || 95.00,
      textColorCategory: newCategoryLabel.toUpperCase(),
      color: newColor,
      colorHex: newColorHex || '#333333',
      image: finalImages[0] || '',
      images: finalImages,
      isNew: true,
      inStock: true,
      preOrder: false,
      sizes: newSizes.length > 0 ? newSizes : ['S', 'M', 'L', 'XL', 'XXL']
    };

    setProducts(prev => [newProduct, ...prev]);
    setShowAddForm(false);
    // Reset forms
    setNewName('');
    setNewPrice('95');
    setNewColor('');
    setNewColorHex('');
    setNewSizes(['S', 'M', 'L', 'XL', 'XXL']);
    setNewFormImages([defaultPlaceholderImg, '', '', '', '']);
  };

  const startEditingProduct = (p: Product) => {
    setEditingProduct(p);
    const loadedImages = [...(p.images || [])];
    while (loadedImages.length < 5) {
      loadedImages.push('');
    }
    setEditForm({
      name: p.name,
      category: p.category,
      price: p.price.toString(),
      originalPrice: p.originalPrice ? p.originalPrice.toString() : '',
      textColorCategory: p.textColorCategory || '',
      color: p.color,
      colorHex: p.colorHex || '#333333',
      image: p.image || loadedImages[0] || '',
      images: loadedImages.slice(0, 5),
      isNew: p.isNew || false,
      isLimited: p.isLimited || false,
      inStock: p.inStock,
      preOrder: p.preOrder,
      sizes: p.sizes || []
    });
  };

  const handleEditProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const priceNum = parseFloat(editForm.price) || 0;
    const originalPriceNum = editForm.originalPrice ? parseFloat(editForm.originalPrice) : undefined;
    const finalImages = editForm.images.filter(Boolean);
    const primaryImage = finalImages[0] || editForm.image || '';

    setProducts(prev =>
      prev.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: editForm.name,
            category: editForm.category,
            price: priceNum,
            originalPrice: originalPriceNum,
            textColorCategory: editForm.textColorCategory,
            color: editForm.color,
            colorHex: editForm.colorHex,
            image: primaryImage,
            images: finalImages,
            isNew: editForm.isNew,
            isLimited: editForm.isLimited,
            inStock: editForm.inStock,
            preOrder: editForm.preOrder,
            sizes: editForm.sizes
          };
        }
        return p;
      })
    );
    setEditingProduct(null);
  };

  // Change Status of orders
  const handleUpdateOrderStatus = (orderId: string, nextStatus: 'Shipped' | 'Processing' | 'Delivered' | 'Hold' | 'Pending' | 'Confirmed') => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
  };

  // Change Payment Status of orders
  const handleUpdateOrderPaymentStatus = (orderId: string, nextPaymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded') => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, paymentStatus: nextPaymentStatus } : o))
    );
  };

  // Static chart data mapping
  const chartData = [
    { month: 'Jan', amount: 28000 },
    { month: 'Feb', amount: 32000 },
    { month: 'Mar', amount: 30000 },
    { month: 'Apr', amount: 36000 },
    { month: 'May', amount: 40000 },
    { month: 'Jun', amount: 45000 },
    { month: 'Jul', amount: 48250 },
  ];

  const topSellers = [
    { name: 'Archive Box Tee', count: 412, progress: 'w-[90%]', profit: '$14,420' },
    { name: 'The Heavyweight Tee', count: 385, progress: 'w-[84%]', profit: '$11,550' },
    { name: 'The Silk-Cotton Polo', count: 290, progress: 'w-[68%]', profit: '$9,860' },
    { name: 'Architect Tee', count: 210, progress: 'w-[48%]', profit: '$7,140' },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-16 pt-24 pb-16 min-h-screen text-left">
      {/* Admin Title Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-black/10 pb-8 mb-8 mt-4">
        <div>
          <span className="font-['Hanken_Grotesk'] text-[10px] tracking-widest text-[#ba1a1a] font-bold uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-650 animate-ping" />
            DUODRIP CENTRAL SYSTEM STATUS: SECURE & ACTIVE
          </span>
          <h1 className="font-['Bodoni_Moda'] text-3xl md:text-5xl font-extrabold text-black tracking-tight mt-1">
            Management Portal
          </h1>
          <p className="font-['Hanken_Grotesk'] text-sm text-gray-500 mt-1">
            Update seasonal collections, configure sizing, control stock levels, and audit real-time analytics.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-3">
          {onAdminLogout && (
            <button
              onClick={onAdminLogout}
              className="px-6 py-3 bg-[#ba1a1a] text-white hover:bg-neutral-800 font-['Hanken_Grotesk'] text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer"
              title="Secure Logout from Admin Console"
              id="admin-header-logout-btn"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          )}
          <button
            onClick={() => setActiveSection('inventory')}
            className="px-6 py-3 border border-black/20 font-['Hanken_Grotesk'] text-xs font-semibold tracking-widest text-gray-850 hover:border-black uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Quick Restock
          </button>
        </div>
      </div>

      {/* Admin Interface layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side Sub-Navigation Menu */}
        <nav className="lg:col-span-3 bg-[#efeded]/60 border border-black/5 p-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 sticky top-24 z-20">
          <button
            onClick={() => setActiveSection('dashboard')}
            className={`w-full text-left px-4 py-3 font-['Hanken_Grotesk'] text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-between cursor-pointer ${
              activeSection === 'dashboard'
                ? 'bg-black text-white'
                : 'text-gray-650 hover:bg-neutral-200'
            }`}
          >
            <span>Analytics Dashboard</span>
            <ChevronRight className="w-4 h-4 hidden lg:block" />
          </button>
          <button
            onClick={() => setActiveSection('inventory')}
            className={`w-full text-left px-4 py-3 font-['Hanken_Grotesk'] text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-between cursor-pointer ${
              activeSection === 'inventory'
                ? 'bg-black text-white'
                : 'text-gray-650 hover:bg-neutral-200'
            }`}
          >
            <span>Inventory Management</span>
            <span className="text-[10px] font-mono bg-neutral-350 text-black px-1.5 py-0.5 rounded ml-2 lg:ml-0">
              {products.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSection('orders')}
            className={`w-full text-left px-4 py-3 font-['Hanken_Grotesk'] text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-between cursor-pointer ${
              activeSection === 'orders'
                ? 'bg-black text-white'
                : 'text-gray-650 hover:bg-neutral-200'
            }`}
          >
            <span>Order Logistics</span>
            <span className="text-[10px] font-mono bg-[#ba1a1a] text-white px-1.5 py-0.5 rounded ml-2 lg:ml-0">
              {orders.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSection('customers')}
            className={`w-full text-left px-4 py-3 font-['Hanken_Grotesk'] text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-between cursor-pointer ${
              activeSection === 'customers'
                ? 'bg-black text-white'
                : 'text-gray-650 hover:bg-neutral-200'
            }`}
          >
            <span>Customer Database</span>
            <ChevronRight className="w-4 h-4 hidden lg:block" />
          </button>
          <button
            onClick={() => setActiveSection('banners')}
            className={`w-full text-left px-4 py-3 font-['Hanken_Grotesk'] text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-between cursor-pointer ${
              activeSection === 'banners'
                ? 'bg-black text-white'
                : 'text-gray-650 hover:bg-neutral-200'
            }`}
          >
            <span>Store Banners & Categories</span>
            <ChevronRight className="w-4 h-4 hidden lg:block" />
          </button>
          <button
            onClick={() => setActiveSection('instagram')}
            className={`w-full text-left px-4 py-3 font-['Hanken_Grotesk'] text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-between cursor-pointer ${
              activeSection === 'instagram'
                ? 'bg-black text-white'
                : 'text-gray-650 hover:bg-neutral-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram Feed</span>
            </span>
            <ChevronRight className="w-4 h-4 hidden lg:block" />
          </button>

          {/* Secure Sign Out Button */}
          {onAdminLogout && (
            <button
              onClick={onAdminLogout}
              className="w-full text-left px-4 py-3 font-['Hanken_Grotesk'] text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-between cursor-pointer text-[#ba1a1a] bg-[#ba1a1a]/5 hover:bg-[#ba1a1a]/10 border border-[#ba1a1a]/15 mt-2"
              title="Close secure administration session"
            >
              <span className="flex items-center gap-2">
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect Portal</span>
              </span>
              <ChevronRight className="w-4 h-4 hidden lg:block" />
            </button>
          )}
        </nav>

        {/* Central Content Panel */}
        <main className="lg:col-span-9 bg-white border border-black/5 p-6 md:p-8 shadow-sm">
          <AnimatePresence mode="wait">
            {/* 1. ANALYTICS DASHBOARD CARD FRAME */}
            {activeSection === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Section Title */}
                <div>
                  <h2 className="font-['Bodoni_Moda'] text-2xl font-bold text-black">Performance Dashboard</h2>
                  <p className="font-['Hanken_Grotesk'] text-xs text-gray-500 mt-1">Real-time aggregate data monitored across global nodes.</p>
                </div>

                {/* KPI Metrics List */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Revenue Card */}
                  <div className="border border-black/5 p-4 rounded-none bg-[#fbf9f9]">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="font-['Hanken_Grotesk'] text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                        REVENUE
                      </span>
                      <span className="text-[10px] font-mono font-bold text-green-650 flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" /> +14.2%
                      </span>
                    </div>
                    <div className="font-['Hanken_Grotesk'] text-2xl md:text-3xl font-extrabold text-black">
                      ₹{totalRevenue.toLocaleString()}
                    </div>
                    <p className="font-['Hanken_Grotesk'] text-[10px] text-gray-400 mt-1 uppercase">Jul Month to date</p>
                  </div>

                  {/* Orders Processed Card */}
                  <div className="border border-black/5 p-4 rounded-none bg-[#fbf9f9]">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="font-['Hanken_Grotesk'] text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                        ORDERS
                      </span>
                      <span className="text-[10px] font-mono font-bold text-green-650 flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" /> +8.5%
                      </span>
                    </div>
                    <div className="font-['Hanken_Grotesk'] text-2xl md:text-3xl font-extrabold text-black">
                      {totalOrdersCount}
                    </div>
                    <p className="font-['Hanken_Grotesk'] text-[10px] text-gray-400 mt-1 uppercase">Total Dispatched</p>
                  </div>

                  {/* Average Order Value Card */}
                  <div className="border border-black/5 p-4 rounded-none bg-[#fbf9f9]">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="font-['Hanken_Grotesk'] text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                        AVG BASKET
                      </span>
                      <span className="text-[10px] font-mono font-bold text-green-650 flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" /> +2.1%
                      </span>
                    </div>
                    <div className="font-['Hanken_Grotesk'] text-2xl md:text-3xl font-extrabold text-black">
                      ₹11,150.00
                    </div>
                    <p className="font-['Hanken_Grotesk'] text-[10px] text-gray-400 mt-1 uppercase">Per customer sweep</p>
                  </div>

                  {/* Conversion Rate Card */}
                  <div className="border border-black/5 p-4 rounded-none bg-[#fbf9f9]">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="font-['Hanken_Grotesk'] text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                        CONVERSION
                      </span>
                      <span className="text-[10px] font-mono font-bold text-green-650 flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" /> +0.5%
                      </span>
                    </div>
                    <div className="font-['Hanken_Grotesk'] text-2xl md:text-3xl font-extrabold text-black">
                      3.42%
                    </div>
                    <p className="font-['Hanken_Grotesk'] text-[10px] text-gray-400 mt-1 uppercase">Session to checkouts</p>
                  </div>
                </div>

                {/* Analytics Graphical Blocks */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Revenue Analytics - Left Custom SVG Bar Chart */}
                  <div className="lg:col-span-7 border border-black/5 p-5 rounded-none">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-['Hanken_Grotesk'] text-xs font-bold tracking-widest uppercase text-black">
                        Revenue Analytics (Monthly)
                      </h3>
                      <span className="text-[10px] font-mono text-gray-500">FISCAL YEAR 2026</span>
                    </div>

                    {/* Highly responsive custom designed interactive bar chart */}
                    <div className="relative h-64 flex items-end justify-between px-2 pt-8">
                      {/* Grid Background Lines */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none mt-8 border-b border-black/10">
                        <div className="border-b border-black/5 w-full h-0" />
                        <div className="border-b border-black/5 w-full h-0" />
                        <div className="border-b border-black/5 w-full h-0" />
                      </div>

                      {/* Bar units */}
                      {chartData.map((d, index) => {
                        // Max ratio relative to $50k max capacity
                        const percentage = (d.amount / 50000) * 100;
                        const isHigh = d.month === 'Jul'; // July highlighted active month

                        return (
                          <div
                            key={d.month}
                            className="flex flex-col items-center flex-1 relative group"
                            onMouseEnter={() => setHoveredBar(index)}
                            onMouseLeave={() => setHoveredBar(null)}
                          >
                            {/* Hover tooltip */}
                            {hoveredBar === index && (
                              <div className="absolute -top-12 bg-black text-white text-[10px] px-2 py-1.5 font-bold font-mono shadow-md z-30 pointer-events-none rounded after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-solid after:border-4 after:border-t-black after:border-r-transparent after:border-b-transparent after:border-l-transparent">
                                ₹{d.amount.toLocaleString()} INR
                              </div>
                            )}

                            {/* Base vertical bar background */}
                            <div className="w-7 md:w-10 bg-neutral-100 h-48 rounded-sm overflow-hidden flex items-end">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${percentage}%` }}
                                transition={{ duration: 0.6, delay: index * 0.05 }}
                                className={`w-full rounded-sm ${
                                  isHigh ? 'bg-black' : 'bg-neutral-300 group-hover:bg-neutral-400'
                                }`}
                              />
                            </div>

                            <span className="font-['Hanken_Grotesk'] text-[10px] font-bold text-gray-550 mt-2">
                              {d.month}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Top Selling Products Progress Bars - Right panel */}
                  <div className="lg:col-span-5 border border-black/5 p-5 rounded-none flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-['Hanken_Grotesk'] text-xs font-bold tracking-widest uppercase text-black">
                          Top Selling Silhouettes
                        </h3>
                        <span className="text-[10px] font-mono text-gray-500">JULY</span>
                      </div>

                      <div className="space-y-4">
                        {topSellers.map((item) => (
                          <div key={item.name} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-black font-semibold font-['Hanken_Grotesk'] truncate max-w-[200px]">
                                {item.name}
                              </span>
                              <span className="font-mono text-xs text-gray-500">
                                {item.count} units
                              </span>
                            </div>
                            {/* Bar container */}
                            <div className="h-2 bg-neutral-100 w-full rounded-sm overflow-hidden">
                              <div className={`h-full bg-black rounded-sm ${item.progress} transition-all duration-1000`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-black/5 pt-4 mt-6 text-center">
                      <button
                        onClick={() => setActiveSection('inventory')}
                        className="font-['Hanken_Grotesk'] text-[10px] font-bold tracking-widest text-black uppercase border-b border-black hover:opacity-75"
                      >
                        AUDIT ENTIRE PRODUCTS CATALOG
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. INVENTORY MANAGEMENT CARD FRAME */}
            {activeSection === 'inventory' && (
              <motion.div
                key="inventory"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-['Bodoni_Moda'] text-2xl font-bold text-black font-['Bodoni_Moda']">Active Inventory Database</h2>
                    <p className="font-['Hanken_Grotesk'] text-xs text-gray-500 mt-1">Configure retail price tiers and toggles.</p>
                  </div>

                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-4 py-2 bg-black text-white hover:bg-neutral-800 font-['Hanken_Grotesk'] text-[10px] font-bold tracking-widest uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    CREATE BRAND NEW PRODUCT
                  </button>
                </div>

                {/* Add product expandable form */}
                {showAddForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-5 border border-black bg-[#fbf9f9] text-left rounded-none space-y-4"
                  >
                    <h3 className="font-['Hanken_Grotesk'] text-xs font-bold tracking-widest uppercase text-black border-b pb-2">
                      New product parameters
                    </h3>
                    <form onSubmit={handleAddProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-1">Product Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Silk Minimalist Suit"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="w-full border border-gray-300 p-2.5 text-xs bg-white focus:outline-black focus:ring-0"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-1">Drape Category</label>
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value as 'Oversized' | 'Polo' | 'Graphic')}
                          className="w-full border border-gray-300 p-2.5 text-xs bg-white focus:outline-black focus:ring-0"
                        >
                          <option value="Oversized">Oversized Silhouette</option>
                          <option value="Polo">Silk Cotton Polo</option>
                          <option value="Graphic">Graphic Minimalist</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-1">Price (USD)</label>
                        <input
                          type="number"
                          required
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          className="w-full border border-gray-300 p-2.5 text-xs bg-white focus:outline-black font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-1">Label Tag Metadata</label>
                        <input
                          type="text"
                          required
                          value={newCategoryLabel}
                          onChange={(e) => setNewCategoryLabel(e.target.value)}
                          className="w-full border border-gray-300 p-2.5 text-xs bg-white focus:outline-black"
                        />
                      </div>

                      {/* AVAILABLE SILHOUETTE SIZES */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1.5 font-bold">
                          AVAILABLE SILHOUETTE SIZES
                        </label>
                        <div className="flex gap-2">
                          {(['M', 'L', 'XL', 'XXL'] as const).map((sz) => {
                            const isSelected = newSizes.includes(sz);
                            return (
                              <button
                                key={sz}
                                type="button"
                                onClick={() => {
                                  setNewSizes(prev => {
                                    const alreadySelected = prev.includes(sz);
                                    if (alreadySelected) {
                                      return prev.filter(x => x !== sz);
                                    } else {
                                      return [...prev, sz];
                                    }
                                  });
                                }}
                                className={`w-10 h-10 border text-xs font-bold font-mono transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-gray-500 border-black/10 hover:border-black'
                                }`}
                              >
                                {sz}
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-[9px] text-gray-400 mt-1 font-sans">
                          Select the sizes available to purchase for consumers online.
                        </p>
                      </div>

                      {/* 5 IMAGE SLOTS MANAGER */}
                      <div className="md:col-span-2 border-t border-black/5 pt-4 mt-2 font-['Hanken_Grotesk']">
                        <span className="block text-[10px] font-bold tracking-widest text-black uppercase mb-1">
                          Product Image Gallery (Option to add 4 to 5 images)
                        </span>
                        <p className="text-[10px] text-gray-500 mb-4">
                          Provide up to <strong>5 high-resolution images</strong>. Slot 1 will serve as primary cover. Choose either to paste direct picture URLs or upload files.
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                          {[0, 1, 2, 3, 4].map((index) => {
                            const currentVal = newFormImages[index];
                            return (
                              <div key={index} className="border border-black/10 bg-white p-2.5 flex flex-col justify-between space-y-2">
                                <span className="block text-[9px] font-bold tracking-wider uppercase text-gray-400">
                                  {index === 0 ? 'Slot 1 (Cover)' : `Slot ${index + 1}`}
                                </span>
                                
                                <div className="relative aspect-[3/4] border border-black/5 bg-[#fbf9f9] overflow-hidden flex items-center justify-center">
                                  {currentVal ? (
                                    <>
                                      <img
                                        src={currentVal}
                                        alt=""
                                        className="w-full h-full object-contain bg-[#fbf9f9]"
                                        referrerPolicy="no-referrer"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setNewFormImages(prev => {
                                            const copy = [...prev];
                                            copy[index] = '';
                                            return copy;
                                          });
                                        }}
                                        className="absolute inset-0 bg-red-600/90 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-[9px] font-bold uppercase cursor-pointer"
                                      >
                                        Clear Slot
                                      </button>
                                    </>
                                  ) : (
                                    <span className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">Empty Slot</span>
                                  )}
                                </div>

                                <div className="space-y-1 mt-1">
                                  <input
                                    type="text"
                                    placeholder="Paste Image URL"
                                    value={currentVal || ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setNewFormImages(prev => {
                                        const copy = [...prev];
                                        copy[index] = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full border border-gray-200 px-1 py-0.5 text-[9px] font-mono text-black focus:outline-black bg-white"
                                  />
                                  
                                  <div className="relative h-6 w-full border border-dashed border-neutral-200 hover:border-black bg-white flex items-center justify-center transition-all cursor-pointer">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          if (file.size > 2 * 1024 * 1024) {
                                            alert("File exceeds suggested 2MB limit.");
                                          }
                                          const reader = new FileReader();
                                          reader.onload = (event) => {
                                            if (event.target?.result) {
                                              const resultStr = event.target.result as string;
                                              setNewFormImages(prev => {
                                                const copy = [...prev];
                                                copy[index] = resultStr;
                                                return copy;
                                              });
                                            }
                                          };
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <span className="text-[8px] font-bold text-gray-400 uppercase">Upload File</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddForm(false)}
                          className="px-5 py-2 border text-[10px] font-bold tracking-widest uppercase hover:bg-neutral-100 cursor-pointer"
                        >
                          CANCEL
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-black text-white hover:bg-neutral-800 text-[10px] font-bold tracking-widest uppercase cursor-pointer"
                        >
                          PUBLISH TO STOREFRONT
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Products List Table */}
                <div className="overflow-x-auto border border-black/5">
                  <table className="w-full min-w-[700px] border-collapse text-left">
                    <thead>
                      <tr className="bg-[#efeded]/60 border-b border-black/10 font-['Hanken_Grotesk'] text-[10px] tracking-widest text-gray-550 uppercase">
                        <th className="p-4">SKU Info</th>
                        <th className="p-4">Category</th>
                        <th className="p-4 text-right">Price</th>
                        <th className="p-4 text-center">In Stock Status</th>
                        <th className="p-4 text-center">Pre-order status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 font-['Hanken_Grotesk'] text-xs">
                      {products.map((p, pIdx) => (
                        <tr key={`inventory-product-${p.id || pIdx}-${pIdx}`} className="hover:bg-neutral-50/50">
                          {/* SKU Column */}
                          <td className="p-4 flex items-center gap-3">
                            <div className="relative group shrink-0">
                              <img src={p.image} alt="" className="w-9 h-11 object-cover border border-black/5 bg-gray-100" referrerPolicy="no-referrer" />
                              <button
                                onClick={() => startEditingProduct(p)}
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] font-bold uppercase cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-white" />
                              </button>
                            </div>
                            <div>
                              <div className="font-semibold text-black leading-tight max-w-[160px] truncate">{p.name}</div>
                              <div className="text-[10px] text-gray-400 font-mono mt-0.5">{p.id}</div>
                              <button
                                onClick={() => startEditingProduct(p)}
                                className="text-[9px] tracking-widest text-black font-bold uppercase hover:underline mt-1 cursor-pointer flex items-center gap-1 bg-transparent border-none p-0 outline-none"
                              >
                                <Edit2 className="w-2 h-2 text-[#ba1a1a]" />
                                Edit Product
                              </button>
                            </div>
                          </td>

                          {/* Category Column */}
                          <td className="p-4 text-gray-650">
                            <span className="px-2 py-1 bg-neutral-100 rounded text-[10px] font-semibold">
                              {p.category}
                            </span>
                          </td>

                          {/* Price Column */}
                          <td className="p-4 text-right font-semibold text-black">
                            ₹{p.price.toFixed(2)}
                          </td>

                          {/* In Stock toggle */}
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleToggleStock(p.id)}
                              className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-colors ${
                                p.inStock
                                  ? 'bg-green-100 text-green-800 hover:bg-neutral-100'
                                  : 'bg-neutral-100 text-neutral-400 hover:bg-green-50'
                              }`}
                            >
                              {p.inStock ? 'ACTIVE' : 'INACTIVE'}
                            </button>
                          </td>

                          {/* Pre-order toggle */}
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleTogglePreOrder(p.id)}
                              className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-colors ${
                                p.preOrder
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-neutral-100 text-neutral-400'
                              }`}
                            >
                              {p.preOrder ? 'PRE-ORDER' : 'OFF'}
                            </button>
                          </td>

                          {/* delete button */}
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              title="Remove Product"
                              className="w-8 h-8 rounded hover:bg-red-50 text-neutral-400 hover:text-red-650 flex items-center justify-center ml-auto transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* 3. ORDER LOGISTICS CARD FRAME */}
            {activeSection === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-['Bodoni_Moda'] text-2xl font-bold text-black">Order Logistics Dispatch</h2>
                  <p className="font-['Hanken_Grotesk'] text-xs text-gray-500 mt-1">Audit active client order status coordinates.</p>
                </div>

                {/* Filter / Search Bar */}
                <div className="flex border border-black/10 px-3 py-2 bg-neutral-50/50">
                  <Search className="w-4 h-4 text-gray-400 self-center mr-2" />
                  <input
                    type="text"
                    placeholder="QUERY BY ORDER ID, CLIENT NAME OR SILHOUETTE DESIGN..."
                    value={orderQuery}
                    onChange={(e) => setOrderQuery(e.target.value)}
                    className="bg-transparent border-none focus:outline-none w-full text-xs font-['Hanken_Grotesk'] uppercase tracking-wider"
                  />
                </div>

                <div className="overflow-x-auto border border-black/5">
                  <table className="w-full min-w-[900px] border-collapse text-left">
                    <thead>
                      <tr className="bg-[#efeded]/60 border-b border-black/10 font-['Hanken_Grotesk'] text-[10px] tracking-widest text-gray-550 uppercase">
                        <th className="p-4">Order ID & Date</th>
                        <th className="p-4">Client Name & Mobile</th>
                        <th className="p-4">Delivery Address</th>
                        <th className="p-4">Ordered Products</th>
                        <th className="p-4 text-right">Order Total</th>
                        <th className="p-4">Payment Method</th>
                        <th className="p-4 text-center">Order Status</th>
                        <th className="p-4 text-right">Status Controls</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 font-['Hanken_Grotesk'] text-xs">
                      {orders
                        .filter(
                          (o) =>
                            o.customerName.toLowerCase().includes(orderQuery.toLowerCase()) ||
                            o.id.toLowerCase().includes(orderQuery.toLowerCase()) ||
                            o.productName.toLowerCase().includes(orderQuery.toLowerCase())
                        )
                        .map((o, oIdx) => (
                          <tr key={`order-row-${o.id || oIdx}-${oIdx}`} className="hover:bg-neutral-50/50">
                            <td className="p-4">
                              <span className="font-bold text-black block">{o.id}</span>
                              <span className="text-[10px] text-gray-400 block mt-0.5">{o.date}</span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-black text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                                  {o.customerInitial}
                                </span>
                                <div>
                                  <span className="text-gray-850 font-semibold block">{o.customerName}</span>
                                  <span className="text-[10px] font-mono text-gray-400 block mt-0.5">{o.phone || 'N/A'}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-gray-650 text-[11px] max-w-[150px] truncate" title={o.address}>
                              {o.address || 'N/A'}
                            </td>
                            <td className="p-4 text-gray-600 truncate max-w-[180px]" title={o.productName}>
                              {o.productName}
                            </td>
                            <td className="p-4 text-right font-bold text-black">
                              ₹{o.amount.toFixed(2)}
                            </td>
                            <td className="p-4">
                              <span className="font-semibold text-black uppercase block text-[10px]">{o.paymentMethod || 'COD'}</span>
                              <span className={`inline-block px-1.5 py-0.5 text-[8px] font-bold tracking-wider uppercase rounded mt-0.5 ${
                                o.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                                o.paymentStatus === 'Failed' ? 'bg-red-100 text-red-700' :
                                'bg-orange-100 text-orange-800'
                              }`}>
                                {o.paymentStatus || 'Pending'}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <span className={`inline-block px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase rounded ${
                                o.status === 'Shipped' ? 'bg-indigo-150 text-indigo-850' :
                                o.status === 'Processing' ? 'bg-amber-100 text-amber-800' :
                                o.status === 'Delivered' ? 'bg-green-150 text-green-850' :
                                o.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                'bg-orange-100 text-orange-850'
                              }`}>
                                {o.status}
                              </span>
                            </td>
                            <td className="p-4 text-right space-y-1.5">
                              <div>
                                <label className="block text-[8px] font-bold uppercase tracking-wider text-gray-400 mb-0.5 text-left">Order Status</label>
                                <select
                                  value={o.status}
                                  onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                                  className="border border-black/10 rounded p-1 text-[10px] font-bold tracking-wider bg-white uppercase cursor-pointer w-full"
                                >
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Processing">Processing</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Hold">Hold</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[8px] font-bold uppercase tracking-wider text-gray-400 mb-0.5 text-left">Payment Status</label>
                                <select
                                  value={o.paymentStatus || 'Pending'}
                                  onChange={(e) => handleUpdateOrderPaymentStatus(o.id, e.target.value as any)}
                                  className="border border-black/10 rounded p-1 text-[10px] font-bold tracking-wider bg-white uppercase cursor-pointer w-full"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Paid">Paid</option>
                                  <option value="Failed">Failed</option>
                                  <option value="Refunded">Refunded</option>
                                </select>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* 4. CUSTOMER DATABASE CARD FRAME */}
            {activeSection === 'customers' && (
              <motion.div
                key="customers"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="font-['Bodoni_Moda'] text-2xl font-bold text-black">Client Database Registry</h2>
                    <p className="font-['Hanken_Grotesk'] text-xs text-gray-500 mt-1">Audit active client accounts & profiles stored in Supabase.</p>
                  </div>

                  {/* Tab Selector buttons */}
                  <div className="flex items-center gap-2 border border-black/10 p-0.5 bg-neutral-100">
                    <button
                      type="button"
                      onClick={() => setCustomerTab('registered')}
                      className={`px-3 py-1.5 font-['Hanken_Grotesk'] text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${
                        customerTab === 'registered'
                          ? 'bg-black text-white'
                          : 'text-gray-500 hover:text-black'
                      }`}
                    >
                      Registered Accounts
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomerTab('invoice')}
                      className={`px-3 py-1.5 font-['Hanken_Grotesk'] text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${
                        customerTab === 'invoice'
                          ? 'bg-black text-white'
                          : 'text-gray-500 hover:text-black'
                      }`}
                    >
                      Invoice Clients
                    </button>
                  </div>
                </div>

                {customerTab === 'registered' ? (
                  <div className="space-y-4">
                    {userProfiles.length === 0 ? (
                      <div className="border border-dashed border-black/15 bg-neutral-50/50 p-8 text-center text-gray-500 font-['Hanken_Grotesk'] text-xs">
                        <p className="font-bold text-black uppercase tracking-widest mb-1 text-[10px]">No Registered Customer Profiles Found</p>
                        <p>Customer profiles stored in the Supabase <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded text-[11px]">user_profiles</code> table will appear here instantly when clients update their accounts in the storefront.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userProfiles.map((profile, pIdx) => {
                          const initial = profile.name ? profile.name.charAt(0).toUpperCase() : 'U';
                          return (
                            <div key={`customer-profile-${profile.email || 'no-email'}-${pIdx}`} className="border border-black/5 bg-neutral-50/50 p-5 rounded-none flex flex-col justify-between text-left relative overflow-hidden">
                              <div className="flex items-start gap-4">
                                {/* Letter Initial Bubble */}
                                <span className="w-10 h-10 rounded-full bg-black text-white text-xs font-black flex items-center justify-center shrink-0">
                                  {initial}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-['Hanken_Grotesk'] text-sm font-semibold text-black truncate">{profile.name}</h4>
                                  <p className="font-mono text-[9px] text-gray-400 truncate mt-0.5 uppercase">{profile.email}</p>
                                  
                                  {profile.phone && (
                                    <p className="font-['Hanken_Grotesk'] text-xs text-gray-600 mt-2">
                                      <span className="font-semibold text-black text-[10px] uppercase tracking-wider block">Phone</span>
                                      {profile.phone}
                                    </p>
                                  )}

                                  {profile.address && (
                                    <p className="font-['Hanken_Grotesk'] text-xs text-gray-600 mt-2">
                                      <span className="font-semibold text-black text-[10px] uppercase tracking-wider block">Delivery Address</span>
                                      {profile.address}, {profile.city} {profile.zip}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="mt-4 pt-3 border-t border-black/5 flex justify-between items-center text-[10px]">
                                <span className="text-gray-400 font-mono uppercase">Preferred Fit</span>
                                <span className="font-bold text-black font-mono bg-neutral-200/50 px-2 py-0.5 rounded text-[9px]">
                                  {profile.preferredSize || 'NOT SPECIFIED'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {orders.map((customer, idx) => (
                      <div key={`customer-order-card-${customer.id || idx}-${idx}`} className="border border-black/5 bg-neutral-50/50 p-4 rounded-none flex items-start gap-4">
                        {/* Customer Initial Ring */}
                        <span className="w-10 h-10 rounded-full bg-black text-white text-xs font-black flex items-center justify-center shrink-0">
                          {customer.customerInitial}
                        </span>
                        <div className="flex-1 text-left">
                          <h4 className="font-['Hanken_Grotesk'] text-sm font-semibold text-black">{customer.customerName}</h4>
                          <p className="font-mono text-[10px] text-gray-400 uppercase mt-0.5">Verified private client status</p>
                          <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-black/5 text-[11px] text-gray-500">
                            <div>
                              <span className="block text-[8px] font-bold tracking-widest uppercase text-gray-400">Total volume</span>
                              <span className="font-bold text-black text-xs">₹{customer.amount.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="block text-[8px] font-bold tracking-widest uppercase text-gray-400">Last Invoice</span>
                              <span className="font-mono text-black font-semibold text-[10px]">{customer.id}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* 5. STORE BANNERS & CATEGORIES CONFIGURATOR */}
            {activeSection === 'banners' && (
              <motion.div
                key="banners"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-12"
              >
                <div>
                  <h2 className="font-['Bodoni_Moda'] text-2xl font-bold text-black font-['Bodoni_Moda']">Storefront Assets Manager</h2>
                  <p className="font-['Hanken_Grotesk'] text-xs text-gray-500 mt-1">Configure active hero slides and category background images instantly.</p>
                </div>

                {/* Section A: Hero Slides Configurator */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-black/10 pb-3">
                    <h3 className="font-['Hanken_Grotesk'] text-sm font-bold tracking-widest uppercase text-black">
                      1. Dynamic Hero Slides
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        const newSlide: HeroSlide = {
                          label: "NEW ARRIVAL",
                          title: "Uniquely Tailored Silhouette series",
                          buttonText: "EXPLORE NOW",
                          bgUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000"
                        };
                        setHeroSlides([...heroSlides, newSlide]);
                      }}
                      className="px-3 py-1.5 bg-black text-white hover:bg-neutral-800 font-['Hanken_Grotesk'] text-[9px] font-bold tracking-widest uppercase transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3" /> Add Slide
                    </button>
                  </div>

                  <div className="space-y-6">
                    {heroSlides.map((slide, sIdx) => (
                      <div key={`admin-slide-${slide.id || sIdx}-${sIdx}`} className="border border-black/5 bg-neutral-50/40 p-5 rounded-none grid grid-cols-1 md:grid-cols-12 gap-6 items-start relative">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = heroSlides.filter((_, idx) => idx !== sIdx);
                            setHeroSlides(updated);
                          }}
                          disabled={heroSlides.length <= 1}
                          className="absolute top-4 right-4 text-gray-400 hover:text-[#ba1a1a] transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                          title="Delete Slide"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {/* Image Preview Panel */}
                        <div className="md:col-span-3">
                          <span className="block text-[8px] font-bold tracking-widest uppercase text-gray-400 mb-2">Live Preview</span>
                          <div className="aspect-[16/10] bg-neutral-100 border border-black/5 relative overflow-hidden flex items-center justify-center">
                            {slide.bgUrl ? (
                              <img src={slide.bgUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <span className="text-[10px] text-gray-400">No Image</span>
                            )}
                          </div>
                        </div>

                        {/* Fields Form Panel */}
                        <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[8px] font-bold tracking-widest uppercase text-gray-400 mb-1">Slide Label</label>
                            <input
                              type="text"
                              value={slide.label}
                              onChange={(e) => {
                                const updated = [...heroSlides];
                                updated[sIdx].label = e.target.value;
                                setHeroSlides(updated);
                              }}
                              className="w-full px-3 py-2 border border-black/10 focus:border-black text-xs font-semibold outline-none transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-[8px] font-bold tracking-widest uppercase text-gray-400 mb-1">Slide Heading Text</label>
                            <input
                              type="text"
                              value={slide.title}
                              onChange={(e) => {
                                const updated = [...heroSlides];
                                updated[sIdx].title = e.target.value;
                                setHeroSlides(updated);
                              }}
                              className="w-full px-3 py-2 border border-black/10 focus:border-black text-xs font-semibold outline-none transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-[8px] font-bold tracking-widest uppercase text-gray-400 mb-1">Button Call to Action</label>
                            <input
                              type="text"
                              value={slide.buttonText}
                              onChange={(e) => {
                                const updated = [...heroSlides];
                                updated[sIdx].buttonText = e.target.value;
                                setHeroSlides(updated);
                              }}
                              className="w-full px-3 py-2 border border-black/10 focus:border-black text-xs font-semibold outline-none transition-colors"
                            />
                          </div>

                          <div className="sm:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-black/5 pt-4 mt-2">
                            <div>
                              <label className="block text-[8px] font-bold tracking-widest uppercase text-gray-400 mb-1">Background Image URL</label>
                              <input
                                type="text"
                                placeholder="Paste image link manually..."
                                value={slide.bgUrl}
                                onChange={(e) => {
                                  const updated = [...heroSlides];
                                  updated[sIdx].bgUrl = e.target.value;
                                  setHeroSlides(updated);
                                }}
                                className="w-full px-3 py-2 border border-black/10 focus:border-black text-xs font-mono outline-none transition-colors placeholder-gray-300"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-bold tracking-widest uppercase text-gray-400 mb-1">
                                Upload Slide Image <span className="text-gray-400 font-normal lowercase">(fits to 16:9 widescreen)</span>
                              </label>
                              <div className="relative group/upload h-[34px] w-full border border-dashed border-neutral-300 hover:border-black bg-white flex items-center justify-center transition-colors px-3 cursor-pointer">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      if (file.size > 2 * 1024 * 1024) {
                                        alert('This asset exceeds 2MB limit. To ensure instant application loading and storage compliance, we suggest using files under 1MB.');
                                      }
                                      const reader = new FileReader();
                                      reader.onload = (event) => {
                                        if (event.target?.result) {
                                          const updated = [...heroSlides];
                                          updated[sIdx].bgUrl = event.target.result as string;
                                          setHeroSlides(updated);
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="flex items-center gap-2 text-gray-400 group-hover/upload:text-black">
                                  <Upload className="w-3.5 h-3.5" />
                                  <span className="text-[10px] font-bold tracking-widest uppercase font-sans">Choose Image File</span>
                                </div>
                              </div>
                              <p className="text-[9px] text-gray-500 mt-1 first-letter:uppercase">
                                Recommended resolution: <strong>1600 × 900 px</strong> or any clean <strong>16:9 aspect ratio</strong>.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section B: Categories (Core Archetypes) Configurator */}
                <div className="space-y-6 pt-6 border-t border-black/10">
                  <div className="flex justify-between items-center pb-3">
                    <h3 className="font-['Hanken_Grotesk'] text-sm font-bold tracking-widest uppercase text-black">
                      2. Silhouette Categories background images
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {categories.map((cat, cIdx) => (
                      <div key={`admin-cat-${cat.id || cIdx}-${cIdx}`} className="border border-black/5 bg-neutral-50/40 p-5 rounded-none grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                        {/* Image Preview Panel */}
                        <div className="md:col-span-3">
                          <span className="block text-[8px] font-bold tracking-widest uppercase text-gray-400 mb-2">Drape Preview</span>
                          <div className="aspect-[3/4] max-h-40 bg-neutral-100 border border-black/5 relative overflow-hidden flex items-center justify-center mx-auto">
                            {cat.bgUrl ? (
                              <img src={cat.bgUrl} alt="Drape Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <span className="text-[10px] text-gray-400">No Image</span>
                            )}
                          </div>
                        </div>

                        {/* Fields Form Panel */}
                        <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[8px] font-bold tracking-widest uppercase text-gray-500 mb-1 font-['Hanken_Grotesk']">
                              Archetype Key Name (ReadOnly)
                            </label>
                            <div className="w-full px-3 py-2 bg-neutral-100 border border-black/10 text-xs font-semibold text-gray-500 rounded-none cursor-not-allowed">
                              {cat.category}
                            </div>
                          </div>

                          <div>
                            <label className="block text-[8px] font-bold tracking-widest uppercase text-gray-400 mb-1">Category Card Title</label>
                            <input
                              type="text"
                              value={cat.title}
                              onChange={(e) => {
                                const updated = [...categories];
                                updated[cIdx].title = e.target.value;
                                setCategories(updated);
                              }}
                              className="w-full px-3 py-2 border border-black/10 focus:border-black text-xs font-semibold outline-none transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-[8px] font-bold tracking-widest uppercase text-gray-400 mb-1">Category Subtitle / Description</label>
                            <input
                              type="text"
                              value={cat.subtitle}
                              onChange={(e) => {
                                const updated = [...categories];
                                updated[cIdx].subtitle = e.target.value;
                                setCategories(updated);
                              }}
                              className="w-full px-3 py-2 border border-black/10 focus:border-black text-xs font-semibold outline-none transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-[8px] font-bold tracking-widest uppercase text-gray-400 mb-1">Button Call to Action</label>
                            <input
                              type="text"
                              value={cat.buttonText}
                              onChange={(e) => {
                                const updated = [...categories];
                                updated[cIdx].buttonText = e.target.value;
                                setCategories(updated);
                              }}
                              className="w-full px-3 py-2 border border-black/10 focus:border-black text-xs font-semibold outline-none transition-colors"
                            />
                          </div>

                          <div className="sm:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-black/5 pt-4 mt-2 font-['Hanken_Grotesk']">
                            <div>
                              <label className="block text-[8px] font-bold tracking-widest uppercase text-gray-400 mb-1">Background Image URL</label>
                              <input
                                type="text"
                                placeholder="Paste image link manually..."
                                value={cat.bgUrl}
                                onChange={(e) => {
                                  const updated = [...categories];
                                  updated[cIdx].bgUrl = e.target.value;
                                  setCategories(updated);
                                }}
                                className="w-full px-3 py-2 border border-black/10 focus:border-black text-xs font-mono outline-none transition-colors placeholder-gray-300"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-bold tracking-widest uppercase text-gray-400 mb-1">
                                Upload Category Image <span className="text-gray-400 font-normal lowercase">(fits to 3:4 portrait)</span>
                              </label>
                              <div className="relative group/upload h-[34px] w-full border border-dashed border-neutral-300 hover:border-black bg-white flex items-center justify-center transition-colors px-3 cursor-pointer">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      if (file.size > 2 * 1024 * 1024) {
                                        alert('This asset exceeds 2MB limit. To ensure instant application loading and storage compliance, we suggest using files under 1MB.');
                                      }
                                      const reader = new FileReader();
                                      reader.onload = (event) => {
                                        if (event.target?.result) {
                                          const updated = [...categories];
                                          updated[cIdx].bgUrl = event.target.result as string;
                                          setCategories(updated);
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="flex items-center gap-2 text-gray-400 group-hover/upload:text-black">
                                  <Upload className="w-3.5 h-3.5" />
                                  <span className="text-[10px] font-bold tracking-widest uppercase font-sans">Choose Image File</span>
                                </div>
                              </div>
                              <p className="text-[9px] text-gray-500 mt-1 first-letter:uppercase">
                                Recommended resolution: <strong>600 × 800 px</strong> or any clean <strong>3:4 aspect ratio (portrait)</strong>.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 6. INSTAGRAM FEED CURATION MANAGER */}
            {activeSection === 'instagram' && (
              <motion.div
                key="instagram"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-10 pb-20 font-['Hanken_Grotesk']"
              >
                {/* Header banner */}
                <div className="border-b border-black/10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="font-['Hanken_Grotesk'] text-[10px] tracking-widest text-red-650 font-bold uppercase flex items-center gap-2">
                      <Instagram className="w-3.5 h-3.5" />
                      INSTAGRAM FEED & REELS INTEGRATION HUB
                    </span>
                    <h2 className="font-['Bodoni_Moda'] text-2.5xl md:text-3.5xl font-extrabold text-black tracking-tight mt-1">
                      Curation & Meta Analytics Graph
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 max-w-2xl">
                      Configure your Meta Graph credentials, synchronize media streams, and manage display rules for the active landing page carousel slider.
                    </p>
                  </div>

                  {/* Public Toggle Switch */}
                  <div className="flex items-center gap-3 bg-neutral-50 px-5 py-3 border border-neutral-200">
                    <span className="text-xs font-bold uppercase tracking-wider text-black">
                      {igEnabled ? 'Section Enabled' : 'Section Disabled'}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateIgEnabled(!igEnabled)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        igEnabled ? 'bg-black' : 'bg-neutral-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          igEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Sub-block A: Connection & Meta OAuth Simulation */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* OAuth / Connection settings Column (Left 5 cols) */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-neutral-50 border border-neutral-200 p-6 space-y-6">
                      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-black flex items-center gap-2">
                          <Instagram className="w-4 h-4 text-black" />
                          Direct Feed Account
                        </h3>
                        <span className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded-none bg-emerald-100 text-emerald-850 border border-emerald-250">
                          Active & Dynamic
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-neutral-500 leading-relaxed mb-3">
                            Directly input your Instagram business or creator account username below. The system automatically fetches, generates, and synchronizes real-time high-fidelity feeds and reels containing your custom tags to the storefront gallery.
                          </p>
                        </div>

                        <div>
                          <label className="block text-[8px] font-bold tracking-widest text-gray-400 uppercase mb-1.5">
                            INSTAGRAM ACCOUNT USERNAME
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">@</span>
                            <input
                              type="text"
                              placeholder="duodrip_official"
                              value={igUsername}
                              onChange={(e) => updateIgUsername(e.target.value.replace(/[^a-zA-Z0-9_.]/g, ''))}
                              className="w-full bg-white border border-gray-300 pl-7 pr-3 py-2.5 text-xs focus:border-black outline-none text-black font-semibold uppercase tracking-wider"
                            />
                          </div>
                          <span className="text-[9px] text-gray-400 block mt-1.5 leading-normal">
                            All posts, reels, metrics, and captions in the live showcase dynamically scale to match this account.
                          </span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsSyncing(true);
                            setTimeout(() => {
                              setIsSyncing(false);
                              const now = new Date();
                              const formatted = now.toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true
                              });
                              updateIgLastSync(formatted);
                              
                              const generated = generateFeedForUsername(igUsername);
                              updateIgPostsList(generated);
                              localStorage.setItem('duodrip_ig_posts_for_username', igUsername);

                              // Auto-approve newly synced feed elements and reset moderation preferences
                              const generatedIds = generated.map(p => p.id);
                              setIgApprovedIds(generatedIds);
                              localStorage.setItem('duodrip_ig_approved_ids', JSON.stringify(generatedIds));
                              setIgHiddenIds([]);
                              localStorage.setItem('duodrip_ig_hidden_ids', JSON.stringify([]));
                              setIgPinnedIds([]);
                              localStorage.setItem('duodrip_ig_pinned_ids', JSON.stringify([]));
                              setIgApprovalRequired(false);
                              localStorage.setItem('duodrip_ig_approval_required', 'false');

                              alert(`Successfully synchronized feeds for @${igUsername}. Your landing page gallery has updated!`);
                            }, 850);
                          }}
                          className="w-full py-2.5 bg-black text-white hover:bg-neutral-850 font-bold text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <RefreshCcw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                          Force Synchronize Gallery
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sync Settings and Carousel Slider Options (Right 7 cols) */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    {/* Synchronisation Panel */}
                    <div className="border border-neutral-200 p-6 space-y-4">
                      <h3 className="font-bold text-xs uppercase tracking-widest text-black flex items-center justify-between">
                        <span>FEEDS SYNC MANAGEMENT STATE</span>
                        <span className="text-[10px] text-gray-400 font-normal">Auto-Sync System</span>
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-50 p-4 border border-neutral-200/50">
                        {/* Status items */}
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">LAST GRAPH SYNCHRONIZATION</span>
                          <span className="text-xs font-semibold text-black block">{igLastSync}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">MUTUAL SYNC CONNECTION PORT</span>
                          <span className="text-xs font-semibold text-emerald-700 block flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Healthy (GraphQL API v18.0)
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                          type="button"
                          disabled={isSyncing}
                          onClick={() => {
                            setIsSyncing(true);
                            setTimeout(() => {
                              setIsSyncing(false);
                              const now = new Date();
                              const formatted = now.toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true
                              });
                              updateIgLastSync(formatted);
                              
                              const generated = generateFeedForUsername(igUsername);
                              updateIgPostsList(generated);
                              localStorage.setItem('duodrip_ig_posts_for_username', igUsername);

                              alert(`Successfully synchronized with @${igUsername} Instagram Feed. Loaded latest customized posts and reel elements.`);
                            }, 1200);
                          }}
                          className="flex-1 py-2.5 bg-black text-white hover:bg-neutral-850 text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <RefreshCcw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                          {isSyncing ? 'SYNCHRONIZING GRAPH...' : 'SYNC LATEST POSTS & REELS'}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const now = new Date();
                            const formatted = now.toLocaleString();
                            updateIgLastSync(formatted);
                            alert('Meta connection status ping verified. Access tokens refreshed.');
                          }}
                          className="py-2.5 px-4 border border-black/10 text-gray-650 hover:border-black hover:text-black text-[10px] font-bold tracking-widest uppercase transition-colors cursor-pointer"
                        >
                          REFRESH EXPIRED TOKENS
                        </button>
                      </div>

                      {/* Trigger auto sync toggle */}
                      <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                        <div className="text-left">
                          <span className="text-xs font-bold text-black block uppercase tracking-wide">Background Auto-sync Hourly</span>
                          <span className="text-[10px] text-gray-500 block">Trigger background CRON simulation task every hour</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => updateIgAutoSync(!igAutoSync)}
                          className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            igAutoSync ? 'bg-black' : 'bg-neutral-250'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              igAutoSync ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Displays / Sliders Display Customisation settings */}
                    <div className="border border-neutral-200 p-6 space-y-5">
                      <h3 className="font-bold text-xs uppercase tracking-widest text-black flex items-center justify-between">
                        <span>DISPLAY OPTIONS & SLIDER SPEED</span>
                        <span className="text-[10px] text-red-650 font-bold uppercase">LIVE PREVIEW ON</span>
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-left">
                        {/* Grid option 1: Filters */}
                        <div>
                          <label className="block text-[8px] font-bold tracking-widest text-gray-500 uppercase mb-1">
                            MEDIA TYPE FILTER CONTENT
                          </label>
                          <select
                            value={igFilter}
                            onChange={(e) => updateIgFilter(e.target.value as any)}
                            className="w-full bg-white border border-gray-300 py-2 px-2.5 text-xs focus:border-black outline-none cursor-pointer rounded-none text-black"
                          >
                            <option value="both">Both Posts and Reels</option>
                            <option value="posts">Instagram Posts Only</option>
                            <option value="reels">Instagram Reels Only</option>
                          </select>
                        </div>

                        {/* Grid option 2: Speed */}
                        <div>
                          <label className="block text-[8px] font-bold tracking-widest text-gray-500 uppercase mb-1">
                            CAROUSEL SLIDE AUTOPLAY TRANSLATE SPEED
                          </label>
                          <select
                            value={igSpeed}
                            onChange={(e) => updateIgSpeed(Number(e.target.value))}
                            className="w-full bg-white border border-gray-300 py-2 px-2.5 text-xs focus:border-black outline-none cursor-pointer rounded-none text-black"
                          >
                            <option value="1500">Fast (1.5 seconds / 1500ms)</option>
                            <option value="3000">Balanced (3.0 seconds / 3000ms)</option>
                            <option value="4500">Relaxed (4.5 seconds / 4500ms)</option>
                            <option value="6000">Atmospheric (6.0 seconds / 6000ms)</option>
                          </select>
                        </div>

                        {/* Grid option 3: Count displayed */}
                        <div>
                          <label className="block text-[8px] font-bold tracking-widest text-gray-500 uppercase mb-1 flex justify-between">
                            <span>MAX POST LIMIT DISPLAYED</span>
                            <span className="font-mono text-black font-bold">{igLimit} Posts</span>
                          </label>
                          <input
                            type="range"
                            min="4"
                            max="24"
                            step="2"
                            value={igLimit}
                            onChange={(e) => updateIgLimit(Number(e.target.value))}
                            className="w-full accent-black cursor-pointer h-1.5 bg-neutral-200 mt-2"
                          />
                        </div>

                        {/* Grid option 4: Settings switches */}
                        <div className="space-y-2 pt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">ENABLE AUTOPLAY LOOP</span>
                            <input
                              type="checkbox"
                              checked={igAutoplay}
                              onChange={(e) => updateIgAutoplay(e.target.checked)}
                              className="w-4 h-4 cursor-pointer accent-black"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">SHOW CAROUSEL ARROWS</span>
                            <input
                              type="checkbox"
                              checked={igArrows}
                              onChange={(e) => updateIgArrows(e.target.checked)}
                              className="w-4 h-4 cursor-pointer accent-black"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">SHOW PAGINATION SLIDE DOTS</span>
                            <input
                              type="checkbox"
                              checked={igDots}
                              onChange={(e) => updateIgDots(e.target.checked)}
                              className="w-4 h-4 cursor-pointer accent-black"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-block B: Content Moderation Grid with Pinning, Unhiding, Pre-Approval & Sequencing */}
                <div className="pt-8 border-t border-black/10 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-xs uppercase tracking-widest text-black flex items-center gap-2">
                        <span>MEDIA STREAM & CONTENT MODERATION GRAPH</span>
                        <span className="font-mono bg-neutral-100 text-[10px] text-gray-650 px-2 py-0.5 border border-black/5 font-bold">
                          {igPosts.length} Registered Base Items
                        </span>
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5 leading-normal max-w-xl">
                        Reorder media display positions (using arrow indexes), hide specific blacklisted assets, pin featured posts to the first slides, or enable manual publishing approval.
                      </p>
                    </div>

                    {/* Pre-Approval Queue Setting and Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                      <div className="flex items-center gap-2 bg-neutral-50 px-3 py-1.5 border border-neutral-200">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-black">
                          Approval Required before Publish
                        </span>
                        <input
                          type="checkbox"
                          checked={igApprovalRequired}
                          onChange={(e) => updateIgApprovalRequired(e.target.checked)}
                          className="w-3.5 h-3.5 cursor-pointer accent-black"
                        />
                      </div>

                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('Reset to standard gorgeous brand aesthetic preset posts? This clears custom items.')) {
                              updateIgPostsList(PRESET_IG_POSTS);
                            }
                          }}
                          className="px-3 py-1.5 border border-black/10 text-gray-600 hover:border-black hover:text-black font-bold text-[9px] tracking-widest uppercase transition-colors cursor-pointer"
                        >
                          RESTORE DEFAULTS
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowIgAddModal(true)}
                          className="px-3.5 py-1.5 bg-black text-white hover:bg-neutral-850 font-bold text-[9px] tracking-widest uppercase transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          ADD SIMULATED ITEM
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Feed Items grid display */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {igPosts.map((post, idx) => {
                      const isHidden = igHiddenIds.includes(post.id);
                      const isPinned = igPinnedIds.includes(post.id);
                      const isApproved = igApprovedIds.includes(post.id);
                      
                      return (
                        <div 
                          key={`admin-ig-post-${post.id || idx}-${idx}`} 
                          className={`border p-4 flex flex-col justify-between transition-all relative rounded-none hover:shadow-md ${
                            isHidden 
                              ? 'border-red-200 bg-red-50/15 opacity-80' 
                              : isPinned 
                                ? 'border-amber-400 bg-amber-50/10' 
                                : 'border-neutral-200 bg-white'
                          }`}
                        >
                          {/* Image preview & badge */}
                          <div className="space-y-3 text-left">
                            <div className="aspect-[3/4] bg-neutral-50 border border-neutral-200 relative overflow-hidden group">
                              <img src={post.mediaUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              
                              {/* Overlay badges */}
                              <div className="absolute top-2 left-2 flex flex-col gap-1">
                                <span className="bg-black text-white font-bold text-[7px] tracking-widest uppercase px-2 py-0.5">
                                  {post.type}
                                </span>
                                {isPinned && (
                                  <span className="bg-amber-500 text-white font-bold text-[7px] tracking-widest uppercase px-2 py-0.5 flex items-center gap-0.5">
                                    <Sparkles className="w-2 h-2 fill-white" /> PINNED
                                  </span>
                                )}
                              </div>

                              <div className="absolute top-2 right-2 flex flex-col gap-1">
                                {isHidden && (
                                  <span className="bg-red-600 text-white font-bold text-[7px] tracking-widest uppercase px-2 py-0.5">
                                    HIDDEN
                                  </span>
                                )}
                              </div>

                              {/* Index Sequence shift Reordering Controls (Overlay layout) */}
                              <div className="absolute bottom-2 left-2 right-2 flex gap-1 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => movePostIndex(idx, 'up')}
                                  className="px-2 py-1 bg-black/90 text-white border border-white/20 hover:bg-black text-[9px] font-bold flex items-center gap-0.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-wider"
                                  title="Shift Left / Move Up display position"
                                >
                                  ▲ UP
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === igPosts.length - 1}
                                  onClick={() => movePostIndex(idx, 'down')}
                                  className="px-2 py-1 bg-black/90 text-white border border-white/20 hover:bg-black text-[9px] font-bold flex items-center gap-0.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-wider"
                                  title="Shift Right / Move Down display position"
                                >
                                  ▼ DOWN
                                </button>
                              </div>
                            </div>

                            {/* Controls Panel */}
                            <div className="space-y-2 border-b border-neutral-100 pb-3">
                              <div className="flex justify-between items-center text-[7px] font-mono text-gray-400">
                                <span>ID: {post.id}</span>
                                <span>Pos: Slide {idx + 1}</span>
                              </div>

                              {/* Action Buttons to configure Pin, Hide, Pre-approve */}
                              <div className="grid grid-cols-3 gap-1 pt-1">
                                {/* Button A: Pin to Top */}
                                <button
                                  type="button"
                                  onClick={() => togglePinned(post.id)}
                                  className={`py-1.5 text-[8px] font-bold uppercase tracking-wider border flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
                                    isPinned 
                                      ? 'border-amber-400 bg-amber-500 text-white hover:bg-amber-600' 
                                      : 'border-neutral-200 text-gray-650 hover:bg-neutral-50'
                                  }`}
                                  title="Pin to the start of the landing page slider carousel"
                                >
                                  <span>★ Pinned</span>
                                </button>

                                {/* Button B: Hide/Unhide */}
                                <button
                                  type="button"
                                  onClick={() => toggleHidden(post.id)}
                                  className={`py-1.5 text-[8px] font-bold uppercase tracking-wider border flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
                                    isHidden 
                                      ? 'border-red-400 bg-red-650 text-white hover:bg-red-750' 
                                      : 'border-neutral-200 hover:bg-red-50 text-gray-650'
                                  }`}
                                  title="Hide this post or reel from storefront"
                                >
                                  <span>👁 {isHidden ? 'Hidden' : 'Show'}</span>
                                </button>

                                {/* Button C: Approve for queue is shown if validation is active */}
                                <button
                                  type="button"
                                  onClick={() => toggleApproved(post.id)}
                                  className={`py-1.5 text-[8px] font-bold uppercase tracking-wider border flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
                                    isApproved 
                                      ? 'border-emerald-300 bg-emerald-600 text-white hover:bg-emerald-700' 
                                      : 'border-neutral-200 hover:bg-emerald-50 text-gray-550'
                                  }`}
                                  title="Manually switch verified published approval validation"
                                >
                                  <span>✔ {isApproved ? 'Approved' : 'Pending'}</span>
                                </button>
                              </div>
                            </div>

                            {/* Editable Fields inside moderation card */}
                            <div className="space-y-2 text-xs">
                              <div>
                                <label className="block text-[8px] font-bold tracking-widest text-gray-400 uppercase mb-0.5">
                                  LIVE CAPTION TEXT
                                </label>
                                <textarea
                                  rows={2}
                                  value={post.caption}
                                  onChange={(e) => {
                                    const updated = [...igPosts];
                                    updated[idx].caption = e.target.value;
                                    updateIgPostsList(updated);
                                  }}
                                  className="w-full bg-white border border-gray-300 py-1 px-1.5 text-xs focus:border-black outline-none transition-all rounded-none text-black leading-normal"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[8px] font-bold tracking-widest text-gray-400 uppercase mb-0.5">
                                    LIKES GRAPH
                                  </label>
                                  <input
                                    type="number"
                                    value={post.likeCount}
                                    onChange={(e) => {
                                      const updated = [...igPosts];
                                      updated[idx].likeCount = Math.max(0, parseInt(e.target.value) || 0);
                                      updateIgPostsList(updated);
                                    }}
                                    className="w-full bg-white border border-gray-300 py-0.5 px-1.5 text-xs focus:border-black outline-none rounded-none text-black font-mono font-semibold"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[8px] font-bold tracking-widest text-gray-400 uppercase mb-0.5">
                                    COMMENTS
                                  </label>
                                  <input
                                    type="number"
                                    value={post.commentCount || 0}
                                    onChange={(e) => {
                                      const updated = [...igPosts];
                                      updated[idx].commentCount = Math.max(0, parseInt(e.target.value) || 0);
                                      updateIgPostsList(updated);
                                    }}
                                    className="w-full bg-white border border-gray-300 py-0.5 px-1.5 text-xs focus:border-black outline-none rounded-none text-black font-mono font-semibold"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Footer with direct link and delete completely actions */}
                          <div className="border-t border-neutral-150/60 pt-3 mt-4 flex items-center justify-between text-[10px] font-semibold text-gray-500">
                            <a
                              href={post.permalink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-black flex items-center gap-1 uppercase tracking-wider"
                            >
                              <ExternalLink className="w-3 h-3" /> Visit Asset
                            </a>

                            <button
                              type="button"
                              onClick={() => {
                                if (confirm('Are you absolutely sure you want to delete this Instagram item completely from the registry?')) {
                                  updateIgPostsList(igPosts.filter((_, i) => i !== idx));
                                }
                              }}
                              className="text-red-750 hover:text-red-900 uppercase font-bold text-[9px] tracking-widest cursor-pointer"
                            >
                              DELETE
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Simulated Meta OAuth Popup has been removed to simplify direct integration */}

                {/* Simulated Custom IG add modal */}
                <AnimatePresence>
                  {showIgAddModal && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[120] p-4">
                      {/* backdrop */}
                      <div className="absolute inset-0 cursor-pointer" onClick={() => setShowIgAddModal(false)} />
                      
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white p-6 md:p-8 max-w-md w-full relative z-10 border border-black space-y-4 shadow-2xl text-left"
                      >
                        <div className="flex justify-between items-center border-b border-black/10 pb-3">
                          <h4 className="font-['Bodoni_Moda'] text-xl font-bold text-black uppercase tracking-tight">
                            Publish Integrated Post
                          </h4>
                          <button
                            type="button"
                            onClick={() => setShowIgAddModal(false)}
                            className="text-gray-400 hover:text-black font-semibold text-lg cursor-pointer bg-none outline-none border-none p-1"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-[8px] font-bold tracking-widest text-gray-500 uppercase mb-1">
                              TYPE OF INSTAGRAM CONTENT
                            </label>
                            <select
                              value={newIgPost.type}
                              onChange={(e) => setNewIgPost(prev => ({ ...prev, type: e.target.value as 'post' | 'reel' }))}
                              className="w-full bg-white border border-gray-300 py-2.5 px-3 text-xs focus:border-black outline-none rounded-none text-black cursor-pointer animate-none"
                            >
                              <option value="post">Instagram Standard Post</option>
                              <option value="reel">Instagram Reels Video</option>
                            </select>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="block text-[8px] font-bold tracking-widest text-gray-500 uppercase">
                                MEDIA ASSETS SOURCE OR DIRECT INSTA PHOTO URL *
                              </label>
                            </div>
                            <input
                              type="url"
                              placeholder="e.g. https://images.unsplash.com/photo-..."
                              required
                              value={newIgPost.mediaUrl}
                              onChange={(e) => setNewIgPost(prev => ({ ...prev, mediaUrl: e.target.value }))}
                              className="w-full bg-white border border-gray-300 py-2.5 px-3 text-xs focus:border-black outline-none font-mono rounded-none text-black"
                            />
                            
                            {/* Choose from local simulation images */}
                            <div className="mt-2 text-center">
                              <label className="block text-[8px] font-bold tracking-widest uppercase text-gray-400 mb-1">
                                Or Upload media directly
                              </label>
                              <div className="relative group/ig-upl h-[36px] w-full border border-dashed border-neutral-300 hover:border-black bg-white flex items-center justify-center transition-colors px-3 cursor-pointer">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (event) => {
                                        if (event.target?.result) {
                                          setNewIgPost(prev => ({ ...prev, mediaUrl: event.target.result as string }));
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="flex items-center gap-2 text-gray-400 group-hover/ig-upl:text-black">
                                  <Upload className="w-3.5 h-3.5" />
                                  <span className="text-[10px] font-bold tracking-widest uppercase font-sans">Choose Image File</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[8px] font-bold tracking-widest text-gray-500 uppercase mb-1 font-sans">
                              POST CAPTION
                            </label>
                            <textarea
                              rows={3}
                              placeholder="e.g. Complete drop details in Bone White. Anatomically designed drop shoulders... #duodrip"
                              value={newIgPost.caption}
                              onChange={(e) => setNewIgPost(prev => ({ ...prev, caption: e.target.value }))}
                              className="w-full bg-white border border-gray-300 py-2 px-3 text-xs focus:border-black outline-none rounded-none text-black leading-relaxed"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[8px] font-bold tracking-widest text-gray-500 uppercase mb-1">
                                LIKES LEVEL
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={newIgPost.likeCount}
                                onChange={(e) => setNewIgPost(prev => ({ ...prev, likeCount: Math.max(1, parseInt(e.target.value) || 0) }))}
                                className="w-full bg-white border border-gray-300 py-1.5 px-3 text-xs focus:border-black outline-none rounded-none text-black font-mono"
                              />
                            </div>

                            <div>
                              <label className="block text-[8px] font-bold tracking-widest text-gray-500 uppercase mb-1">
                                COMMENTS LEVEL
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={newIgPost.commentCount}
                                onChange={(e) => setNewIgPost(prev => ({ ...prev, commentCount: Math.max(0, parseInt(e.target.value) || 0) }))}
                                className="w-full bg-white border border-gray-300 py-1.5 px-3 text-xs focus:border-black outline-none rounded-none text-black font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                          <button
                            type="button"
                            onClick={() => setShowIgAddModal(false)}
                            className="flex-1 py-1 px-3 border border-black text-black font-semibold text-xs tracking-widest uppercase hover:bg-neutral-50 transition-colors cursor-pointer"
                          >
                            CANCEL
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!newIgPost.mediaUrl.trim()) {
                                alert('Please provide a media URL or upload an image file first.');
                                return;
                              }
                              const postObj: InstagramPost = {
                                id: `ig-post-user-${Date.now()}`,
                                type: newIgPost.type,
                                mediaUrl: newIgPost.mediaUrl.trim(),
                                permalink: `https://www.instagram.com/${igUsername}/${newIgPost.type}/${Date.now()}`,
                                caption: newIgPost.caption || 'Curation update from our Instagram account. #duodrip',
                                likeCount: newIgPost.likeCount || 150,
                                commentCount: newIgPost.commentCount || 0,
                                timestamp: new Date().toISOString()
                              } as any;
                              updateIgPostsList([postObj, ...igPosts]);
                              setShowIgAddModal(false);
                              setNewIgPost({ type: 'post', mediaUrl: '', caption: '', likeCount: 220, commentCount: 14 });
                            }}
                            className="flex-1 py-3 bg-black text-white font-semibold text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors cursor-pointer"
                          >
                            PUBLISH PORTAL
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>

              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      {/* Edit Product details Modal */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[110] p-4 overflow-y-auto font-['Hanken_Grotesk']">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border border-black max-w-lg w-full p-6 text-left shadow-2xl relative my-8"
            >
              <button
                onClick={() => setEditingProduct(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black font-semibold text-lg cursor-pointer bg-transparent border-none outline-none"
              >
                ✕
              </button>

              <h3 className="font-['Bodoni_Moda'] text-2xl font-bold text-black border-b border-black/10 pb-3 mb-4 uppercase tracking-tight">
                Modify Silhouette details
              </h3>

              <form onSubmit={handleEditProductSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1 no-scrollbar">
                {/* Product Name */}
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">
                    PRODUCT NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 p-2.5 text-xs bg-white focus:outline-black focus:ring-0 font-sans text-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">
                      CATEGORY
                    </label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full border border-gray-300 p-2.5 text-xs bg-white focus:outline-black focus:ring-0 font-sans text-black"
                    >
                      <option value="Oversized">Oversized</option>
                      <option value="Polo">Polo</option>
                      <option value="Graphic">Graphic</option>
                    </select>
                  </div>

                  {/* Category Label (e.g., ESSENTIALS) */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">
                      TEXT CATEGORY LABEL
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ESSENTIALS"
                      value={editForm.textColorCategory}
                      onChange={(e) => setEditForm(prev => ({ ...prev, textColorCategory: e.target.value }))}
                      className="w-full border border-gray-300 p-2.5 text-xs bg-white focus:outline-black focus:ring-0 font-sans text-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">
                      UNIT PRICE (INR ₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editForm.price}
                      onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full border border-gray-300 p-2.5 text-xs bg-white focus:outline-black focus:ring-0 font-mono text-black"
                    />
                  </div>

                  {/* Original Price */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">
                      ORIGINAL PRICE (₹ - OPTIONAL)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 150.00"
                      value={editForm.originalPrice}
                      onChange={(e) => setEditForm(prev => ({ ...prev, originalPrice: e.target.value }))}
                      className="w-full border border-gray-300 p-2.5 text-xs bg-white focus:outline-black focus:ring-0 font-mono text-black"
                    />
                  </div>
                </div>

                {/* Available Sizes */}
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1.5 font-bold">
                    AVAILABLE SILHOUETTE SIZES
                  </label>
                  <div className="flex gap-2">
                    {(['M', 'L', 'XL', 'XXL'] as const).map((sz) => {
                      const isSelected = editForm.sizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => {
                            setEditForm(prev => {
                              const alreadySelected = prev.sizes.includes(sz);
                              const newSizes = alreadySelected
                                ? prev.sizes.filter(x => x !== sz)
                                : [...prev.sizes, sz];
                              return { ...prev, sizes: newSizes };
                            });
                          }}
                          className={`w-10 h-10 border text-xs font-bold font-mono transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-black text-white border-black'
                              : 'bg-neutral-50 text-gray-500 border-black/10 hover:border-black'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Status Toggle Flags */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-neutral-50 p-3 border border-black/5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editForm.isNew}
                      onChange={(e) => setEditForm(prev => ({ ...prev, isNew: e.target.checked }))}
                      className="accent-black w-4 h-4 cursor-pointer"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wide text-gray-600">NEW COLLECT</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editForm.isLimited}
                      onChange={(e) => setEditForm(prev => ({ ...prev, isLimited: e.target.checked }))}
                      className="accent-black w-4 h-4 cursor-pointer"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wide text-gray-600">LIMITED</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editForm.inStock}
                      onChange={(e) => setEditForm(prev => {
                        const nextVal = e.target.checked;
                        return { 
                          ...prev, 
                          inStock: nextVal,
                          preOrder: nextVal ? false : prev.preOrder
                        };
                      })}
                      className="accent-black w-4 h-4 cursor-pointer"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wide text-gray-600">IN STOCK</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editForm.preOrder}
                      onChange={(e) => setEditForm(prev => {
                        const nextVal = e.target.checked;
                        return { 
                          ...prev, 
                          preOrder: nextVal,
                          inStock: nextVal ? false : prev.inStock
                        };
                      })}
                      className="accent-black w-4 h-4 cursor-pointer"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wide text-gray-600">PRE-ORDER</span>
                  </label>
                </div>

                {/* Current vs New Image Comparison Preview */}
                <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-3 border border-black/5">
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-gray-500 mb-1 text-center block">CURRENT LOOK</span>
                    <img src={editingProduct.image} alt="Original" className="w-full h-32 object-cover border border-black/5" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-gray-500 mb-1 text-center block font-bold">PROPOSED LOOK</span>
                    {editForm.image ? (
                      <img src={editForm.image} alt="Preview" className="w-full h-32 object-cover border border-black/5" onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400';
                      }} referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 text-center p-2 uppercase">
                        Paste URL to preview
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-black/5 pt-4 font-['Hanken_Grotesk'] space-y-4">
                  <span className="block text-[10px] font-bold tracking-widest text-black uppercase">
                    Silhouettes Images Gallery Manager (Option to add 4 to 5 images)
                  </span>
                  <p className="text-[10px] text-gray-500">
                    Provide up to <strong>5 high-resolution images</strong>. Slot 1 serves as primary cover. Choose either to paste direct picture URLs or upload files.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[0, 1, 2, 3, 4].map((index) => {
                      const currentVal = editForm.images[index] || '';
                      return (
                        <div key={index} className="border border-black/10 bg-white p-2.5 flex flex-col justify-between space-y-2">
                          <span className="block text-[9px] font-bold tracking-wider uppercase text-gray-400">
                            {index === 0 ? 'Slot 1 (Cover)' : `Slot ${index + 1}`}
                          </span>
                          
                          <div className="relative aspect-[3/4] border border-black/5 bg-[#fbf9f9] overflow-hidden flex items-center justify-center">
                            {currentVal ? (
                              <>
                                <img
                                  src={currentVal}
                                  alt=""
                                  className="w-full h-full object-contain bg-[#fbf9f9]"
                                  referrerPolicy="no-referrer"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditForm(prev => {
                                      const copy = [...prev.images];
                                      copy[index] = '';
                                      return { ...prev, images: copy };
                                    });
                                  }}
                                  className="absolute inset-0 bg-red-650/90 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-[9px] font-bold uppercase cursor-pointer"
                                >
                                  Clear Slot
                                </button>
                              </>
                            ) : (
                              <span className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">Empty Slot</span>
                            )}
                          </div>

                          <div className="space-y-1 mt-1">
                            <input
                              type="text"
                              placeholder="Paste Image URL"
                              value={currentVal}
                              onChange={(e) => {
                                const val = e.target.value;
                                setEditForm(prev => {
                                  const copy = [...prev.images];
                                  copy[index] = val;
                                  return { ...prev, images: copy };
                                });
                              }}
                              className="w-full border border-gray-200 px-1 py-0.5 text-[9px] font-mono text-black focus:outline-black bg-white"
                            />
                            
                            <div className="relative h-6 w-full border border-dashed border-neutral-200 hover:border-black bg-white flex items-center justify-center transition-all cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    if (file.size > 2 * 1024 * 1024) {
                                      alert("File exceeds suggested 2MB limit.");
                                    }
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      if (event.target?.result) {
                                        const resultStr = event.target.result as string;
                                        setEditForm(prev => {
                                          const copy = [...prev.images];
                                          copy[index] = resultStr;
                                          return { ...prev, images: copy };
                                        });
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <span className="text-[8px] font-bold text-gray-400 uppercase">Upload File</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick presets for garment style models */}
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">
                    DUODRIP PHOTO ARCHIVE PRESETS
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'Model Drape', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDx0WgV8LotbmCjJyLPzGVPu50wMKbnlVe6MEcSx8L_ufwEweD1aV1PLfvyQ4-V2SLKmJz1g6j2UViwTkW2-nbCyLJgs_9QpvlKRmb9RMqV6p4tqkN1Pl8RAAaNgUz7ZzDsNi0vGaoLEdOeOGQ40ZthOHwHDshKRUDw2CEdMAhUFZgtlNmxVOncxhveclYQGzU1rucofz5ZpZY8Rn4QBUKtMS8h8O6OI51S0o8HtBodfR7HxvQu8Fjf7ebsEFZHCtJhKJpb4ncy_iJ7' },
                      { label: 'Obsidian Tee', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRsAzPghUs5MrcvnxKEdlB6Cb4UilfgKw7vTZ0vbucmncaEXHTfV8j1l3-HZQGtsE-u6PWPzdsQIEgmMZvEcOvnRUfAYWvrvs46GP1M8IYjlIaCosjA6gPFCVFHqtsXWUZOS7BpdpTlGuNIc-ytarB3FHTx5f4TYBnVJrVYKa46LDZUsDbmLTniYgILaRxkLSfiqGqcfxXslDNkON9-kOCpG1HGcNH9sSKh0XeStaING5QjmLBwekat_UrFfFGoV-x0SY7zMne0KZW' },
                      { label: 'White Silk Polo', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwUVplbi_cIoS8lOdjLtSlZhSkm6iIoj9M3ObLB0ZNplXo1lTO4Oayi3HMyIadnmwuPu1mww4eIXQNP1Tb1VcYSZ6k0MkJQyHNu8TuCKVYwleou12zGpKLJXCAWqQfuxvXtCaWVYHGnE3ll210pdkdNvVJ1bokSAT5ID2Umi4lOyvBmVcEgid-P6DkuQlNsvQgniKt134Sm0gAeukWUfnEqsf3CDF-Fcm-O-Hj3LcuGTgcJVXkn4xsMkthNzV14AhDpFxPY03XRuAg' },
                      { label: 'Studio Neutral', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400' }
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditForm(prev => ({ ...prev, image: preset.url }))}
                        className="p-1 border border-black/10 hover:border-black text-[9px] bg-neutral-50 flex flex-col items-center gap-1 cursor-pointer truncate"
                      >
                        <img src={preset.url} alt="" className="w-8 h-8 object-cover rounded-sm" referrerPolicy="no-referrer" />
                        <span className="truncate max-w-full font-semibold">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 justify-end pt-4 border-t border-black/5">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 border border-black/10 text-[10px] font-bold tracking-widest uppercase hover:bg-neutral-100 cursor-pointer text-gray-500"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-black text-white hover:bg-neutral-800 text-[10px] font-bold tracking-widest uppercase cursor-pointer"
                  >
                    SAVE SILHOUETTE
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
