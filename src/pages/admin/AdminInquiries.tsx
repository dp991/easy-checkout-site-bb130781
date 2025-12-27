import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Eye, Trash2, Mail, Phone, Building, MessageSquare } from 'lucide-react';
import { supabase, DbInquiry } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
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

export default function AdminInquiries() {
  const queryClient = useQueryClient();
  const [selectedInquiry, setSelectedInquiry] = useState<DbInquiry | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: inquiries, isLoading } = useQuery({
    queryKey: ['admin-inquiries'],
    queryFn: async (): Promise<DbInquiry[]> => {
      const { data, error } = await supabase
        .from('wh_inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('wh_inquiries')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
      toast.success('状态更新成功');
    },
    onError: () => toast.error('更新失败'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('wh_inquiries').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
      toast.success('询盘删除成功');
    },
    onError: () => toast.error('删除失败'),
  });

  const filteredInquiries = inquiries?.filter(i => 
    statusFilter === 'all' || i.status === statusFilter
  );

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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">询盘列表</h1>
            <p className="text-muted-foreground mt-1">查看和管理客户询盘</p>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="筛选状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="pending">待处理</SelectItem>
              <SelectItem value="replied">已回复</SelectItem>
              <SelectItem value="closed">已关闭</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Inquiries List */}
        <Card className="p-6 bg-card border-border">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredInquiries && filteredInquiries.length > 0 ? (
            <div className="space-y-4">
              {filteredInquiries.map((inquiry, index) => (
                <motion.div
                  key={inquiry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground truncate">
                        {inquiry.customer_name || '未知客户'}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(inquiry.status || 'pending')}`}>
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
                      {inquiry.created_at && new Date(inquiry.created_at).toLocaleDateString('zh-CN')}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedInquiry(inquiry)}
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
