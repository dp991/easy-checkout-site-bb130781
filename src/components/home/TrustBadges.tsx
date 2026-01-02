import { motion } from 'framer-motion';
import { Truck, Headphones, ShieldCheck, BadgeCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TrustBadges() {
  const { locale } = useLanguage();

  const badges = [
    {
      icon: ShieldCheck,
      text: locale === 'zh' ? '官方正品授权' : 'Authorized Dealer',
      subtext: locale === 'zh' ? '品牌官方授权经销商' : 'Official Brand Partner'
    },
    {
      icon: Truck,
      text: locale === 'zh' ? '全球配送' : 'Worldwide Shipping',
      subtext: locale === 'zh' ? '支持国际物流' : 'Fast & Reliable'
    },
    {
      icon: Headphones,
      text: locale === 'zh' ? '专业技术支持' : 'Tech Support',
      subtext: locale === 'zh' ? '1对1售后服务' : '1-on-1 Assistance'
    },
    {
      icon: BadgeCheck,
      text: locale === 'zh' ? '质保无忧' : 'Warranty Included',
      subtext: locale === 'zh' ? '提供完善售后保障' : 'Peace of Mind'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="pt-6 md:pt-10"
    >
      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6">
        {badges.map((badge, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-card/30 border border-border/30 backdrop-blur-sm"
          >
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <badge.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs md:text-sm font-medium text-foreground leading-tight">
                {badge.text}
              </p>
              <p className="text-[10px] md:text-xs text-muted-foreground">
                {badge.subtext}
              </p>
            </div>
            <span className="sm:hidden text-xs text-foreground font-medium">
              {badge.text}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
