import { useQuery } from '@tanstack/react-query';
import { supabase, DbCategory, DbProduct } from '@/lib/supabase';

// Fetch all categories
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<DbCategory[]> => {
      const { data, error } = await supabase
        .from('wh_categories')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });
}

// Fetch all products
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<DbProduct[]> => {
      const { data, error } = await supabase
        .from('wh_products')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });
}

// Fetch featured products
export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async (): Promise<DbProduct[]> => {
      const { data, error } = await supabase
        .from('wh_products')
        .select('*')
        .eq('is_featured', true)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });
}

// Fetch product by slug
export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ['products', slug],
    queryFn: async (): Promise<DbProduct | null> => {
      const { data, error } = await supabase
        .from('wh_products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

// Fetch category by slug
export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: ['categories', slug],
    queryFn: async (): Promise<DbCategory | null> => {
      const { data, error } = await supabase
        .from('wh_categories')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

// Fetch products by category
export function useProductsByCategory(categoryId: string) {
  return useQuery({
    queryKey: ['products', 'category', categoryId],
    queryFn: async (): Promise<DbProduct[]> => {
      const { data, error } = await supabase
        .from('wh_products')
        .select('*')
        .eq('category_id', categoryId)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!categoryId,
  });
}

// Submit inquiry
export async function submitInquiry(inquiry: {
  product_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_company?: string;
  message: string;
  source?: string;
}) {
  const { data, error } = await supabase
    .from('wh_inquiries')
    .insert([{
      ...inquiry,
      source: inquiry.source || 'web',
      status: 'pending',
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
