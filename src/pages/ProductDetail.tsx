import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Send, ChevronLeft, ChevronRight, Package, Truck, Shield, ShoppingCart, Building2, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useProductBySlug, useProducts } from '@/hooks/useDatabase';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

interface ProductAttribute {
  key: string;
  value: string;
  is_key_attribute?: boolean;
  group?: string;
}

interface SupplierInfo {
  name?: string;
  location?: string;
  type?: string;
  years?: number;
  verified?: boolean;
  logo_url?: string;
  certifications?: string[];
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t, locale } = useLanguage();
  const { addToCart } = useCart();
  const [currentImage, setCurrentImage] = useState(0);

  const { data: product, isLoading } = useProductBySlug(slug || '');
  const { data: allProducts } = useProducts();

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

  const productAny = product as any;
  const name = locale === 'zh' ? product.name_zh : product.name_en;
  const description = locale === 'zh' ? product.description_zh : product.description_en;
  const descriptionHtml = locale === 'zh' ? productAny.description_html_zh : productAny.description_html_en;
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
  const attributes: ProductAttribute[] = productAny.attributes || [];
  const supplier: SupplierInfo = productAny.supplier || {};
  const keyAttributes = attributes.filter(a => a.is_key_attribute);

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
          <Link to="/" className="hover:text-foreground transition-colors">{t.nav.home}</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-foreground transition-colors">{t.nav.products}</Link>
          <span>/</span>
          <span className="text-foreground line-clamp-1">{name}</span>
        </nav>

        {/* Main Content - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left: Image Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1 space-y-3">
            <div className="relative aspect-square rounded-xl overflow-hidden metal-surface">
              <img src={images[currentImage] || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800'} alt={name} className="w-full h-full object-cover" />
              {images.length > 1 && (
                <>
                  <button onClick={() => setCurrentImage(prev => prev === 0 ? images.length - 1 : prev - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background"><ChevronLeft className="w-4 h-4" /></button>
                  <button onClick={() => setCurrentImage(prev => prev === images.length - 1 ? 0 : prev + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background"><ChevronRight className="w-4 h-4" /></button>
                </>
              )}
              <div className="absolute top-3 left-3 flex gap-2">
                {product.is_new && <Badge className="bg-gradient-gold text-primary-foreground border-0 text-xs">NEW</Badge>}
                {product.is_featured && <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs">{locale === 'zh' ? '热门' : 'Featured'}</Badge>}
              </div>
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button key={idx} onClick={() => setCurrentImage(idx)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${idx === currentImage ? 'border-primary' : 'border-border hover:border-muted-foreground'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Center: Product Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1 space-y-4">
            <div>
              <h1 className="font-display text-xl md:text-2xl font-bold text-foreground">{name}</h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-xl md:text-2xl font-bold text-primary">{priceRange}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${product.is_active !== false ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
                  {product.is_active !== false ? t.products.inStock : t.products.outOfStock}
                </span>
              </div>
            </div>

            <p className="text-muted-foreground text-sm">{description}</p>

            {/* Key Attributes */}
            {keyAttributes.length > 0 && (
              <div className="space-y-2">
                {keyAttributes.slice(0, 5).map((attr, idx) => (
                  <div key={idx} className="flex justify-between text-sm py-1.5 border-b border-border/50">
                    <span className="text-muted-foreground">{attr.key}</span>
                    <span className="font-medium text-foreground">{attr.value}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Package className="w-4 h-4" />
              <span>{t.products.minOrder}: {product.min_order} {locale === 'zh' ? '台' : 'pcs'}</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <Button onClick={() => addToCart(product.id)} className="w-full h-11 bg-gradient-gold text-primary-foreground hover:opacity-90 font-semibold">
                <ShoppingCart className="w-4 h-4 mr-2" />{locale === 'zh' ? '加入购物车' : 'Add to Cart'}
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <a href={`https://wa.me/8613800138000?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full h-10 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm"><MessageCircle className="w-4 h-4 mr-1" />WhatsApp</Button>
                </a>
                <a href="https://t.me/posstore" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full h-10 bg-[#0088cc] hover:bg-[#0077b3] text-white font-semibold text-sm"><Send className="w-4 h-4 mr-1" />Telegram</Button>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: Supplier Card (Desktop) */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:block lg:col-span-1">
            {supplier.name && (
              <Card className="p-4 bg-card border-border sticky top-24">
                <div className="flex items-center gap-3 mb-4">
                  {supplier.logo_url ? (
                    <img src={supplier.logo_url} alt={supplier.name} className="w-12 h-12 rounded-lg object-contain bg-white" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center"><Building2 className="w-6 h-6 text-muted-foreground" /></div>
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{supplier.name}</h3>
                    {supplier.verified && <Badge className="mt-1 bg-primary/10 text-primary text-xs"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>}
                  </div>
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  {supplier.location && <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" />{supplier.location}</div>}
                  {supplier.type && <div className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5" />{supplier.type}</div>}
                  {supplier.years && <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" />{supplier.years} {locale === 'zh' ? '年经验' : 'Years'}</div>}
                </div>
                {supplier.certifications && supplier.certifications.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {supplier.certifications.map((cert, idx) => <Badge key={idx} variant="outline" className="text-xs">{cert}</Badge>)}
                  </div>
                )}
              </Card>
            )}
            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="text-center p-3 rounded-lg bg-muted/30">
                <Shield className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-[10px] text-muted-foreground">{locale === 'zh' ? '质量保证' : 'Quality'}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/30">
                <Truck className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-[10px] text-muted-foreground">{locale === 'zh' ? '全球配送' : 'Shipping'}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/30">
                <Package className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-[10px] text-muted-foreground">{locale === 'zh' ? '安全包装' : 'Packing'}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <div className="mt-8 md:mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent h-auto p-0">
              <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">{locale === 'zh' ? '产品详情' : 'Description'}</TabsTrigger>
              {attributes.length > 0 && <TabsTrigger value="specs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">{locale === 'zh' ? '规格参数' : 'Specifications'}</TabsTrigger>}
            </TabsList>
            <TabsContent value="description" className="mt-6">
              {descriptionHtml ? (
                <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
              ) : (
                <p className="text-muted-foreground">{description || (locale === 'zh' ? '暂无详细描述' : 'No description available')}</p>
              )}
            </TabsContent>
            {attributes.length > 0 && (
              <TabsContent value="specs" className="mt-6">
                <div className="rounded-lg border border-border overflow-hidden">
                  {attributes.map((attr, idx) => (
                    <div key={idx} className={`flex ${idx % 2 === 0 ? 'bg-muted/30' : 'bg-transparent'}`}>
                      <div className="w-1/3 p-3 text-sm text-muted-foreground border-r border-border">{attr.key}</div>
                      <div className="w-2/3 p-3 text-sm text-foreground">{attr.value}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>

        {/* Mobile Supplier Card */}
        {supplier.name && (
          <Card className="lg:hidden mt-8 p-4 bg-card border-border">
            <div className="flex items-center gap-3">
              {supplier.logo_url ? <img src={supplier.logo_url} alt={supplier.name} className="w-12 h-12 rounded-lg object-contain bg-white" /> : <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center"><Building2 className="w-6 h-6 text-muted-foreground" /></div>}
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-sm">{supplier.name}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  {supplier.location && <span>{supplier.location}</span>}
                  {supplier.years && <span>• {supplier.years} YRS</span>}
                </div>
              </div>
              {supplier.verified && <Badge className="bg-primary/10 text-primary text-xs"><CheckCircle className="w-3 h-3" /></Badge>}
            </div>
          </Card>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-10 md:mt-16">
            <h2 className="font-display text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6">{t.products.relatedProducts}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {relatedProducts.map((p, index) => <ProductCard key={p.id} product={p} index={index} />)}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
