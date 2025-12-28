import { Link } from 'react-router-dom';
import { Mail, MapPin, MessageCircle, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t, locale } = useLanguage();

  const quickLinks = [
    { href: '/', label: t.nav.home },
    { href: '/products', label: t.nav.products },
    { href: '/categories', label: t.nav.categories },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contact },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center">
                <span className="font-display font-bold text-xl text-primary-foreground">P</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                POS Store
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {t.footer.about}
            </p>
            <div className="flex gap-3">
              <a
                href="https://wa.me/8613800138000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[#25D366]/10 text-[#25D366] flex items-center justify-center hover:bg-[#25D366]/20 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="https://t.me/posstore"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[#0088cc]/10 text-[#0088cc] flex items-center justify-center hover:bg-[#0088cc]/20 transition-colors"
              >
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground mb-4">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground mb-4">
              {t.footer.contactInfo}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-foreground">sales@posstore.com</p>
                  <p className="text-xs text-muted-foreground">
                    {locale === 'zh' ? '24小时内回复' : 'Reply within 24h'}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-foreground">
                    {locale === 'zh' 
                      ? '广东省深圳市宝安区' 
                      : 'Bao\'an District, Shenzhen, China'}
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground mb-4">
              {locale === 'zh' ? '订阅最新资讯' : 'Stay Updated'}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {locale === 'zh' 
                ? '获取最新产品信息和优惠' 
                : 'Get the latest products and offers'}
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder={locale === 'zh' ? '输入邮箱' : 'Enter email'}
                className="flex-1 px-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-gold text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                {locale === 'zh' ? '订阅' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-sm">
            <p className="text-muted-foreground">
              {t.footer.copyright}
            </p>
            <div className="flex gap-4">
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                {locale === 'zh' ? '隐私政策' : 'Privacy Policy'}
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                {locale === 'zh' ? '服务条款' : 'Terms of Service'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
