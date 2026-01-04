import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react';
import { DbCategory } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AdminCategoryTreeProps {
  categories: DbCategory[];
  selectedId?: string | null;
  onSelect: (category: DbCategory | null) => void;
}

interface TreeNodeProps {
  category: DbCategory;
  categories: DbCategory[];
  level: number;
  selectedId?: string | null;
  onSelect: (category: DbCategory | null) => void;
}

function TreeNode({ category, categories, level, selectedId, onSelect }: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(true);

  const children = categories.filter(c => c.parent_id === category.id);
  const hasChildren = children.length > 0;
  const isSelected = selectedId === category.id;

  return (
    <div>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex items-center gap-1.5 py-1.5 px-2 rounded-md cursor-pointer transition-colors text-sm",
              isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted"
            )}
            style={{ paddingLeft: `${8 + level * 12}px` }}
            onClick={() => onSelect(category)}
          >
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
                className="p-0.5 hover:bg-muted rounded"
              >
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            ) : (
              <span className="w-5" />
            )}
            {isOpen && hasChildren ? (
              <FolderOpen className="w-4 h-4 text-primary" />
            ) : (
              <Folder className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="text-sm truncate">{category.name_zh}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="start"
          sideOffset={8}
          className="z-[100] max-w-xs bg-primary text-primary-foreground border-primary shadow-lg"
        >
          <p className="font-medium">{category.name_zh}</p>
        </TooltipContent>
      </Tooltip>

      {hasChildren && isOpen && (
        <div>
          {children
            .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
            .map(child => (
              <TreeNode
                key={child.id}
                category={child}
                categories={categories}
                level={level + 1}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            ))}
        </div>
      )}
    </div>
  );
}

export default function AdminCategoryTree({ categories, selectedId, onSelect }: AdminCategoryTreeProps) {
  const rootCategories = categories
    .filter(c => !c.parent_id)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  return (
    <TooltipProvider>
      <div className="space-y-1">
        <div
          className={cn(
            "flex items-center gap-1.5 py-1.5 px-2 rounded-md cursor-pointer transition-colors text-sm",
            selectedId === null ? "bg-primary/10 text-primary" : "hover:bg-muted"
          )}
          onClick={() => onSelect(null)}
        >
          <Folder className="w-4 h-4" />
          <span className="text-sm font-medium">全部分类</span>
        </div>

        {rootCategories.map(category => (
          <TreeNode
            key={category.id}
            category={category}
            categories={categories}
            level={0}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </TooltipProvider>
  );
}
