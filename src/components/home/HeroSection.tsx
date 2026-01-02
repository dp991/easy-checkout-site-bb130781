import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import TrustBadges from './TrustBadges';
import heroImage from '@/assets/hero-pos.jpg';

// Product carousel data
const heroProducts = [
  {
    id: 1,
    image: heroImage,
    titleZh: 'POS收银终端',
    titleEn: 'POS Terminal',
    descZh: '高性能触屏收银机',
    descEn: 'High-Performance Touchscreen'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    titleZh: '智能支付终端',
    titleEn: 'Smart Payment',
    descZh: '支持多种支付方式',
    descEn: 'Multi-Payment Support'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&q=80',
    titleZh: '便携式POS机',
    titleEn: 'Portable POS',
    descZh: '移动收款解决方案',
    descEn: 'Mobile Payment Solution'
  }
];

export default function HeroSection() {
  const { t, locale } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroProducts.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + heroProducts.length) % heroProducts.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % heroProducts.length);
  };

  const currentProduct = heroProducts[currentIndex];

  return (
    <section className="relative min-h-[85vh] md:min-h-[80vh] flex items-center overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/95" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 industrial-grid opacity-30" />

      {/* Glowing orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] opacity-30 will-change-transform"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] opacity-20 will-change-transform"
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <div className="container-wide relative z-10 py-6 md:py-12 px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-12 items-center">

          {/* Product Image Carousel - Now First on Mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative order-1"
          >
            {/* Glow behind product */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                className="w-[70%] h-[70%] bg-primary/30 rounded-full blur-[100px]"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            {/* Carousel Container */}
            <div className="relative z-10 max-w-sm mx-auto md:max-w-md lg:max-w-lg">
              {/* Main Image with Swipe Support */}
              <motion.div
                className="relative aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden bg-card/20 backdrop-blur-sm border border-border/30"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 50) {
                    goToPrev();
                  } else if (info.offset.x < -50) {
                    goToNext();
                  }
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentIndex}
                    src={currentProduct.image}
                    alt={locale === 'zh' ? currentProduct.titleZh : currentProduct.titleEn}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    fetchPriority="high"
                  />
                </AnimatePresence>

                {/* Shine overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />

                {/* Navigation Arrows - Desktop Only */}
                <button
                  onClick={goToPrev}
                  className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md text-white items-center justify-center hover:bg-black/50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goToNext}
                  className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md text-white items-center justify-center hover:bg-black/50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Product Label */}
                <motion.div
                  key={`label-${currentIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent"
                >
                  <p className="text-white font-semibold text-sm md:text-base">
                    {locale === 'zh' ? currentProduct.titleZh : currentProduct.titleEn}
                  </p>
                  <p className="text-white/70 text-xs md:text-sm">
                    {locale === 'zh' ? currentProduct.descZh : currentProduct.descEn}
                  </p>
                </motion.div>
              </motion.div>

              {/* Carousel Dots */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {heroProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => { setIsAutoPlaying(false); setCurrentIndex(index); }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex
                      ? 'w-6 bg-primary'
                      : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                      }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            layoutId="hero-content"
            className="text-center lg:text-left order-2"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.15] tracking-tighter"
            >
              {locale === 'zh' ? '重新定义' : 'Redefining'}
              <br />
              <span className="text-gradient-gold">{locale === 'zh' ? '支付体验' : 'Payment'}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mt-3 md:mt-6"
            >
              {t.hero.description}
            </motion.p>

            {/* CTA with Glow Effect */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mt-6 md:mt-10"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-gold rounded-lg blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
                <Link to="/categories">
                  <Button
                    size="lg"
                    className="relative bg-gradient-gold text-primary-foreground hover:opacity-90 font-semibold h-11 md:h-14 px-6 md:px-10 text-sm md:text-lg"
                  >
                    {t.hero.cta}
                    <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                </Link>
              </div>

              <Link to="/about" className="group">
                <Button
                  size="lg"
                  className="h-11 md:h-14 px-5 md:px-6 bg-cyan-500 text-white border-0 hover:bg-cyan-400 hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.6)] transition-all duration-300"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center mr-2 md:mr-3">
                    <Play className="w-3 h-3 md:w-4 md:h-4 ml-0.5" />
                  </div>
                  {locale === 'zh' ? '了解更多' : 'Learn More'}
                </Button>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <TrustBadges />
          </motion.div>
        </div>
      </div >

      {/* Bottom gradient fade */}
      < div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section >
  );
}
