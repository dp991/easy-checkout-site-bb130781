import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function StickyBottomBar() {
  const { locale } = useLanguage();

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      <div className="bg-card/80 backdrop-blur-xl border-t border-border/50 px-4 py-3 safe-area-bottom">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">
              {locale === 'zh' ? '专业POS终端' : 'Professional POS'}
            </p>
            <p className="text-lg font-bold text-foreground">
              {locale === 'zh' ? '询价获取报价' : 'Get Quote'}
            </p>
          </div>
          <Link to="/contact" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
            <Button 
              size="lg" 
              className="bg-gradient-gold text-primary-foreground font-semibold px-6 h-11 glow-gold"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {locale === 'zh' ? '立即咨询' : 'Inquire Now'}
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
