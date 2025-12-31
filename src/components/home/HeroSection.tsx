import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import TrustBadges from './TrustBadges';
import heroImage from '@/assets/hero-pos.jpg';

export default function HeroSection() {
  const { t, locale } = useLanguage();

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/95" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 industrial-grid opacity-30" />
      
      {/* Glowing orbs - use will-change for GPU acceleration */}
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

      <div className="container-wide relative z-10 py-12 md:py-20 px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            layoutId="hero-content"
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs md:text-sm font-medium backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {locale === 'zh' ? '专业POS解决方案提供商' : 'Professional POS Solutions Provider'}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground leading-[0.95] tracking-tighter mt-6 md:mt-8"
            >
              {locale === 'zh' ? '重新定义' : 'Redefining'}
              <br />
              <span className="text-gradient-gold">{locale === 'zh' ? '支付体验' : 'Payment'}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mt-4 md:mt-6"
            >
              {t.hero.description}
            </motion.p>

            {/* CTA with Glow Effect */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-8 md:mt-10"
            >
              <div className="relative group">
                {/* Glow effect behind button */}
                <div className="absolute -inset-1 bg-gradient-gold rounded-lg blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
                <Link to="/categories">
                  <Button 
                    size="lg" 
                    className="relative bg-gradient-gold text-primary-foreground hover:opacity-90 font-semibold h-12 md:h-14 px-8 md:px-10 text-base md:text-lg"
                  >
                    {t.hero.cta}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
              
              <Link to="/about" className="group">
                <Button 
                  size="lg" 
                  className="h-12 md:h-14 px-6 bg-cyan-500 text-white border-0 hover:bg-cyan-400 hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.6)] transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <Play className="w-4 h-4 ml-0.5" />
                  </div>
                  {locale === 'zh' ? '了解更多' : 'Learn More'}
                </Button>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <TrustBadges />
          </motion.div>

          {/* Right - Floating Product Image */}
          <motion.div
            layoutId="hero-image"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative order-1 lg:order-2"
          >
            {/* Glow behind product */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[80%] h-[80%] bg-primary/20 rounded-full blur-[80px] animate-pulse-glow" />
            </div>
            
            {/* Floating product image */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 will-change-transform"
            >
              <div className="relative aspect-square max-w-md mx-auto lg:max-w-lg">
                {/* Glass card container */}
                <div className="absolute inset-4 md:inset-8 rounded-3xl bg-card/30 backdrop-blur-xl border border-border/30 overflow-hidden">
                  {/* Hero image with Vite's asset handling - imported at top */}
                  <img
                    src={heroImage}
                    alt="POS Terminal"
                    className="w-full h-full object-cover"
                    // Hero image should not be lazy loaded as it's above the fold
                    fetchPriority="high"
                    decoding="async"
                  />
                  {/* Shine overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-primary/30 rounded-tr-3xl" />
                <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-primary/30 rounded-bl-3xl" />
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
