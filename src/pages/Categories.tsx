import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProducts, useCategories } from '@/hooks/useDatabase';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import CategoryTree from '@/components/products/CategoryTree';
import ProductPagination from '@/components/products/ProductPagination';
import { Skeleton } from '@/components/ui/skeleton';

const PAGE_SIZE = 12;

export default function Categories() {
  const { locale } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>(
    locale === 'zh' ? '全部产品' : 'All Products'
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedPages, setLoadedPages] = useState(1); // For "Load More" feature
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Handle URL parameter for category and page
  useEffect(() => {
    const categorySlug = searchParams.get('category');
    const pageParam = searchParams.get('page');
    
    if (categorySlug && categories) {
      const category = categories.find(c => c.slug === categorySlug);
      if (category) {
        setSelectedCategory(categorySlug);
        setSelectedCategoryName(locale === 'zh' ? category.name_zh : category.name_en);
      }
    } else if (!categorySlug) {
      setSelectedCategory(null);
      setSelectedCategoryName(locale === 'zh' ? '全部产品' : 'All Products');
    }
    
    if (pageParam) {
      const page = parseInt(pageParam, 10);
      if (!isNaN(page) && page >= 1) {
        setCurrentPage(page);
        setLoadedPages(page);
      }
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
    // Reset pagination when category changes
    setCurrentPage(1);
    setLoadedPages(1);
  };

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!selectedCategory) return products;
    
    // Find the selected category
    const selectedCat = categories?.find(c => c.slug === selectedCategory);
    if (!selectedCat) return products;
    
    // Check if product belongs to this category or its children
    const categoryIds = [selectedCat.id];
    const childCategories = categories?.filter(c => c.parent_id === selectedCat.id) || [];
    childCategories.forEach(child => categoryIds.push(child.id));
    
    return products.filter(product => 
      product.category_id && categoryIds.includes(product.category_id)
    );
  }, [products, selectedCategory, categories]);

  // Pagination calculations
  const totalCount = filteredProducts.length;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  
  // Products to display (supports "load more" by showing all loaded pages)
  const displayedProducts = useMemo(() => {
    const endIndex = loadedPages * PAGE_SIZE;
    return filteredProducts.slice(0, endIndex);
  }, [filteredProducts, loadedPages]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    
    setCurrentPage(page);
    setLoadedPages(page); // Reset loaded pages to match current page
    
    // Update URL
    const newParams = new URLSearchParams(searchParams);
    if (page === 1) {
      newParams.delete('page');
    } else {
      newParams.set('page', page.toString());
    }
    setSearchParams(newParams);
    
    // Scroll to top of products grid
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadMore = async () => {
    if (loadedPages >= totalPages) return;
    
    setIsLoadingMore(true);
    // Simulate async loading delay for smooth UX
    await new Promise(resolve => setTimeout(resolve, 300));
    setLoadedPages(prev => prev + 1);
    setIsLoadingMore(false);
  };

  const isLoading = productsLoading || categoriesLoading;

  return (
    <Layout>
      <title>{locale === 'zh' ? '产品分类 - 收银机商城' : 'Categories - POS Store'}</title>
      <meta name="description" content={locale === 'zh' 
        ? '浏览收银机商城产品分类，包括POS终端、收银机、打印机、扫描器等。' 
        : 'Browse POS Store categories including POS terminals, cash registers, printers, scanners and more.'
      } />

      <div className="relative">
        {/* Left Sidebar - Category Tree (Fixed Position) */}
        <aside className="w-72 fixed left-0 top-[80px] bottom-0 border-r border-border bg-card/50 hidden md:block overflow-y-auto z-30">
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
        </aside>

        {/* Right Content - Products Grid (with left margin for fixed sidebar) */}
        <main className="md:ml-72 p-6 lg:p-8 min-h-[calc(100vh-80px)]">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Category Header */}
            <div className="mb-6">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                {selectedCategoryName}
              </h1>
              <p className="text-muted-foreground mt-1">
                {locale === 'zh' 
                  ? `共 ${totalCount} 款产品` 
                  : `${totalCount} products`}
              </p>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(PAGE_SIZE)].map((_, i) => (
                  <Skeleton key={i} className="aspect-[4/5] rounded-xl" />
                ))}
              </div>
            ) : displayedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayedProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                <ProductPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  showLoadMore={displayedProducts.length < totalCount}
                  onLoadMore={handleLoadMore}
                  loadedCount={displayedProducts.length}
                  totalCount={totalCount}
                  isLoadingMore={isLoadingMore}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <span className="text-3xl">📦</span>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {locale === 'zh' ? '暂无产品' : 'No products found'}
                </h3>
                <p className="text-muted-foreground">
                  {locale === 'zh' 
                    ? '该分类下暂时没有产品，请选择其他分类' 
                    : 'No products in this category, please select another'}
                </p>
              </div>
            )}
          </motion.div>
        </main>

        {/* Mobile Category Selector */}
        <div className="md:hidden fixed bottom-20 left-4 right-4 z-40">
          <select
            value={selectedCategory || ''}
            onChange={(e) => {
              const slug = e.target.value;
              if (slug === '') {
                handleSelectCategory('', locale === 'zh' ? '全部产品' : 'All Products');
              } else {
                const cat = categories?.find(c => c.slug === slug);
                if (cat) {
                  handleSelectCategory(cat.slug, locale === 'zh' ? cat.name_zh : cat.name_en);
                }
              }
            }}
            className="w-full px-4 py-3 rounded-xl bg-card border border-border shadow-lg text-foreground"
          >
            <option value="">{locale === 'zh' ? '全部产品' : 'All Products'}</option>
            {categories?.filter(c => !c.parent_id).map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {locale === 'zh' ? cat.name_zh : cat.name_en}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Layout>
  );
}
