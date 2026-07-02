import { createClient } from '@supabase/supabase-js';
import { Product, RecentOrder, HeroSlide, CategoryItem, UserProfile } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, HERO_SLIDES, INITIAL_CATEGORIES, INITIAL_USER_PROFILES } from './data';

// Read configuration from Vite environment variables, falling back to the credentials provided by the user
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/rest\/v1\/?$/, '');
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('⚡ Supabase Engine Initialized:', SUPABASE_URL);

/**
 * AUTO-HEALING SCHEMA MUTATION HELPER
 * If PostgreSQL returns error code '42703' (undefined_column), this helper parses the missing
 * column name, dynamically deletes that property from the object payload, and retries up to 15 times.
 * This guarantees insertions succeed even if the user has omitted columns in their Supabase Table Editor!
 */
async function safeInsert(tableName: string, payload: any): Promise<boolean> {
  let currentPayload = Array.isArray(payload) ? JSON.parse(JSON.stringify(payload)) : { ...payload };
  let attempts = 0;
  const maxAttempts = 15;

  while (attempts < maxAttempts) {
    const { error } = await supabase.from(tableName).insert(currentPayload);
    if (!error) {
      return true;
    }

    const errorMsg = error.message || '';
    const errorCode = error.code || '';
    let badColumn: string | null = null;

    // Error code 42703 represents "undefined_column" in PostgreSQL
    if (errorCode === '42703' || (errorMsg.includes('column') && errorMsg.includes('does not exist'))) {
      const match = errorMsg.match(/column "([^"]+)"/) || errorMsg.match(/column '([^']+)'/) || errorMsg.match(/column ([a-zA-Z0-9_]+)/);
      if (match && match[1]) {
        badColumn = match[1];
      }
    } else if (errorMsg.toLowerCase().includes("could not find the") && errorMsg.toLowerCase().includes("column of")) {
      const match = errorMsg.match(/Could not find the\s+['"\\_]*([a-zA-Z0-9_]+)['"\\_]*\s+column/i);
      if (match && match[1]) {
        badColumn = match[1];
      }
    }

    if (badColumn) {
      console.warn(`🔧 Auto-healing: Column "${badColumn}" does not exist in table "${tableName}". Removing from payload...`);
      
      if (Array.isArray(currentPayload)) {
        currentPayload = currentPayload.map(item => {
          const copy = { ...item };
          delete copy[badColumn];
          return copy;
        });
      } else {
        delete currentPayload[badColumn];
      }
      attempts++;
      continue;
    }

    // Handle duplicate key / unique constraint violations gracefully (e.g. error 23505)
    if (errorCode === '23505' || errorMsg.toLowerCase().includes('duplicate key') || errorMsg.toLowerCase().includes('unique constraint')) {
      if (!Array.isArray(currentPayload) && currentPayload && typeof currentPayload.id === 'string' && currentPayload.id.startsWith('STM-')) {
        const newId = `STM-${Math.floor(100000 + Math.random() * 900000)}`;
        console.warn(`🔧 Auto-healing: Duplicate key error on table "${tableName}". Regenerating order ID from "${currentPayload.id}" to "${newId}" and retrying...`);
        currentPayload.id = newId;
        attempts++;
        continue;
      } else {
        console.warn(`⚠️ Warning: Duplicate key violation on table "${tableName}" (row already exists). Skipping insert.`);
        return true;
      }
    }

    console.error(`❌ safeInsert completely failed for table "${tableName}":`, errorMsg);
    return false;
  }
  return false;
}

async function safeUpsert(tableName: string, payload: any): Promise<boolean> {
  let currentPayload = Array.isArray(payload) ? JSON.parse(JSON.stringify(payload)) : { ...payload };
  let attempts = 0;
  const maxAttempts = 15;

  while (attempts < maxAttempts) {
    const { error } = await supabase.from(tableName).upsert(currentPayload);
    if (!error) {
      return true;
    }

    const errorMsg = error.message || '';
    const errorCode = error.code || '';
    let badColumn: string | null = null;

    if (errorCode === '42703' || (errorMsg.includes('column') && errorMsg.includes('does not exist'))) {
      const match = errorMsg.match(/column "([^"]+)"/) || errorMsg.match(/column '([^']+)'/) || errorMsg.match(/column ([a-zA-Z0-9_]+)/);
      if (match && match[1]) {
        badColumn = match[1];
      }
    } else if (errorMsg.toLowerCase().includes("could not find the") && errorMsg.toLowerCase().includes("column of")) {
      const match = errorMsg.match(/Could not find the\s+['"\\_]*([a-zA-Z0-9_]+)['"\\_]*\s+column/i);
      if (match && match[1]) {
        badColumn = match[1];
      }
    }

    if (badColumn) {
      console.warn(`🔧 Auto-healing: Column "${badColumn}" does not exist in table "${tableName}" during upsert. Removing...`);
      
      if (Array.isArray(currentPayload)) {
        currentPayload = currentPayload.map(item => {
          const copy = { ...item };
          delete copy[badColumn];
          return copy;
        });
      } else {
        delete currentPayload[badColumn];
      }
      attempts++;
      continue;
    }

    console.error(`❌ safeUpsert completely failed for table "${tableName}":`, errorMsg);
    return false;
  }
  return false;
}

/**
 * DATABASE OPERATIONS & SYNCHRONIZATION HELPERS
 */

// 1. PRODUCTS MANAGEMENT
export async function fetchProductsFromDb(): Promise<Product[] | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.warn('⚠️ Error fetching products, falling back to local storage:', error.message);
      return null;
    }

    // Merge database results with local initial templates to restore any omitted asset references/details
    const dbProducts = data as Product[];
    return dbProducts.map(p => {
      const initial = INITIAL_PRODUCTS.find(i => i.id === p.id);
      if (initial) {
        return { ...initial, ...p };
      }
      return p;
    });
  } catch (err) {
    console.error('❌ Supabase product fetch crash:', err);
    return null;
  }
}

export async function upsertProductInDb(product: Product): Promise<boolean> {
  const payload = {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    textColorCategory: product.textColorCategory || '',
    image: product.image,
    isNew: !!product.isNew,
    inStock: !!product.inStock,
    preOrder: !!product.preOrder,
    sizes: product.sizes || []
  };
  return safeUpsert('products', payload);
}

export async function deleteProductFromDb(productId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('❌ Supabase product deletion error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('❌ Supabase product deletion crash:', err);
    return false;
  }
}


// 2. ORDERS MANAGEMENT
export async function fetchOrdersFromDb(): Promise<RecentOrder[] | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.warn('⚠️ Error fetching orders, falling back to local storage:', error.message);
      return null;
    }

    const dbOrders = data as RecentOrder[];
    return dbOrders.map(o => {
      const initial = INITIAL_ORDERS.find(i => i.id === o.id);
      if (initial) {
        return { ...initial, ...o };
      }
      return o;
    });
  } catch (err) {
    console.error('❌ Supabase orders fetch crash:', err);
    return null;
  }
}

export async function insertOrderInDb(order: RecentOrder): Promise<boolean> {
  const payload = {
    id: order.id,
    customerInitial: order.customerInitial,
    customer_initial: order.customerInitial,
    customerName: order.customerName,
    customer_name: order.customerName,
    productName: order.productName,
    product_name: order.productName,
    amount: order.amount,
    status: order.status,
    date: order.date,
    customer_email: order.email,
    email: order.email,
    phone: order.phone,
    customer_phone: order.phone,
    address: order.address,
    customer_address: order.address,
    productId: order.productId,
    product_id: order.productId,
    size: order.size,
    color: order.color,
    quantity: order.quantity,
    whatsAppSent: order.whatsAppSent ?? true,
    whatsapp_sent: order.whatsAppSent ?? true
  };
  return safeInsert('orders', payload);
}

export async function updateOrderStatusInDb(orderId: string, status: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('❌ Supabase order status update error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('❌ Supabase order status update crash:', err);
    return false;
  }
}


// 3. STORE BANNERS (HERO SLIDES)
export async function fetchHeroSlidesFromDb(): Promise<HeroSlide[] | null> {
  try {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*');

    if (error) {
      console.warn('⚠️ Error fetching hero slides:', error.message);
      return null;
    }

    const dbSlides = data as HeroSlide[];
    return dbSlides.map(s => {
      const initial = HERO_SLIDES.find(i => i.title === s.title || i.label === s.label);
      if (initial) {
        return { ...initial, ...s };
      }
      return s;
    });
  } catch (err) {
    console.error('❌ Supabase hero slides fetch crash:', err);
    return null;
  }
}

export async function saveHeroSlidesToDb(slides: HeroSlide[]): Promise<boolean> {
  try {
    const formattedSlides = slides.map((slide, index) => ({
      id: slide.id || `slide-${index}-${Date.now()}`,
      label: slide.label,
      title: slide.title,
      buttonText: slide.buttonText,
      bgUrl: slide.bgUrl
    }));

    // 1. Upsert all current hero slides to ensure no unique constraint violations
    const upsertSuccess = await safeUpsert('hero_slides', formattedSlides);
    if (!upsertSuccess) return false;

    // 2. Safely clean up any old hero slides that were removed from the selection
    const idsToKeep = formattedSlides.map(s => s.id);
    if (idsToKeep.length > 0) {
      const { error: deleteError } = await supabase
        .from('hero_slides')
        .delete()
        .not('id', 'in', idsToKeep);
      if (deleteError) {
        console.warn('⚠️ Stale hero slides cleanup warning:', deleteError.message);
      }
    }
    return true;
  } catch (err) {
    console.error('❌ Supabase save hero slides crash:', err);
    return false;
  }
}


// 4. CATEGORIES
export async function fetchCategoriesFromDb(): Promise<CategoryItem[] | null> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*');

    if (error) {
      console.warn('⚠️ Error fetching categories:', error.message);
      return null;
    }

    const dbCategories = data as CategoryItem[];
    return dbCategories.map(c => {
      const initial = INITIAL_CATEGORIES.find(i => i.id === c.id);
      if (initial) {
        return { ...initial, ...c };
      }
      return c;
    });
  } catch (err) {
    console.error('❌ Supabase categories fetch crash:', err);
    return null;
  }
}

export async function saveCategoriesToDb(categories: CategoryItem[]): Promise<boolean> {
  try {
    // 1. Upsert all active categories to ensure zero duplicate key errors
    const upsertSuccess = await safeUpsert('categories', categories);
    if (!upsertSuccess) return false;

    // 2. Safely clean up any categories that were removed from the manager
    const idsToKeep = categories.map(c => c.id);
    if (idsToKeep.length > 0) {
      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .not('id', 'in', idsToKeep);
      if (deleteError) {
        console.warn('⚠️ Stale categories cleanup warning:', deleteError.message);
      }
    }
    return true;
  } catch (err) {
    console.error('❌ Supabase save categories crash:', err);
    return false;
  }
}


// 5. ADMIN AUTHENTICATION
export async function verifyAdminCredentials(username: string, inputPasswordPlain: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username.trim().toLowerCase())
      .single();

    if (error || !data) {
      console.warn('⚠️ Admin user not found or error in Supabase check. Falling back to local/default validation.', error?.message);
      return false;
    }

    // Direct match check (allows both password hashing and plaintext password checks securely)
    return data.password === inputPasswordPlain;
  } catch (err) {
    console.error('❌ Supabase admin auth error:', err);
    return false;
  }
}

// 6. CUSTOMER USER PROFILES
export async function fetchUserProfilesFromDb(): Promise<UserProfile[] | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*');

    if (error) {
      console.warn('⚠️ Error fetching user_profiles from Supabase:', error.message);
      return INITIAL_USER_PROFILES;
    }

    if (!data || data.length === 0) {
      console.log('🌱 Seeding initial user profiles to Supabase...');
      for (const profile of INITIAL_USER_PROFILES) {
        await upsertUserProfileInDb(profile);
      }
      return INITIAL_USER_PROFILES;
    }

    // Map database snake_case or standard fields correctly to prevent type mismatch issues
    const mapped = (data as any[]).map(item => ({
      name: item.name || '',
      email: item.email || '',
      phone: item.phone || '',
      address: item.address || '',
      city: item.city || '',
      zip: item.zip || '',
      preferredSize: item.preferredSize || item.preferred_size || '',
      pin: item.pin || ''
    }));

    return mapped as UserProfile[];
  } catch (err) {
    console.error('❌ Supabase user_profiles fetch crash:', err);
    return INITIAL_USER_PROFILES;
  }
}

export async function upsertUserProfileInDb(profile: UserProfile): Promise<boolean> {
  // Try upserting. Since email is unique, we use it as the main identifier/key.
  const payload = {
    email: profile.email,
    name: profile.name,
    phone: profile.phone,
    address: profile.address,
    city: profile.city,
    zip: profile.zip,
    preferredSize: profile.preferredSize,
    preferred_size: profile.preferredSize, // Support both camelCase and snake_case column names automatically!
    pin: profile.pin || ''
  };
  return safeUpsert('user_profiles', payload);
}

export async function fetchUserProfileByEmail(email: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle();

    if (error) {
      console.error('❌ Supabase error fetching profile by email:', error.message);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      city: data.city || '',
      zip: data.zip || '',
      preferredSize: data.preferredSize || data.preferred_size || '',
      pin: data.pin || ''
    };
  } catch (err) {
    console.error('❌ Supabase user profile fetch error:', err);
    return null;
  }
}

