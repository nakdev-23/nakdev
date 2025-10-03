import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, FileText, Wrench, Plus, Trash2, Calendar, Mail, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserDetailDialogProps {
  user: {
    user_id: string;
    full_name: string;
    email: string;
    role: 'USER' | 'ADMIN';
    created_at: string;
    enrollments?: Array<{
      id: string;
      item_id: string;
      item_type: string;
      enrolled_at: string;
      price_paid: number;
      course_title?: string;
      ebook_title?: string;
      tool_title?: string;
    }>;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

interface Course {
  id: string;
  title: string;
}

interface Ebook {
  id: string;
  title: string;
}

interface Tool {
  id: string;
  title: string;
}

export default function UserDetailDialog({ user, open, onOpenChange, onUpdate }: UserDetailDialogProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchItems();
    }
  }, [open]);

  const fetchItems = async () => {
    try {
      const [coursesData, ebooksData, toolsData] = await Promise.all([
        supabase.from('courses').select('id, title').order('title'),
        supabase.from('ebooks').select('id, title').order('title'),
        supabase.from('tools').select('id, title').order('title')
      ]);

      if (coursesData.data) setCourses(coursesData.data);
      if (ebooksData.data) setEbooks(ebooksData.data);
      if (toolsData.data) setTools(toolsData.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleRoleChange = async (newRole: 'USER' | 'ADMIN') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', user.user_id);

      if (error) throw error;

      toast({
        title: "สำเร็จ",
        description: "อัปเดตสิทธิ์ผู้ใช้เรียบร้อยแล้ว",
      });

      onUpdate();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตสิทธิ์ได้",
        variant: "destructive",
      });
    }
  };

  const handleAddEnrollment = async (itemId: string, itemType: 'course' | 'ebook' | 'tool') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.user_id,
          item_id: itemId,
          item_type: itemType,
          price_paid: 0
        });

      if (error) throw error;

      toast({
        title: "สำเร็จ",
        description: `เพิ่มสิทธิ์${itemType === 'course' ? 'คอร์ส' : itemType === 'ebook' ? 'อีบุ๊ก' : 'เครื่องมือ'}เรียบร้อยแล้ว`,
      });

      onUpdate();
    } catch (error) {
      console.error('Error adding enrollment:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มสิทธิ์ได้",
        variant: "destructive",
      });
    }
  };

  const handleRemoveEnrollment = async (enrollmentId: string, itemType: string) => {
    if (!confirm(`คุณแน่ใจหรือไม่ที่จะยกเลิกสิทธิ์${itemType === 'course' ? 'คอร์ส' : itemType === 'ebook' ? 'อีบุ๊ก' : 'เครื่องมือ'}นี้?`)) return;

    try {
      const { error } = await supabase
        .from('enrollments')
        .delete()
        .eq('id', enrollmentId);

      if (error) throw error;

      toast({
        title: "สำเร็จ",
        description: "ยกเลิกสิทธิ์เรียบร้อยแล้ว",
      });

      onUpdate();
    } catch (error) {
      console.error('Error removing enrollment:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถยกเลิกสิทธิ์ได้",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  const courseEnrollments = user.enrollments?.filter(e => e.item_type === 'course') || [];
  const ebookEnrollments = user.enrollments?.filter(e => e.item_type === 'ebook') || [];
  const toolEnrollments = user.enrollments?.filter(e => e.item_type === 'tool') || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">ข้อมูลผู้ใช้</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info Section */}
          <div className="grid gap-4 p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">ชื่อผู้ใช้</p>
                <p className="font-medium">{user.full_name || 'ไม่ระบุชื่อ'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">อีเมล</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">วันที่สมัคร</p>
                <p className="font-medium">{new Date(user.created_at).toLocaleDateString('th-TH', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">สิทธิ์การเข้าถึง</p>
                <Select value={user.role} onValueChange={(value) => handleRoleChange(value as 'USER' | 'ADMIN')}>
                  <SelectTrigger className="w-40">
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
              </div>
            </div>
          </div>

          {/* Enrollments Section */}
          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                คอร์ส ({courseEnrollments.length})
              </TabsTrigger>
              <TabsTrigger value="ebooks" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                อีบุ๊ก ({ebookEnrollments.length})
              </TabsTrigger>
              <TabsTrigger value="tools" className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                เครื่องมือ ({toolEnrollments.length})
              </TabsTrigger>
            </TabsList>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">คอร์สที่ลงทะเบียน</h4>
                {courseEnrollments.length > 0 ? (
                  courseEnrollments.map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium">{enrollment.course_title}</p>
                        <p className="text-sm text-muted-foreground">
                          ลงทะเบียน: {new Date(enrollment.enrolled_at).toLocaleDateString('th-TH')}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEnrollment(enrollment.id, 'course')}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">ยังไม่มีคอร์ส</p>
                )}
              </div>

              <div className="space-y-2 pt-4 border-t">
                <h4 className="font-medium">เพิ่มคอร์ส</h4>
                <div className="grid gap-2 max-h-60 overflow-y-auto">
                  {courses
                    .filter(course => !courseEnrollments.some(e => e.item_id === course.id))
                    .map((course) => (
                      <Button
                        key={course.id}
                        variant="outline"
                        onClick={() => handleAddEnrollment(course.id, 'course')}
                        className="justify-start"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {course.title}
                      </Button>
                    ))}
                  {courses.filter(course => !courseEnrollments.some(e => e.item_id === course.id)).length === 0 && (
                    <p className="text-muted-foreground text-center py-4">ลงทะเบียนครบทุกคอร์สแล้ว</p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Ebooks Tab */}
            <TabsContent value="ebooks" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">อีบุ๊กที่ลงทะเบียน</h4>
                {ebookEnrollments.length > 0 ? (
                  ebookEnrollments.map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium">{enrollment.ebook_title}</p>
                        <p className="text-sm text-muted-foreground">
                          ลงทะเบียน: {new Date(enrollment.enrolled_at).toLocaleDateString('th-TH')}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEnrollment(enrollment.id, 'ebook')}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">ยังไม่มีอีบุ๊ก</p>
                )}
              </div>

              <div className="space-y-2 pt-4 border-t">
                <h4 className="font-medium">เพิ่มอีบุ๊ก</h4>
                <div className="grid gap-2 max-h-60 overflow-y-auto">
                  {ebooks
                    .filter(ebook => !ebookEnrollments.some(e => e.item_id === ebook.id))
                    .map((ebook) => (
                      <Button
                        key={ebook.id}
                        variant="outline"
                        onClick={() => handleAddEnrollment(ebook.id, 'ebook')}
                        className="justify-start"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {ebook.title}
                      </Button>
                    ))}
                  {ebooks.filter(ebook => !ebookEnrollments.some(e => e.item_id === ebook.id)).length === 0 && (
                    <p className="text-muted-foreground text-center py-4">ลงทะเบียนครบทุกอีบุ๊กแล้ว</p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Tools Tab */}
            <TabsContent value="tools" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">เครื่องมือที่ลงทะเบียน</h4>
                {toolEnrollments.length > 0 ? (
                  toolEnrollments.map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium">{enrollment.tool_title}</p>
                        <p className="text-sm text-muted-foreground">
                          ลงทะเบียน: {new Date(enrollment.enrolled_at).toLocaleDateString('th-TH')}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEnrollment(enrollment.id, 'tool')}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">ยังไม่มีเครื่องมือ</p>
                )}
              </div>

              <div className="space-y-2 pt-4 border-t">
                <h4 className="font-medium">เพิ่มเครื่องมือ</h4>
                <div className="grid gap-2 max-h-60 overflow-y-auto">
                  {tools
                    .filter(tool => !toolEnrollments.some(e => e.item_id === tool.id))
                    .map((tool) => (
                      <Button
                        key={tool.id}
                        variant="outline"
                        onClick={() => handleAddEnrollment(tool.id, 'tool')}
                        className="justify-start"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {tool.title}
                      </Button>
                    ))}
                  {tools.filter(tool => !toolEnrollments.some(e => e.item_id === tool.id)).length === 0 && (
                    <p className="text-muted-foreground text-center py-4">ลงทะเบียนครบทุกเครื่องมือแล้ว</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
