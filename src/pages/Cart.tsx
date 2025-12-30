import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Package } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function Cart() {
  const { locale } = useLanguage();
  const { items, isLoading, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleContactInquiry = () => {
    // Build cart items info for the message
    const cartInfo = items.map((item) => {
      const nameZh = item.product?.name_zh || '';
      const nameEn = item.product?.name_en || '';
      const categoryZh = item.product?.category?.name_zh || '';
      const categoryEn = item.product?.category?.name_en || '';
      const priceMin = item.product?.price_min;
      const priceMax = item.product?.price_max;
      const quantity = item.quantity;

      let priceRange = '';
      if (priceMin && priceMax && priceMin !== priceMax) {
        priceRange = `$${priceMin} - $${priceMax}`;
      } else if (priceMin) {
        priceRange = `$${priceMin}`;
      } else if (priceMax) {
        priceRange = `$${priceMax}`;
      } else {
        priceRange = locale === 'zh' ? '询价' : 'Contact for price';
      }

      return {
        nameZh,
        nameEn,
        categoryZh,
        categoryEn,
        priceRange,
        quantity,
      };
    });

    navigate('/contact', { state: { cartItems: cartInfo } });
  };

  if (!user) {
    return (
      <Layout>
        <div className="container-wide py-8">
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <h1 className="text-xl font-display font-bold text-foreground mb-3">
              {locale === 'zh' ? '请先登录' : 'Please Login First'}
            </h1>
            <p className="text-muted-foreground mb-4 text-sm">
              {locale === 'zh' ? '登录后即可查看购物车' : 'Login to view your cart'}
            </p>
            <Link to="/auth">
              <Button size="sm" className="bg-gradient-gold text-primary-foreground">
                {locale === 'zh' ? '去登录' : 'Login'}
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-wide py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-2 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              {locale === 'zh' ? '继续购物' : 'Continue Shopping'}
            </Link>
            <h1 className="text-2xl font-display font-bold text-foreground">
              {locale === 'zh' ? '购物车' : 'Shopping Cart'}
            </h1>
          </div>
          {items.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearCart}>
              {locale === 'zh' ? '清空购物车' : 'Clear Cart'}
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <h2 className="text-lg font-display font-bold text-foreground mb-2">
              {locale === 'zh' ? '购物车是空的' : 'Your cart is empty'}
            </h2>
            <p className="text-muted-foreground mb-4 text-sm">
              {locale === 'zh' ? '快去挑选您喜欢的产品吧' : 'Start adding products you like'}
            </p>
            <Link to="/products">
              <Button size="sm" className="bg-gradient-gold text-primary-foreground">
                {locale === 'zh' ? '浏览产品' : 'Browse Products'}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border border-border rounded-lg p-3 flex gap-3"
              >
                {/* Product Image */}
                <Link to={`/products/${item.product?.slug}`} className="shrink-0">
                  <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden">
                    {item.product?.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={locale === 'zh' ? item.product.name_zh : item.product.name_en}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item.product?.slug}`}>
                    <h3 className="font-display font-semibold text-foreground hover:text-primary transition-colors">
                      {locale === 'zh' ? item.product?.name_zh : item.product?.name_en}
                    </h3>
                  </Link>
                  <p className="text-primary font-semibold mt-1">
                    {item.product?.price_min && item.product?.price_max
                      ? `$${item.product.price_min} - $${item.product.price_max}`
                      : locale === 'zh' ? '询价' : 'Contact for price'}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => removeFromCart(item.product_id)}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </motion.div>
            ))}

            {/* Summary */}
            <div className="bg-card border border-border rounded-lg p-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-muted-foreground text-sm">
                  {locale === 'zh' ? '商品数量' : 'Total Items'}
                </span>
                <span className="font-semibold">
                  {items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {locale === 'zh' 
                  ? '请联系我们获取详细报价和下单' 
                  : 'Please contact us for detailed pricing and ordering'}
              </p>
              <Button 
                size="sm" 
                className="w-full bg-gradient-gold text-primary-foreground"
                onClick={handleContactInquiry}
              >
                {locale === 'zh' ? '联系询价' : 'Contact for Quote'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
