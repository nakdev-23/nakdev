import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import { 
  TrendingUp, Users, ShoppingCart, BookOpen, FileText, Wrench,
  DollarSign, Calendar, Activity, Target
} from 'lucide-react';

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

interface ProductStats {
  name: string;
  sales: number;
  revenue: number;
  type: string;
}

interface UserStats {
  date: string;
  newUsers: number;
  totalUsers: number;
}

interface OrderStatusData {
  status: string;
  count: number;
  percentage: number;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export default function AdminReports() {
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [productStats, setProductStats] = useState<ProductStats[]>([]);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<OrderStatusData[]>([]);
  const [totalStats, setTotalStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0
  });

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      
      // Fetch sales data (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: ordersData } = await supabase
        .from('orders')
        .select('created_at, total_amount, status')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      // Process sales data
      const salesByDate = (ordersData || []).reduce((acc: any, order) => {
        const date = new Date(order.created_at).toLocaleDateString('th-TH');
        if (!acc[date]) {
          acc[date] = { date, revenue: 0, orders: 0 };
        }
        if (order.status === 'confirmed') {
          acc[date].revenue += Number(order.total_amount);
        }
        acc[date].orders += 1;
        return acc;
      }, {});
      
      setSalesData(Object.values(salesByDate));

      // Fetch product statistics
      const { data: orderItems } = await supabase
        .from('order_items')
        .select(`
          item_id,
          item_type,
          quantity,
          price,
          orders!inner(status)
        `)
        .eq('orders.status', 'confirmed');

      const productSales = (orderItems || []).reduce((acc: Record<string, ProductStats>, item) => {
        const key = `${item.item_id}-${item.item_type}`;
        if (!acc[key]) {
          acc[key] = {
            name: `${item.item_type} ${item.item_id.slice(0, 8)}`,
            sales: 0,
            revenue: 0,
            type: item.item_type
          };
        }
        acc[key].sales += item.quantity;
        acc[key].revenue += Number(item.price) * item.quantity;
        return acc;
      }, {});

      setProductStats(Object.values(productSales).slice(0, 10));

      // Fetch user statistics
      const { data: usersData } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      const usersByDate = (usersData || []).reduce((acc: Record<string, UserStats>, user) => {
        const date = new Date(user.created_at).toLocaleDateString('th-TH');
        if (!acc[date]) {
          acc[date] = { date, newUsers: 0, totalUsers: 0 };
        }
        acc[date].newUsers += 1;
        return acc;
      }, {});

      setUserStats(Object.values(usersByDate));

      // Fetch order status distribution
      const { data: orderStatusStats } = await supabase
        .from('orders')
        .select('status');

      const statusCount = (orderStatusStats || []).reduce((acc: Record<string, number>, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});

      const total = Object.values(statusCount).reduce((a: number, b: number) => a + b, 0);
      const statusData = Object.entries(statusCount).map(([status, count]: [string, number]) => ({
        status,
        count,
        percentage: Math.round((count / total) * 100)
      }));

      setOrderStatusData(statusData);

      // Calculate total statistics
      const { data: totalOrdersData } = await supabase
        .from('orders')
        .select('total_amount, status');

      const totalRevenue = (totalOrdersData || [])
        .filter(order => order.status === 'confirmed')
        .reduce((sum, order) => sum + Number(order.total_amount), 0);

      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: totalCourses } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });

      const { count: totalEbooks } = await supabase
        .from('ebooks')
        .select('*', { count: 'exact', head: true });

      const { count: totalTools } = await supabase
        .from('tools')
        .select('*', { count: 'exact', head: true });

      setTotalStats({
        totalRevenue,
        totalOrders: totalOrdersData?.length || 0,
        totalUsers: totalUsers || 0,
        totalProducts: (totalCourses || 0) + (totalEbooks || 0) + (totalTools || 0)
      });

    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">รายงานระบบ</h1>
        <Badge variant="outline" className="text-sm">
          อัปเดตล่าสุด: {new Date().toLocaleDateString('th-TH')}
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">รายได้รวม</p>
                <p className="text-2xl font-bold text-primary">
                  ฿{totalStats.totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  จากคำสั่งซื้อที่ยืนยันแล้ว
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">คำสั่งซื้อทั้งหมด</p>
                <p className="text-2xl font-bold text-secondary">
                  {totalStats.totalOrders.toLocaleString()}
                </p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  คำสั่งซื้อทั้งหมด
                </p>
              </div>
              <Activity className="w-8 h-8 text-secondary opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ผู้ใช้ทั้งหมด</p>
                <p className="text-2xl font-bold text-accent">
                  {totalStats.totalUsers.toLocaleString()}
                </p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <Users className="w-3 h-3 mr-1" />
                  ผู้ใช้ที่ลงทะเบียน
                </p>
              </div>
              <Target className="w-8 h-8 text-accent opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">สินค้าทั้งหมด</p>
                <p className="text-2xl font-bold text-orange-600">
                  {totalStats.totalProducts.toLocaleString()}
                </p>
                <p className="text-xs text-orange-600 flex items-center mt-1">
                  <Calendar className="w-3 h-3 mr-1" />
                  คอร์ส, อีบุ๊ก, เครื่องมือ
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-orange-600 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">ยอดขาย</TabsTrigger>
          <TabsTrigger value="products">สินค้า</TabsTrigger>
          <TabsTrigger value="users">ผู้ใช้</TabsTrigger>
          <TabsTrigger value="orders">คำสั่งซื้อ</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                รายได้รายวัน (30 วันล่าสุด)
              </CardTitle>
              <CardDescription>
                แสดงรายได้และจำนวนคำสั่งซื้อในแต่ละวัน
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'revenue' ? `฿${Number(value).toLocaleString()}` : value,
                        name === 'revenue' ? 'รายได้' : 'คำสั่งซื้อ'
                      ]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stackId="1"
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.3}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="orders" 
                      stackId="2"
                      stroke="hsl(var(--secondary))" 
                      fill="hsl(var(--secondary))" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                สินค้าขายดีที่สุด (Top 10)
              </CardTitle>
              <CardDescription>
                รายการสินค้าที่มียอดขายสูงสุด
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'revenue' ? `฿${Number(value).toLocaleString()}` : value,
                        name === 'revenue' ? 'รายได้' : 'ยอดขาย'
                      ]}
                    />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                ผู้ใช้ใหม่รายวัน (30 วันล่าสุด)
              </CardTitle>
              <CardDescription>
                จำนวนผู้ใช้ใหม่ที่ลงทะเบียนในแต่ละวัน
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [value, 'ผู้ใช้ใหม่']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="newUsers" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--accent))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                สถานะคำสั่งซื้อ
              </CardTitle>
              <CardDescription>
                การกระจายตัวของสถานะคำสั่งซื้อทั้งหมด
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, percentage }) => `${status}: ${percentage}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'จำนวน']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}