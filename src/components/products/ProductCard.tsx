import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, MessageCircle, ShoppingCart } from 'lucide-react';
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group"
    >
      <div onClick={handleClick} className="cursor-pointer">
        {/* Image - opacity change on hover, no scale */}
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800'}
            alt={name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {product.is_new && (
              <span className="badge-promo text-xs px-2 py-1 bg-accent text-accent-foreground">
                NEW
              </span>
            )}
            {product.is_featured && (
              <span className="badge-promo text-xs px-2 py-1 bg-secondary text-foreground">
                {locale === 'zh' ? '热门' : 'Featured'}
              </span>
            )}
          </div>

          {/* Quick Actions on hover */}
          <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center"
            >
              <Eye className="w-4 h-4" />
            </motion.div>
            <motion.button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product.id);
              }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center"
            >
              <ShoppingCart className="w-4 h-4" />
            </motion.button>
            <motion.a
              href={`https://wa.me/8613800138000?text=I'm interested in ${encodeURIComponent(name || '')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-[#25D366] text-white flex items-center justify-center"
            >
              <MessageCircle className="w-4 h-4" />
            </motion.a>
          </div>
        </div>

        {/* Content - minimal styling */}
        <div className="pt-3 pb-2">
          <h3 className="font-medium text-foreground text-base leading-tight line-clamp-1 group-hover:underline group-hover:underline-offset-2 transition-all">
            {name}
          </h3>
          
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-foreground font-normal text-base">{priceRange}</p>
            <span className={`text-xs ${
              product.is_active !== false 
                ? 'text-forest-muted' 
                : 'text-destructive'
            }`}>
              {product.is_active !== false ? t.products.inStock : t.products.outOfStock}
            </span>
          </div>
          
          <p className="text-muted-foreground text-xs mt-1">
            {t.products.minOrder}: {product.min_order} {locale === 'zh' ? '台' : 'pcs'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
