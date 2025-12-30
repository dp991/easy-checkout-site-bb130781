import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Send, ChevronLeft, ChevronRight, Package, Truck, Shield, ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useProductBySlug, useProducts, useCategoryBySlug } from '@/hooks/useDatabase';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t, locale } = useLanguage();
  const { addToCart } = useCart();
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
  const priceMin = product.price_min;
  const priceMax = product.price_max;
  
  const formatPrice = () => {
    if (priceMin && priceMax && priceMin !== priceMax) {
      return `$${priceMin} - $${priceMax}`;
    }
    if (priceMin) return `$${priceMin}`;
    if (priceMax) return `$${priceMax}`;
    return locale === 'zh' ? '询价' : 'Contact';
  };
  const priceRange = formatPrice();
  const images = product.images || [];
  const specs = (product.specifications as Record<string, string>) || {};

  const relatedProducts = allProducts
    ?.filter(p => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 3) || [];

  const whatsappMessage = encodeURIComponent(`Hello, I'm interested in ${name}. Please provide more details and pricing.`);

  return (
    <Layout>
      <title>{name} - {locale === 'zh' ? '收银机商城' : 'POS Store'}</title>
      <meta name="description" content={description?.slice(0, 160) || ''} />

      <div className="container-wide py-4 md:py-8 px-4 md:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mb-4 md:mb-8 flex-wrap">
          <Link to="/" className="hover:text-foreground transition-colors">
            {t.nav.home}
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-foreground transition-colors">
            {t.nav.products}
          </Link>
          <span>/</span>
          <span className="text-foreground line-clamp-1">{name}</span>
        </nav>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-3 md:space-y-4"
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
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                {product.is_new && (
                  <Badge className="bg-gradient-gold text-primary-foreground border-0 text-xs">NEW</Badge>
                )}
                {product.is_featured && (
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs">
                    {locale === 'zh' ? '热门' : 'Featured'}
                  </Badge>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${
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
            className="space-y-4 md:space-y-6"
          >
            <div>
              <h1 className="font-display text-xl sm:text-2xl md:text-4xl font-bold text-foreground">
                {name}
              </h1>
              <div className="flex items-center gap-2 md:gap-3 mt-2 md:mt-4 flex-wrap">
                <span className="text-xl md:text-3xl font-bold text-primary">{priceRange}</span>
                <span className={`text-xs md:text-sm px-2 md:px-3 py-0.5 md:py-1 rounded-full ${
                  product.is_active !== false
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-destructive/10 text-destructive'
                }`}>
                  {product.is_active !== false ? t.products.inStock : t.products.outOfStock}
                </span>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{description}</p>

            {/* Specs */}
            {Object.keys(specs).length > 0 && (
              <div>
                <h3 className="font-display font-semibold text-base md:text-lg text-foreground mb-3 md:mb-4">
                  {t.products.specifications}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-2 md:p-3 rounded-lg bg-muted/50">
                      <span className="text-xs md:text-sm text-muted-foreground">{key}</span>
                      <span className="text-xs md:text-sm font-medium text-foreground">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Min Order */}
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Package className="w-4 h-4 md:w-5 md:h-5" />
              <span>{t.products.minOrder}: {product.min_order} {locale === 'zh' ? '台' : 'pcs'}</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-2 md:gap-3 pt-2 md:pt-4">
              <Button 
                onClick={() => addToCart(product.id)}
                className="w-full h-11 md:h-12 bg-gradient-gold text-primary-foreground hover:opacity-90 font-semibold"
              >
                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                {locale === 'zh' ? '加入购物车' : 'Add to Cart'}
              </Button>
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                <a
                  href={`https://wa.me/8613800138000?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full h-10 md:h-12 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm md:text-base">
                    <MessageCircle className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">{t.contact.whatsapp}</span>
                    <span className="sm:hidden">WhatsApp</span>
                  </Button>
                </a>
                <a
                  href="https://t.me/posstore"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full h-10 md:h-12 bg-[#0088cc] hover:bg-[#0077b3] text-white font-semibold text-sm md:text-base">
                    <Send className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">{t.contact.telegram}</span>
                    <span className="sm:hidden">Telegram</span>
                  </Button>
                </a>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 pt-4 md:pt-6 border-t border-border">
              <div className="text-center">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-primary mx-auto mb-1 md:mb-2" />
                <p className="text-[10px] md:text-xs text-muted-foreground">
                  {locale === 'zh' ? '质量保证' : 'Quality Assured'}
                </p>
              </div>
              <div className="text-center">
                <Truck className="w-5 h-5 md:w-6 md:h-6 text-primary mx-auto mb-1 md:mb-2" />
                <p className="text-[10px] md:text-xs text-muted-foreground">
                  {locale === 'zh' ? '全球配送' : 'Global Shipping'}
                </p>
              </div>
              <div className="text-center">
                <Package className="w-5 h-5 md:w-6 md:h-6 text-primary mx-auto mb-1 md:mb-2" />
                <p className="text-[10px] md:text-xs text-muted-foreground">
                  {locale === 'zh' ? '安全包装' : 'Secure Packing'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-10 md:mt-20">
            <h2 className="font-display text-lg md:text-2xl font-bold text-foreground mb-4 md:mb-8">
              {t.products.relatedProducts}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
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
