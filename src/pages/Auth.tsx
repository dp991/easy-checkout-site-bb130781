import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);
  const { user, signIn, signUp } = useAuth();
  const { locale } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Handle email confirmation callback
  useEffect(() => {
    const confirmed = searchParams.get('confirmed');
    if (confirmed === 'true') {
      toast.success(locale === 'zh' ? '邮箱验证成功！请登录' : 'Email verified! Please sign in');
      setIsLogin(true);
    }
  }, [searchParams, locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          // Handle email not confirmed error
          if (error.message.includes('Email not confirmed')) {
            toast.error(locale === 'zh' 
              ? '邮箱尚未验证，请检查您的邮箱并点击验证链接' 
              : 'Email not confirmed. Please check your email and click the verification link');
          } else if (error.message.includes('Invalid login')) {
            toast.error(locale === 'zh' ? '邮箱或密码错误' : 'Invalid email or password');
          } else {
            toast.error(locale === 'zh' ? '登录失败：' + error.message : 'Login failed: ' + error.message);
          }
        } else {
          toast.success(locale === 'zh' ? '登录成功！' : 'Login successful!');
          navigate('/');
        }
      } else {
        const { error } = await signUp(email, password, nickname);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error(locale === 'zh' ? '该邮箱已注册' : 'This email is already registered');
          } else {
            toast.error(locale === 'zh' ? '注册失败：' + error.message : 'Registration failed: ' + error.message);
          }
        } else {
          // Show email sent confirmation
          setShowEmailSent(true);
        }
      }
    } catch (error) {
      toast.error(locale === 'zh' ? '操作失败' : 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Email sent confirmation screen
  if (showEmailSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-card border border-border rounded-2xl p-8 shadow-elevated text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            
            <h1 className="text-2xl font-display font-bold text-foreground mb-3">
              {locale === 'zh' ? '验证邮件已发送' : 'Verification Email Sent'}
            </h1>
            
            <p className="text-muted-foreground mb-6">
              {locale === 'zh' 
                ? `我们已向 ${email} 发送了一封验证邮件，请点击邮件中的链接完成注册。`
                : `We've sent a verification email to ${email}. Please click the link in the email to complete your registration.`
              }
            </p>

            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground">
                {locale === 'zh' 
                  ? '没有收到邮件？请检查垃圾邮件文件夹，或稍后重试。'
                  : "Didn't receive the email? Check your spam folder, or try again later."
                }
              </p>
            </div>

            <Button
              onClick={() => {
                setShowEmailSent(false);
                setIsLogin(true);
              }}
              variant="outline"
              className="w-full"
            >
              {locale === 'zh' ? '返回登录' : 'Back to Login'}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl p-8 shadow-elevated">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {locale === 'zh' ? '返回首页' : 'Back to Home'}
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center">
              <span className="font-display font-bold text-xl text-primary-foreground">P</span>
            </div>
            <span className="font-display font-bold text-xl text-foreground">POS Store</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            {isLogin 
              ? (locale === 'zh' ? '欢迎回来' : 'Welcome Back')
              : (locale === 'zh' ? '创建账户' : 'Create Account')
            }
          </h1>
          <p className="text-muted-foreground mb-6">
            {isLogin
              ? (locale === 'zh' ? '登录以访问您的账户' : 'Sign in to access your account')
              : (locale === 'zh' ? '注册后需验证邮箱' : 'Email verification required after signup')
            }
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="nickname">{locale === 'zh' ? '昵称' : 'Nickname'}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="nickname"
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder={locale === 'zh' ? '输入昵称' : 'Enter nickname'}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{locale === 'zh' ? '邮箱' : 'Email'}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={locale === 'zh' ? '输入邮箱地址' : 'Enter email address'}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{locale === 'zh' ? '密码' : 'Password'}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={locale === 'zh' ? '输入密码（至少6位）' : 'Enter password (min 6 chars)'}
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin
                ? (locale === 'zh' ? '登录' : 'Sign In')
                : (locale === 'zh' ? '注册' : 'Sign Up')
              }
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              {isLogin
                ? (locale === 'zh' ? '还没有账户？' : "Don't have an account? ")
                : (locale === 'zh' ? '已有账户？' : 'Already have an account? ')
              }
            </span>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline font-medium"
            >
              {isLogin
                ? (locale === 'zh' ? '立即注册' : 'Sign Up')
                : (locale === 'zh' ? '立即登录' : 'Sign In')
              }
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
