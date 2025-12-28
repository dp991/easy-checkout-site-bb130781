import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DbCategory } from '@/lib/supabase';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategoryTreeProps {
  categories: DbCategory[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string, name: string) => void;
}

export default function CategoryTree({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryTreeProps) {
  const { locale } = useLanguage();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Build tree structure from flat list
  const rootCategories = categories.filter(c => !c.parent_id);
  const getChildren = (parentId: string) => categories.filter(c => c.parent_id === parentId);

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const renderCategory = (category: DbCategory, level: number = 0) => {
    const children = getChildren(category.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = selectedCategory === category.slug;
    const name = locale === 'zh' ? category.name_zh : category.name_en;

    return (
      <div key={category.id}>
        <button
          onClick={() => {
            onSelectCategory(category.slug, name);
            if (hasChildren) {
              toggleExpand(category.id);
            }
          }}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-200",
            "hover:bg-primary/10 hover:text-primary",
            isSelected 
              ? "bg-primary text-primary-foreground font-medium" 
              : "text-muted-foreground"
          )}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4 shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 shrink-0" />
            )
          ) : (
            <span className="w-4" />
          )}
          {hasChildren ? (
            isExpanded ? (
              <FolderOpen className="w-4 h-4 shrink-0 text-primary" />
            ) : (
              <Folder className="w-4 h-4 shrink-0" />
            )
          ) : null}
          <span className="truncate text-left">{name}</span>
        </button>

        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {children
                .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                .map(child => renderCategory(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <ScrollArea className="h-[calc(100vh-120px)]">
      <div className="p-4 space-y-1">
        <h2 className="font-display font-bold text-lg text-foreground mb-4 px-3">
          {locale === 'zh' ? '产品分类' : 'Categories'}
        </h2>
        
        {/* All Products Option */}
        <button
          onClick={() => onSelectCategory('', locale === 'zh' ? '全部产品' : 'All Products')}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-200",
            "hover:bg-primary/10 hover:text-primary",
            selectedCategory === null 
              ? "bg-primary text-primary-foreground font-medium" 
              : "text-muted-foreground"
          )}
          style={{ paddingLeft: '12px' }}
        >
          <span className="w-4" />
          <Folder className="w-4 h-4 shrink-0 text-primary" />
          <span className="truncate text-left">
            {locale === 'zh' ? '全部产品' : 'All Products'}
          </span>
        </button>

        {rootCategories
          .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
          .map(category => renderCategory(category))}
      </div>
    </ScrollArea>
  );
}
