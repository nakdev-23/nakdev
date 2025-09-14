import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Trash2, Users, BookOpen, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";

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
  enrolled_at: string;
  price_paid: number;
  course_title?: string;
}

interface Course {
  id: string;
  title: string;
  slug: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollmentDialogOpen, setEnrollmentDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    fetchCourses();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch users with their enrollments and course details
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('user_id, full_name, email, role, created_at')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Fetch enrollments for each user
      const usersWithEnrollments = await Promise.all(
        (usersData || []).map(async (user) => {
          const { data: enrollments, error: enrollmentError } = await supabase
            .from('enrollments')
            .select('id, item_id, enrolled_at, price_paid')
            .eq('user_id', user.user_id)
            .eq('item_type', 'course');

          if (enrollmentError) {
            console.error('Error fetching enrollments for user:', user.user_id, enrollmentError);
            return { ...user, enrollments: [] };
          }

          // Get course details for each enrollment
          const enrollmentsWithCourses = await Promise.all(
            (enrollments || []).map(async (enrollment) => {
              const { data: course } = await supabase
                .from('courses')
                .select('title')
                .eq('id', enrollment.item_id)
                .single();

              return {
                ...enrollment,
                course_title: course?.title || 'ไม่พบชื่อคอร์ส'
              };
            })
          );

          return { ...user, enrollments: enrollmentsWithCourses };
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

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, slug')
        .order('title');

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'USER' | 'ADMIN') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "สำเร็จ",
        description: "อัปเดตสิทธิ์ผู้ใช้เรียบร้อยแล้ว",
      });

      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตสิทธิ์ได้",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้?')) return;

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

  const handleAddEnrollment = async (userId: string, courseId: string) => {
    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: userId,
          item_id: courseId,
          item_type: 'course',
          price_paid: 0
        });

      if (error) throw error;

      toast({
        title: "สำเร็จ",
        description: "เพิ่มสิทธิ์คอร์สเรียนเรียบร้อยแล้ว",
      });

      fetchUsers();
      setEnrollmentDialogOpen(false);
    } catch (error) {
      console.error('Error adding enrollment:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มสิทธิ์คอร์สเรียนได้",
        variant: "destructive",
      });
    }
  };

  const handleRemoveEnrollment = async (enrollmentId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะยกเลิกสิทธิ์คอร์สเรียนนี้?')) return;

    try {
      const { error } = await supabase
        .from('enrollments')
        .delete()
        .eq('id', enrollmentId);

      if (error) throw error;

      toast({
        title: "สำเร็จ",
        description: "ยกเลิกสิทธิ์คอร์สเรียนเรียบร้อยแล้ว",
      });

      fetchUsers();
    } catch (error) {
      console.error('Error removing enrollment:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถยกเลิกสิทธิ์คอร์สเรียนได้",
        variant: "destructive",
      });
    }
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
                  <TableHead>คอร์สที่ลงทะเบียน</TableHead>
                  <TableHead>วันที่สมัคร</TableHead>
                  <TableHead>การจัดการ</TableHead>
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
                      <Select
                        value={user.role}
                        onValueChange={(value) => handleRoleChange(user.user_id, value as 'USER' | 'ADMIN')}
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">
                            <Badge variant="secondary">USER</Badge>
                          </SelectItem>
                          <SelectItem value="ADMIN">
                            <Badge variant="default">ADMIN</Badge>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                     </TableCell>
                     <TableCell>
                       <div className="space-y-1">
                         {user.enrollments && user.enrollments.length > 0 ? (
                           user.enrollments.map((enrollment) => (
                             <div key={enrollment.id} className="flex items-center justify-between bg-muted/50 rounded px-2 py-1">
                               <span className="text-sm">{enrollment.course_title}</span>
                               <Button
                                 variant="ghost"
                                 size="sm"
                                 onClick={() => handleRemoveEnrollment(enrollment.id)}
                                 className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                               >
                                 <Trash2 className="h-3 w-3" />
                               </Button>
                             </div>
                           ))
                         ) : (
                           <span className="text-muted-foreground text-sm">ยังไม่มีคอร์ส</span>
                         )}
                         <Dialog open={enrollmentDialogOpen && selectedUser?.user_id === user.user_id} onOpenChange={setEnrollmentDialogOpen}>
                           <DialogTrigger asChild>
                             <Button
                               variant="outline" 
                               size="sm"
                               onClick={() => setSelectedUser(user)}
                               className="w-full mt-1"
                             >
                               <Plus className="h-3 w-3 mr-1" />
                               เพิ่มคอร์ส
                             </Button>
                           </DialogTrigger>
                           <DialogContent>
                             <DialogHeader>
                               <DialogTitle>เพิ่มสิทธิ์คอร์สเรียนให้กับ {user.full_name}</DialogTitle>
                             </DialogHeader>
                             <div className="space-y-4">
                               <div className="grid gap-2">
                                 {courses
                                   .filter(course => 
                                     !user.enrollments?.some(e => e.item_id === course.id)
                                   )
                                   .map((course) => (
                                     <Button
                                       key={course.id}
                                       variant="outline"
                                       onClick={() => handleAddEnrollment(user.user_id, course.id)}
                                       className="justify-start"
                                     >
                                       <BookOpen className="h-4 w-4 mr-2" />
                                       {course.title}
                                     </Button>
                                   ))}
                                 {courses.filter(course => 
                                   !user.enrollments?.some(e => e.item_id === course.id)
                                 ).length === 0 && (
                                   <p className="text-muted-foreground text-center py-4">
                                     ผู้ใช้นี้ลงทะเบียนครบทุกคอร์สแล้ว
                                   </p>
                                 )}
                               </div>
                             </div>
                           </DialogContent>
                         </Dialog>
                       </div>
                     </TableCell>
                     <TableCell>
                       {new Date(user.created_at).toLocaleDateString('th-TH')}
                     </TableCell>
                     <TableCell>
                       <div className="flex space-x-2">
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
    </AdminLayout>
  );
}