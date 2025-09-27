import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, BookOpen, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  instructor: string;
  total_lessons: number;
  price: number | null;
  cover_image_url?: string;
  cover_image_path?: string;
  tags: string[];
  features: string[];
  created_at: string;
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    instructor: '',
    total_lessons: 0,
    price: 0,
    cover_image_url: '',
    cover_image_path: '',
    tags: [] as string[],
    features: [] as string[]
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newTag, setNewTag] = useState('');
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลคอร์สได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadCoverImage = async (file: File): Promise<{ url: string; path: string } | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `courses/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-covers')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('product-covers')
        .getPublicUrl(filePath)

      return { url: publicUrl, path: filePath }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({ 
        title: "เกิดข้อผิดพลาด", 
        description: "ไม่สามารถอัปโหลดรูปภาพได้",
        variant: "destructive" 
      })
      return null
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setFormData({
      ...formData,
      features: formData.features.filter(feature => feature !== featureToRemove)
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
    } else {
      toast({ 
        title: "ไฟล์ไม่ถูกต้อง", 
        description: "กรุณาเลือกไฟล์รูปภาพ",
        variant: "destructive" 
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let courseData = { ...formData }

      // Upload new cover image if selected
      if (selectedFile) {
        const uploadResult = await uploadCoverImage(selectedFile)
        if (uploadResult) {
          courseData.cover_image_url = uploadResult.url
          courseData.cover_image_path = uploadResult.path
        }
      }

      if (editingCourse) {
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', editingCourse.id);

        if (error) throw error;

        toast({
          title: "สำเร็จ",
          description: "อัปเดตคอร์สเรียบร้อยแล้ว",
        });
      } else {
        const { error } = await supabase
          .from('courses')
          .insert([courseData]);

        if (error) throw error;

        toast({
          title: "สำเร็จ",
          description: "เพิ่มคอร์สใหม่เรียบร้อยแล้ว",
        });
      }

      setIsDialogOpen(false);
      setEditingCourse(null);
      setFormData({ 
        title: '', 
        slug: '', 
        description: '', 
        instructor: '', 
        total_lessons: 0, 
        price: 0, 
        cover_image_url: '', 
        cover_image_path: '',
        tags: [],
        features: []
      });
      setSelectedFile(null);
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      slug: course.slug,
      description: course.description || '',
      instructor: course.instructor || '',
      total_lessons: course.total_lessons || 0,
      price: course.price || 0,
      cover_image_url: course.cover_image_url || '',
      cover_image_path: course.cover_image_path || '',
      tags: course.tags || [],
      features: course.features || []
    });
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบคอร์สนี้?')) return;

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "สำเร็จ",
        description: "ลบคอร์สเรียบร้อยแล้ว",
      });
      
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบคอร์สได้",
        variant: "destructive",
      });
    }
  };

  const openAddDialog = () => {
    setEditingCourse(null);
    setFormData({ 
      title: '', 
      slug: '', 
      description: '', 
      instructor: '', 
      total_lessons: 0, 
      price: 0, 
      cover_image_url: '', 
      cover_image_path: '',
      tags: [],
      features: []
    });
    setSelectedFile(null);
    setIsDialogOpen(true);
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
          <CardTitle>จัดการคอร์ส</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มคอร์สใหม่
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingCourse ? 'แก้ไขคอร์ส' : 'เพิ่มคอร์สใหม่'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">ชื่อคอร์ส</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">คำอธิบาย</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="cover_image">รูปปกคอร์ส</Label>
                  <Input
                    id="cover_image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {formData.cover_image_url && (
                    <div className="mt-2">
                      <img 
                        src={formData.cover_image_url} 
                        alt="Cover preview" 
                        className="w-32 h-20 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>

                 <div className="grid grid-cols-3 gap-4">
                   <div>
                     <Label htmlFor="instructor">ผู้สอน</Label>
                     <Input
                       id="instructor"
                       value={formData.instructor}
                       onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                     />
                   </div>
                   <div>
                     <Label htmlFor="total_lessons">จำนวนบทเรียน</Label>
                     <Input
                       id="total_lessons"
                       type="number"
                       value={formData.total_lessons}
                       onChange={(e) => setFormData({ ...formData, total_lessons: parseInt(e.target.value) || 0 })}
                     />
                   </div>
                   <div>
                     <Label htmlFor="price">ราคา (บาท)</Label>
                     <Input
                       id="price"
                       type="number"
                       value={formData.price}
                       onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                       min="0"
                       step="0.01"
                     />
                   </div>
                  </div>

                 {/* Tags Section */}
                 <div>
                   <Label>แท็ก</Label>
                   <div className="flex space-x-2 mb-2">
                     <Input
                       placeholder="เพิ่มแท็ก"
                       value={newTag}
                       onChange={(e) => setNewTag(e.target.value)}
                       onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                     />
                     <Button type="button" onClick={addTag} size="sm">
                       <Plus className="h-4 w-4" />
                     </Button>
                   </div>
                   <div className="flex flex-wrap gap-2">
                     {formData.tags.map((tag) => (
                       <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                         {tag}
                         <Button
                           type="button"
                           variant="ghost"
                           size="sm"
                           className="h-auto p-0 hover:bg-transparent"
                           onClick={() => removeTag(tag)}
                         >
                           <X className="h-3 w-3" />
                         </Button>
                       </Badge>
                     ))}
                   </div>
                 </div>

                 {/* Features Section */}
                 <div>
                   <Label>คุณสมบัติของคอร์ส</Label>
                   <div className="flex space-x-2 mb-2">
                     <Input
                       placeholder="เพิ่มคุณสมบัติ"
                       value={newFeature}
                       onChange={(e) => setNewFeature(e.target.value)}
                       onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                     />
                     <Button type="button" onClick={addFeature} size="sm">
                       <Plus className="h-4 w-4" />
                     </Button>
                   </div>
                   <div className="flex flex-wrap gap-2">
                     {formData.features.map((feature) => (
                       <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                         {feature}
                         <Button
                           type="button"
                           variant="ghost"
                           size="sm"
                           className="h-auto p-0 hover:bg-transparent"
                           onClick={() => removeFeature(feature)}
                         >
                           <X className="h-3 w-3" />
                         </Button>
                       </Badge>
                     ))}
                   </div>
                 </div>

                 <Button type="submit" className="w-full">
                   {editingCourse ? 'อัปเดต' : 'บันทึก'}
                 </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              ยังไม่มีคอร์ส - เริ่มต้นด้วยการเพิ่มคอร์สแรก
            </p>
          ) : (
            <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>รูปปก</TableHead>
                   <TableHead>ชื่อคอร์ส</TableHead>
                   <TableHead>ผู้สอน</TableHead>
                   <TableHead>บทเรียน</TableHead>
                   <TableHead>ราคา</TableHead>
                   <TableHead>วันที่สร้าง</TableHead>
                   <TableHead>การจัดการ</TableHead>
                 </TableRow>
               </TableHeader>
              <TableBody>
                 {courses.map((course) => (
                   <TableRow key={course.id}>
                     <TableCell>
                       {course.cover_image_url ? (
                         <img 
                           src={course.cover_image_url} 
                           alt={course.title}
                           className="w-16 h-12 object-cover rounded-md"
                         />
                       ) : (
                         <div className="w-16 h-12 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                           ไม่มีรูป
                         </div>
                       )}
                     </TableCell>
                     <TableCell>
                       <div>
                         <div className="font-medium">{course.title}</div>
                         <div className="text-sm text-muted-foreground">{course.slug}</div>
                       </div>
                     </TableCell>
                     <TableCell>{course.instructor || '-'}</TableCell>
                     <TableCell>
                       <Badge variant="secondary">{course.total_lessons} บทเรียน</Badge>
                     </TableCell>
                     <TableCell>
                       <Badge variant={course.price === 0 || course.price === null ? "secondary" : "default"}>
                         {course.price === 0 || course.price === null ? "ฟรี" : `฿${course.price}`}
                       </Badge>
                     </TableCell>
                     <TableCell>{new Date(course.created_at).toLocaleDateString('th-TH')}</TableCell>
                     <TableCell>
                       <div className="flex space-x-2">
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => navigate(`/admin/courses/${course.id}/lessons`)}
                           title="จัดการบทเรียน"
                         >
                           <BookOpen className="h-4 w-4" />
                         </Button>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => handleEdit(course)}
                           title="แก้ไขคอร์ส"
                         >
                           <Pencil className="h-4 w-4" />
                         </Button>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => handleDelete(course.id)}
                           title="ลบคอร์ส"
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