import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Users, BookOpen, Wrench, ShoppingBag } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalTools: 0,
    totalOrders: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch courses count
      const { count: coursesCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });

      // Fetch tools count
      const { count: toolsCount } = await supabase
        .from('tools')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: usersCount || 0,
        totalCourses: coursesCount || 0,
        totalTools: toolsCount || 0,
        totalOrders: 0 // Placeholder since we don't have orders table yet
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (!profile || profile.role !== 'ADMIN') {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="p-6">
            <CardContent className="text-center">
              <h2 className="text-2xl font-bold text-destructive mb-2">ไม่มีสิทธิ์เข้าถึง</h2>
              <p className="text-muted-foreground">คุณไม่มีสิทธิ์เข้าถึงหน้าผู้ดูแลระบบ</p>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  const statsList = [
    {
      title: "ผู้ใช้ทั้งหมด",
      value: stats.totalUsers.toString(),
      icon: Users,
      description: "ผู้ใช้ที่ลงทะเบียน"
    },
    {
      title: "คอร์สทั้งหมด",
      value: stats.totalCourses.toString(),
      icon: BookOpen,
      description: "คอร์สที่เผยแพร่แล้ว"
    },
    {
      title: "เครื่องมือ",
      value: stats.totalTools.toString(),
      icon: Wrench,
      description: "เครื่องมือที่มีให้บริการ"
    },
    {
      title: "คำสั่งซื้อ",
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      description: "คำสั่งซื้อทั้งหมด"
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">แดชบอร์ดผู้ดูแลระบบ</h1>
          <p className="text-muted-foreground">
            ยินดีต้อนรับ, {profile.full_name || profile.email}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsList.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>การดำเนินการด่วน</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/admin/courses')}
            >
              <Plus className="h-6 w-6" />
              <span>จัดการคอร์ส</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/admin/tools')}
            >
              <Wrench className="h-6 w-6" />
              <span>จัดการเครื่องมือ</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/admin/ebooks')}
            >
              <BookOpen className="h-6 w-6" />
              <span>จัดการ E-books</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/admin/users')}
            >
              <Users className="h-6 w-6" />
              <span>จัดการผู้ใช้</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}