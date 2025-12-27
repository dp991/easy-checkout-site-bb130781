import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';

export default function AdminSettings() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">网站设置</h1>
          <p className="text-muted-foreground mt-1">配置网站基本信息</p>
        </div>

        <Card className="p-6 bg-card border-border">
          <p className="text-muted-foreground text-center py-12">
            设置功能开发中...
          </p>
        </Card>
      </div>
    </AdminLayout>
  );
}
