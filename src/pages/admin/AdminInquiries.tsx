import { useState, useRef, useCallback, useEffect } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Eye, Trash2, Mail, Phone, Building, MessageSquare, Circle, Check } from 'lucide-react';
import { supabase, DbInquiry } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
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

const PAGE_SIZE = 20;

export default function AdminInquiries() {
  const queryClient = useQueryClient();
  const [selectedInquiry, setSelectedInquiry] = useState<DbInquiry | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [readFilter, setReadFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Infinite query with cursor-based pagination
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['admin-inquiries-infinite', statusFilter, readFilter],
    queryFn: async ({ pageParam }) => {
      let query = supabase
        .from('wh_inquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(PAGE_SIZE);

      if (pageParam) {
        query = query.lt('created_at', pageParam);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (readFilter === 'unread') {
        query = query.eq('is_read', false);
      } else if (readFilter === 'read') {
        query = query.eq('is_read', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return lastPage[lastPage.length - 1]?.created_at;
    },
    initialPageParam: null as string | null,
  });

  const allInquiries = data?.pages.flat() || [];

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

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('wh_inquiries')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries-infinite'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success('状态更新成功');
    },
    onError: () => toast.error('更新失败'),
  });

  const markAsReadMutation = useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => {
      const { error } = await supabase
        .from('wh_inquiries')
        .update({ is_read })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries-infinite'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: () => toast.error('更新失败'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('wh_inquiries').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries-infinite'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success('询盘删除成功');
    },
    onError: () => toast.error('删除失败'),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from('wh_inquiries').delete().in('id', ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries-infinite'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setSelectedIds(new Set());
      toast.success('批量删除成功');
    },
    onError: () => toast.error('批量删除失败'),
  });

  const handleViewInquiry = (inquiry: DbInquiry) => {
    setSelectedInquiry(inquiry);
    // Mark as read when viewing
    if (!inquiry.is_read && inquiry.id) {
      markAsReadMutation.mutate({ id: inquiry.id, is_read: true });
    }
  };

  // Count unread inquiries
  const unreadCount = allInquiries.filter(i => !i.is_read).length;

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
    if (selectedIds.size === allInquiries.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allInquiries.map(i => i.id!)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (confirm(`确定要删除选中的 ${selectedIds.size} 条询盘吗？`)) {
      bulkDeleteMutation.mutate(Array.from(selectedIds));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'replied':
        return 'bg-green-500/10 text-green-500';
      case 'closed':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return '待处理';
      case 'replied':
        return '已回复';
      case 'closed':
        return '已关闭';
      default:
        return status;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              询盘列表
              {unreadCount > 0 && (
                <span className="ml-3 inline-flex items-center justify-center w-6 h-6 text-xs font-medium bg-destructive text-destructive-foreground rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-muted-foreground mt-1">查看和管理客户询盘</p>
          </div>
          <div className="flex gap-3 flex-wrap">
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
            {allInquiries.length > 0 && (
              <Button variant="outline" size="sm" onClick={toggleSelectAll}>
                <Check className="w-4 h-4 mr-2" />
                {selectedIds.size === allInquiries.length ? '取消全选' : '全选'}
              </Button>
            )}
            <Select value={readFilter} onValueChange={setReadFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="阅读状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="unread">未读</SelectItem>
                <SelectItem value="read">已读</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="处理状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="pending">待处理</SelectItem>
                <SelectItem value="replied">已回复</SelectItem>
                <SelectItem value="closed">已关闭</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Inquiries List */}
        <Card className="p-0 bg-card border-border overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 220px)' }}>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : allInquiries.length > 0 ? (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {allInquiries.map((inquiry, index) => (
                  <motion.div
                    key={inquiry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.02, 0.3) }}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg transition-colors",
                      inquiry.is_read ? "bg-muted/30" : "bg-primary/5 border border-primary/20",
                      selectedIds.has(inquiry.id!) && "ring-2 ring-primary/50"
                    )}
                  >
                    {/* Checkbox */}
                    <Checkbox
                      checked={selectedIds.has(inquiry.id!)}
                      onCheckedChange={() => toggleSelect(inquiry.id!)}
                      className="flex-shrink-0"
                    />

                    {/* Read/Unread Indicator */}
                    <div className="flex-shrink-0">
                      <Circle 
                        className={cn(
                          "w-3 h-3",
                          inquiry.is_read ? "text-muted-foreground" : "text-primary fill-primary"
                        )} 
                      />
                    </div>

                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={cn(
                          "text-foreground truncate",
                          !inquiry.is_read && "font-semibold"
                        )}>
                          {inquiry.customer_name || '未知客户'}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(inquiry.status || 'pending')}`}>
                          {getStatusLabel(inquiry.status || 'pending')}
                        </span>
                        {!inquiry.is_read && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                            未读
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {inquiry.customer_email}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                        {inquiry.message}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {inquiry.created_at && formatDate(inquiry.created_at)}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewInquiry(inquiry)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm('确定要删除这条询盘吗？')) {
                              deleteMutation.mutate(inquiry.id!);
                            }
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Load more trigger */}
              <div ref={loadMoreRef} className="py-4 flex justify-center">
                {isFetchingNextPage && (
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                )}
                {!hasNextPage && allInquiries.length > PAGE_SIZE && (
                  <p className="text-sm text-muted-foreground">已加载全部数据</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-12">暂无询盘</p>
          )}
        </Card>

        {/* Detail Dialog */}
        <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>询盘详情</DialogTitle>
            </DialogHeader>
            {selectedInquiry && (
              <div className="space-y-6 mt-4">
                {/* Customer Info */}
                <div className="space-y-3">
                  <h3 className="font-medium text-foreground">客户信息</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">姓名:</span>
                      <span className="text-foreground">{selectedInquiry.customer_name || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a href={`mailto:${selectedInquiry.customer_email}`} className="text-primary hover:underline">
                        {selectedInquiry.customer_email}
                      </a>
                    </div>
                    {selectedInquiry.customer_phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{selectedInquiry.customer_phone}</span>
                      </div>
                    )}
                    {selectedInquiry.customer_company && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{selectedInquiry.customer_company}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">来源:</span>
                      <span className="text-foreground capitalize">{selectedInquiry.source || 'web'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">时间:</span>
                      <span className="text-foreground">
                        {selectedInquiry.created_at && formatDate(selectedInquiry.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-3">
                  <h3 className="font-medium text-foreground">留言内容</h3>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                    {selectedInquiry.message || '无留言'}
                  </p>
                </div>

                {/* Status Update */}
                <div className="space-y-3">
                  <h3 className="font-medium text-foreground">更新状态</h3>
                  <Select
                    value={selectedInquiry.status}
                    onValueChange={(value) => {
                      updateStatusMutation.mutate({ id: selectedInquiry.id!, status: value });
                      setSelectedInquiry({ ...selectedInquiry, status: value });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">待处理</SelectItem>
                      <SelectItem value="replied">已回复</SelectItem>
                      <SelectItem value="closed">已关闭</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <a
                    href={`mailto:${selectedInquiry.customer_email}`}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      发送邮件
                    </Button>
                  </a>
                  <Button
                    onClick={() => setSelectedInquiry(null)}
                    className="flex-1 bg-gradient-gold text-primary-foreground hover:opacity-90"
                  >
                    关闭
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
