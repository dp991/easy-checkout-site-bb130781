import { useState, useRef, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, ChevronRight, ChevronDown, Folder, FolderOpen,
  Upload, X, Check, FolderTree, ImageOff, Package
} from 'lucide-react';
import { supabase, DbCategory } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { useImageUpload } from '@/hooks/useImageUpload';
import { generateSnowflakeId } from '@/lib/snowflake';

interface CategoryTreeItemProps {
  category: DbCategory;
  categories: DbCategory[];
  productCounts: Map<string, number>;
  level: number;
  onEdit: (category: DbCategory) => void;
  onDelete: (id: string) => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
}

function CategoryTreeItem({
  category,
  categories,
  productCounts,
  level,
  onEdit,
  onDelete,
  selectedIds,
  onToggleSelect
}: CategoryTreeItemProps) {
  const [isOpen, setIsOpen] = useState(true);
  const children = categories.filter(c => c.parent_id === category.id);
  const hasChildren = children.length > 0;
  const productCount = productCounts.get(category.id) || 0;

  // Level colors
  const levelColors = [
    'border-l-primary bg-primary/5',
    'border-l-cyan-500 bg-cyan-500/5',
    'border-l-orange-500 bg-orange-500/5',
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn(
          "flex items-center gap-3 p-4 rounded-lg border border-border/50 transition-all duration-200 cursor-pointer group",
          "hover:border-primary/40 hover:shadow-md hover:shadow-primary/5",
          level > 0 && "ml-6 border-l-4",
          level > 0 && levelColors[Math.min(level, levelColors.length - 1)],
          selectedIds.has(category.id) && "ring-2 ring-primary/50 border-primary bg-primary/10"
        )}
      >
        {/* Checkbox */}
        <Checkbox
          checked={selectedIds.has(category.id)}
          onCheckedChange={() => onToggleSelect(category.id)}
          className="flex-shrink-0"
        />

        {/* Expand/Collapse */}
        {hasChildren ? (
          <button
            onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
            className="p-1.5 hover:bg-muted rounded-md transition-colors"
          >
            <motion.div
              initial={false}
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </button>
        ) : (
          <span className="w-7" />
        )}

        {/* Icon */}
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
          isOpen && hasChildren ? "bg-primary/20" : "bg-muted/50",
          "group-hover:bg-primary/20"
        )}>
          {isOpen && hasChildren ? (
            <FolderOpen className="w-5 h-5 text-primary" />
          ) : (
            <Folder className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
        </div>

        {/* Image */}
        {category.image_url ? (
          <img
            src={category.image_url}
            alt={category.name_zh}
            className="w-12 h-12 rounded-lg object-cover border border-border/50 flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-muted/30 border border-dashed border-border flex items-center justify-center flex-shrink-0">
            <ImageOff className="w-5 h-5 text-muted-foreground/50" />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-foreground truncate">{category.name_zh}</p>
            {productCount > 0 && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                <Package className="w-3 h-3" />
                {productCount}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">{category.name_en}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => { e.stopPropagation(); onEdit(category); }}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              if (hasChildren) {
                toast.error('请先删除子分类');
                return;
              }
              if (confirm('确定要删除这个分类吗？')) {
                onDelete(category.id);
              }
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Children */}
      <AnimatePresence>
        {hasChildren && isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 space-y-2 overflow-hidden"
          >
            {children
              .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
              .map(child => (
                <CategoryTreeItem
                  key={child.id}
                  category={child}
                  categories={categories}
                  productCounts={productCounts}
                  level={level + 1}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  selectedIds={selectedIds}
                  onToggleSelect={onToggleSelect}
                />
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminCategories() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DbCategory | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    name_zh: '',
    name_en: '',
    slug: '',
    image_url: '',
    parent_id: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImages, isUploading, uploadProgress } = useImageUpload();

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

  const { data: products } = useQuery({
    queryKey: ['admin-products-for-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wh_products')
        .select('id, category_id, images');
      if (error) throw error;
      return data || [];
    },
  });

  // Calculate product counts per category
  const productCounts = useMemo(() => {
    const counts = new Map<string, number>();
    if (products) {
      products.forEach(p => {
        if (p.category_id) {
          counts.set(p.category_id, (counts.get(p.category_id) || 0) + 1);
        }
      });
    }
    return counts;
  }, [products]);

  // Statistics
  const stats = useMemo(() => {
    if (!categories) return { total: 0, root: 0, sub: 0, noImage: 0 };
    const total = categories.length;
    const root = categories.filter(c => !c.parent_id).length;
    const sub = total - root;
    const noImage = categories.filter(c => !c.image_url).length;
    return { total, root, sub, noImage };
  }, [categories]);

  // Get random product image from category
  const getRandomProductImage = (categoryId: string): string | null => {
    if (!products) return null;
    const categoryProducts = products.filter(p =>
      p.category_id === categoryId && p.images && p.images.length > 0
    );
    if (categoryProducts.length === 0) return null;
    const randomProduct = categoryProducts[Math.floor(Math.random() * categoryProducts.length)];
    return randomProduct.images?.[0] || null;
  };

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const imageUrl = data.image_url || null;
      const { error } = await supabase.from('wh_categories').insert([{
        name_zh: data.name_zh,
        name_en: data.name_en,
        slug: generateSnowflakeId(),
        image_url: imageUrl,
        sort_order: 0,
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
      let imageUrl = data.image_url || null;
      if (!imageUrl) {
        imageUrl = getRandomProductImage(data.id);
      }

      const { error } = await supabase.from('wh_categories')
        .update({
          name_zh: data.name_zh,
          name_en: data.name_en,
          slug: generateSnowflakeId(),
          image_url: imageUrl,
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

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const hasChildrenIds = ids.filter(id =>
        categories?.some(c => c.parent_id === id)
      );

      if (hasChildrenIds.length > 0) {
        throw new Error('选中的分类包含子分类，请先删除子分类');
      }

      const { error } = await supabase.from('wh_categories').delete().in('id', ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setSelectedIds(new Set());
      toast.success('批量删除成功');
    },
    onError: (error: Error) => toast.error(error.message || '批量删除失败'),
  });

  const resetForm = () => {
    setFormData({
      name_zh: '',
      name_en: '',
      slug: '',
      image_url: '',
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const urls = await uploadImages(files);
    if (urls.length > 0) {
      setFormData(prev => ({ ...prev, image_url: urls[0] }));
      toast.success('图片上传成功');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (!categories) return;
    if (selectedIds.size === categories.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(categories.map(c => c.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (confirm(`确定要删除选中的 ${selectedIds.size} 个分类吗？`)) {
      bulkDeleteMutation.mutate(Array.from(selectedIds));
    }
  };

  const rootCategories = categories?.filter(c => !c.parent_id).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)) || [];

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

  // Stat cards
  const statCards = [
    { label: '总分类', value: stats.total, icon: Folder, color: 'text-primary', bgColor: 'bg-primary/10' },
    { label: '一级分类', value: stats.root, icon: FolderTree, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10' },
    { label: '二级分类', value: stats.sub, icon: FolderOpen, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
    { label: '无封面', value: stats.noImage, icon: ImageOff, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 bg-card border-border hover:border-primary/30 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center shrink-0`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Toolbar */}
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">分类管理</h1>
              <p className="text-sm text-muted-foreground">管理产品分类（支持多级目录）</p>
            </div>
            <div className="flex gap-2">
              {selectedIds.size > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={bulkDeleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  删除 ({selectedIds.size})
                </Button>
              )}
              {categories && categories.length > 0 && (
                <Button variant="outline" size="sm" onClick={toggleSelectAll}>
                  <Check className="w-4 h-4 mr-1" />
                  {selectedIds.size === categories.length ? '取消' : '全选'}
                </Button>
              )}
              <Button
                size="sm"
                onClick={() => { resetForm(); setIsDialogOpen(true); }}
                className="bg-gradient-cosmos text-primary-foreground hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-1" />
                添加分类
              </Button>
            </div>
          </div>
        </Card>

        {/* Categories Tree */}
        <Card className="p-4 bg-card border-border" style={{ maxHeight: 'calc(100vh - 340px)', overflowY: 'auto' }}>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : rootCategories.length > 0 ? (
            <div className="space-y-2">
              {rootCategories.map(category => (
                <CategoryTreeItem
                  key={category.id}
                  category={category}
                  categories={categories || []}
                  productCounts={productCounts}
                  level={0}
                  onEdit={openEditDialog}
                  onDelete={(id) => deleteMutation.mutate(id)}
                  selectedIds={selectedIds}
                  onToggleSelect={toggleSelect}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Folder className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">暂无分类</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => { resetForm(); setIsDialogOpen(true); }}
              >
                <Plus className="w-4 h-4 mr-1" />
                创建第一个分类
              </Button>
            </div>
          )}
        </Card>

        {/* Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  {editingCategory ? <Pencil className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4 text-primary" />}
                </div>
                {editingCategory ? '编辑分类' : '添加分类'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              {/* Parent Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium">父级分类</label>
                <Select
                  value={formData.parent_id || 'none'}
                  onValueChange={(value) => setFormData({ ...formData, parent_id: value === 'none' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择父级分类（可选）" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      <span className="flex items-center gap-2">
                        <FolderTree className="w-4 h-4" />
                        无（一级分类）
                      </span>
                    </SelectItem>
                    {getAvailableParents().map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <span className="flex items-center gap-2">
                          <Folder className="w-4 h-4" />
                          {cat.parent_id ? '└ ' : ''}{cat.name_zh}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Names */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">中文名称 *</label>
                  <Input
                    value={formData.name_zh}
                    onChange={(e) => setFormData({ ...formData, name_zh: e.target.value })}
                    placeholder="如：收银机"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">英文名称 *</label>
                  <Input
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    placeholder="e.g. POS Machine"
                    required
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">封面图片</label>
                <p className="text-xs text-muted-foreground">如不上传，将自动从该分类下的产品中选择一张图片</p>
                <div className="border-2 border-dashed border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {formData.image_url ? (
                    <div className="relative">
                      <img
                        src={formData.image_url}
                        alt="封面图片"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                        className="absolute top-2 right-2 w-7 h-7 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-full h-24 border-0"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-6 h-6 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {isUploading ? `上传中 ${uploadProgress}%` : '点击上传图片'}
                        </span>
                      </div>
                    </Button>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-cosmos text-primary-foreground hover:opacity-90"
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
