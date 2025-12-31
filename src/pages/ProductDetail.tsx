import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Send, ChevronLeft, ChevronRight, Package, Truck, Shield, ShoppingCart, Settings, Clock } from 'lucide-react';
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

interface PackagingItem {
  key: string;
  value: string;
}

interface LeadTimeItem {
  quantity_range: string;
  lead_days: string;
}

interface CustomizationItem {
  service_name: string;
  moq: string;
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
  const packagingInfo: PackagingItem[] = productAny.packaging_info || [];
  const leadTimes: LeadTimeItem[] = productAny.lead_times || [];
  const customizations: CustomizationItem[] = productAny.customizations || [];
  const keyAttributes = attributes.filter(a => a.is_key_attribute);
  
  const hasSpecs = attributes.length > 0 || packagingInfo.length > 0 || leadTimes.length > 0 || customizations.length > 0;

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

          {/* Right: Trust Badges (Desktop) */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:block lg:col-span-1">
            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2">
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
          <Tabs defaultValue={hasSpecs ? "specs" : "description"} className="w-full">
            <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent h-auto p-0">
              {hasSpecs && <TabsTrigger value="specs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">{locale === 'zh' ? '规格参数' : 'Specifications'}</TabsTrigger>}
              <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">{locale === 'zh' ? '产品详情' : 'Description'}</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              {descriptionHtml ? (
                <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
              ) : (
                <p className="text-muted-foreground">{description || (locale === 'zh' ? '暂无详细描述' : 'No description available')}</p>
              )}
            </TabsContent>
            {hasSpecs && (
              <TabsContent value="specs" className="mt-6 space-y-8">
                {/* Key Attributes Section */}
                {attributes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-4">{locale === 'zh' ? '重要属性' : 'Key Attributes'}</h3>
                    <div className="rounded-lg border border-border overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-2">
                        {attributes.map((attr, idx) => (
                          <div key={idx} className={`flex border-b border-border last:border-b-0 md:odd:border-r ${idx % 4 < 2 ? 'bg-muted/30' : 'bg-transparent'}`}>
                            <div className="w-2/5 p-3 text-sm text-primary border-r border-border">{attr.key}</div>
                            <div className="w-3/5 p-3 text-sm text-foreground">{attr.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Packaging & Delivery Section */}
                {packagingInfo.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-4">{locale === 'zh' ? '包装和发货信息' : 'Packaging & Delivery'}</h3>
                    <div className="rounded-lg border border-border overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-2">
                        {packagingInfo.map((item, idx) => (
                          <div key={idx} className={`flex border-b border-border last:border-b-0 md:odd:border-r ${idx % 4 < 2 ? 'bg-muted/30' : 'bg-transparent'}`}>
                            <div className="w-2/5 p-3 text-sm text-primary border-r border-border">{item.key}</div>
                            <div className="w-3/5 p-3 text-sm text-foreground">{item.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Lead Time Section */}
                {leadTimes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      {locale === 'zh' ? '交货时间' : 'Lead Time'}
                    </h3>
                    <div className="rounded-lg border border-border overflow-x-auto">
                      <table className="w-full min-w-max">
                        <thead>
                          <tr className="bg-muted/30">
                            <td className="p-3 text-sm text-primary border-r border-border font-medium">{locale === 'zh' ? '数量 (pieces)' : 'Quantity (pieces)'}</td>
                            {leadTimes.map((item, idx) => (
                              <td key={idx} className="p-3 text-sm text-foreground text-center border-r border-border last:border-r-0">{item.quantity_range}</td>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-3 text-sm text-primary border-r border-border font-medium">{locale === 'zh' ? '预计时间 (天)' : 'Est. Time (days)'}</td>
                            {leadTimes.map((item, idx) => (
                              <td key={idx} className="p-3 text-sm text-foreground text-center border-r border-border last:border-r-0">{item.lead_days}</td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Customization Section */}
                {customizations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-primary" />
                      {locale === 'zh' ? '定制选项' : 'Customization'}
                    </h3>
                    <div className="rounded-lg border border-border overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-2">
                        {customizations.map((item, idx) => (
                          <div key={idx} className={`flex border-b border-border last:border-b-0 md:odd:border-r ${idx % 4 < 2 ? 'bg-muted/30' : 'bg-transparent'}`}>
                            <div className="w-2/5 p-3 text-sm text-primary border-r border-border">{item.service_name}</div>
                            <div className="w-3/5 p-3 text-sm text-foreground">
                              {item.moq ? `${locale === 'zh' ? '最低起订量: ' : 'Min. Order: '}${item.moq}` : '-'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>

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
