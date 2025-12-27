import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { locale, setLocale, t } = useLanguage();
  const location = useLocation();

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/products', label: t.nav.products },
    { href: '/categories', label: t.nav.categories },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contact },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container-wide">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center">
              <span className="font-display font-bold text-xl text-primary-foreground">P</span>
            </div>
            <span className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors">
              POS Store
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{locale === 'en' ? 'EN' : '中文'}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              
              <AnimatePresence>
                {isLangOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsLangOpen(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 py-2 w-32 bg-card border border-border rounded-lg shadow-lg z-20"
                    >
                      <button
                        onClick={() => { setLocale('en'); setIsLangOpen(false); }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors ${
                          locale === 'en' ? 'text-primary' : 'text-foreground'
                        }`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => { setLocale('zh'); setIsLangOpen(false); }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors ${
                          locale === 'zh' ? 'text-primary' : 'text-foreground'
                        }`}
                      >
                        中文
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* CTA Button */}
            <Link to="/contact" className="hidden sm:block">
              <Button className="bg-gradient-gold text-primary-foreground hover:opacity-90 font-semibold">
                {t.nav.inquiry}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border overflow-hidden"
            >
              <div className="py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive(link.href)
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="px-4 pt-4">
                  <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90 font-semibold">
                      {t.nav.inquiry}
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
