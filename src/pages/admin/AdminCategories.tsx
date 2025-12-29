import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react';
import { supabase, DbCategory } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CategoryTreeItemProps {
  category: DbCategory;
  categories: DbCategory[];
  level: number;
  onEdit: (category: DbCategory) => void;
  onDelete: (id: string) => void;
}

function CategoryTreeItem({ category, categories, level, onEdit, onDelete }: CategoryTreeItemProps) {
  const [isOpen, setIsOpen] = useState(true);
  const children = categories.filter(c => c.parent_id === category.id);
  const hasChildren = children.length > 0;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors",
          level > 0 && "ml-6 border-l-2 border-l-primary/30"
        )}
      >
        {hasChildren ? (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-muted rounded"
          >
            {isOpen ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <span className="w-6" />
        )}
        
        {isOpen && hasChildren ? (
          <FolderOpen className="w-5 h-5 text-primary" />
        ) : (
          <Folder className="w-5 h-5 text-muted-foreground" />
        )}

        {category.image_url && (
          <img
            src={category.image_url}
            alt={category.name_zh}
            className="w-10 h-10 rounded-lg object-cover"
          />
        )}

        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{category.name_zh}</p>
          <p className="text-sm text-muted-foreground truncate">{category.name_en}</p>
        </div>

        <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-muted">
          排序: {category.sort_order}
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(category)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (hasChildren) {
                toast.error('请先删除子分类');
                return;
              }
              if (confirm('确定要删除这个分类吗？')) {
                onDelete(category.id);
              }
            }}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {hasChildren && isOpen && (
        <div className="mt-2 space-y-2">
          {children
            .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
            .map(child => (
              <CategoryTreeItem
                key={child.id}
                category={child}
                categories={categories}
                level={level + 1}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
        </div>
      )}
    </div>
  );
}

export default function AdminCategories() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DbCategory | null>(null);
  const [formData, setFormData] = useState({
    name_zh: '',
    name_en: '',
    slug: '',
    image_url: '',
    sort_order: '0',
    parent_id: '',
  });

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async (): Promise<DbCategory[]> => {
      const { data, error } = await supabase
        .from('wh_categories')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('wh_categories').insert([{
        name_zh: data.name_zh,
        name_en: data.name_en,
        slug: data.slug,
        image_url: data.image_url || null,
        sort_order: parseInt(data.sort_order) || 0,
        parent_id: data.parent_id || null,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setIsDialogOpen(false);
      resetForm();
      toast.success('分类创建成功');
    },
    onError: () => toast.error('创建失败'),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData & { id: string }) => {
      const { error } = await supabase.from('wh_categories')
        .update({
          name_zh: data.name_zh,
          name_en: data.name_en,
          slug: data.slug,
          image_url: data.image_url || null,
          sort_order: parseInt(data.sort_order) || 0,
          parent_id: data.parent_id || null,
        })
        .eq('id', data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setIsDialogOpen(false);
      resetForm();
      toast.success('分类更新成功');
    },
    onError: () => toast.error('更新失败'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('wh_categories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('分类删除成功');
    },
    onError: () => toast.error('删除失败，可能存在关联产品'),
  });

  const resetForm = () => {
    setFormData({
      name_zh: '',
      name_en: '',
      slug: '',
      image_url: '',
      sort_order: '0',
      parent_id: '',
    });
    setEditingCategory(null);
  };

  const openEditDialog = (category: DbCategory) => {
    setEditingCategory(category);
    setFormData({
      name_zh: category.name_zh,
      name_en: category.name_en,
      slug: category.slug,
      image_url: category.image_url || '',
      sort_order: String(category.sort_order || 0),
      parent_id: category.parent_id || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateMutation.mutate({ ...formData, id: editingCategory.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  // Get root categories
  const rootCategories = categories?.filter(c => !c.parent_id).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)) || [];

  // Get available parent categories (exclude current category and its children when editing)
  const getAvailableParents = () => {
    if (!categories) return [];
    if (!editingCategory) return categories;
    
    const getDescendantIds = (id: string): string[] => {
      const children = categories.filter(c => c.parent_id === id);
      let ids = [id];
      for (const child of children) {
        ids = [...ids, ...getDescendantIds(child.id)];
      }
      return ids;
    };
    
    const excludeIds = getDescendantIds(editingCategory.id);
    return categories.filter(c => !excludeIds.includes(c.id));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">分类管理</h1>
            <p className="text-muted-foreground mt-1">管理产品分类（支持多级目录）</p>
          </div>
          <Button
            onClick={() => { resetForm(); setIsDialogOpen(true); }}
            className="bg-gradient-gold text-primary-foreground hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加分类
          </Button>
        </div>

        {/* Categories Tree */}
        <Card className="p-6 bg-card border-border">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : rootCategories.length > 0 ? (
            <div className="space-y-3">
              {rootCategories.map(category => (
                <CategoryTreeItem
                  key={category.id}
                  category={category}
                  categories={categories || []}
                  level={0}
                  onEdit={openEditDialog}
                  onDelete={(id) => deleteMutation.mutate(id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-12">暂无分类</p>
          )}
        </Card>

        {/* Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? '编辑分类' : '添加分类'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">父级分类</label>
                <Select
                  value={formData.parent_id}
                  onValueChange={(value) => setFormData({ ...formData, parent_id: value === 'none' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择父级分类（可选）" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">无（一级分类）</SelectItem>
                    {getAvailableParents().map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.parent_id ? '└ ' : ''}{cat.name_zh}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">中文名称 *</label>
                <Input
                  value={formData.name_zh}
                  onChange={(e) => setFormData({ ...formData, name_zh: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">英文名称 *</label>
                <Input
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">URL Slug *</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">封面图片 URL</label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">排序</label>
                <Input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-gold text-primary-foreground hover:opacity-90"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? '保存中...' : '保存'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
