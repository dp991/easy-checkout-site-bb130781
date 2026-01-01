import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, User, Phone, Building, MessageSquare, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const inquirySchema = z.object({
  customer_name: z.string().min(1, '请输入姓名'),
  customer_email: z.string().email('请输入有效的邮箱地址'),
  customer_phone: z.string().optional(),
  customer_company: z.string().optional(),
  message: z.string().min(10, '请输入至少10个字符的留言'),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

interface InquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId?: string;
  productName?: string;
}

export default function InquiryDialog({ open, onOpenChange, productId, productName }: InquiryDialogProps) {
  const { locale } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      message: productName ? (locale === 'zh' ? `我对产品"${productName}"感兴趣，请提供更多详情和报价。` : `I'm interested in "${productName}". Please provide more details and pricing.`) : '',
    },
  });

  const onSubmit = async (data: InquiryFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('wh_inquiries').insert({
        product_id: productId || null,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone || null,
        customer_company: data.customer_company || null,
        message: data.message,
        source: 'product_page',
        status: 'pending',
        is_read: false,
      });

      if (error) throw error;

      toast.success(locale === 'zh' ? '询盘发送成功！我们会尽快与您联系。' : 'Inquiry sent successfully! We will contact you soon.');
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error(locale === 'zh' ? '发送失败，请稍后重试' : 'Failed to send. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            {locale === 'zh' ? '发送询盘' : 'Send Inquiry'}
          </DialogTitle>
          <DialogDescription>
            {locale === 'zh' 
              ? '填写以下信息，我们会尽快与您联系' 
              : 'Fill in the form below and we will contact you soon'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="customer_name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {locale === 'zh' ? '姓名' : 'Name'} *
            </Label>
            <Input
              id="customer_name"
              placeholder={locale === 'zh' ? '请输入您的姓名' : 'Enter your name'}
              {...register('customer_name')}
              className={errors.customer_name ? 'border-destructive' : ''}
            />
            {errors.customer_name && (
              <p className="text-xs text-destructive">{errors.customer_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer_email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {locale === 'zh' ? '邮箱' : 'Email'} *
            </Label>
            <Input
              id="customer_email"
              type="email"
              placeholder={locale === 'zh' ? '请输入您的邮箱' : 'Enter your email'}
              {...register('customer_email')}
              className={errors.customer_email ? 'border-destructive' : ''}
            />
            {errors.customer_email && (
              <p className="text-xs text-destructive">{errors.customer_email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="customer_phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {locale === 'zh' ? '电话' : 'Phone'}
              </Label>
              <Input
                id="customer_phone"
                placeholder={locale === 'zh' ? '可选' : 'Optional'}
                {...register('customer_phone')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer_company" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                {locale === 'zh' ? '公司' : 'Company'}
              </Label>
              <Input
                id="customer_company"
                placeholder={locale === 'zh' ? '可选' : 'Optional'}
                {...register('customer_company')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              {locale === 'zh' ? '留言' : 'Message'} *
            </Label>
            <Textarea
              id="message"
              rows={4}
              placeholder={locale === 'zh' ? '请描述您的需求...' : 'Describe your requirements...'}
              {...register('message')}
              className={errors.message ? 'border-destructive' : ''}
            />
            {errors.message && (
              <p className="text-xs text-destructive">{errors.message.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gradient-cosmos text-primary-foreground hover:opacity-90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {locale === 'zh' ? '发送中...' : 'Sending...'}
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {locale === 'zh' ? '发送询盘' : 'Send Inquiry'}
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
