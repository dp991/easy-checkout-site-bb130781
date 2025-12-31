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
      <section className="py-10 md:py-16 border-t border-border/50">
        <div className="container-wide px-4 md:px-6">
          <div className="flex items-end justify-between mb-6 md:mb-10">
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-primary text-xs md:text-sm font-medium uppercase tracking-wider"
              >
                {locale === 'zh' ? '产品系列' : 'Product Lines'}
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mt-2 tracking-tighter"
              >
                {t.categories.title}
              </motion.h2>
            </div>
            <Link
              to="/categories"
              className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors text-sm group"
            >
              {t.common.seeAll}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {categories?.filter(c => !c.parent_id).slice(0, 8).map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-10 md:py-16 bg-gradient-to-b from-card/30 to-transparent">
        <div className="container-wide px-4 md:px-6">
          <div className="flex items-end justify-between mb-6 md:mb-10">
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-primary text-xs md:text-sm font-medium uppercase tracking-wider"
              >
                {locale === 'zh' ? '精选推荐' : 'Best Sellers'}
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mt-2 tracking-tighter"
              >
                {t.products.featured}
              </motion.h2>
            </div>
            <Link
              to="/categories"
              className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors text-sm group"
            >
              {t.common.seeAll}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {products?.slice(0, 8).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-16">
        <div className="container-wide px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-card/50 backdrop-blur-xl border border-border/50 p-6 md:p-10 lg:p-16"
          >
            {/* Background effects */}
            <div className="absolute inset-0 industrial-grid opacity-20" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] opacity-30" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] opacity-20" />

            <div className="relative z-10 max-w-2xl mx-auto text-center">

              <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-foreground tracking-tighter">
                {locale === 'zh' ? '准备好开始了吗？' : 'Ready to get started?'}
              </h2>
              <p className="mt-4 text-muted-foreground text-sm md:text-lg max-w-lg mx-auto">
                {locale === 'zh' 
                  ? '联系我们的销售团队，获取专属报价和定制解决方案。'
                  : 'Contact our sales team for exclusive quotes and customized solutions.'}
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-gold rounded-lg blur-lg opacity-40 group-hover:opacity-70 transition-opacity" />
                  <Link to="/contact" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
                    <Button className="relative bg-gradient-gold text-primary-foreground hover:opacity-90 font-semibold h-12 px-8">
                      {t.nav.inquiry}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <a
                  href="https://wa.me/8613800138000"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button 
                    variant="outline" 
                    className="h-12 px-8 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card hover:text-foreground"
                  >
                    {t.contact.whatsapp}
                  </Button>
                </a>
              </div>
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
