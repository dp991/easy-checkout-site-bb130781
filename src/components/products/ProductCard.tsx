import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Product } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { locale, t } = useLanguage();

  const name = locale === 'zh' ? product.name_zh : product.name_en;
  const priceRange = product.price_min === product.price_max
    ? `$${product.price_min}`
    : `$${product.price_min} - $${product.price_max}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group"
    >
      <Link to={`/products/${product.slug}`}>
        <div className="metal-surface rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-card">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={product.images[0]}
              alt={name}
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
                initial={{ scale: 0 }}
                whileHover={{ scale: 1.1 }}
                className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
              >
                <Eye className="w-5 h-5" />
              </motion.div>
              <motion.a
                href={`https://wa.me/8613800138000?text=I'm interested in ${encodeURIComponent(name)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0 }}
                whileHover={{ scale: 1.1 }}
                className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-display font-semibold text-foreground text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {name}
            </h3>
            
            <div className="mt-2 flex items-end justify-between">
              <div>
                <p className="text-primary font-bold text-xl">{priceRange}</p>
                <p className="text-muted-foreground text-xs mt-1">
                  {t.products.minOrder}: {product.min_order} {locale === 'zh' ? '台' : 'pcs'}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                product.stock_status === 'in_stock' 
                  ? 'bg-green-500/10 text-green-500' 
                  : 'bg-destructive/10 text-destructive'
              }`}>
                {product.stock_status === 'in_stock' ? t.products.inStock : t.products.outOfStock}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
