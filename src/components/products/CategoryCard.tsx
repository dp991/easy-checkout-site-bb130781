import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DbCategory } from '@/lib/supabase';

interface CategoryCardProps {
  category: DbCategory;
  index?: number;
}

export default function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const { locale } = useLanguage();

  const name = locale === 'zh' ? category.name_zh : category.name_en;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link
        to={`/categories?category=${category.slug}`}
        className="group block relative overflow-hidden rounded-xl aspect-[4/3] metal-surface"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={category.image_url || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600'}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-4 lg:p-6">
          <h3 className="font-display font-bold text-lg lg:text-2xl text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <p className="text-muted-foreground text-sm">
              {locale === 'zh' ? '查看产品' : 'View Products'}
            </p>
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
              <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
          </div>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        </div>
      </Link>
    </motion.div>
  );
}
