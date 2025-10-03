import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import UserDetailDialog from "@/components/admin/UserDetailDialog";

interface User {
  user_id: string;
  full_name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  created_at: string;
  enrollments?: Enrollment[];
}

interface Enrollment {
  id: string;
  item_id: string;
  item_type: string;
  enrolled_at: string;
  price_paid: number;
  course_title?: string;
  ebook_title?: string;
  tool_title?: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('user_id, full_name, email, role, created_at')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Fetch all enrollments for all users
      const usersWithEnrollments = await Promise.all(
        (usersData || []).map(async (user) => {
          const { data: enrollments, error: enrollmentError } = await supabase
            .from('enrollments')
            .select('id, item_id, item_type, enrolled_at, price_paid')
            .eq('user_id', user.user_id);

          if (enrollmentError) {
            console.error('Error fetching enrollments for user:', user.user_id, enrollmentError);
            return { ...user, enrollments: [] };
          }

          // Get details for each enrollment based on type
          const enrichedEnrollments = await Promise.all(
            (enrollments || []).map(async (enrollment) => {
              if (enrollment.item_type === 'course') {
                const { data: course } = await supabase
                  .from('courses')
                  .select('title')
                  .eq('id', enrollment.item_id)
                  .single();
                return { ...enrollment, course_title: course?.title || 'ไม่พบชื่อ' };
              } else if (enrollment.item_type === 'ebook') {
                const { data: ebook } = await supabase
                  .from('ebooks')
                  .select('title')
                  .eq('id', enrollment.item_id)
                  .single();
                return { ...enrollment, ebook_title: ebook?.title || 'ไม่พบชื่อ' };
              } else if (enrollment.item_type === 'tool') {
                const { data: tool } = await supabase
                  .from('tools')
                  .select('title')
                  .eq('id', enrollment.item_id)
                  .single();
                return { ...enrollment, tool_title: tool?.title || 'ไม่พบชื่อ' };
              }
              return enrollment;
            })
          );

          return { ...user, enrollments: enrichedEnrollments };
        })
      );

      setUsers(usersWithEnrollments);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลผู้ใช้ได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้? การกระทำนี้ไม่สามารถย้อนกลับได้')) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "สำเร็จ",
        description: "ลบผู้ใช้เรียบร้อยแล้ว",
      });
      
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบผู้ใช้ได้",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setDetailDialogOpen(true);
  };

  const getTotalEnrollments = (user: User) => {
    return user.enrollments?.length || 0;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              จัดการผู้ใช้
            </CardTitle>
            <Badge variant="secondary">
              {users.length} ผู้ใช้ทั้งหมด
            </Badge>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                ยังไม่มีผู้ใช้ลงทะเบียน
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ชื่อผู้ใช้</TableHead>
                    <TableHead>อีเมล</TableHead>
                    <TableHead>สิทธิ์</TableHead>
                    <TableHead>รายการที่ลงทะเบียน</TableHead>
                    <TableHead>วันที่สมัคร</TableHead>
                    <TableHead className="text-right">การจัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell className="font-medium">
                        {user.full_name || 'ไม่ระบุชื่อ'}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="font-normal">
                            {getTotalEnrollments(user)} รายการ
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString('th-TH')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(user)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            ดูรายละเอียด
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user.user_id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <UserDetailDialog
        user={selectedUser}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onUpdate={fetchUsers}
      />
    </AdminLayout>
  );
}