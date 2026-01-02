import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package, FolderTree, Users, MessageSquare, TrendingUp, Eye, UserCheck, Activity } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format, startOfDay, endOfDay, subDays, subMonths, eachDayOfInterval, eachMonthOfInterval } from 'date-fns';
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
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
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

  // Fetch traffic stats - today and total
  const { data: trafficStats } = useQuery({
    queryKey: ['admin-traffic-stats'],
    queryFn: async () => {
      const today = new Date();
      const startOfToday = startOfDay(today).toISOString();
      const endOfToday = endOfDay(today).toISOString();

      // Fetch today's page views
      const { data: todayViews, error: todayError } = await supabase
        .from('wh_page_views')
        .select('id, visitor_id, session_id')
        .gte('created_at', startOfToday)
        .lte('created_at', endOfToday);

      if (todayError) throw todayError;

      // Fetch all page views for totals
      const { data: allViews, error: allError } = await supabase
        .from('wh_page_views')
        .select('id, visitor_id, session_id');

      if (allError) throw allError;

      const todayData = todayViews || [];
      const allData = allViews || [];

      return {
        // Today stats
        todayPageViews: todayData.length,
        todayUniqueVisitors: new Set(todayData.map(v => v.visitor_id)).size,
        todaySessions: new Set(todayData.map(v => v.session_id)).size,
        // Total stats
        totalPageViews: allData.length,
        totalUniqueVisitors: new Set(allData.map(v => v.visitor_id)).size,
        totalSessions: new Set(allData.map(v => v.session_id)).size,
      };
    },
  });

  // Fetch inquiry chart data based on time range
  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['admin-inquiry-chart', timeRange],
    queryFn: async () => {
      const today = new Date();
      let startDate: Date;
      const endDate: Date = endOfDay(today);
      let intervals: Date[];
      let formatStr: string;

      switch (timeRange) {
        case 'week':
          // 近7天
          startDate = subDays(today, 6);
          intervals = eachDayOfInterval({ start: startOfDay(startDate), end: today });
          formatStr = 'M/d';
          break;
        case 'month':
          // 近30天
          startDate = subDays(today, 29);
          intervals = eachDayOfInterval({ start: startOfDay(startDate), end: today });
          formatStr = 'M/d';
          break;
        case 'year':
          // 近12个月
          startDate = subMonths(today, 11);
          intervals = eachMonthOfInterval({ start: startOfDay(startDate), end: today });
          formatStr = 'M月';
          break;
      }

      const { data: inquiries, error } = await supabase
        .from('wh_inquiries')
        .select('created_at')
        .gte('created_at', startOfDay(startDate).toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group inquiries by interval
      const groupedData = intervals.map(intervalDate => {
        let count = 0;

        if (timeRange === 'year') {
          const monthStart = startOfDay(new Date(intervalDate.getFullYear(), intervalDate.getMonth(), 1));
          const monthEnd = endOfDay(new Date(intervalDate.getFullYear(), intervalDate.getMonth() + 1, 0));
          count = (inquiries || []).filter(i => {
            const date = new Date(i.created_at);
            return date >= monthStart && date <= monthEnd;
          }).length;
        } else {
          const dayStart = startOfDay(intervalDate);
          const dayEnd = endOfDay(intervalDate);
          count = (inquiries || []).filter(i => {
            const date = new Date(i.created_at);
            return date >= dayStart && date <= dayEnd;
          }).length;
        }

        return {
          date: format(intervalDate, formatStr, { locale: zhCN }),
          fullDate: format(intervalDate, 'yyyy年M月d日', { locale: zhCN }),
          count,
        };
      });

      return groupedData;
    },
  });

  // Calculate total inquiries for current period
  const totalPeriodInquiries = chartData?.reduce((sum, item) => sum + item.count, 0) || 0;

  // Traffic stats cards - combined today and total
  const trafficCards = [
    {
      label: '今日浏览量',
      value: trafficStats?.todayPageViews || 0,
      icon: Eye,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
    {
      label: '今日访客数',
      value: trafficStats?.todayUniqueVisitors || 0,
      icon: UserCheck,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: '今日访问次数',
      value: trafficStats?.todaySessions || 0,
      icon: Activity,
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/10',
    },
    {
      label: '总浏览量',
      value: trafficStats?.totalPageViews || 0,
      icon: Eye,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-600/10',
    },
    {
      label: '总访客数',
      value: trafficStats?.totalUniqueVisitors || 0,
      icon: UserCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-600/10',
    },
    {
      label: '总访问次数',
      value: trafficStats?.totalSessions || 0,
      icon: Activity,
      color: 'text-violet-600',
      bgColor: 'bg-violet-600/10',
    },
  ];

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
    week: '近7天',
    month: '近30天',
    year: '近一年',
  };

  return (
    <AdminLayout>
      <div className="flex flex-col h-[calc(100vh-7.5rem)] gap-4">
        {/* Traffic Stats - Combined in one row */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">流量概览</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {trafficCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 bg-card border-border hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center shrink-0`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Business Stats Grid */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">业务指标</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 + 0.2 }}
              >
                <Card className="p-4 bg-card border-border hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center shrink-0`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Inquiry Chart - Redesigned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex-1 min-h-0"
        >
          <Card className="p-6 bg-card border-border h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg text-foreground">询盘趋势</h3>
                  <span className="text-sm text-muted-foreground">
                    {timeRangeLabels[timeRange]}共 <span className="text-primary font-medium">{totalPeriodInquiries}</span> 条
                  </span>
                </div>
              </div>
              <div className="flex gap-1 bg-muted/50 rounded-lg p-1">
                {(['week', 'month', 'year'] as TimeRange[]).map((range) => (
                  <Button
                    key={range}
                    variant="ghost"
                    size="sm"
                    onClick={() => setTimeRange(range)}
                    className={`h-8 px-4 text-sm transition-all ${timeRange === range
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-transparent'
                      }`}
                  >
                    {timeRangeLabels[range]}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex-1 min-h-[200px] w-full overflow-hidden">
              {chartLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <AreaChart
                    data={chartData || []}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorInquiry" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--border))"
                      strokeOpacity={0.5}
                    />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      interval={timeRange === 'month' ? 2 : 0}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      width={30}
                    />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-lg shadow-xl px-4 py-3">
                              <p className="text-xs text-muted-foreground mb-1">{data.fullDate}</p>
                              <p className="text-base font-semibold text-foreground">
                                {data.count} <span className="text-sm font-normal text-muted-foreground">条询盘</span>
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                      cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorInquiry)"
                      dot={false}
                      activeDot={{
                        r: 5,
                        fill: 'hsl(var(--primary))',
                        stroke: 'hsl(var(--background))',
                        strokeWidth: 2
                      }}
                    />
                  </AreaChart>
                </ChartContainer>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
