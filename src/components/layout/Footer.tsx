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
    <footer className="bg-card border-t border-border">
      <div className="container-wide pt-8 md:pt-12 pb-6 md:pb-8 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Company Info - Centered on mobile */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center shadow-lg shadow-violet-500/10">
                <span className="font-display font-bold text-xl text-primary-foreground">P</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                POS Store
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-xs md:max-w-none">
              {t.footer.about}
            </p>
            <div className="flex gap-3">
              <a
                href="https://wa.me/8613800138000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[#25D366]/10 text-[#25D366] flex items-center justify-center hover:bg-[#25D366]/20 transition-all hover:scale-105"
                title="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="https://t.me/posstore"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[#0088cc]/10 text-[#0088cc] flex items-center justify-center hover:bg-[#0088cc]/20 transition-all hover:scale-105"
                title="Telegram"
              >
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="font-display font-semibold text-base md:text-lg text-foreground mb-4">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-3 flex flex-col items-center md:items-start">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors block py-0.5 md:py-0"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h3 className="font-display font-semibold text-base md:text-lg text-foreground mb-4">
              {t.footer.contactInfo}
            </h3>
            <ul className="space-y-4 flex flex-col items-center md:items-start">
              <li className="flex items-start gap-3 text-center md:text-left">
                <Mail className="w-5 h-5 text-primary mt-0.5 shrink-0 hidden md:block" />
                <div className="flex flex-col items-center md:items-start">
                  <a href="mailto:ceos@posstore.com" className="text-sm text-foreground hover:text-primary transition-colors">
                    ceos@posstore.com
                  </a>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {locale === 'zh' ? '24小时内回复' : 'Reply within 24h'}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-center md:text-left">
                <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0 hidden md:block" />
                <div className="flex flex-col items-center md:items-start">
                  <p className="text-sm text-foreground leading-relaxed max-w-[200px] md:max-w-none mx-auto md:mx-0">
                    {locale === 'zh'
                      ? '广东省深圳市宝安区'
                      : 'Bao\'an District, Shenzhen, China'}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Copyright Centered */}
        <div className="mt-8 md:mt-12 pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-muted-foreground w-full text-center md:text-left">
              {t.footer.copyright}
            </p>
            {/* Optional: Add Policy Links here if needed later */}
          </div>
        </div>
      </div>
    </footer>
  );
}
