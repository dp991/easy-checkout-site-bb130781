import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCategories, useProducts } from '@/hooks/useDatabase';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import CategoryCard from '@/components/products/CategoryCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import HeroSection from '@/components/home/HeroSection';
import StickyBottomBar from '@/components/home/StickyBottomBar';

export default function Index() {
  const { t, locale } = useLanguage();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: products, isLoading: productsLoading } = useProducts();

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="container-wide">
          <div className="flex items-end justify-between mb-10 md:mb-12">
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-nav text-muted-foreground"
              >
                {locale === 'zh' ? '产品系列' : 'Product Lines'}
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mt-2 tracking-tight"
              >
                {t.categories.title}
              </motion.h2>
            </div>
            <Link
              to="/categories"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground link-underline transition-colors text-sm"
            >
              {t.common.seeAll}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {categories?.filter(c => !c.parent_id).slice(0, 8).map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="flex items-end justify-between mb-10 md:mb-12">
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-nav text-muted-foreground"
              >
                {locale === 'zh' ? '精选推荐' : 'Best Sellers'}
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mt-2 tracking-tight"
              >
                {t.products.featured}
              </motion.h2>
            </div>
            <Link
              to="/categories"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground link-underline transition-colors text-sm"
            >
              {t.common.seeAll}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {products?.slice(0, 8).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <span className="text-nav text-muted-foreground">
              {locale === 'zh' ? '开始您的业务' : 'Start Your Business'}
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mt-4 tracking-tight">
              {locale === 'zh' ? '准备好开始了吗？' : 'Ready to get started?'}
            </h2>
            <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-lg mx-auto">
              {locale === 'zh' 
                ? '联系我们的销售团队，获取专属报价和定制解决方案。'
                : 'Contact our sales team for exclusive quotes and customized solutions.'}
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
                <Button size="lg">
                  {t.nav.inquiry}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <a
                href="https://wa.me/8613800138000"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg">
                  {t.contact.whatsapp}
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sticky Bottom Bar for Mobile */}
      <StickyBottomBar />
      
      {/* Bottom padding for sticky bar on mobile */}
      <div className="h-20 md:hidden" />
    </Layout>
  );
}
