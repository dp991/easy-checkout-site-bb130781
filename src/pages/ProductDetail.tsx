import { useParams, Link } from 'react-router-dom';
import { Settings, Clock, ChevronRight, ArrowLeft, ListChecks, Package } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProductBySlug, useProducts } from '@/hooks/useDatabase';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import ProductDetailHero from '@/components/products/ProductDetailHero';
import FloatingChatButton from '@/components/FloatingChatButton';
import { Skeleton } from '@/components/ui/skeleton';
import ProductDescriptionDisplay from '@/components/products/ProductDescriptionDisplay';
import { parseProductDescription, ProductDescriptionData } from '@/components/admin/ProductDescriptionEditor';

interface ProductAttribute {
  key_zh: string;
  key_en: string;
  value_zh: string;
  value_en: string;
  is_key_attribute?: boolean;
  group?: string;
}

interface PackagingItem {
  key_zh: string;
  key_en: string;
  value_zh: string;
  value_en: string;
}

interface LeadTimeItem {
  quantity_range: string;
  lead_days: string;
}

interface CustomizationItem {
  service_name_zh: string;
  service_name_en: string;
  moq_zh: string;
  moq_en: string;
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t, locale } = useLanguage();

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

  // Smart merge: features/specTables are language-specific, but images are shared
  const getDescriptionData = () => {
    const zhData = parseProductDescription(productAny.description_data_zh);
    const enData = parseProductDescription(productAny.description_data_en);

    // Get primary data based on locale
    const primaryData = locale === 'zh' ? zhData : enData;
    const fallbackData = locale === 'zh' ? enData : zhData;

    // Use primary features/specTables, fallback if empty
    const features = primaryData.features.length > 0 ? primaryData.features : fallbackData.features;
    const specTables = primaryData.specTables.length > 0 ? primaryData.specTables : fallbackData.specTables;

    // For richContent: use primary text, but merge images from both languages
    const primaryTexts = primaryData.richContent.filter(block => block.type === 'text');
    const fallbackTexts = fallbackData.richContent.filter(block => block.type === 'text');
    const texts = primaryTexts.length > 0 ? primaryTexts : fallbackTexts;

    // Merge all images from both languages (deduplicate by content URL)
    const allImages = [
      ...zhData.richContent.filter(block => block.type === 'image'),
      ...enData.richContent.filter(block => block.type === 'image')
    ];
    const uniqueImages = allImages.filter((img, index, self) =>
      index === self.findIndex(i => i.content === img.content)
    );

    // Combine: texts first, then images
    const richContent = [...texts, ...uniqueImages];

    return { features, specTables, richContent };
  };
  const descriptionData: ProductDescriptionData = getDescriptionData();
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
  const keyAttributes = attributes
    .filter(a => a.is_key_attribute)
    .map(a => ({
      key: locale === 'zh' ? a.key_zh : a.key_en,
      value: locale === 'zh' ? a.value_zh : a.value_en
    }));

  const hasSpecs = attributes.length > 0 || packagingInfo.length > 0 || leadTimes.length > 0 || customizations.length > 0;

  const relatedProducts = allProducts
    ?.filter(p => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 3) || [];

  return (
    <Layout>
      <title>{name} - {locale === 'zh' ? '收银机商城' : 'POS Store'}</title>
      <meta name="description" content={description?.slice(0, 160) || ''} />

      <div className="container-wide py-4 md:py-8 px-4 md:px-6">
        {/* Mobile Back Navigation */}
        <nav className="lg:hidden mb-4">
          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.nav.products}
          </Link>
        </nav>

        {/* Hero Section */}
        <ProductDetailHero
          product={product}
          name={name || ''}
          description={description}
          priceRange={priceRange}
          images={images}
          keyAttributes={keyAttributes}
        />

        {/* Anchor Navigation */}
        <div className="mt-4 md:mt-12 sticky top-14 sm:top-16 z-30 bg-background/95 backdrop-blur-sm -mx-4 md:-mx-6 px-4 md:px-6 py-2 border-b border-border">
          <nav className="flex gap-6">
            {hasSpecs && (
              <button
                onClick={() => document.getElementById('specs-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors pb-2 border-b-2 border-transparent hover:border-primary"
              >
                {locale === 'zh' ? '规格参数' : 'Specifications'}
              </button>
            )}
            <button
              onClick={() => document.getElementById('description-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors pb-2 border-b-2 border-transparent hover:border-primary"
            >
              {locale === 'zh' ? '产品详情' : 'Description'}
            </button>
          </nav>
        </div>

        {/* Continuous Scrollable Content */}
        <div className="mt-6 space-y-12">
          {/* Specifications Section */}
          {hasSpecs && (
            <section id="specs-section" className="scroll-mt-32 space-y-8">

              {/* Key Attributes Section */}
              {attributes.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <ListChecks className="w-5 h-5 text-primary" />
                    {locale === 'zh' ? '重要属性' : 'Key Attributes'}
                  </h3>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      {attributes.map((attr, idx) => (
                        <div key={idx} className={`flex border-b border-border last:border-b-0 md:odd:border-r ${idx % 4 < 2 ? 'bg-muted/30' : 'bg-transparent'}`}>
                          <div className="w-2/5 p-3 text-sm text-cyan-400 font-medium border-r border-border">{locale === 'zh' ? attr.key_zh : attr.key_en}</div>
                          <div className="w-3/5 p-3 text-sm text-foreground">{locale === 'zh' ? attr.value_zh : attr.value_en}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Packaging & Delivery Section */}
              {packagingInfo.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    {locale === 'zh' ? '包装和发货信息' : 'Packaging & Delivery'}
                  </h3>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      {packagingInfo.map((item, idx) => (
                        <div key={idx} className={`flex border-b border-border last:border-b-0 md:odd:border-r ${idx % 4 < 2 ? 'bg-muted/30' : 'bg-transparent'}`}>
                          <div className="w-2/5 p-3 text-sm text-cyan-400 font-medium border-r border-border">{locale === 'zh' ? item.key_zh : item.key_en}</div>
                          <div className="w-3/5 p-3 text-sm text-foreground">{locale === 'zh' ? item.value_zh : item.value_en}</div>
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
                          <td className="p-3 text-sm text-cyan-400 font-medium border-r border-border font-medium">{locale === 'zh' ? '数量 (pieces)' : 'Quantity (pieces)'}</td>
                          {leadTimes.map((item, idx) => (
                            <td key={idx} className="p-3 text-sm text-foreground text-center border-r border-border last:border-r-0">{item.quantity_range}</td>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-3 text-sm text-cyan-400 font-medium border-r border-border font-medium">{locale === 'zh' ? '预计时间 (天)' : 'Est. Time (days)'}</td>
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
                          <div className="w-2/5 p-3 text-sm text-cyan-400 font-medium border-r border-border">{locale === 'zh' ? item.service_name_zh : item.service_name_en}</div>
                          <div className="w-3/5 p-3 text-sm text-foreground">
                            {(locale === 'zh' ? item.moq_zh : item.moq_en) || '-'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Description Section */}
          <section id="description-section" className="scroll-mt-32">
            <ProductDescriptionDisplay
              data={descriptionData}
              locale={locale}
              fallbackText={description}
            />
          </section>
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

        {/* Spacer for mobile sticky bottom bar */}
        <div className="h-20 lg:hidden" />
      </div>

      {/* Floating Chat Button */}
      <FloatingChatButton />
    </Layout >
  );
}
