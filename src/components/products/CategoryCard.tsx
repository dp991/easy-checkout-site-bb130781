import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const name = locale === 'zh' ? category.name_zh : category.name_en;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/categories?category=${category.slug}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <motion.div
      layoutId={`category-card-${category.id}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <a
        href={`/categories?category=${category.slug}`}
        onClick={handleClick}
        className="group block relative overflow-hidden rounded-xl aspect-[4/3] metal-surface"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={category.image_url || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600'}
            alt={name}
            loading="lazy"
            decoding="async"
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
            <motion.div 
              className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 text-primary group-hover:text-primary-foreground transition-colors" />
            </motion.div>
          </div>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        </div>
      </a>
    </motion.div>
  );
}
