import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Users, BookOpen, Wrench, ShoppingBag } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  if (!profile || profile.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <CardContent className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-2">ไม่มีสิทธิ์เข้าถึง</h2>
            <p className="text-muted-foreground">คุณไม่มีสิทธิ์เข้าถึงหน้าผู้ดูแลระบบ</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      title: "ผู้ใช้ทั้งหมด",
      value: "0",
      icon: Users,
      description: "ผู้ใช้ที่ลงทะเบียน"
    },
    {
      title: "คอร์สทั้งหมด",
      value: "0",
      icon: BookOpen,
      description: "คอร์สที่เผยแพร่แล้ว"
    },
    {
      title: "เครื่องมือ",
      value: "0",
      icon: Wrench,
      description: "เครื่องมือที่มีให้บริการ"
    },
    {
      title: "คำสั่งซื้อ",
      value: "0",
      icon: ShoppingBag,
      description: "คำสั่งซื้อทั้งหมด"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">แดชบอร์ดผู้ดูแลระบบ</h1>
          <p className="text-muted-foreground">
            ยินดีต้อนรับ, {profile.full_name || profile.email}
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
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
      </div>
    </div>
  );
}