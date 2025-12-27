import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package, FolderTree, MessageSquare, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [products, categories, inquiries, pendingInquiries] = await Promise.all([
        supabase.from('wh_products').select('id', { count: 'exact', head: true }),
        supabase.from('wh_categories').select('id', { count: 'exact', head: true }),
        supabase.from('wh_inquiries').select('id', { count: 'exact', head: true }),
        supabase.from('wh_inquiries').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);
      
      return {
        products: products.count || 0,
        categories: categories.count || 0,
        inquiries: inquiries.count || 0,
        pendingInquiries: pendingInquiries.count || 0,
      };
    },
  });

  const { data: recentInquiries } = useQuery({
    queryKey: ['recent-inquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wh_inquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
  });

  const statCards = [
    { 
      label: '产品总数', 
      value: stats?.products || 0, 
      icon: Package, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    { 
      label: '分类数量', 
      value: stats?.categories || 0, 
      icon: FolderTree, 
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    { 
      label: '询盘总数', 
      value: stats?.inquiries || 0, 
      icon: MessageSquare, 
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    { 
      label: '待处理询盘', 
      value: stats?.pendingInquiries || 0, 
      icon: TrendingUp, 
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">仪表板</h1>
          <p className="text-muted-foreground mt-1">欢迎回来，这是您的网站概览</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-card border-border">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Inquiries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-card border-border">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              最近询盘
            </h2>
            
            {recentInquiries && recentInquiries.length > 0 ? (
              <div className="space-y-4">
                {recentInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {inquiry.customer_name || '未知客户'}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {inquiry.customer_email}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        inquiry.status === 'pending'
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : inquiry.status === 'replied'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {inquiry.status === 'pending' ? '待处理' : 
                         inquiry.status === 'replied' ? '已回复' : inquiry.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(inquiry.created_at).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">暂无询盘</p>
            )}
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
