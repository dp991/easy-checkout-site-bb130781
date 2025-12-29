import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package, FolderTree, Users, Eye, FileText, MessageSquare, Calendar, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';
import { zhCN } from 'date-fns/locale';

type TimeRange = 'week' | 'month' | 'year';

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const today = new Date();
      const startOfToday = startOfDay(today).toISOString();
      const endOfToday = endOfDay(today).toISOString();

      const [products, categories, inquiries, users, todayInquiries] = await Promise.all([
        supabase.from('wh_products').select('id', { count: 'exact', head: true }),
        supabase.from('wh_categories').select('id', { count: 'exact', head: true }),
        supabase.from('wh_inquiries').select('id', { count: 'exact', head: true }),
        supabase.from('wh_users').select('id', { count: 'exact', head: true }),
        supabase.from('wh_inquiries')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', startOfToday)
          .lte('created_at', endOfToday),
      ]);
      
      return {
        products: products.count || 0,
        categories: categories.count || 0,
        inquiries: inquiries.count || 0,
        users: users.count || 0,
        todayInquiries: todayInquiries.count || 0,
      };
    },
  });

  // Fetch inquiry chart data based on time range
  const { data: chartData } = useQuery({
    queryKey: ['admin-inquiry-chart', timeRange],
    queryFn: async () => {
      const today = new Date();
      let startDate: Date;
      let endDate: Date = endOfDay(today);
      let intervals: Date[];
      let formatStr: string;

      switch (timeRange) {
        case 'week':
          startDate = startOfWeek(today, { weekStartsOn: 1 });
          endDate = endOfWeek(today, { weekStartsOn: 1 });
          intervals = eachDayOfInterval({ start: startDate, end: endDate });
          formatStr = 'EEE';
          break;
        case 'month':
          startDate = startOfMonth(today);
          endDate = endOfMonth(today);
          intervals = eachDayOfInterval({ start: startDate, end: endDate });
          formatStr = 'M/d';
          break;
        case 'year':
          startDate = startOfYear(today);
          endDate = endOfYear(today);
          intervals = eachMonthOfInterval({ start: startDate, end: endDate });
          formatStr = 'M月';
          break;
      }

      const { data: inquiries, error } = await supabase
        .from('wh_inquiries')
        .select('created_at')
        .gte('created_at', startOfDay(startDate).toISOString())
        .lte('created_at', endOfDay(endDate).toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group inquiries by interval
      const groupedData = intervals.map(intervalDate => {
        let count = 0;
        
        if (timeRange === 'year') {
          // Count inquiries in this month
          const monthStart = startOfMonth(intervalDate);
          const monthEnd = endOfMonth(intervalDate);
          count = (inquiries || []).filter(i => {
            const date = new Date(i.created_at);
            return date >= monthStart && date <= monthEnd;
          }).length;
        } else {
          // Count inquiries on this day
          const dayStart = startOfDay(intervalDate);
          const dayEnd = endOfDay(intervalDate);
          count = (inquiries || []).filter(i => {
            const date = new Date(i.created_at);
            return date >= dayStart && date <= dayEnd;
          }).length;
        }

        return {
          date: format(intervalDate, formatStr, { locale: zhCN }),
          fullDate: format(intervalDate, 'yyyy-MM-dd', { locale: zhCN }),
          count,
        };
      });

      return groupedData;
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
      label: '今日询盘', 
      value: stats?.todayInquiries || 0, 
      icon: TrendingUp, 
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    { 
      label: '用户数', 
      value: stats?.users || 0, 
      icon: Users, 
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  const chartConfig = {
    count: {
      label: '询盘数',
      color: 'hsl(var(--primary))',
    },
  };

  const timeRangeLabels: Record<TimeRange, string> = {
    week: '本周',
    month: '本月',
    year: '本年',
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">仪表板</h1>
          <p className="text-muted-foreground mt-1">欢迎回来，这是您的网站概览</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
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

        {/* Inquiry Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">询盘趋势</h3>
                  <p className="text-sm text-muted-foreground">历史询盘数据统计</p>
                </div>
              </div>
              <div className="flex gap-2">
                {(['week', 'month', 'year'] as TimeRange[]).map((range) => (
                  <Button
                    key={range}
                    variant={timeRange === range ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeRange(range)}
                    className={timeRange === range ? 'bg-primary text-primary-foreground' : ''}
                  >
                    {timeRangeLabels[range]}
                  </Button>
                ))}
              </div>
            </div>

            <div className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <AreaChart data={chartData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
                            <p className="text-sm font-medium text-foreground">{data.fullDate}</p>
                            <p className="text-sm text-muted-foreground">
                              询盘数: <span className="font-medium text-primary">{data.count}</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCount)"
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
