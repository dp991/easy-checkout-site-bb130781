import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Send, ChevronLeft, ChevronRight, Package, Truck, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProductBySlug, useProducts, useCategoryBySlug } from '@/hooks/useDatabase';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t, locale } = useLanguage();
  const [currentImage, setCurrentImage] = useState(0);

  const { data: product, isLoading } = useProductBySlug(slug || '');
  const { data: allProducts } = useProducts();

  // Get category slug based on product's category
  const categorySlugMap: Record<string, string> = {
    'pos-terminals': 'pos-terminals',
    'cash-registers': 'cash-registers',
    'receipt-printers': 'receipt-printers',
    'barcode-scanners': 'barcode-scanners',
    'cash-drawers': 'cash-drawers',
    'accessories': 'accessories',
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container-wide py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container-wide py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            {locale === 'zh' ? '产品未找到' : 'Product not found'}
          </h1>
          <Link to="/products" className="text-primary mt-4 inline-block">
            {t.common.back}
          </Link>
        </div>
      </Layout>
    );
  }

  const name = locale === 'zh' ? product.name_zh : product.name_en;
  const description = locale === 'zh' ? product.description_zh : product.description_en;
  const priceMin = product.price_min ?? 0;
  const priceMax = product.price_max ?? 0;
  const priceRange = priceMin === priceMax ? `$${priceMin}` : `$${priceMin} - $${priceMax}`;
  const images = product.images || [];
  const specs = product.specs || {};

  const relatedProducts = allProducts
    ?.filter(p => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 3) || [];

  const whatsappMessage = encodeURIComponent(`Hello, I'm interested in ${name}. Please provide more details and pricing.`);

  return (
    <Layout>
      <title>{name} - {locale === 'zh' ? '收银机商城' : 'POS Store'}</title>
      <meta name="description" content={description?.slice(0, 160) || ''} />

      <div className="container-wide py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">
            {t.nav.home}
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-foreground transition-colors">
            {t.nav.products}
          </Link>
          <span>/</span>
          <span className="text-foreground">{name}</span>
        </nav>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative aspect-square rounded-xl overflow-hidden metal-surface">
              <img
                src={images[currentImage] || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800'}
                alt={name}
                className="w-full h-full object-cover"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {product.is_new && (
                  <Badge className="bg-gradient-gold text-primary-foreground border-0">NEW</Badge>
                )}
                {product.is_featured && (
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                    {locale === 'zh' ? '热门' : 'Featured'}
                  </Badge>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      idx === currentImage ? 'border-primary' : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {name}
              </h1>
              <div className="flex items-center gap-3 mt-4">
                <span className="text-3xl font-bold text-primary">{priceRange}</span>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  product.stock_status === 'in_stock'
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-destructive/10 text-destructive'
                }`}>
                  {product.stock_status === 'in_stock' ? t.products.inStock : t.products.outOfStock}
                </span>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">{description}</p>

            {/* Specs */}
            {Object.keys(specs).length > 0 && (
              <div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-4">
                  {t.products.specifications}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">{key}</span>
                      <span className="text-sm font-medium text-foreground">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Min Order */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package className="w-5 h-5" />
              <span>{t.products.minOrder}: {product.min_order} {locale === 'zh' ? '台' : 'pcs'}</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <a
                href={`https://wa.me/8613800138000?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="w-full h-12 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {t.contact.whatsapp}
                </Button>
              </a>
              <a
                href="https://t.me/posstore"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="w-full h-12 bg-[#0088cc] hover:bg-[#0077b3] text-white font-semibold">
                  <Send className="w-5 h-5 mr-2" />
                  {t.contact.telegram}
                </Button>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="text-center">
                <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">
                  {locale === 'zh' ? '质量保证' : 'Quality Assured'}
                </p>
              </div>
              <div className="text-center">
                <Truck className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">
                  {locale === 'zh' ? '全球配送' : 'Global Shipping'}
                </p>
              </div>
              <div className="text-center">
                <Package className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">
                  {locale === 'zh' ? '安全包装' : 'Secure Packing'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
              {t.products.relatedProducts}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p, index) => (
                <ProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
