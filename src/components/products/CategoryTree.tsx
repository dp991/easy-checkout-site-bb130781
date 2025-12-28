import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CategoryNode } from '@/lib/categoryData';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CategoryTreeProps {
  categories: CategoryNode[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string, name: string) => void;
}

interface TreeItemProps {
  node: CategoryNode;
  level: number;
  selectedCategory: string | null;
  onSelectCategory: (slug: string, name: string) => void;
}

function TreeItem({ node, level, selectedCategory, onSelectCategory }: TreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedCategory === node.slug;

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
    onSelectCategory(node.slug, node.name);
  };

  return (
    <div>
      <button
        onClick={handleClick}
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
        <span className="truncate text-left">{node.name}</span>
      </button>
      
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {node.children!.map((child) => (
            <TreeItem
              key={child.slug}
              node={child}
              level={level + 1}
              selectedCategory={selectedCategory}
              onSelectCategory={onSelectCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoryTree({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryTreeProps) {
  return (
    <ScrollArea className="h-[calc(100vh-120px)]">
      <div className="p-4 space-y-1">
        <h2 className="font-display font-bold text-lg text-foreground mb-4 px-3">
          产品分类
        </h2>
        {categories.map((category) => (
          <TreeItem
            key={category.slug}
            node={category}
            level={0}
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
