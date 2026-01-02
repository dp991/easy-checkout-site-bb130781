import { motion } from 'framer-motion';
import { Truck, Headphones, ShieldCheck, BadgeCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TrustBadges() {
  const { locale } = useLanguage();

  const badges = [
    { icon: ShieldCheck, text: locale === 'zh' ? '正品授权' : 'Authorized' },
    { icon: Truck, text: locale === 'zh' ? '全球配送' : 'Shipping' },
    { icon: Headphones, text: locale === 'zh' ? '技术支持' : 'Support' },
    { icon: BadgeCheck, text: locale === 'zh' ? '质保无忧' : 'Warranty' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="pt-6 md:pt-10"
    >
      {/* Mobile: Compact 2x2 Grid */}
      <div className="grid grid-cols-4 gap-2 sm:hidden">
        {badges.map((badge, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.05 }}
            className="flex flex-col items-center gap-1 py-2"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <badge.icon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-[10px] text-muted-foreground text-center leading-tight">
              {badge.text}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Tablet/Desktop: Horizontal with cards */}
      <div className="hidden sm:flex flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-4">
        {badges.map((badge, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card/30 border border-border/30 backdrop-blur-sm"
          >
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <badge.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
            </div>
            <span className="text-xs md:text-sm font-medium text-foreground">
              {badge.text}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
