import { motion } from 'framer-motion';
import { Shield, Truck, Headphones, Award, Wifi, Battery, CreditCard, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

export default function BentoFeatures() {
  const { locale } = useLanguage();

  const features = [
    {
      icon: Shield,
      title: locale === 'zh' ? '品质保证' : 'Quality Assured',
      description: locale === 'zh' ? '严格质检流程，每台设备出厂前经过100+项测试' : 'Rigorous QC process, 100+ tests before shipping',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      span: 'md:col-span-2',
    },
    {
      icon: Wifi,
      title: locale === 'zh' ? '全网通' : '4G/5G Ready',
      description: locale === 'zh' ? '支持全球网络频段' : 'Global network support',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      span: '',
    },
    {
      icon: Battery,
      title: locale === 'zh' ? '超长续航' : 'Long Battery',
      description: locale === 'zh' ? '8小时连续使用' : '8-hour continuous use',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      span: '',
    },
    {
      icon: CreditCard,
      title: locale === 'zh' ? '多种支付' : 'Multi-Payment',
      description: locale === 'zh' ? 'NFC/IC卡/磁条卡' : 'NFC/IC/Magnetic',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      span: '',
    },
    {
      icon: Truck,
      title: locale === 'zh' ? '全球配送' : 'Global Shipping',
      description: locale === 'zh' ? '快速发货至全球200+国家和地区' : 'Fast delivery to 200+ countries',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      span: 'md:col-span-2',
    },
    {
      icon: Headphones,
      title: locale === 'zh' ? '专业支持' : '24/7 Support',
      description: locale === 'zh' ? '全天候技术支持' : 'Round-the-clock assistance',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      span: '',
    },
    {
      icon: Zap,
      title: locale === 'zh' ? '快速交易' : 'Fast Transaction',
      description: locale === 'zh' ? '0.3秒极速响应' : '0.3s response time',
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
      span: '',
    },
    {
      icon: Award,
      title: locale === 'zh' ? '行业领先' : 'Industry Leader',
      description: locale === 'zh' ? '10年出口经验' : '10+ years export experience',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      span: '',
    },
  ];

  return (
    <section className="py-10 md:py-16">
      <div className="container-wide px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <span className="text-primary text-xs md:text-sm font-medium uppercase tracking-wider">
            {locale === 'zh' ? '为什么选择我们' : 'Why Choose Us'}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mt-2 tracking-tighter">
            {locale === 'zh' ? '专业级解决方案' : 'Professional Solutions'}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className={feature.span}
            >
              <Card className="relative h-full overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 p-4 md:p-6 group hover:border-primary/30 transition-colors">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Icon in corner */}
                <div className={`absolute -top-4 -right-4 w-20 h-20 md:w-24 md:h-24 ${feature.bgColor} rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity`} />
                
                <div className="relative z-10">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-3 md:mb-4`}>
                    <feature.icon className={`w-5 h-5 md:w-6 md:h-6 ${feature.color}`} />
                  </div>
                  <h3 className="font-display font-semibold text-foreground text-sm md:text-lg mb-1 md:mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
