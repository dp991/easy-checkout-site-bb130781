import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, MessageCircle, Send, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

function FooterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border md:border-none last:border-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 md:py-0 md:mb-4 group select-none md:cursor-default"
      >
        <h3 className="font-display font-semibold text-base md:text-lg text-foreground group-hover:text-primary transition-colors md:group-hover:text-foreground">
          {title}
        </h3>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 md:hidden ${isOpen ? 'rotate-180 text-primary' : ''
            }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:h-auto md:opacity-100 ${isOpen ? 'max-h-[500px] opacity-100 mb-4' : 'max-h-0 opacity-0 md:max-h-none md:mb-0'
          }`}
      >
        {children}
      </div>
    </div>
  );
}

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
          <FooterSection title={t.footer.quickLinks}>
            <ul className="space-y-3">
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
          </FooterSection>

          {/* Contact Info */}
          <FooterSection title={t.footer.contactInfo}>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <a href="mailto:ceos@posstore.com" className="text-sm text-foreground hover:text-primary transition-colors">
                    ceos@posstore.com
                  </a>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {locale === 'zh' ? '24小时内回复' : 'Reply within 24h'}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {locale === 'zh'
                      ? '广东省深圳市宝安区'
                      : 'Bao\'an District, Shenzhen, China'}
                  </p>
                </div>
              </li>
            </ul>
          </FooterSection>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 md:mt-12 pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-muted-foreground text-center md:text-left">
              {t.footer.copyright}
            </p>
            {/* Optional: Add Policy Links here if needed later */}
          </div>
        </div>
      </div>
    </footer>
  );
}
