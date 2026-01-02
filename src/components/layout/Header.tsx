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
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Glass background */}
      <div className="absolute inset-0 bg-[hsl(222,47%,5%)]/90 backdrop-blur-xl" />
      {/* Gradient bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container-wide relative">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-gold flex items-center justify-center">
              <span className="font-display font-bold text-lg sm:text-xl text-primary-foreground">P</span>
            </div>
            <span className="font-display font-bold text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors">
              POS Store
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.href)
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Cart Button */}
            <Link to="/cart" className="relative p-2 rounded-lg hover:bg-white/5 transition-colors group">
              <ShoppingCart className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              {itemCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full flex items-center justify-center text-white"
                  style={{ background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' }}
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline max-w-[100px] truncate">
                      {user.email?.split('@')[0]}
                    </span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
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
                      className="absolute right-0 top-full mt-2 p-1.5 w-32 bg-[hsl(222,47%,8%)]/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl shadow-black/20 z-20"
                    >
                      <button
                        onClick={() => { setLocale('en'); setIsLangOpen(false); }}
                        className={`w-full px-3 py-2.5 text-left text-sm rounded-lg transition-all ${locale === 'en'
                            ? 'bg-white/5 text-foreground'
                            : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                          }`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => { setLocale('zh'); setIsLangOpen(false); }}
                        className={`w-full px-3 py-2.5 text-left text-sm rounded-lg transition-all ${locale === 'zh'
                            ? 'bg-white/5 text-foreground'
                            : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                          }`}
                      >
                        中文
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>



            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
              className="md:hidden overflow-hidden"
            >
              {/* Gradient top border */}
              <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              <div className="py-3 px-2 space-y-1">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => { setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${isActive(link.href)
                        ? 'bg-gradient-to-r from-primary/20 to-pink-500/10 text-white border border-primary/30'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                        }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Gradient bottom border */}
              <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
