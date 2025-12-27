import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProducts } from '@/hooks/useDatabase';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function Products() {
  const { t, locale } = useLanguage();
  const { data: products, isLoading } = useProducts();

  return (
    <Layout>
      <title>{locale === 'zh' ? '全部产品 - 收银机商城' : 'All Products - POS Store'}</title>
      <meta name="description" content={locale === 'zh' 
        ? '浏览我们的全系列收银机、POS终端、打印机、扫描器等零售设备。' 
        : 'Browse our full range of cash registers, POS terminals, printers, scanners and retail equipment.'
      } />

      {/* Hero */}
      <section className="py-16 md:py-24 bg-card/50 border-b border-border">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <span className="text-primary text-sm font-medium uppercase tracking-wider">
              {locale === 'zh' ? '产品中心' : 'Product Catalog'}
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3">
              {t.products.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {locale === 'zh'
                ? '探索我们丰富的产品线，满足您的各种零售需求。'
                : 'Explore our extensive product line to meet all your retail needs.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 md:py-16">
        <div className="container-wide">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products?.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
