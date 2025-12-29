import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { supabase, DbProduct, DbCategory } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminCategoryTree from '@/components/admin/AdminCategoryTree';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DbProduct | null>(null);
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
    images: '',
    is_featured: false,
    is_new: false,
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async (): Promise<DbProduct[]> => {
      const { data, error } = await supabase
        .from('wh_products')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

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

  // Filter products by category tree
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let result = products;
    
    // Filter by category (including children)
    if (selectedCategoryId && categories) {
      const categoryIds = getDescendantIds(selectedCategoryId, categories);
      result = result.filter(p => p.category_id && categoryIds.includes(p.category_id));
    }
    
    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(p =>
        p.name_zh.toLowerCase().includes(searchLower) ||
        p.name_en.toLowerCase().includes(searchLower)
      );
    }
    
    return result;
  }, [products, categories, selectedCategoryId, search]);

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('wh_products').insert([{
        name_zh: data.name_zh,
        name_en: data.name_en,
        slug: data.slug,
        category_id: data.category_id || null,
        description_zh: data.description_zh,
        description_en: data.description_en,
        price_min: parseFloat(data.price_min) || 0,
        price_max: parseFloat(data.price_max) || 0,
        min_order: parseInt(data.min_order) || 1,
        images: data.images.split('\n').filter(Boolean),
        is_featured: data.is_featured,
        is_new: data.is_new,
        specs: {},
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
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
          price_min: parseFloat(data.price_min) || 0,
          price_max: parseFloat(data.price_max) || 0,
          min_order: parseInt(data.min_order) || 1,
          images: data.images.split('\n').filter(Boolean),
          is_featured: data.is_featured,
          is_new: data.is_new,
        })
        .eq('id', data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
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
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('产品删除成功');
    },
    onError: () => toast.error('删除失败'),
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
      images: '',
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
      images: product.images?.join('\n') || '',
      is_featured: product.is_featured,
      is_new: product.is_new,
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
          <Button
            onClick={() => { resetForm(); setIsDialogOpen(true); }}
            className="bg-gradient-gold text-primary-foreground hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加产品
          </Button>
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
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索产品..."
                className="pl-10 bg-card border-border"
              />
            </div>

            {/* Products List */}
            <Card className="p-6 bg-card border-border">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredProducts && filteredProducts.length > 0 ? (
                <div className="space-y-4">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
                    >
                      <img
                        src={product.images?.[0] || 'https://via.placeholder.com/80'}
                        alt={product.name_zh}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{product.name_zh}</p>
                        <p className="text-sm text-muted-foreground truncate">{product.name_en}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-primary font-medium">
                            ${product.price_min} - ${product.price_max}
                          </span>
                          <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted">
                            {getCategoryName(product.category_id)}
                          </span>
                          {product.is_featured && (
                            <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">热门</span>
                          )}
                          {product.is_new && (
                            <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-500">新品</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(product)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm('确定要删除这个产品吗？')) {
                              deleteMutation.mutate(product.id);
                            }
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
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
                  <label className="text-sm font-medium">URL Slug *</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
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

              <div className="space-y-2">
                <label className="text-sm font-medium">图片URL（每行一个）</label>
                <Textarea
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  rows={3}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded border-border"
                  />
                  <span className="text-sm">设为热门</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_new}
                    onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                    className="rounded border-border"
                  />
                  <span className="text-sm">标记为新品</span>
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
