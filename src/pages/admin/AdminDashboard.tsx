import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Section */}
        <div className="glass-card p-6 md:p-8 rounded-2xl border shadow-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                แดชบอร์ดผู้ดูแลระบบ
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                ยินดีต้อนรับ, {profile.full_name || profile.email}
              </p>
            </div>
            <Badge className="w-fit bg-gradient-to-r from-primary to-secondary text-primary-foreground border-0 shadow-glow">
              Admin Dashboard
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {statsList.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index} 
                className="glass-card hover:shadow-glow transition-all duration-300 hover:-translate-y-1 border"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gradient">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="glass-card border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              การดำเนินการด่วน
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Button 
              className="h-auto p-6 flex flex-col items-center gap-3 bg-gradient-to-br from-primary to-primary/80 hover:shadow-glow transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/admin/courses')}
            >
              <div className="p-3 rounded-full bg-background/20">
                <BookOpen className="h-6 w-6" />
              </div>
              <span className="font-medium">จัดการคอร์ส</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-6 flex flex-col items-center gap-3 glass-card hover:shadow-card transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/admin/tools')}
            >
              <div className="p-3 rounded-full bg-primary/10">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
              <span className="font-medium">จัดการเครื่องมือ</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-6 flex flex-col items-center gap-3 glass-card hover:shadow-card transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/admin/ebooks')}
            >
              <div className="p-3 rounded-full bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <span className="font-medium">จัดการ E-books</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-6 flex flex-col items-center gap-3 glass-card hover:shadow-card transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/admin/users')}
            >
              <div className="p-3 rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <span className="font-medium">จัดการผู้ใช้</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}