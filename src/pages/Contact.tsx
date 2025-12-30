import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, MapPin, MessageCircle, Send, Clock, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { submitInquiry } from '@/hooks/useDatabase';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { z } from 'zod';

interface CartItemInfo {
  nameZh: string;
  nameEn: string;
  categoryZh: string;
  categoryEn: string;
  priceRange: string;
  quantity: number;
}

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export default function Contact() {
  const { t, locale } = useLanguage();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  // Build cart inquiry message from navigation state
  useEffect(() => {
    const cartItems = location.state?.cartItems as CartItemInfo[] | undefined;
    if (cartItems && cartItems.length > 0) {
      const header = locale === 'zh' 
        ? '我想咨询以下购物车商品：\n\n' 
        : 'I would like to inquire about the following cart items:\n\n';

      const itemsText = cartItems.map((item, index) => {
        const lines = [
          `${index + 1}. ${locale === 'zh' ? '商品名称' : 'Product Name'}:`,
          `   - ${locale === 'zh' ? '中文' : 'Chinese'}: ${item.nameZh}`,
          `   - ${locale === 'zh' ? '英文' : 'English'}: ${item.nameEn || 'N/A'}`,
          `   ${locale === 'zh' ? '分类' : 'Category'}: ${item.categoryZh}${item.categoryEn ? ` / ${item.categoryEn}` : ''}`,
          `   ${locale === 'zh' ? '价格' : 'Price'}: ${item.priceRange}`,
          `   ${locale === 'zh' ? '数量' : 'Quantity'}: ${item.quantity}`,
        ];
        return lines.join('\n');
      }).join('\n\n');

      setFormData(prev => ({
        ...prev,
        message: header + itemsText,
      }));
    }
  }, [location.state, locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      contactSchema.parse(formData);
      setIsSubmitting(true);
      
      await submitInquiry({
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone || undefined,
        customer_company: formData.company || undefined,
        message: formData.message,
        source: 'web',
      });
      
      toast.success(t.contact.success);
      // Don't clear form data - let user manually refresh if needed
    } catch (error) {
      console.error('Contact form submission error:', error);
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else if (error instanceof Error) {
        toast.error(locale === 'zh' ? `提交失败: ${error.message}` : `Submission failed: ${error.message}`);
      } else {
        toast.error(locale === 'zh' ? '提交失败，请重试' : 'Submission failed, please try again');
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
      <section className="py-8 md:py-12 bg-card/50 border-b border-border">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <span className="text-primary text-sm font-medium uppercase tracking-wider">
              {locale === 'zh' ? '联系我们' : 'Get in Touch'}
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
              {t.contact.title}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {t.contact.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <div key={item.title} className="flex gap-4 p-4 rounded-lg bg-card/50 border border-border/50">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
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
              <div className="pt-4 border-t border-border space-y-3">
                <h3 className="font-display font-semibold text-foreground">
                  {locale === 'zh' ? '即时通讯' : 'Instant Messaging'}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="https://wa.me/8613800138000?text=Hello%2C%20I%20want%20to%20inquire%20about%20your%20POS%20products"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full h-10 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm">
                      <MessageCircle className="w-4 h-4 mr-1.5" />
                      WhatsApp
                    </Button>
                  </a>
                  <a
                    href="https://t.me/posstore"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full h-10 bg-[#0088cc] hover:bg-[#0077b3] text-white font-semibold text-sm">
                      <Send className="w-4 h-4 mr-1.5" />
                      Telegram
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
              <form onSubmit={handleSubmit} className="metal-surface rounded-xl p-5 md:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">{t.contact.name} *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={locale === 'zh' ? '请输入您的姓名' : 'Enter your name'}
                      required
                      className="h-10 bg-muted border-border"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">{t.contact.email} *</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={locale === 'zh' ? '请输入邮箱' : 'Enter your email'}
                      required
                      className="h-10 bg-muted border-border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">{t.contact.phone}</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={locale === 'zh' ? '请输入电话' : 'Enter phone number'}
                      className="h-10 bg-muted border-border"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">{t.contact.company}</label>
                    <Input
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder={locale === 'zh' ? '请输入公司名称' : 'Enter company name'}
                      className="h-10 bg-muted border-border"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">{t.contact.message} *</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={locale === 'zh' ? '请描述您的需求...' : 'Describe your requirements...'}
                    required
                    rows={4}
                    className="bg-muted border-border resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-10 bg-gradient-gold text-primary-foreground hover:opacity-90 font-semibold"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                      />
                      {locale === 'zh' ? '发送中...' : 'Sending...'}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
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
