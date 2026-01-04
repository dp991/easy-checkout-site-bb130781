import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
    Eye, Trash2, Mail, Phone, Building, MessageSquare, Circle, Check,
    Clock, CheckCircle, XCircle, Search, MailOpen, Copy, ExternalLink,
    LayoutGrid, LayoutList
} from 'lucide-react';
import { supabase, DbInquiry } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
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
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const PAGE_SIZE = 20;

type ViewMode = 'table' | 'card';

export default function AdminInquiries() {
    const queryClient = useQueryClient();
    const [selectedInquiry, setSelectedInquiry] = useState<DbInquiry | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [readFilter, setReadFilter] = useState<string>('all');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('table');

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

    // Filter by search query (client-side)
    const filteredInquiries = useMemo(() => {
        if (!searchQuery.trim()) return allInquiries;
        const query = searchQuery.toLowerCase();
        return allInquiries.filter(i =>
            i.customer_name?.toLowerCase().includes(query) ||
            i.customer_email?.toLowerCase().includes(query) ||
            i.customer_company?.toLowerCase().includes(query) ||
            i.message?.toLowerCase().includes(query)
        );
    }, [allInquiries, searchQuery]);

    // Statistics
    const stats = useMemo(() => {
        const total = allInquiries.length;
        const pending = allInquiries.filter(i => i.status === 'pending').length;
        const replied = allInquiries.filter(i => i.status === 'replied').length;
        const unread = allInquiries.filter(i => !i.is_read).length;
        return { total, pending, replied, unread };
    }, [allInquiries]);

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
        if (!inquiry.is_read && inquiry.id) {
            markAsReadMutation.mutate({ id: inquiry.id, is_read: true });
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
        if (selectedIds.size === filteredInquiries.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredInquiries.map(i => i.id!)));
        }
    };

    const handleBulkDelete = () => {
        if (selectedIds.size === 0) return;
        if (confirm(`确定要删除选中的 ${selectedIds.size} 条询盘吗？`)) {
            bulkDeleteMutation.mutate(Array.from(selectedIds));
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('已复制到剪贴板');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'replied':
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'closed':
                return 'bg-muted text-muted-foreground border-border';
            default:
                return 'bg-muted text-muted-foreground border-border';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-3 h-3" />;
            case 'replied':
                return <CheckCircle className="w-3 h-3" />;
            case 'closed':
                return <XCircle className="w-3 h-3" />;
            default:
                return <Circle className="w-3 h-3" />;
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

    const formatRelativeTime = (dateStr: string) => {
        return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: zhCN });
    };

    // Stat cards configuration
    const statCards = [
        { label: '总询盘', value: stats.total, icon: MessageSquare, color: 'text-primary', bgColor: 'bg-primary/10' },
        { label: '待处理', value: stats.pending, icon: Clock, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
        { label: '已回复', value: stats.replied, icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-500/10' },
        { label: '未读', value: stats.unread, icon: MailOpen, color: 'text-red-500', bgColor: 'bg-red-500/10' },
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
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="搜索客户名、邮箱、公司或留言..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex gap-2 flex-wrap">
                            <Select value={readFilter} onValueChange={setReadFilter}>
                                <SelectTrigger className="w-[110px]">
                                    <SelectValue placeholder="阅读状态" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">全部</SelectItem>
                                    <SelectItem value="unread">未读</SelectItem>
                                    <SelectItem value="read">已读</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[110px]">
                                    <SelectValue placeholder="处理状态" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">全部</SelectItem>
                                    <SelectItem value="pending">待处理</SelectItem>
                                    <SelectItem value="replied">已回复</SelectItem>
                                    <SelectItem value="closed">已关闭</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* View Toggle */}
                            <div className="flex gap-1 bg-muted/50 rounded-lg p-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setViewMode('table')}
                                    className={cn(
                                        "h-8 w-8 p-0",
                                        viewMode === 'table' ? 'bg-background shadow-sm' : 'hover:bg-transparent'
                                    )}
                                >
                                    <LayoutList className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setViewMode('card')}
                                    className={cn(
                                        "h-8 w-8 p-0",
                                        viewMode === 'card' ? 'bg-background shadow-sm' : 'hover:bg-transparent'
                                    )}
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Bulk Actions */}
                        <div className="flex gap-2">
                            {filteredInquiries.length > 0 && (
                                <Button variant="outline" size="sm" onClick={toggleSelectAll}>
                                    <Check className="w-4 h-4 mr-1" />
                                    {selectedIds.size === filteredInquiries.length ? '取消' : '全选'}
                                </Button>
                            )}
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
                        </div>
                    </div>
                </Card>

                {/* Inquiries List */}
                <Card className="p-0 bg-card border-border overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 340px)' }}>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : filteredInquiries.length > 0 ? (
                        <div className="flex-1 overflow-y-auto">
                            {viewMode === 'table' ? (
                                /* Table View */
                                <div className="min-w-[800px]">
                                    {/* Table Header */}
                                    <div className="grid grid-cols-[40px_90px_1fr_180px_1fr_100px_90px] gap-3 px-4 py-3 bg-muted/30 border-b border-border text-xs font-medium text-muted-foreground sticky top-0 z-10">
                                        <div className="flex items-center">
                                            <Checkbox
                                                checked={selectedIds.size === filteredInquiries.length && filteredInquiries.length > 0}
                                                onCheckedChange={toggleSelectAll}
                                            />
                                        </div>
                                        <span>状态</span>
                                        <span>客户</span>
                                        <span>邮箱</span>
                                        <span>留言</span>
                                        <span>时间</span>
                                        <span className="text-right">操作</span>
                                    </div>

                                    {/* Table Body */}
                                    {filteredInquiries.map((inquiry, index) => (
                                        <motion.div
                                            key={inquiry.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: Math.min(index * 0.02, 0.2) }}
                                            className={cn(
                                                "grid grid-cols-[40px_90px_1fr_180px_1fr_100px_90px] gap-3 px-4 py-3 border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer items-center",
                                                !inquiry.is_read && "bg-primary/5",
                                                selectedIds.has(inquiry.id!) && "bg-primary/10"
                                            )}
                                            onClick={() => handleViewInquiry(inquiry)}
                                        >
                                            {/* Checkbox */}
                                            <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                                                <Checkbox
                                                    checked={selectedIds.has(inquiry.id!)}
                                                    onCheckedChange={() => toggleSelect(inquiry.id!)}
                                                />
                                            </div>

                                            {/* Status */}
                                            <div className="flex items-center gap-1.5">
                                                {!inquiry.is_read && (
                                                    <Circle className="w-2 h-2 text-primary fill-primary flex-shrink-0" />
                                                )}
                                                <span className={cn(
                                                    "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border",
                                                    getStatusBadge(inquiry.status || 'pending')
                                                )}>
                                                    {getStatusIcon(inquiry.status || 'pending')}
                                                    {getStatusLabel(inquiry.status || 'pending')}
                                                </span>
                                            </div>

                                            {/* Customer */}
                                            <div className="min-w-0">
                                                <p className={cn(
                                                    "text-sm text-foreground truncate",
                                                    !inquiry.is_read && "font-semibold"
                                                )}>
                                                    {inquiry.customer_name || '未知客户'}
                                                </p>
                                                {inquiry.customer_company && (
                                                    <p className="text-xs text-muted-foreground truncate">{inquiry.customer_company}</p>
                                                )}
                                            </div>

                                            {/* Email */}
                                            <div className="min-w-0">
                                                <a
                                                    href={`mailto:${inquiry.customer_email}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="text-sm text-primary hover:underline truncate block"
                                                >
                                                    {inquiry.customer_email}
                                                </a>
                                            </div>

                                            {/* Message */}
                                            <p className="text-sm text-muted-foreground truncate">
                                                {inquiry.message || '-'}
                                            </p>

                                            {/* Time */}
                                            <span className="text-xs text-muted-foreground">
                                                {inquiry.created_at && formatRelativeTime(inquiry.created_at)}
                                            </span>

                                            {/* Actions */}
                                            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleViewInquiry(inquiry)}>
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                    onClick={() => {
                                                        if (confirm('确定要删除这条询盘吗？')) {
                                                            deleteMutation.mutate(inquiry.id!);
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                /* Card View */
                                <div className="p-4 space-y-3">
                                    {filteredInquiries.map((inquiry, index) => (
                                        <motion.div
                                            key={inquiry.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: Math.min(index * 0.02, 0.3) }}
                                            className={cn(
                                                "flex items-center gap-4 p-4 rounded-lg transition-colors cursor-pointer",
                                                inquiry.is_read ? "bg-muted/30" : "bg-primary/5 border border-primary/20",
                                                selectedIds.has(inquiry.id!) && "ring-2 ring-primary/50"
                                            )}
                                            onClick={() => handleViewInquiry(inquiry)}
                                        >
                                            {/* Checkbox */}
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <Checkbox
                                                    checked={selectedIds.has(inquiry.id!)}
                                                    onCheckedChange={() => toggleSelect(inquiry.id!)}
                                                    className="flex-shrink-0"
                                                />
                                            </div>

                                            {/* Read Indicator */}
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
                                                    <span className={cn(
                                                        "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border",
                                                        getStatusBadge(inquiry.status || 'pending')
                                                    )}>
                                                        {getStatusIcon(inquiry.status || 'pending')}
                                                        {getStatusLabel(inquiry.status || 'pending')}
                                                    </span>
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
                                                    {inquiry.created_at && formatRelativeTime(inquiry.created_at)}
                                                </span>
                                                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleViewInquiry(inquiry)}>
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                        onClick={() => {
                                                            if (confirm('确定要删除这条询盘吗？')) {
                                                                deleteMutation.mutate(inquiry.id!);
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

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
                        <div className="text-center py-12">
                            <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-muted-foreground">
                                {searchQuery ? '没有找到匹配的询盘' : '暂无询盘'}
                            </p>
                        </div>
                    )}
                </Card>

                {/* Detail Dialog */}
                <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-3">
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                                    {selectedInquiry?.customer_name?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="block truncate">{selectedInquiry?.customer_name || '未知客户'}</span>
                                    <span className="text-xs font-normal text-muted-foreground">
                                        来源: {selectedInquiry?.source || 'web'}
                                    </span>
                                </div>
                                {selectedInquiry && (
                                    <span className={cn(
                                        "inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border",
                                        getStatusBadge(selectedInquiry.status || 'pending')
                                    )}>
                                        {getStatusIcon(selectedInquiry.status || 'pending')}
                                        {getStatusLabel(selectedInquiry.status || 'pending')}
                                    </span>
                                )}
                            </DialogTitle>
                        </DialogHeader>
                        {selectedInquiry && (
                            <div className="space-y-5 mt-4">
                                {/* Contact Info Card */}
                                <Card className="p-4 bg-muted/30 border-border/50">
                                    <div className="grid gap-3">
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                            <a href={`mailto:${selectedInquiry.customer_email}`} className="text-sm text-primary hover:underline truncate">
                                                {selectedInquiry.customer_email}
                                            </a>
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-auto" onClick={() => copyToClipboard(selectedInquiry.customer_email || '')}>
                                                <Copy className="w-3 h-3" />
                                            </Button>
                                        </div>
                                        {selectedInquiry.customer_phone && (
                                            <div className="flex items-center gap-3">
                                                <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                <span className="text-sm text-foreground">{selectedInquiry.customer_phone}</span>
                                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-auto" onClick={() => copyToClipboard(selectedInquiry.customer_phone || '')}>
                                                    <Copy className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        )}
                                        {selectedInquiry.customer_company && (
                                            <div className="flex items-center gap-3">
                                                <Building className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                <span className="text-sm text-foreground">{selectedInquiry.customer_company}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1 border-t border-border/50">
                                            <Clock className="w-3 h-3" />
                                            {selectedInquiry.created_at && formatDate(selectedInquiry.created_at)}
                                        </div>
                                    </div>
                                </Card>

                                {/* Message */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-foreground">留言内容</h3>
                                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => copyToClipboard(selectedInquiry.message || '')}>
                                            <Copy className="w-3 h-3 mr-1" />
                                            复制
                                        </Button>
                                    </div>
                                    <div className="bg-muted/50 p-4 rounded-lg">
                                        <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                                            {selectedInquiry.message || '无留言'}
                                        </p>
                                    </div>
                                </div>

                                {/* Status Update */}
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-foreground">更新状态</h3>
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

                                {/* Quick Actions */}
                                <div className="flex gap-2 pt-2">
                                    <a href={`mailto:${selectedInquiry.customer_email}`} className="flex-1">
                                        <Button variant="outline" className="w-full">
                                            <Mail className="w-4 h-4 mr-2" />
                                            发送邮件
                                        </Button>
                                    </a>
                                    {selectedInquiry.customer_phone && (
                                        <a
                                            href={`https://wa.me/${selectedInquiry.customer_phone.replace(/\D/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1"
                                        >
                                            <Button variant="outline" className="w-full">
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                WhatsApp
                                            </Button>
                                        </a>
                                    )}
                                    <Button
                                        onClick={() => setSelectedInquiry(null)}
                                        className="flex-1 bg-gradient-cosmos text-primary-foreground hover:opacity-90"
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
