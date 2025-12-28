import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProducts } from '@/hooks/useDatabase';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import CategoryTree from '@/components/products/CategoryTree';
import { categoryTree } from '@/lib/categoryData';
import { Skeleton } from '@/components/ui/skeleton';

export default function Categories() {
  const { locale } = useLanguage();
  const { data: products, isLoading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('全部产品');

  const handleSelectCategory = (slug: string, name: string) => {
    setSelectedCategory(slug);
    setSelectedCategoryName(name);
  };

  return (
    <Layout>
      <title>{locale === 'zh' ? '产品分类 - 收银机商城' : 'Categories - POS Store'}</title>
      <meta name="description" content={locale === 'zh' 
        ? '浏览收银机商城产品分类，包括POS终端、收银机、打印机、扫描器等。' 
        : 'Browse POS Store categories including POS terminals, cash registers, printers, scanners and more.'
      } />

      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Left Sidebar - Category Tree */}
        <aside className="w-72 shrink-0 border-r border-border bg-card/50 hidden md:block">
          <CategoryTree
            categories={categoryTree}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />
        </aside>

        {/* Right Content - Products Grid */}
        <main className="flex-1 p-6 lg:p-8">
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
                  ? `共 ${products?.length || 0} 款产品` 
                  : `${products?.length || 0} products`}
              </p>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="aspect-[4/5] rounded-xl" />
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
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
              const cat = categoryTree.find(c => c.slug === e.target.value);
              if (cat) {
                handleSelectCategory(cat.slug, cat.name);
              }
            }}
            className="w-full px-4 py-3 rounded-xl bg-card border border-border shadow-lg text-foreground"
          >
            <option value="">{locale === 'zh' ? '选择分类' : 'Select Category'}</option>
            {categoryTree.map((cat) => (
              <option key={cat.slug} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>
    </Layout>
  );
}
