import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@/assets/hero-pos.jpg';

export default function HeroSection() {
  const { t, locale } = useLanguage();

  return (
    <section className="relative min-h-[85vh] md:min-h-screen flex items-center bg-background">
      <div className="container-wide relative z-10 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left Content */}
          <motion.div 
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-nav text-muted-foreground mb-4"
            >
              {locale === 'zh' ? '专业POS解决方案提供商' : 'Professional POS Solutions Provider'}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-medium text-foreground leading-[1.1] tracking-tight"
            >
              {locale === 'zh' ? '重新定义' : 'Redefining'}
              <br />
              <span className="text-foreground">{locale === 'zh' ? '支付体验' : 'Payment Experience'}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base md:text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 mt-6"
            >
              {t.hero.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-10"
            >
              <Link to="/categories">
                <Button size="lg">
                  {t.hero.cta}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              
              <Link to="/about" className="link-underline text-muted-foreground hover:text-foreground transition-colors text-nav">
                {locale === 'zh' ? '了解更多' : 'Learn More'}
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center justify-center lg:justify-start gap-8 mt-12 text-muted-foreground text-sm"
            >
              <div>
                <span className="font-medium text-foreground text-2xl">500+</span>
                <p className="text-xs mt-1">{locale === 'zh' ? '企业客户' : 'Clients'}</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <span className="font-medium text-foreground text-2xl">15+</span>
                <p className="text-xs mt-1">{locale === 'zh' ? '年经验' : 'Years'}</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <span className="font-medium text-foreground text-2xl">24/7</span>
                <p className="text-xs mt-1">{locale === 'zh' ? '技术支持' : 'Support'}</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Product Image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative aspect-square max-w-md mx-auto lg:max-w-lg">
              <img
                src={heroImage}
                alt="POS Terminal"
                className="w-full h-full object-cover"
                fetchPriority="high"
                decoding="async"
              />
            </div>

            {/* Floating specs - minimal style */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute top-1/4 -left-4 md:left-0 hidden md:block"
            >
              <div className="bg-background border border-border px-4 py-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{locale === 'zh' ? '处理速度' : 'Speed'}</p>
                <p className="text-lg font-medium text-foreground">0.3s</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-1/4 -right-4 md:right-0 hidden md:block"
            >
              <div className="bg-background border border-border px-4 py-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{locale === 'zh' ? '续航时间' : 'Battery'}</p>
                <p className="text-lg font-medium text-foreground">8h+</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
