import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { DbProduct } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: DbProduct;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { locale, t } = useLanguage();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const name = locale === 'zh' ? product.name_zh : product.name_en;
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

  const handleClick = () => {
    navigate(`/products/${product.slug}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id);
  };

  return (
    <motion.div
      layoutId={`product-card-${product.id}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div onClick={handleClick} className="cursor-pointer">
        <div className="metal-surface rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-card">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800'}
              alt={name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Badges - Top Left, Stacked Vertically */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.is_new && (
                <Badge className="bg-gradient-gold text-primary-foreground border-0 text-[10px] px-1.5 py-0.5 shadow-sm">
                  New
                </Badge>
              )}
              {product.is_featured && (
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 6px rgba(251, 146, 60, 0.4)',
                      '0 0 12px rgba(251, 146, 60, 0.7)',
                      '0 0 6px rgba(251, 146, 60, 0.4)'
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold text-white shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #f97316 0%, #ef4444 50%, #ec4899 100%)' }}
                >
                  {locale === 'zh' ? '热门' : 'Hot'}
                </motion.div>
              )}
            </div>

            {/* Cart Button - Top Right */}
            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-2 right-2 w-7 h-7 md:w-8 md:h-8 rounded-full text-white flex items-center justify-center shadow-md z-10 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)' }}
              title={locale === 'zh' ? '加入购物车' : 'Add to Cart'}
            >
              <ShoppingCart className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-2.5 md:p-4">
            <h3 className="font-display font-semibold text-foreground text-sm md:text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {name}
            </h3>

            <div className="mt-1.5 md:mt-2 flex items-end justify-between">
              <div>
                <p
                  className="font-bold text-base md:text-xl bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(90deg, #a855f7 0%, #ec4899 50%, #f97316 100%)' }}
                >
                  {priceRange}
                </p>
                <p className="text-muted-foreground text-[10px] md:text-xs mt-0.5 md:mt-1">
                  {t.products.minOrder}: {product.min_order} {locale === 'zh' ? '台' : 'pcs'}
                </p>
              </div>
              <span className={`text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full ${product.is_active !== false
                ? 'bg-green-500/10 text-green-500'
                : 'bg-destructive/10 text-destructive'
                }`}>
                {product.is_active !== false ? t.products.inStock : t.products.outOfStock}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
