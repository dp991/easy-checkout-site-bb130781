import { motion } from 'framer-motion';
import { Award, Users, Globe, Truck, Target, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';

export default function About() {
  const { locale } = useLanguage();

  const stats = [
    { value: '10+', label: locale === 'zh' ? '年行业经验' : 'Years Experience' },
    { value: '50+', label: locale === 'zh' ? '国家/地区' : 'Countries Served' },
    { value: '1000+', label: locale === 'zh' ? '合作客户' : 'Happy Clients' },
    { value: '99%', label: locale === 'zh' ? '客户满意度' : 'Satisfaction Rate' },
  ];

  const values = [
    {
      icon: Target,
      title: locale === 'zh' ? '品质至上' : 'Quality First',
      description: locale === 'zh'
        ? '我们严格把控每一个生产环节，确保每一台设备都达到最高品质标准。'
        : 'We strictly control every production process to ensure each device meets the highest quality standards.',
    },
    {
      icon: Users,
      title: locale === 'zh' ? '客户为本' : 'Customer Centric',
      description: locale === 'zh'
        ? '以客户需求为导向，提供专业的售前咨询和完善的售后服务。'
        : 'Customer-oriented approach with professional pre-sales consultation and comprehensive after-sales service.',
    },
    {
      icon: Heart,
      title: locale === 'zh' ? '诚信经营' : 'Integrity',
      description: locale === 'zh'
        ? '诚实守信是我们的经营理念，与每一位客户建立长期信任关系。'
        : 'Honesty and integrity are our business philosophy, building long-term trust with every customer.',
    },
  ];

  return (
    <Layout>
      <title>{locale === 'zh' ? '关于我们 - 收银机商城' : 'About Us - POS Store'}</title>
      <meta name="description" content={locale === 'zh' 
        ? '了解收银机商城 - 10年专注POS设备出口，为全球50+国家客户提供优质服务。' 
        : 'Learn about POS Store - 10+ years focused on POS equipment export, serving customers in 50+ countries worldwide.'
      } />

      {/* Hero */}
      <section className="py-8 md:py-12 bg-card/50 border-b border-border">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="text-primary text-sm font-medium uppercase tracking-wider">
              {locale === 'zh' ? '关于我们' : 'About Us'}
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3">
              {locale === 'zh' ? '专业 · 专注 · 值得信赖' : 'Professional · Focused · Trusted'}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              {locale === 'zh'
                ? '我们是一家专注于POS设备出口的专业供应商，拥有超过10年的行业经验。从收银机、POS终端到各类配件，我们为全球客户提供一站式采购解决方案。'
                : 'We are a professional supplier focused on POS equipment export with over 10 years of industry experience. From cash registers, POS terminals to various accessories, we provide one-stop procurement solutions for global customers.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 md:py-12 border-b border-border">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="font-display text-4xl md:text-5xl font-bold text-gradient-gold">
                  {stat.value}
                </p>
                <p className="mt-2 text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-10 md:py-12">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary text-sm font-medium uppercase tracking-wider">
              {locale === 'zh' ? '我们的价值观' : 'Our Values'}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
              {locale === 'zh' ? '为什么选择我们' : 'Why Choose Us'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="metal-surface rounded-xl p-8 text-center"
              >
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-10 md:py-12 bg-card/50">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary text-sm font-medium uppercase tracking-wider">
              {locale === 'zh' ? '资质认证' : 'Certifications'}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
              {locale === 'zh' ? '品质保障' : 'Quality Assurance'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['CE', 'FCC', 'RoHS', 'ISO 9001'].map((cert, index) => (
              <motion.div
                key={cert}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="metal-surface rounded-xl p-8 text-center"
              >
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="font-display font-bold text-xl text-foreground">{cert}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {locale === 'zh' ? '认证' : 'Certified'}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Reach */}
      <section className="py-10 md:py-12">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary text-sm font-medium uppercase tracking-wider">
                {locale === 'zh' ? '全球业务' : 'Global Reach'}
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                {locale === 'zh' ? '服务遍及全球' : 'Serving Worldwide'}
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {locale === 'zh'
                  ? '我们的产品已出口至亚洲、欧洲、北美、南美、非洲及中东等50多个国家和地区。无论您在哪里，我们都能为您提供及时高效的服务。'
                  : 'Our products have been exported to over 50 countries across Asia, Europe, North America, South America, Africa, and the Middle East. Wherever you are, we can provide timely and efficient service.'}
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-primary" />
                  <span className="text-foreground">
                    {locale === 'zh' ? '50+ 国家/地区' : '50+ Countries'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-primary" />
                  <span className="text-foreground">
                    {locale === 'zh' ? '快速发货' : 'Fast Shipping'}
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video rounded-xl overflow-hidden metal-surface p-1">
                <img
                  src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800"
                  alt="Global logistics"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
