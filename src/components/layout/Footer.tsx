import { Link } from 'react-router-dom';
import { Mail, MapPin, MessageCircle, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t, locale } = useLanguage();

  const quickLinks = [
    { href: '/', label: t.nav.home },
    { href: '/categories', label: t.nav.categories },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contact },
  ];

  return (
    <footer className="bg-background border-t border-border">
      <div className="container-wide py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary flex items-center justify-center">
                <span className="font-medium text-lg text-primary-foreground">P</span>
              </div>
              <span className="font-medium text-lg text-foreground tracking-tight">
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
                className="w-10 h-10 border border-border text-muted-foreground flex items-center justify-center hover:border-foreground hover:text-foreground transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://t.me/posstore"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-border text-muted-foreground flex items-center justify-center hover:border-foreground hover:text-foreground transition-colors"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-nav text-foreground mb-4">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm link-underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-nav text-foreground mb-4">
              {t.footer.contactInfo}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-foreground">sales@posstore.com</p>
                  <p className="text-xs text-muted-foreground">
                    {locale === 'zh' ? '24小时内回复' : 'Reply within 24h'}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
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
            <h3 className="text-nav text-foreground mb-4">
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
                className="flex-1 px-4 py-2 bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium uppercase tracking-wider hover:opacity-80 transition-opacity"
              >
                {locale === 'zh' ? '订阅' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex items-center justify-center text-sm">
            <p className="text-muted-foreground">
              {t.footer.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
