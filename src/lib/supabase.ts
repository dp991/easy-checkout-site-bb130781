import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions
export interface DbCategory {
  id: string;
  name_zh: string;
  name_en: string;
  slug: string;
  image_url: string | null;
  sort_order: number;
  parent_id: string | null;
  created_at: string;
}

export interface DbProduct {
  id: string;
  category_id: string | null;
  name_zh: string;
  name_en: string | null;
  slug: string;
  description_zh: string | null;
  description_en: string | null;
  description_data_zh: unknown | null;
  description_data_en: unknown | null;
  price: number | null;
  price_min: number | null;
  price_max: number | null;
  min_order: number | null;
  specifications: Record<string, string> | null;
  images: string[] | null;
  is_featured: boolean | null;
  is_new: boolean | null;
  is_active: boolean | null;
  unit: string | null;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
}

export interface DbInquiry {
  id?: string;
  product_id?: string | null;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_company?: string;
  customer_im?: string;
  message?: string;
  source?: string;
  status?: string;
  is_read?: boolean;
  created_at?: string;
}

export interface DbSiteSetting {
  key: string;
  value: unknown;
  description: string | null;
  updated_at: string;
}
