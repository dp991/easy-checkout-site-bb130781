import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, MessageCircle, Send, Clock, CheckCircle, LogIn, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { submitInquiry } from '@/hooks/useDatabase';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import SEOHead from '@/components/seo/SEOHead';

interface CartItemInfo {
  nameZh: string;
  nameEn: string;
  categoryZh: string;
  categoryEn: string;
  priceRange: string;
  quantity: number;
}

const createContactSchema = (locale: 'zh' | 'en') => z.object({
  name: z.string()
    .min(2, locale === 'zh' ? '姓名至少2个字符' : 'Name must be at least 2 characters')
    .max(100, locale === 'zh' ? '姓名不能超过100个字符' : 'Name must be less than 100 characters'),
  email: z.string()
    .email(locale === 'zh' ? '请输入有效的邮箱地址' : 'Please enter a valid email'),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string()
    .min(10, locale === 'zh' ? '消息至少10个字符' : 'Message must be at least 10 characters')
    .max(5000, locale === 'zh' ? '消息不能超过5000个字符' : 'Message must be less than 5000 characters'),
});

type ContactFormValues = z.infer<ReturnType<typeof createContactSchema>>;

// Animated error message component
function AnimatedFormMessage({ children }: { children?: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      {children && (
        <motion.div
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div className="flex items-center gap-1.5 text-destructive text-xs mt-1.5">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            <span>{children}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Styled input classes
const inputClassName = "h-12 bg-muted/50 border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-white/20 focus:ring-offset-0 focus:border-primary/50 transition-all";

export default function Contact() {
  const { t, locale } = useLanguage();
  const { user, isLoading: authLoading } = useAuth();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoggedIn = !!user;

  const contactSchema = createContactSchema(locale);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      message: '',
    },
    mode: 'onBlur',
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

      form.setValue('message', header + itemsText);
    }
  }, [location.state, locale, form]);

  const onSubmit = async (data: ContactFormValues) => {
    try {
      setIsSubmitting(true);

      await submitInquiry({
        customer_name: data.name,
        customer_email: data.email,
        customer_phone: data.phone || undefined,
        customer_company: data.company || undefined,
        message: data.message,
        source: 'web',
      });

      toast.success(t.contact.success);
    } catch (error) {
      console.error('Contact form submission error:', error);
      if (error instanceof Error) {
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
      value: locale === 'zh' ? '浙江省杭州市' : "Hangzhou, China",
    },
    {
      icon: Clock,
      title: locale === 'zh' ? '工作时间' : 'Business Hours',
      value: locale === 'zh' ? '周一至周五 9:00-18:00' : 'Mon-Fri 9AM-6PM (GMT+8)',
    },
  ];

  return (
    <Layout>
      <SEOHead
        title="Contact Us - POStore"
        titleZh="联系我们 - 收银机商城"
        description="Contact POStore sales team for POS product quotes, technical support, and business inquiries. WhatsApp, Email support available."
        descriptionZh="联系收银机商城销售团队，获取POS产品报价、技术支持和商务咨询。支持WhatsApp、邮件联系。"
        keywords="contact POS supplier, POS quote, cash register inquiry, 联系收银机厂家, POS报价咨询"
        url="/contact"
        breadcrumbs={[
          { name: locale === 'zh' ? '首页' : 'Home', url: '/' },
          { name: locale === 'zh' ? '联系我们' : 'Contact Us', url: '/contact' },
        ]}
      />

      {/* Hero */}
      <section className="py-6 md:py-8 bg-card/50 border-b border-border">
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

      <section className="py-6 md:py-10">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 flex flex-col"
            >
              <div className="metal-surface rounded-xl p-5 md:p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  {contactInfo.map((item) => (
                    <div key={item.title} className="flex gap-4 p-4 rounded-lg bg-muted/50 border border-border/50">
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
                <div className="pt-4 mt-auto border-t border-border/50 space-y-3">
                  <h3 className="font-display font-semibold text-foreground">
                    {locale === 'zh' ? '即时通讯' : 'Instant Messaging'}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href="https://wa.me/8613221018869?text=Hello%2C%20I%20want%20to%20inquire%20about%20your%20POS%20products"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full h-10 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm">
                        <MessageCircle className="w-4 h-4 mr-1.5" />
                        WhatsApp
                      </Button>
                    </a>
                    <a
                      href="https://m.me/yourpage"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full h-10 bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm">
                        <Send className="w-4 h-4 mr-1.5" />
                        Facebook
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3 flex flex-col"
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="metal-surface rounded-xl p-5 md:p-6 space-y-5 flex-1 flex flex-col">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">
                            {t.contact.name} <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={locale === 'zh' ? '请输入您的姓名' : 'Enter your name'}
                              className={inputClassName}
                            />
                          </FormControl>
                          <AnimatedFormMessage>
                            {fieldState.error?.message}
                          </AnimatedFormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">
                            {t.contact.email} <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder={locale === 'zh' ? '请输入邮箱' : 'Enter your email'}
                              className={inputClassName}
                            />
                          </FormControl>
                          <AnimatedFormMessage>
                            {fieldState.error?.message}
                          </AnimatedFormMessage>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">
                            {t.contact.phone}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={locale === 'zh' ? '请输入电话' : 'Enter phone number'}
                              className={inputClassName}
                            />
                          </FormControl>
                          <AnimatedFormMessage>
                            {fieldState.error?.message}
                          </AnimatedFormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">
                            {t.contact.company}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={locale === 'zh' ? '请输入公司名称' : 'Enter company name'}
                              className={inputClassName}
                            />
                          </FormControl>
                          <AnimatedFormMessage>
                            {fieldState.error?.message}
                          </AnimatedFormMessage>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field, fieldState }) => (
                      <FormItem className="flex-1 flex flex-col">
                        <FormLabel className="text-sm font-medium text-foreground">
                          {t.contact.message} <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder={locale === 'zh' ? '请描述您的需求...' : 'Describe your requirements...'}
                            className="bg-muted/50 border-border/50 rounded-lg resize-none flex-1 min-h-[120px] text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-white/20 focus:ring-offset-0 focus:border-primary/50 transition-all"
                          />
                        </FormControl>
                        <AnimatedFormMessage>
                          {fieldState.error?.message}
                        </AnimatedFormMessage>
                      </FormItem>
                    )}
                  />

                  {/* Login prompt for non-logged in users */}
                  <AnimatePresence>
                    {!isLoggedIn && !authLoading && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400">
                          <LogIn className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm">
                            {locale === 'zh'
                              ? '请先登录后再发送询盘'
                              : 'Please login before sending an inquiry'}
                          </span>
                          <Link to="/auth" className="ml-auto">
                            <Button size="sm" variant="outline" className="h-8 text-xs border-amber-500/50 hover:bg-amber-500/10">
                              {locale === 'zh' ? '去登录' : 'Login'}
                            </Button>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative group pt-2">
                    <div className="absolute -inset-1 bg-gradient-gold rounded-lg blur-lg opacity-0 group-hover:opacity-30 transition-opacity" />
                    <Button
                      type="submit"
                      disabled={isSubmitting || !isLoggedIn || authLoading}
                      className="relative w-full h-12 bg-gradient-gold text-primary-foreground hover:opacity-90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-base"
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
                  </div>
                </form>
              </Form>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
