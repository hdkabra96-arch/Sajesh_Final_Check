-- ==========================================
-- DUODRIPIN DATABASE INITIALIZATION SCHEMA (POSTGRESQL & SUPABASE COMPATIBLE)
-- ==========================================
-- Paste this script directly into your Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- to automatically build all tables, set up proper relationships, and seed baseline parameters.

-- 1. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS public.admin_users (
    username text PRIMARY KEY,
    password text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed initial admin user if not already present
INSERT INTO public.admin_users (username, password)
VALUES ('admin', 'admin123')
ON CONFLICT (username) DO NOTHING;


-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id text PRIMARY KEY,
    category text NOT NULL,
    title text NOT NULL,
    subtitle text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id text PRIMARY KEY,
    name text NOT NULL,
    category text NOT NULL,
    price numeric NOT NULL,
    "textColorCategory" text,
    image text,
    "isNew" boolean DEFAULT false,
    "inStock" boolean DEFAULT true,
    "preOrder" boolean DEFAULT false,
    sizes text[] DEFAULT '{}'::text[],
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 4. CUSTOMER USER PROFILES TABLE (THE REQUESTED USER TABLE)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    email text PRIMARY KEY,
    name text NOT NULL,
    phone text,
    address text,
    city text,
    zip text,
    "preferredSize" text,
    preferred_size text, -- Supports camelCase and snake_case references
    pin text DEFAULT '1234', -- 4-digit client login PIN
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 5. ORDERS & INVOICES TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id text PRIMARY KEY,
    "customerInitial" text DEFAULT 'U',
    "customerName" text NOT NULL,
    "productName" text NOT NULL,
    amount numeric NOT NULL,
    status text DEFAULT 'Processing',
    date text NOT NULL,
    customer_email text REFERENCES public.user_profiles(email) ON DELETE SET NULL, -- Establishes clean user relationship!
    phone text,
    customer_phone text,
    address text,
    customer_address text,
    "productId" text,
    product_id text,
    size text,
    quantity integer,
    "whatsAppSent" boolean DEFAULT true,
    whatsapp_sent boolean DEFAULT true,
    customer_name text,
    customer_initial text,
    product_name text,
    email text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 6. STOREFRONT HERO BANNERS TABLE
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id text PRIMARY KEY,
    label text NOT NULL,
    title text NOT NULL,
    "buttonText" text DEFAULT 'Explore Collection',
    "bgUrl" text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ==========================================
-- INDICES & CONSTRAINTS FOR ADVANCED QUERY PERFORMANCE
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_orders_date ON public.orders(date);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);


-- ==========================================
-- DISABLE ROW LEVEL SECURITY (RLS) FOR CLIENT ACCESS
-- ==========================================
-- By default, new Supabase projects may enforce Row Level Security (RLS).
-- Run these commands in your Supabase SQL Editor to allow your client-side 
-- application to fetch and modify data using the Anon key.
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides DISABLE ROW LEVEL SECURITY;

