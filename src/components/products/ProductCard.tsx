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
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {product.is_new && (
                <Badge className="bg-gradient-gold text-primary-foreground border-0">
                  NEW
                </Badge>
              )}
              {product.is_featured && (
                <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                  {locale === 'zh' ? '热门' : 'Featured'}
                </Badge>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
              >
                <Eye className="w-5 h-5" />
              </motion.div>
              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart(product.id);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5" />
              </motion.button>
              <motion.a
                href={`https://wa.me/8613800138000?text=I'm interested in ${encodeURIComponent(name || '')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Content */}
          <div className="p-2.5 md:p-4">
            <h3 className="font-display font-semibold text-foreground text-sm md:text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {name}
            </h3>
            
            <div className="mt-1.5 md:mt-2 flex items-end justify-between">
              <div>
                <p className="text-primary font-bold text-base md:text-xl">{priceRange}</p>
                <p className="text-muted-foreground text-[10px] md:text-xs mt-0.5 md:mt-1">
                  {t.products.minOrder}: {product.min_order} {locale === 'zh' ? '台' : 'pcs'}
                </p>
              </div>
              <span className={`text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full ${
                product.is_active !== false 
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
