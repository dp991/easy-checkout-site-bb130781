import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageCircle, Send, Clock, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});

export default function Contact() {
  const { t, locale } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      contactSchema.parse(formData);
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(t.contact.success);
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'sales@posstore.com',
      link: 'mailto:sales@posstore.com',
    },
    {
      icon: Phone,
      title: locale === 'zh' ? '电话' : 'Phone',
      value: '+86 138 0013 8000',
      link: 'tel:+8613800138000',
    },
    {
      icon: MapPin,
      title: locale === 'zh' ? '地址' : 'Address',
      value: locale === 'zh' ? '广东省深圳市宝安区' : "Bao'an District, Shenzhen, China",
    },
    {
      icon: Clock,
      title: locale === 'zh' ? '工作时间' : 'Business Hours',
      value: locale === 'zh' ? '周一至周五 9:00-18:00' : 'Mon-Fri 9AM-6PM (GMT+8)',
    },
  ];

  return (
    <Layout>
      <title>{locale === 'zh' ? '联系我们 - 收银机商城' : 'Contact Us - POS Store'}</title>
      <meta name="description" content={locale === 'zh' 
        ? '联系我们的销售团队，获取收银机产品报价和技术支持。' 
        : 'Contact our sales team for POS product quotes and technical support.'
      } />

      {/* Hero */}
      <section className="py-16 md:py-24 bg-card/50 border-b border-border">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <span className="text-primary text-sm font-medium uppercase tracking-wider">
              {locale === 'zh' ? '联系我们' : 'Get in Touch'}
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3">
              {t.contact.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {t.contact.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-8"
            >
              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{item.title}</h3>
                      {item.link ? (
                        <a href={item.link} className="text-muted-foreground hover:text-primary transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* IM Buttons */}
              <div className="pt-6 border-t border-border space-y-4">
                <h3 className="font-display font-semibold text-lg text-foreground">
                  {locale === 'zh' ? '即时通讯' : 'Instant Messaging'}
                </h3>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://wa.me/8613800138000?text=Hello%2C%20I%20want%20to%20inquire%20about%20your%20POS%20products"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full h-12 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      {t.contact.whatsapp}
                    </Button>
                  </a>
                  <a
                    href="https://t.me/posstore"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full h-12 bg-[#0088cc] hover:bg-[#0077b3] text-white font-semibold">
                      <Send className="w-5 h-5 mr-2" />
                      {t.contact.telegram}
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              <form onSubmit={handleSubmit} className="metal-surface rounded-xl p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">{t.contact.name} *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={locale === 'zh' ? '请输入您的姓名' : 'Enter your name'}
                      required
                      className="h-12 bg-muted border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">{t.contact.email} *</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={locale === 'zh' ? '请输入邮箱' : 'Enter your email'}
                      required
                      className="h-12 bg-muted border-border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">{t.contact.phone}</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={locale === 'zh' ? '请输入电话' : 'Enter phone number'}
                      className="h-12 bg-muted border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">{t.contact.company}</label>
                    <Input
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder={locale === 'zh' ? '请输入公司名称' : 'Enter company name'}
                      className="h-12 bg-muted border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t.contact.message} *</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={locale === 'zh' ? '请描述您的需求...' : 'Describe your requirements...'}
                    required
                    rows={5}
                    className="bg-muted border-border resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-gradient-gold text-primary-foreground hover:opacity-90 font-semibold"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                      />
                      {locale === 'zh' ? '发送中...' : 'Sending...'}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      {t.contact.send}
                    </span>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
