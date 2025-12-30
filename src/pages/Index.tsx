import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Truck, Headphones, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCategories, useProducts } from '@/hooks/useDatabase';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import CategoryCard from '@/components/products/CategoryCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import heroImage from '@/assets/hero-pos.jpg';

export default function Index() {
  const { t, locale } = useLanguage();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: products, isLoading: productsLoading } = useProducts();

  const features = [
    {
      icon: Shield,
      title: locale === 'zh' ? '品质保证' : 'Quality Assured',
      description: locale === 'zh' ? '严格质检，1年质保' : 'Strict QC, 1-Year Warranty',
    },
    {
      icon: Truck,
      title: locale === 'zh' ? '全球配送' : 'Global Shipping',
      description: locale === 'zh' ? '快速发货至全球' : 'Fast delivery worldwide',
    },
    {
      icon: Headphones,
      title: locale === 'zh' ? '专业支持' : '24/7 Support',
      description: locale === 'zh' ? '全天候技术支持' : 'Round-the-clock assistance',
    },
    {
      icon: Award,
      title: locale === 'zh' ? '行业领先' : 'Industry Leader',
      description: locale === 'zh' ? '10年出口经验' : '10+ years export experience',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center overflow-hidden">
        {/* Background Image - Right Side */}
        <div className="absolute inset-0">
          <div className="absolute inset-y-0 right-0 w-full lg:w-3/5">
            <img
              src={heroImage}
              alt="POS Terminal"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          </div>
          <div className="absolute inset-0 bg-background lg:bg-transparent" />
          <div className="absolute inset-0 lg:hidden bg-background/90" />
        </div>

        <div className="container-wide relative z-10 py-10 md:py-16 lg:py-20 px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-4 md:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium">
                  {locale === 'zh' ? '🚀 专业POS解决方案提供商' : '🚀 Professional POS Solutions Provider'}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
              >
                {t.hero.title}
                <span className="block text-gradient-gold mt-1 md:mt-2">{t.hero.subtitle}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-sm md:text-lg text-muted-foreground max-w-xl"
              >
                {t.hero.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2"
              >
                <Link to="/categories" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-gold text-primary-foreground hover:opacity-90 font-semibold h-11 md:h-12 px-6 md:px-8">
                    {t.hero.cta}
                    <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                </Link>
                <Link to="/contact" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-11 md:h-12 px-6 md:px-8 border-border hover:bg-muted">
                    {t.hero.ctaSecondary}
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Right Spacer for layout balance */}
            <div className="hidden lg:block" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-6 md:py-10 border-b border-border">
        <div className="container-wide px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-3 md:p-6"
              >
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2 md:mb-4">
                  <feature.icon className="w-5 h-5 md:w-7 md:h-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-sm md:text-base">{feature.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 md:py-12">
        <div className="container-wide px-4 md:px-6">
          <div className="flex items-end justify-between mb-4 md:mb-6">
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
                className="font-display text-xl sm:text-2xl md:text-4xl font-bold text-foreground mt-1 md:mt-2"
              >
                {t.categories.title}
              </motion.h2>
            </div>
            <Link
              to="/categories"
              className="flex items-center gap-1 md:gap-2 text-primary hover:text-primary/80 font-medium transition-colors text-sm"
            >
              {t.common.seeAll}
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
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
      <section className="py-8 md:py-12 bg-card/50">
        <div className="container-wide px-4 md:px-6">
          <div className="flex items-end justify-between mb-4 md:mb-6">
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
                className="font-display text-xl sm:text-2xl md:text-4xl font-bold text-foreground mt-1 md:mt-2"
              >
                {t.products.featured}
              </motion.h2>
            </div>
            <Link
              to="/categories"
              className="flex items-center gap-1 md:gap-2 text-primary hover:text-primary/80 font-medium transition-colors text-sm"
            >
              {t.common.seeAll}
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
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
      <section className="py-8 md:py-12">
        <div className="container-wide px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/20 p-5 md:p-8 lg:p-12"
          >
            <div className="relative z-10 max-w-xl">
              <h2 className="font-display text-lg sm:text-xl md:text-3xl font-bold text-foreground">
                {locale === 'zh' ? '准备好开始了吗？' : 'Ready to get started?'}
              </h2>
              <p className="mt-2 md:mt-3 text-muted-foreground text-sm md:text-base">
                {locale === 'zh' 
                  ? '联系我们的销售团队，获取专属报价和定制解决方案。'
                  : 'Contact our sales team for exclusive quotes and customized solutions.'}
              </p>
              <div className="mt-4 md:mt-6 flex flex-col sm:flex-row gap-3 md:gap-4">
                <Link to="/contact" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-gold text-primary-foreground hover:opacity-90 font-semibold">
                    {t.nav.inquiry}
                  </Button>
                </Link>
                <a
                  href="https://wa.me/8613800138000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button variant="outline" className="w-full sm:w-auto border-primary/30 hover:bg-primary/10">
                    {t.contact.whatsapp}
                  </Button>
                </a>
              </div>
            </div>

            <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 hidden sm:block">
              <div className="absolute right-10 top-10 w-40 h-40 rounded-full bg-primary blur-3xl" />
              <div className="absolute right-40 bottom-10 w-60 h-60 rounded-full bg-primary/50 blur-3xl" />
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
