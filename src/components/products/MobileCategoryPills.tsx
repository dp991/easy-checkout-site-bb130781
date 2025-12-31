import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { DbCategory } from '@/lib/supabase';

interface MobileCategoryPillsProps {
  categories: DbCategory[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string, name: string) => void;
}

export default function MobileCategoryPills({
  categories,
  selectedCategory,
  onSelectCategory,
}: MobileCategoryPillsProps) {
  const { locale } = useLanguage();

  // Get only parent categories for pills
  const parentCategories = categories.filter(c => !c.parent_id);

  return (
    <div className="md:hidden sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="flex overflow-x-auto gap-2 px-4 py-3 scrollbar-hide">
        {/* All Products Pill */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectCategory('', locale === 'zh' ? '全部产品' : 'All Products')}
          className={`
            whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all
            flex-shrink-0
            ${selectedCategory === null
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
              : 'bg-accent/50 text-foreground border border-border hover:bg-accent'
            }
          `}
        >
          {locale === 'zh' ? '全部' : 'All'}
        </motion.button>

        {/* Category Pills */}
        {parentCategories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          const name = locale === 'zh' ? cat.name_zh : (cat.name_en || cat.name_zh);
          
          return (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectCategory(cat.slug, name)}
              className={`
                whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all
                flex-shrink-0
                ${isSelected
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-accent/50 text-foreground border border-border hover:bg-accent'
                }
              `}
            >
              {name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
