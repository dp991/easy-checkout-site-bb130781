import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';
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
      <div className="container-wide py-6 md:py-10 px-4 md:px-6">
        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Brand */}
          <div className="flex flex-col items-center text-center mb-8">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center shadow-lg shadow-violet-500/10">
                <span className="font-display font-bold text-xl text-primary-foreground">P</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                POS Store
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {t.footer.about}
            </p>
          </div>

          {/* Quick Links + Contact in 2-column */}
          <div className="grid grid-cols-2 gap-6 border-t border-border pt-6">
            <div>
              <h3 className="font-display font-semibold text-sm text-foreground mb-3">
                {t.footer.quickLinks}
              </h3>
              <ul className="space-y-2">
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
            <div>
              <h3 className="font-display font-semibold text-sm text-foreground mb-3">
                {t.footer.contactInfo}
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <a href="mailto:ceos@posstore.com" className="text-sm text-foreground hover:text-primary transition-colors block">
                      ceos@posstore.com
                    </a>
                    <p className="text-xs text-muted-foreground">
                      {locale === 'zh' ? '24h内回复' : '24h reply'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground">
                    {locale === 'zh' ? '浙江省杭州市' : 'Hangzhou, China'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Centered 3-column grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
          {/* Company Info */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center shadow-lg shadow-violet-500/10">
                <span className="font-display font-bold text-xl text-primary-foreground">P</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                POS Store
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t.footer.about}
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="font-display font-semibold text-base text-foreground mb-4">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-2">
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
          <div className="text-center">
            <h3 className="font-display font-semibold text-base text-foreground mb-4">
              {t.footer.contactInfo}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:ceos@posstore.com" className="text-sm text-foreground hover:text-primary transition-colors">
                  ceos@posstore.com
                </a>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-foreground">
                  {locale === 'zh' ? '浙江省杭州市' : 'Hangzhou, China'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Copyright centered */}
        <div className="mt-6 md:mt-8 pt-4 border-t border-border">
          <p className="text-muted-foreground text-xs md:text-sm text-center pb-2">
            {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
