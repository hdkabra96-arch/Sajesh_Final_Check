export interface Product {
  id: string;
  name: string;
  category: 'Oversized' | 'Polo' | 'Graphic' | 'Premium' | 'Minimalist';
  price: number;
  originalPrice?: number;
  textColorCategory: string; // e.g. "ESSENTIALS", "MODERN CLASSIC" etc.
  color?: string; // e.g. "Obsidian Black", "Bone White"
  colorHex?: string; // color swatch background code
  image: string;
  images?: string[];
  isNew?: boolean;
  isLimited?: boolean;
  inStock: boolean;
  preOrder: boolean;
  sizes: ('M' | 'L' | 'XL' | 'XXL')[];
}

export interface CartItem {
  product: Product;
  selectedSize: 'M' | 'L' | 'XL' | 'XXL';
  quantity: number;
}

export interface RecentOrder {
  id: string;
  customerInitial: string;
  customerName: string;
  productName: string;
  amount: number;
  status: 'Shipped' | 'Processing' | 'Delivered' | 'Hold' | 'Pending';
  date: string;
  phone?: string;
  email?: string;
  address?: string;
  productId?: string;
  size?: string;
  color?: string;
  quantity?: number;
  whatsAppSent?: boolean;
}

export interface FilterState {
  inStock: boolean;
  preOrder: boolean;
  selectedSize: 'M' | 'L' | 'XL' | 'XXL' | null;
  selectedColors: string[];
  maxPrice: number;
}

export type SortingType = 'Newest' | 'PriceHighToLow' | 'PriceLowToHigh' | 'BestSellers';

export type ActiveView = 'storefront' | 'shop' | 'admin' | 'about' | 'contact' | 'privacy' | 'shipping-returns' | 'profile';
export type AdminSection = 'dashboard' | 'inventory' | 'orders' | 'customers' | 'banners' | 'analytics' | 'instagram';

export interface HeroSlide {
  id?: string;
  label: string;
  title: string;
  buttonText: string;
  bgUrl: string;
}

export interface CategoryItem {
  id: string;
  category: 'Oversized' | 'Polo' | 'Graphic' | 'Premium' | 'Minimalist';
  title: string;
  subtitle: string;
  buttonText: string;
  bgUrl: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  preferredSize: 'M' | 'L' | 'XL' | 'XXL' | '';
  pin?: string;
}

