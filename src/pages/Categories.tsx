import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useInfiniteProducts } from '@/hooks/useInfiniteProducts';
import { useCategories } from '@/hooks/useDatabase';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import CategoryTree from '@/components/products/CategoryTree';
import MobileCategoryPills from '@/components/products/MobileCategoryPills';
import FloatingChatButton from '@/components/FloatingChatButton';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 16;

export default function Categories() {
  const { locale } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>(
    locale === 'zh' ? '全部产品' : 'All Products'
  );

  // Calculate category IDs for filtering (including children)
  const categoryIds = useMemo(() => {
    if (!selectedCategory || !categories) return null;
    
    const selectedCat = categories.find(c => c.slug === selectedCategory);
    if (!selectedCat) return null;
    
    const ids = [selectedCat.id];
    const childCategories = categories.filter(c => c.parent_id === selectedCat.id);
    childCategories.forEach(child => ids.push(child.id));
    
    return ids;
  }, [selectedCategory, categories]);

  // Use infinite query for load more
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: productsLoading,
  } = useInfiniteProducts({
    categoryIds,
    pageSize: PAGE_SIZE,
  });

  // Handle URL parameter for category
  useEffect(() => {
    const categorySlug = searchParams.get('category');
    
    if (categorySlug && categories) {
      const category = categories.find(c => c.slug === categorySlug);
      if (category) {
        setSelectedCategory(categorySlug);
        setSelectedCategoryName(locale === 'zh' ? category.name_zh : (category.name_en || category.name_zh));
      }
    } else if (!categorySlug) {
      setSelectedCategory(null);
      setSelectedCategoryName(locale === 'zh' ? '全部产品' : 'All Products');
    }
  }, [searchParams, categories, locale]);

  const handleSelectCategory = (slug: string, name: string) => {
    if (slug === '') {
      setSelectedCategory(null);
      setSelectedCategoryName(locale === 'zh' ? '全部产品' : 'All Products');
      setSearchParams({});
    } else {
      setSelectedCategory(slug);
      setSelectedCategoryName(name);
      setSearchParams({ category: slug });
    }
    // Scroll to top when category changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const isLoading = productsLoading || categoriesLoading;
  
  // Flatten all pages into single products array
  const products = data?.pages.flatMap(page => page.products) || [];
  const totalCount = data?.pages[0]?.totalCount || 0;
  const loadedCount = products.length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <title>{locale === 'zh' ? '产品分类 - 收银机商城' : 'Categories - POS Store'}</title>
      <meta name="description" content={locale === 'zh' 
        ? '浏览收银机商城产品分类，包括POS终端、收银机、打印机、扫描器等。' 
        : 'Browse POS Store categories including POS terminals, cash registers, printers, scanners and more.'
      } />
      
      <Header />

      {/* Mobile Category Pills - Sticky under header */}
      {!categoriesLoading && categories && (
        <MobileCategoryPills
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
      )}

      {/* Main Content - Native Page Scroll */}
      <div className="flex-1 pt-16 md:pt-20 flex">
        {/* Left Sidebar - Sticky Position on Desktop */}
        <aside className="w-64 lg:w-72 hidden md:block flex-shrink-0">
          <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto border-r border-border bg-card">
            {categoriesLoading ? (
              <div className="p-4 space-y-2">
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <CategoryTree
                categories={categories || []}
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
              />
            )}
          </div>
        </aside>

        {/* Right Content - Products */}
        <main className="flex-1 min-w-0">
          <div className="p-4 md:p-5 lg:p-6">
            <motion.div
              key={selectedCategory || 'all'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Category Header */}
              <div className="mb-4 md:mb-5">
                <h1 className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                  {selectedCategoryName}
                </h1>
                <p className="text-muted-foreground mt-1 text-sm md:text-base">
                  {locale === 'zh' 
                    ? `共 ${totalCount} 款产品` 
                    : `${totalCount} products`}
                </p>
              </div>

              {/* Products Grid */}
              {isLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
                  {[...Array(PAGE_SIZE)].map((_, i) => (
                    <Skeleton key={i} className="aspect-[4/5] rounded-xl" />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
                    {products.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>

                  {/* Load More Button */}
                  {hasNextPage && (
                    <div className="flex justify-center mt-8 md:mt-10">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handleLoadMore}
                        disabled={isFetchingNextPage}
                        className="w-full max-w-md h-12 border-dashed border-2 hover:bg-primary/5 hover:border-primary/50 transition-all"
                      >
                        {isFetchingNextPage ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {locale === 'zh' ? '加载中...' : 'Loading...'}
                          </>
                        ) : (
                          locale === 'zh' 
                            ? `加载更多商品 (${loadedCount}/${totalCount})` 
                            : `Load More (${loadedCount}/${totalCount})`
                        )}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <span className="text-2xl md:text-3xl">📦</span>
                  </div>
                  <h3 className="text-base md:text-lg font-medium text-foreground mb-2">
                    {locale === 'zh' ? '暂无产品' : 'No products found'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'zh' 
                      ? '该分类下暂时没有产品，请选择其他分类' 
                      : 'No products in this category, please select another'}
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Footer - Inside content area */}
          <Footer />
        </main>
      </div>

      {/* Floating Chat Button */}
      <FloatingChatButton />
    </div>
  );
}
