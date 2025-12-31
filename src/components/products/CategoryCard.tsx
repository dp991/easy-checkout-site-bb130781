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
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <a
        href={`/categories?category=${category.slug}`}
        onClick={handleClick}
        className="group block relative overflow-hidden aspect-[4/3]"
      >
        {/* Background Image - opacity change on hover, no scale */}
        <div className="absolute inset-0">
          <img
            src={category.image_url || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600'}
            alt={name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-4 lg:p-6">
          <h3 className="font-medium text-lg lg:text-xl text-primary-foreground group-hover:underline group-hover:underline-offset-2 transition-all">
            {name}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <p className="text-primary-foreground/70 text-sm">
              {locale === 'zh' ? '查看产品' : 'View Products'}
            </p>
            <div className="w-8 h-8 border border-primary-foreground/30 flex items-center justify-center group-hover:border-primary-foreground transition-colors">
              <ArrowRight className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
}
