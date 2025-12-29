import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package, FolderTree, Users, Eye, FileText, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [products, categories, inquiries, users] = await Promise.all([
        supabase.from('wh_products').select('id', { count: 'exact', head: true }),
        supabase.from('wh_categories').select('id', { count: 'exact', head: true }),
        supabase.from('wh_inquiries').select('id', { count: 'exact', head: true }),
        supabase.from('wh_users').select('id', { count: 'exact', head: true }),
      ]);
      
      return {
        products: products.count || 0,
        categories: categories.count || 0,
        inquiries: inquiries.count || 0,
        users: users.count || 0,
        // These would typically come from an analytics service
        visitors: 1250,
        pageViews: 8420,
      };
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
      label: '用户数', 
      value: stats?.users || 0, 
      icon: Users, 
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    { 
      label: '访客量', 
      value: stats?.visitors?.toLocaleString() || '0', 
      icon: Eye, 
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
    { 
      label: '页面浏览量', 
      value: stats?.pageViews?.toLocaleString() || '0', 
      icon: FileText, 
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </AdminLayout>
  );
}
