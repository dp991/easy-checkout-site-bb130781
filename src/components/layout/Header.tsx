import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, ChevronDown, ShoppingCart, User, LogOut } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { locale, setLocale, t } = useLanguage();
  const { user, isAdmin, signOut } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/categories', label: t.nav.categories },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contact },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="container-wide">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary flex items-center justify-center">
              <span className="font-medium text-lg text-primary-foreground">P</span>
            </div>
            <span className="font-medium text-lg text-foreground tracking-tight">
              POS Store
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`text-nav link-underline transition-colors duration-200 ${
                  isActive(link.href)
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <Link to="/cart" className="relative p-2 hover:opacity-70 transition-opacity">
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 text-nav text-muted-foreground hover:text-foreground transition-colors">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline max-w-[100px] truncate normal-case">
                      {user.email?.split('@')[0]}
                    </span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-sm">
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        {locale === 'zh' ? '管理后台' : 'Admin Panel'}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/cart" className="cursor-pointer">
                      {locale === 'zh' ? '我的购物车' : 'My Cart'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut} className="text-destructive cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    {locale === 'zh' ? '退出登录' : 'Sign Out'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <User className="w-4 h-4 mr-2" />
                  {locale === 'zh' ? '登录' : 'Login'}
                </Button>
              </Link>
            )}

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 text-nav text-muted-foreground hover:text-foreground transition-colors"
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
                      className="absolute right-0 top-full mt-2 py-2 w-32 bg-background border border-border shadow-sm z-20"
                    >
                      <button
                        onClick={() => { setLocale('en'); setIsLangOpen(false); }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-secondary transition-colors ${
                          locale === 'en' ? 'text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => { setLocale('zh'); setIsLangOpen(false); }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-secondary transition-colors ${
                          locale === 'zh' ? 'text-foreground' : 'text-muted-foreground'
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
              <Button>
                {t.nav.inquiry}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-foreground hover:opacity-70 transition-opacity"
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
                    onClick={() => { setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`block px-4 py-3 text-nav transition-colors ${
                      isActive(link.href)
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="px-4 pt-4">
                  <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">
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
