import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories } from '@/lib/mockData';
import Layout from '@/components/layout/Layout';
import CategoryCard from '@/components/products/CategoryCard';

export default function Categories() {
  const { t, locale } = useLanguage();

  return (
    <Layout>
      <title>{locale === 'zh' ? '产品分类 - 收银机商城' : 'Categories - POS Store'}</title>
      <meta name="description" content={locale === 'zh' 
        ? '浏览收银机商城产品分类，包括POS终端、收银机、打印机、扫描器等。' 
        : 'Browse POS Store categories including POS terminals, cash registers, printers, scanners and more.'
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
              {locale === 'zh' ? '产品系列' : 'Product Lines'}
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3">
              {t.categories.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {locale === 'zh'
                ? '选择适合您业务的产品类别，找到最佳解决方案。'
                : 'Choose the product category that fits your business needs.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 md:py-16">
        <div className="container-wide">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
