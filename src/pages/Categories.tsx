import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePaginatedProducts, useCategories } from '@/hooks/useDatabase';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingContact from '@/components/layout/FloatingContact';
import ProductCard from '@/components/products/ProductCard';
import CategoryTree from '@/components/products/CategoryTree';
import ProductPagination from '@/components/products/ProductPagination';
import { Skeleton } from '@/components/ui/skeleton';

const PAGE_SIZE = 12;

export default function Categories() {
  const { locale } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>(
    locale === 'zh' ? '全部产品' : 'All Products'
  );
  const [currentPage, setCurrentPage] = useState(1);

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

  // Use paginated query
  const { data: paginatedData, isLoading: productsLoading } = usePaginatedProducts({
    categoryIds,
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  // Handle URL parameter for category and page
  useEffect(() => {
    const categorySlug = searchParams.get('category');
    const pageParam = searchParams.get('page');
    
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
    
    if (pageParam) {
      const page = parseInt(pageParam, 10);
      if (!isNaN(page) && page >= 1) {
        setCurrentPage(page);
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
  };

  const handlePageChange = (page: number) => {
    const totalPages = paginatedData?.totalPages || 1;
    if (page < 1 || page > totalPages) return;
    
    setCurrentPage(page);
    
    // Update URL
    const newParams = new URLSearchParams(searchParams);
    if (page === 1) {
      newParams.delete('page');
    } else {
      newParams.set('page', page.toString());
    }
    setSearchParams(newParams);
    
    // Scroll to top of products grid
    document.getElementById('products-area')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isLoading = productsLoading || categoriesLoading;
  const products = paginatedData?.products || [];
  const totalCount = paginatedData?.totalCount || 0;
  const totalPages = paginatedData?.totalPages || 1;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <title>{locale === 'zh' ? '产品分类 - 收银机商城' : 'Categories - POS Store'}</title>
      <meta name="description" content={locale === 'zh' 
        ? '浏览收银机商城产品分类，包括POS终端、收银机、打印机、扫描器等。' 
        : 'Browse POS Store categories including POS terminals, cash registers, printers, scanners and more.'
      } />
      
      <Header />

      {/* Main Content Area - Fixed Layout */}
      <div className="flex-1 pt-16 md:pt-20 flex">
        {/* Left Sidebar - Fixed Position */}
        <aside className="w-64 lg:w-72 fixed left-0 top-16 md:top-20 bottom-0 border-r border-border bg-card hidden md:block overflow-y-auto z-40">
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

        {/* Right Content - Scrollable Products Area */}
        <main id="products-area" className="flex-1 md:ml-64 lg:ml-72 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8 min-h-full pb-24 md:pb-8">
            <motion.div
              key={`${selectedCategory}-${currentPage}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Category Header */}
              <div className="mb-4 md:mb-6">
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
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                  {[...Array(PAGE_SIZE)].map((_, i) => (
                    <Skeleton key={i} className="aspect-[4/5] rounded-xl" />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                    {products.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>

                  {/* Pagination - Always show if more than 1 page */}
                  {totalPages > 1 && (
                    <ProductPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      showLoadMore={false}
                      loadedCount={products.length}
                      totalCount={totalCount}
                    />
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted flex items-center justify-center mb-3 md:mb-4">
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

          {/* Footer - Inside the scrollable area */}
          <Footer />
        </main>
      </div>

      {/* Mobile Category Selector */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
        <select
          value={selectedCategory || ''}
          onChange={(e) => {
            const slug = e.target.value;
            if (slug === '') {
              handleSelectCategory('', locale === 'zh' ? '全部产品' : 'All Products');
            } else {
              const cat = categories?.find(c => c.slug === slug);
              if (cat) {
                handleSelectCategory(cat.slug, locale === 'zh' ? cat.name_zh : (cat.name_en || cat.name_zh));
              }
            }
          }}
          className="w-full px-4 py-3 rounded-xl bg-card border border-border shadow-lg text-foreground text-sm"
        >
          <option value="">{locale === 'zh' ? '全部产品' : 'All Products'}</option>
          {categories?.filter(c => !c.parent_id).map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {locale === 'zh' ? cat.name_zh : (cat.name_en || cat.name_zh)}
            </option>
          ))}
        </select>
      </div>

      <FloatingContact />
    </div>
  );
}
