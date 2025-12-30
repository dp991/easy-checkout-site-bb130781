import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, Upload, X, Check } from 'lucide-react';
import { supabase, DbProduct, DbCategory } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminCategoryTree from '@/components/admin/AdminCategoryTree';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { useImageUpload } from '@/hooks/useImageUpload';
import { generateSnowflakeId } from '@/lib/snowflake';

const PAGE_SIZE = 20;

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DbProduct | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    name_zh: '',
    name_en: '',
    slug: '',
    category_id: '',
    description_zh: '',
    description_en: '',
    price_min: '',
    price_max: '',
    min_order: '1',
    images: [] as string[],
    is_featured: false,
    is_new: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { uploadImages, isUploading, uploadProgress } = useImageUpload();

  const { data: categories } = useQuery({
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

  // Get all descendant category IDs for a given category
  const getDescendantIds = (categoryId: string, cats: DbCategory[]): string[] => {
    const children = cats.filter(c => c.parent_id === categoryId);
    let ids = [categoryId];
    for (const child of children) {
      ids = [...ids, ...getDescendantIds(child.id, cats)];
    }
    return ids;
  };

  // Infinite query with cursor-based pagination
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['admin-products-infinite', selectedCategoryId, search],
    queryFn: async ({ pageParam }) => {
      let query = supabase
        .from('wh_products')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(PAGE_SIZE);

      if (pageParam) {
        query = query.lt('updated_at', pageParam);
      }

      if (selectedCategoryId && categories) {
        const categoryIds = getDescendantIds(selectedCategoryId, categories);
        query = query.in('category_id', categoryIds);
      }

      if (search) {
        query = query.or(`name_zh.ilike.%${search}%,name_en.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return lastPage[lastPage.length - 1]?.updated_at;
    },
    initialPageParam: null as string | null,
  });

  const allProducts = useMemo(() => {
    return data?.pages.flat() || [];
  }, [data]);

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('wh_products').insert([{
        name_zh: data.name_zh,
        name_en: data.name_en,
        slug: data.slug || generateSnowflakeId(),
        category_id: data.category_id || null,
        description_zh: data.description_zh,
        description_en: data.description_en,
        price_min: parseFloat(data.price_min) || null,
        price_max: parseFloat(data.price_max) || null,
        min_order: parseInt(data.min_order) || 1,
        images: data.images,
        is_featured: data.is_featured,
        is_new: data.is_new,
        specifications: {},
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products-infinite'] });
      setIsDialogOpen(false);
      resetForm();
      toast.success('产品创建成功');
    },
    onError: () => toast.error('创建失败'),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData & { id: string }) => {
      const { error } = await supabase.from('wh_products')
        .update({
          name_zh: data.name_zh,
          name_en: data.name_en,
          slug: data.slug,
          category_id: data.category_id || null,
          description_zh: data.description_zh,
          description_en: data.description_en,
          price_min: data.price_min ? parseFloat(data.price_min) : null,
          price_max: data.price_max ? parseFloat(data.price_max) : null,
          min_order: parseInt(data.min_order) || 1,
          images: data.images,
          is_featured: data.is_featured,
          is_new: data.is_new,
        })
        .eq('id', data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products-infinite'] });
      setIsDialogOpen(false);
      resetForm();
      toast.success('产品更新成功');
    },
    onError: () => toast.error('更新失败'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('wh_products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products-infinite'] });
      toast.success('产品删除成功');
    },
    onError: () => toast.error('删除失败'),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from('wh_products').delete().in('id', ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products-infinite'] });
      setSelectedIds(new Set());
      toast.success('批量删除成功');
    },
    onError: () => toast.error('批量删除失败'),
  });

  const resetForm = () => {
    setFormData({
      name_zh: '',
      name_en: '',
      slug: '',
      category_id: '',
      description_zh: '',
      description_en: '',
      price_min: '',
      price_max: '',
      min_order: '1',
      images: [],
      is_featured: false,
      is_new: false,
    });
    setEditingProduct(null);
  };

  const openEditDialog = (product: DbProduct) => {
    setEditingProduct(product);
    setFormData({
      name_zh: product.name_zh,
      name_en: product.name_en,
      slug: product.slug,
      category_id: product.category_id || '',
      description_zh: product.description_zh || '',
      description_en: product.description_en || '',
      price_min: String(product.price_min || ''),
      price_max: String(product.price_max || ''),
      min_order: String(product.min_order || 1),
      images: product.images || [],
      is_featured: product.is_featured || false,
      is_new: product.is_new || false,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateMutation.mutate({ ...formData, id: editingProduct.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const urls = await uploadImages(files);
    if (urls.length > 0) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }));
      toast.success(`成功上传 ${urls.length} 张图片`);
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
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
    if (selectedIds.size === allProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allProducts.map(p => p.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (confirm(`确定要删除选中的 ${selectedIds.size} 个产品吗？`)) {
      bulkDeleteMutation.mutate(Array.from(selectedIds));
    }
  };

  // Get category name by ID
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId || !categories) return '-';
    const cat = categories.find(c => c.id === categoryId);
    return cat?.name_zh || '-';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">产品管理</h1>
            <p className="text-muted-foreground mt-1">管理您的所有产品</p>
          </div>
          <div className="flex gap-2">
            {selectedIds.size > 0 && (
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                disabled={bulkDeleteMutation.isPending}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                删除选中 ({selectedIds.size})
              </Button>
            )}
            <Button
              onClick={() => { resetForm(); setIsDialogOpen(true); }}
              className="bg-gradient-gold text-primary-foreground hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              添加产品
            </Button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Category Tree Sidebar */}
          <Card className="w-64 flex-shrink-0 p-4 bg-card border-border h-fit sticky top-4">
            <h3 className="font-medium text-foreground mb-3">分类目录</h3>
            {categories && (
              <AdminCategoryTree
                categories={categories}
                selectedId={selectedCategoryId}
                onSelect={(cat) => setSelectedCategoryId(cat?.id || null)}
              />
            )}
          </Card>

          {/* Main Content */}
          <div className="flex-1 space-y-4">
            {/* Search & Select All */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="搜索产品..."
                  className="pl-10 bg-card border-border"
                />
              </div>
              {allProducts.length > 0 && (
                <Button variant="outline" size="sm" onClick={toggleSelectAll}>
                  <Check className="w-4 h-4 mr-2" />
                  {selectedIds.size === allProducts.length ? '取消全选' : '全选'}
                </Button>
              )}
            </div>

            {/* Products Grid */}
            <Card className="p-6 bg-card border-border">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : allProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {allProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: Math.min(index * 0.02, 0.3) }}
                        className={`relative group rounded-lg border overflow-hidden transition-all ${
                          selectedIds.has(product.id) 
                            ? 'border-primary ring-2 ring-primary/20' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {/* Checkbox */}
                        <div className="absolute top-2 left-2 z-10">
                          <Checkbox
                            checked={selectedIds.has(product.id)}
                            onCheckedChange={() => toggleSelect(product.id)}
                            className="bg-background/80 backdrop-blur-sm"
                          />
                        </div>

                        {/* Image */}
                        <div className="aspect-square bg-muted">
                          <img
                            src={product.images?.[0] || 'https://via.placeholder.com/200'}
                            alt={product.name_zh}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="p-3 space-y-1">
                          <p className="font-medium text-foreground text-sm truncate">{product.name_zh}</p>
                          <p className="text-xs text-muted-foreground truncate">{product.name_en}</p>
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="text-xs text-primary font-medium">
                              {product.price_min && product.price_max && product.price_min !== product.price_max
                                ? `$${product.price_min} - $${product.price_max}`
                                : product.price_min
                                  ? `$${product.price_min}`
                                  : product.price_max
                                    ? `$${product.price_max}`
                                    : '询价'}
                            </span>
                            <span className="text-xs text-muted-foreground px-1 py-0.5 rounded bg-muted truncate max-w-[80px]">
                              {getCategoryName(product.category_id)}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            {product.is_featured && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">热门</span>
                            )}
                            {product.is_new && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/10 text-green-500">新品</span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => openEditDialog(product)}
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={() => {
                              if (confirm('确定要删除这个产品吗？')) {
                                deleteMutation.mutate(product.id);
                              }
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Load more trigger */}
                  <div ref={loadMoreRef} className="py-4 flex justify-center">
                    {isFetchingNextPage && (
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground text-center py-12">
                  {selectedCategoryId ? '该分类下暂无产品' : '暂无产品'}
                </p>
              )}
            </Card>
          </div>
        </div>

        {/* Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? '编辑产品' : '添加产品'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">URL Slug</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="留空将自动生成"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">分类</label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.parent_id ? '└ ' : ''}{cat.name_zh}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">中文描述</label>
                <Textarea
                  value={formData.description_zh}
                  onChange={(e) => setFormData({ ...formData, description_zh: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">英文描述</label>
                <Textarea
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">最低价格</label>
                  <Input
                    type="number"
                    value={formData.price_min}
                    onChange={(e) => setFormData({ ...formData, price_min: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">最高价格</label>
                  <Input
                    type="number"
                    value={formData.price_max}
                    onChange={(e) => setFormData({ ...formData, price_max: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">最小起订量</label>
                  <Input
                    type="number"
                    value={formData.min_order}
                    onChange={(e) => setFormData({ ...formData, min_order: e.target.value })}
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">产品图片</label>
                <div className="border-2 border-dashed border-border rounded-lg p-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploading ? `上传中 ${uploadProgress}%` : '选择图片上传（支持多选）'}
                  </Button>

                  {formData.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {formData.images.map((url, index) => (
                        <div key={index} className="relative group aspect-square">
                          <img
                            src={url}
                            alt={`图片 ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: !!checked })}
                  />
                  <span className="text-sm">设为热门</span>
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.is_new}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_new: !!checked })}
                  />
                  <span className="text-sm">设为新品</span>
                </label>
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
