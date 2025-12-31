import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  ChevronLeft, 
  ChevronRight, 
  Package, 
  Truck, 
  Shield, 
  ShoppingCart,
  Clock,
  Mail
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductDetailHeroProps {
  product: any;
  name: string;
  description?: string;
  priceRange: string;
  images: string[];
  keyAttributes: Array<{ key: string; value: string }>;
}

export default function ProductDetailHero({
  product,
  name,
  description,
  priceRange,
  images,
  keyAttributes,
}: ProductDetailHeroProps) {
  const { t, locale } = useLanguage();
  const { addToCart } = useCart();
  const [currentImage, setCurrentImage] = useState(0);
  const [direction, setDirection] = useState(0);
  const constraintsRef = useRef(null);

  const displayImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800'];
  
  const whatsappMessage = encodeURIComponent(`Hello, I'm interested in ${name}. Please provide more details and pricing.`);

  const handleSwipe = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      setDirection(1);
      setCurrentImage(prev => (prev === displayImages.length - 1 ? 0 : prev + 1));
    } else if (info.offset.x > threshold) {
      setDirection(-1);
      setCurrentImage(prev => (prev === 0 ? displayImages.length - 1 : prev - 1));
    }
  };

  const nextImage = () => {
    setDirection(1);
    setCurrentImage(prev => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setDirection(-1);
    setCurrentImage(prev => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <>
      {/* Mobile + Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10">
        {/* Left: Image Gallery */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="space-y-3"
        >
          {/* Main Image - Swipeable on Mobile */}
          <div 
            ref={constraintsRef}
            className="relative aspect-square lg:aspect-[4/3] rounded-xl overflow-hidden bg-card border border-border"
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.img
                key={currentImage}
                src={displayImages[currentImage]}
                alt={name}
                className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={handleSwipe}
              />
            </AnimatePresence>

            {/* Badges - Overlay on Image */}
            <div className="absolute top-3 left-3 flex gap-2 z-10">
              {product.is_new && (
                <Badge className="bg-gradient-cosmos text-primary-foreground border-0 text-xs font-semibold shadow-lg">
                  NEW
                </Badge>
              )}
              {product.is_featured && (
                <Badge className="bg-accent text-accent-foreground border-0 text-xs font-semibold shadow-lg">
                  {locale === 'zh' ? '热门' : 'HOT'}
                </Badge>
              )}
            </div>

            {/* Desktop Navigation Arrows */}
            {displayImages.length > 1 && (
              <>
                <button 
                  onClick={prevImage} 
                  className="hidden lg:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm items-center justify-center hover:bg-background transition-colors border border-border shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={nextImage} 
                  className="hidden lg:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm items-center justify-center hover:bg-background transition-colors border border-border shadow-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Mobile Dots Indicator */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 lg:hidden">
                {displayImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDirection(idx > currentImage ? 1 : -1);
                      setCurrentImage(idx);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentImage 
                        ? 'bg-primary w-4' 
                        : 'bg-foreground/40 hover:bg-foreground/60'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Desktop Counter */}
            {displayImages.length > 1 && (
              <div className="hidden lg:flex absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-sm text-xs font-medium border border-border">
                {currentImage + 1} / {displayImages.length}
              </div>
            )}
          </div>

          {/* Desktop Thumbnails */}
          {displayImages.length > 1 && (
            <div className="hidden lg:flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentImage ? 1 : -1);
                    setCurrentImage(idx);
                  }}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                    idx === currentImage 
                      ? 'border-primary ring-2 ring-primary/30' 
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right: Product Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 lg:space-y-5"
        >
          {/* Breadcrumb - Desktop Only */}
          <nav className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">{t.nav.home}</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-foreground transition-colors">{t.nav.products}</Link>
            <span>/</span>
            <span className="text-foreground line-clamp-1">{name}</span>
          </nav>

          {/* Title */}
          <div>
            <h1 className="font-display text-xl lg:text-3xl font-bold text-foreground leading-tight">
              {name}
            </h1>
            {/* Meta Info */}
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <span>{locale === 'zh' ? '型号' : 'Model'}: {product.slug?.toUpperCase()}</span>
              <span className="text-border">|</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                product.is_active !== false 
                  ? 'bg-green-500/10 text-green-500' 
                  : 'bg-destructive/10 text-destructive'
              }`}>
                {product.is_active !== false ? t.products.inStock : t.products.outOfStock}
              </span>
            </div>
          </div>

          {/* Key Specs - Horizontal Scroll on Mobile */}
          {keyAttributes.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide lg:grid lg:grid-cols-2 lg:gap-2 lg:overflow-visible">
              {keyAttributes.slice(0, 4).map((attr, idx) => (
                <div 
                  key={idx} 
                  className="flex-shrink-0 px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm lg:flex-shrink lg:flex lg:justify-between"
                >
                  <span className="text-muted-foreground lg:mr-2">{attr.key}:</span>
                  <span className="font-medium text-foreground ml-1 lg:ml-0">{attr.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Price & MOQ - The "Buy Box" */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-card to-muted/30 border border-border/50">
            {/* Price */}
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl lg:text-3xl font-bold text-primary">{priceRange}</span>
              <span className="text-sm text-muted-foreground">/ {locale === 'zh' ? '台' : 'Piece'}</span>
            </div>
            
            {/* MOQ & Lead Time */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="w-4 h-4 text-primary" />
                <span>{t.products.minOrder}: <span className="text-foreground font-medium">{product.min_order || 1} {locale === 'zh' ? '台' : 'pcs'}</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4 text-primary" />
                <span>{locale === 'zh' ? '交期' : 'Lead'}: <span className="text-foreground font-medium">15-30 {locale === 'zh' ? '天' : 'days'}</span></span>
              </div>
            </div>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex flex-col gap-3">
            <Button 
              onClick={() => addToCart(product.id)} 
              size="lg"
              className="w-full h-12 bg-gradient-cosmos text-primary-foreground hover:opacity-90 font-semibold text-base"
            >
              <Mail className="w-5 h-5 mr-2" />
              {locale === 'zh' ? '发送询盘' : 'Send Inquiry'}
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <a href={`https://wa.me/8613800138000?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="block">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full h-11 border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/10 hover:border-[#25D366] font-semibold"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </a>
              <a href="https://t.me/posstore" target="_blank" rel="noopener noreferrer" className="block">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full h-11 border-[#0088cc]/30 text-[#0088cc] hover:bg-[#0088cc]/10 hover:border-[#0088cc] font-semibold"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Telegram
                </Button>
              </a>
            </div>
          </div>

          {/* Desktop Trust Signals */}
          <div className="hidden lg:flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-primary" />
              <span>{locale === 'zh' ? '质量保证' : 'Quality Assured'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="w-4 h-4 text-primary" />
              <span>{locale === 'zh' ? '全球配送' : 'Global Shipping'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="w-4 h-4 text-primary" />
              <span>{locale === 'zh' ? '安全包装' : 'Secure Packing'}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Trust Signals */}
      <div className="lg:hidden flex items-center justify-center gap-4 py-2 border-t border-border/50 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-primary" />
          <span>{locale === 'zh' ? '质量保证' : 'Quality'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Truck className="w-3.5 h-3.5 text-primary" />
          <span>{locale === 'zh' ? '全球配送' : 'Shipping'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Package className="w-3.5 h-3.5 text-primary" />
          <span>{locale === 'zh' ? '安全包装' : 'Packing'}</span>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur-lg border-t border-border p-3 safe-area-bottom">
        <div className="flex items-center gap-3">
          {/* Chat Button */}
          <a 
            href={`https://wa.me/8613800138000?text=${whatsappMessage}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center w-16 h-12 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          >
            <MessageCircle className="w-5 h-5 text-[#25D366]" />
            <span className="text-[10px] text-muted-foreground mt-0.5">Chat</span>
          </a>
          
          {/* Primary CTA */}
          <Button 
            onClick={() => addToCart(product.id)} 
            className="flex-1 h-12 bg-gradient-cosmos text-primary-foreground hover:opacity-90 font-semibold text-base rounded-xl"
          >
            <Mail className="w-5 h-5 mr-2" />
            {locale === 'zh' ? '发送询盘' : 'Send Inquiry'}
          </Button>
        </div>
      </div>

      {/* Spacer for mobile sticky bar - reduced */}
      <div className="h-16 lg:hidden" />
    </>
  );
}
