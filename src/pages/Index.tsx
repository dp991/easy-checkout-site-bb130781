import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Truck, Headphones, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCategories, useFeaturedProducts } from '@/hooks/useDatabase';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import CategoryCard from '@/components/products/CategoryCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import heroImage from '@/assets/hero-pos.jpg';

export default function Index() {
  const { t, locale } = useLanguage();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: featuredProducts, isLoading: productsLoading } = useFeaturedProducts();

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
      <section className="relative min-h-[90vh] flex items-center overflow-hidden industrial-grid">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
          <img
            src={heroImage}
            alt="POS Terminal"
            className="absolute right-0 top-0 h-full w-2/3 object-cover object-left opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        </div>

        <div className="container-wide relative z-10 py-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                {locale === 'zh' ? '🚀 专业POS解决方案提供商' : '🚀 Professional POS Solutions Provider'}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
            >
              {t.hero.title}
              <span className="block text-gradient-gold mt-2">{t.hero.subtitle}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg text-muted-foreground max-w-xl"
            >
              {t.hero.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link to="/products">
                <Button size="lg" className="bg-gradient-gold text-primary-foreground hover:opacity-90 font-semibold h-12 px-8">
                  {t.hero.cta}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="h-12 px-8 border-border hover:bg-muted">
                  {t.hero.ctaSecondary}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 border-b border-border">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container-wide">
          <div className="flex items-end justify-between mb-10">
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-primary text-sm font-medium uppercase tracking-wider"
              >
                {locale === 'zh' ? '产品系列' : 'Product Lines'}
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2"
              >
                {t.categories.title}
              </motion.h2>
            </div>
            <Link
              to="/categories"
              className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {t.common.seeAll}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories?.slice(0, 6).map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-card/50">
        <div className="container-wide">
          <div className="flex items-end justify-between mb-10">
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-primary text-sm font-medium uppercase tracking-wider"
              >
                {locale === 'zh' ? '精选推荐' : 'Best Sellers'}
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2"
              >
                {t.products.featured}
              </motion.h2>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {t.common.seeAll}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts?.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/20 p-8 md:p-12"
          >
            <div className="relative z-10 max-w-xl">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                {locale === 'zh' ? '准备好开始了吗？' : 'Ready to get started?'}
              </h2>
              <p className="mt-3 text-muted-foreground">
                {locale === 'zh' 
                  ? '联系我们的销售团队，获取专属报价和定制解决方案。'
                  : 'Contact our sales team for exclusive quotes and customized solutions.'}
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link to="/contact">
                  <Button className="bg-gradient-gold text-primary-foreground hover:opacity-90 font-semibold">
                    {t.nav.inquiry}
                  </Button>
                </Link>
                <a
                  href="https://wa.me/8613800138000"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
                    {t.contact.whatsapp}
                  </Button>
                </a>
              </div>
            </div>

            <div className="absolute right-0 top-0 w-1/2 h-full opacity-20">
              <div className="absolute right-10 top-10 w-40 h-40 rounded-full bg-primary blur-3xl" />
              <div className="absolute right-40 bottom-10 w-60 h-60 rounded-full bg-primary/50 blur-3xl" />
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
