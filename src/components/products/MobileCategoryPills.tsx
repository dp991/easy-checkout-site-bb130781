import { useRef, useEffect } from 'react';
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Get only parent categories for pills
  const parentCategories = categories.filter(c => !c.parent_id);

  // Auto-scroll to selected category when it changes
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const selectedSlug = selectedCategory || 'all';
    const selectedButton = buttonRefs.current.get(selectedSlug);

    if (selectedButton) {
      const container = scrollContainerRef.current;
      const containerRect = container.getBoundingClientRect();
      const buttonRect = selectedButton.getBoundingClientRect();

      // Calculate scroll position to center the button in view
      const scrollLeft = selectedButton.offsetLeft - (containerRect.width / 2) + (buttonRect.width / 2);

      container.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: 'smooth'
      });
    }
  }, [selectedCategory]);

  return (
    <div className="md:hidden sticky top-14 sm:top-16 z-40 bg-[hsl(222,47%,5%)] shadow-md shadow-black/20">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-2 px-4 py-3 scrollbar-hide"
      >
        {/* All Products Pill */}
        <motion.button
          ref={(el) => { if (el) buttonRefs.current.set('all', el); }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectCategory('', locale === 'zh' ? '全部产品' : 'All Products')}
          className={`
            whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all
            flex-shrink-0
            ${selectedCategory === null
              ? 'bg-gradient-to-r from-primary to-pink-500 text-white shadow-lg shadow-primary/25'
              : 'bg-card/80 text-muted-foreground border border-border/50 hover:border-primary/50 hover:text-foreground'
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
              ref={(el) => { if (el) buttonRefs.current.set(cat.slug, el); }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectCategory(cat.slug, name)}
              className={`
                whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all
                flex-shrink-0
                ${isSelected
                  ? 'bg-gradient-to-r from-primary to-pink-500 text-white shadow-lg shadow-primary/25'
                  : 'bg-card/80 text-muted-foreground border border-border/50 hover:border-primary/50 hover:text-foreground'
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

