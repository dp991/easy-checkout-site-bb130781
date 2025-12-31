import { motion } from 'framer-motion';
import { Shield, Clock, Award, CreditCard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TrustBadges() {
  const { locale } = useLanguage();

  const badges = [
    { icon: CreditCard, text: locale === 'zh' ? '安全支付' : 'Secure Payment' },
    { icon: Clock, text: locale === 'zh' ? '24小时发货' : 'Ships in 24h' },
    { icon: Shield, text: locale === 'zh' ? '1年质保' : '1-Year Warranty' },
    { icon: Award, text: locale === 'zh' ? '正品保证' : 'Authentic' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="flex flex-wrap items-center justify-center gap-3 md:gap-6 pt-6 md:pt-8"
    >
      {badges.map((badge, index) => (
        <div
          key={index}
          className="flex items-center gap-1.5 md:gap-2 text-muted-foreground"
        >
          <badge.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary/60" />
          <span className="text-xs md:text-sm">{badge.text}</span>
        </div>
      ))}
    </motion.div>
  );
}
