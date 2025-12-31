import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase, DbProduct } from '@/lib/supabase';

interface InfiniteProductsParams {
  categoryIds?: string[] | null;
  pageSize: number;
}

interface ProductsPage {
  products: DbProduct[];
  totalCount: number;
  nextPage: number | null;
}

export function useInfiniteProducts({ categoryIds, pageSize }: InfiniteProductsParams) {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite', categoryIds, pageSize],
    queryFn: async ({ pageParam = 1 }): Promise<ProductsPage> => {
      const from = (pageParam - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('wh_products')
        .select('*', { count: 'exact' });

      if (categoryIds && categoryIds.length > 0) {
        query = query.in('category_id', categoryIds);
      }

      const { data, error, count } = await query
        .order('sort_order', { ascending: true })
        .range(from, to);

      if (error) throw error;

      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / pageSize);
      const nextPage = pageParam < totalPages ? pageParam + 1 : null;

      return {
        products: data || [],
        totalCount,
        nextPage,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}
