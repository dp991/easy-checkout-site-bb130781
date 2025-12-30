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

// Paginated products query
interface PaginatedProductsParams {
  categoryIds?: string[] | null;
  page: number;
  pageSize: number;
}

interface PaginatedProductsResult {
  products: DbProduct[];
  totalCount: number;
  totalPages: number;
}

export function usePaginatedProducts({ categoryIds, page, pageSize }: PaginatedProductsParams) {
  return useQuery({
    queryKey: ['products', 'paginated', categoryIds, page, pageSize],
    queryFn: async (): Promise<PaginatedProductsResult> => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('wh_products')
        .select('*', { count: 'exact' });

      // Filter by category IDs if provided
      if (categoryIds && categoryIds.length > 0) {
        query = query.in('category_id', categoryIds);
      }

      const { data, error, count } = await query
        .order('sort_order', { ascending: true })
        .range(from, to);

      if (error) throw error;

      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        products: data || [],
        totalCount,
        totalPages,
      };
    },
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

// Fetch site settings
export function useSiteSettings() {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wh_site_settings')
        .select('*');
      
      if (error) throw error;
      
      // Convert to key-value object
      const settings: Record<string, unknown> = {};
      data?.forEach(item => {
        settings[item.key] = item.value;
      });
      
      return settings;
    },
  });
}

// Fetch specific setting
export function useSiteSetting(key: string) {
  return useQuery({
    queryKey: ['site-settings', key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wh_site_settings')
        .select('value')
        .eq('key', key)
        .maybeSingle();
      
      if (error) throw error;
      return data?.value;
    },
    enabled: !!key,
  });
}
