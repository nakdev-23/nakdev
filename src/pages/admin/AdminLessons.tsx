import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Pencil, Trash2, Play, Clock, BookOpen, FileText, HelpCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAssignments, Assignment } from "@/hooks/useAssignments";
import { useQuizzes, Quiz } from "@/hooks/useQuizzes";
import AssignmentDialog from "@/components/admin/AssignmentDialog";
import QuizDialog from "@/components/admin/QuizDialog";

interface Course {
  id: string;
  title: string;
  slug: string;
}

interface Lesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration_text: string;
  duration_seconds: number;
  chapter_id: number;
  chapter_title: string;
  lesson_order: number;
  video_id: string;
  youtube_url: string;
  created_at: string;
}

export default function AdminLessons() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const { toast } = useToast();

  // Assignments & Quizzes hooks
  const { assignments, createAssignment, updateAssignment, deleteAssignment } = useAssignments(courseId || '');
  const { quizzes, createQuiz, updateQuiz, deleteQuiz } = useQuizzes(courseId || '');
  
  // Dialog states
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    duration_text: '',
    duration_seconds: 0,
    chapter_id: 1,
    chapter_title: '',
    lesson_order: 1,
    youtube_url: ''
  });

  useEffect(() => {
    if (courseId) {
      fetchCourse();
      fetchLessons();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, slug')
        .eq('id', courseId)
        .single();

      if (error) throw error;
      setCourse(data);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลคอร์สได้",
        variant: "destructive",
      });
    }
  };

  const fetchLessons = async () => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('lesson_order');

      if (error) throw error;
      setLessons(data || []);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลบทเรียนได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const lessonData = {
        ...formData,
        course_id: courseId
      };

      if (editingLesson) {
        const { error } = await supabase
          .from('lessons')
          .update(lessonData)
          .eq('id', editingLesson.id);

        if (error) throw error;

        toast({
          title: "สำเร็จ",
          description: "อัปเดตบทเรียนเรียบร้อยแล้ว",
        });
      } else {
        const { error } = await supabase
          .from('lessons')
          .insert([lessonData]);

        if (error) throw error;

        toast({
          title: "สำเร็จ",
          description: "เพิ่มบทเรียนใหม่เรียบร้อยแล้ว",
        });
      }

      setIsDialogOpen(false);
      setEditingLesson(null);
      resetForm();
      fetchLessons();
    } catch (error) {
      console.error('Error saving lesson:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      slug: lesson.slug,
      description: lesson.description || '',
      duration_text: lesson.duration_text || '',
      duration_seconds: lesson.duration_seconds || 0,
      chapter_id: lesson.chapter_id || 1,
      chapter_title: lesson.chapter_title || '',
      lesson_order: lesson.lesson_order || 1,
      youtube_url: lesson.youtube_url || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบบทเรียนนี้?')) return;

    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "สำเร็จ",
        description: "ลบบทเรียนเรียบร้อยแล้ว",
      });
      
      fetchLessons();
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบบทเรียนได้",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      duration_text: '',
      duration_seconds: 0,
      chapter_id: 1,
      chapter_title: '',
      lesson_order: lessons.length + 1,
      youtube_url: ''
    });
  };

  const openAddDialog = () => {
    setEditingLesson(null);
    resetForm();
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
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/courses')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับไปยังคอร์ส
          </Button>
          <div>
            <h1 className="text-2xl font-bold">จัดการบทเรียน</h1>
            <p className="text-muted-foreground">
              คอร์ส: {course?.title}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">บทเรียนทั้งหมด</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lessons.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ระยะเวลารวม</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(() => {
                  const totalSeconds = lessons.reduce((total, lesson) => total + (lesson.duration_seconds || 0), 0);
                  const hours = Math.floor(totalSeconds / 3600);
                  const minutes = Math.floor((totalSeconds % 3600) / 60);
                  
                  if (hours > 0) {
                    return `${hours} ชั่วโมง ${minutes} นาที`;
                  }
                  return `${minutes} นาที`;
                })()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">บทที่ล่าสุด</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.max(...lessons.map(l => l.chapter_id || 1), 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="lessons" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="lessons">
              <BookOpen className="h-4 w-4 mr-2" />
              บทเรียน ({lessons.length})
            </TabsTrigger>
            <TabsTrigger value="assignments">
              <FileText className="h-4 w-4 mr-2" />
              การบ้าน ({assignments.length})
            </TabsTrigger>
            <TabsTrigger value="quizzes">
              <HelpCircle className="h-4 w-4 mr-2" />
              Quiz ({quizzes.length})
            </TabsTrigger>
          </TabsList>

          {/* Lessons Tab */}
          <TabsContent value="lessons">
        {/* Lessons table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>บทเรียนทั้งหมด</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAddDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  เพิ่มบทเรียนใหม่
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingLesson ? 'แก้ไขบทเรียน' : 'เพิ่มบทเรียนใหม่'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">ชื่อบทเรียน</Label>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="chapter_id">บทที่</Label>
                      <Input
                        id="chapter_id"
                        type="number"
                        value={formData.chapter_id}
                        onChange={(e) => setFormData({ ...formData, chapter_id: parseInt(e.target.value) || 1 })}
                        min="1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="chapter_title">ชื่อบท</Label>
                      <Input
                        id="chapter_title"
                        value={formData.chapter_title}
                        onChange={(e) => setFormData({ ...formData, chapter_title: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="lesson_order">ลำดับบทเรียน</Label>
                      <Input
                        id="lesson_order"
                        type="number"
                        value={formData.lesson_order}
                        onChange={(e) => setFormData({ ...formData, lesson_order: parseInt(e.target.value) || 1 })}
                        min="1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration_text">ระยะเวลา (ข้อความ)</Label>
                      <Input
                        id="duration_text"
                        value={formData.duration_text}
                        onChange={(e) => setFormData({ ...formData, duration_text: e.target.value })}
                        placeholder="เช่น 10:30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration_seconds">ระยะเวลา (วินาที)</Label>
                      <Input
                        id="duration_seconds"
                        type="number"
                        value={formData.duration_seconds}
                        onChange={(e) => setFormData({ ...formData, duration_seconds: parseInt(e.target.value) || 0 })}
                        min="0"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="youtube_url">YouTube URL</Label>
                    <Input
                      id="youtube_url"
                      type="url"
                      value={formData.youtube_url}
                      onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {editingLesson ? 'อัปเดต' : 'บันทึก'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {lessons.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                ยังไม่มีบทเรียน - เริ่มต้นด้วยการเพิ่มบทเรียนแรก
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ลำดับ</TableHead>
                    <TableHead>ชื่อบทเรียน</TableHead>
                    <TableHead>บท</TableHead>
                    <TableHead>ระยะเวลา</TableHead>
                    <TableHead>เวลารวม</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>การจัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lessons.map((lesson, index) => {
                    // Calculate cumulative time up to this lesson
                    const cumulativeSeconds = lessons.slice(0, index + 1)
                      .reduce((total, l) => total + (l.duration_seconds || 0), 0);
                    const cumulativeHours = Math.floor(cumulativeSeconds / 3600);
                    const cumulativeMinutes = Math.floor((cumulativeSeconds % 3600) / 60);
                    
                    const cumulativeTime = cumulativeHours > 0 
                      ? `${cumulativeHours}:${cumulativeMinutes.toString().padStart(2, '0')}` 
                      : `${cumulativeMinutes} นาที`;

                    return (
                      <TableRow key={lesson.id}>
                        <TableCell className="font-medium">{lesson.lesson_order}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{lesson.title}</div>
                            <div className="text-sm text-muted-foreground">{lesson.slug}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {lesson.chapter_id} - {lesson.chapter_title}
                          </Badge>
                        </TableCell>
                        <TableCell>{lesson.duration_text || '-'}</TableCell>
                        <TableCell className="font-medium text-primary">{cumulativeTime}</TableCell>
                        <TableCell>
                          <Badge variant={lesson.youtube_url ? "default" : "secondary"}>
                            {lesson.youtube_url ? 'มีวิดีโอ' : 'ยังไม่มีวิดีโอ'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(lesson)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(lesson.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>การบ้านทั้งหมด</CardTitle>
                <Button onClick={() => { setEditingAssignment(null); setIsAssignmentDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  เพิ่มการบ้านใหม่
                </Button>
              </CardHeader>
              <CardContent>
                {assignments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    ยังไม่มีการบ้าน - เริ่มต้นด้วยการเพิ่มการบ้านแรก
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ชื่อการบ้าน</TableHead>
                        <TableHead>บทเรียน</TableHead>
                        <TableHead>ประเภท</TableHead>
                        <TableHead>คะแนน</TableHead>
                        <TableHead>สถานะ</TableHead>
                        <TableHead>การจัดการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignments.map((assignment) => {
                        const lesson = lessons.find(l => l.id === assignment.lesson_id);
                        return (
                          <TableRow key={assignment.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{assignment.title}</div>
                                {assignment.description && (
                                  <div className="text-sm text-muted-foreground line-clamp-1">
                                    {assignment.description}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {lesson ? (
                                <Badge variant="secondary">
                                  บทที่ {lesson.lesson_order}: {lesson.title}
                                </Badge>
                              ) : (
                                <Badge variant="outline">ทั้งคอร์ส</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{assignment.attachment_type || 'ไม่ระบุ'}</Badge>
                            </TableCell>
                            <TableCell>{assignment.points} คะแนน</TableCell>
                            <TableCell>
                              <Badge variant={assignment.is_required ? "default" : "secondary"}>
                                {assignment.is_required ? 'บังคับ' : 'ไม่บังคับ'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => { setEditingAssignment(assignment); setIsAssignmentDialogOpen(true); }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    if (confirm('คุณแน่ใจหรือไม่ที่จะลบการบ้านนี้?')) {
                                      deleteAssignment.mutate(assignment.id);
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quizzes Tab */}
          <TabsContent value="quizzes">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Quiz ทั้งหมด</CardTitle>
                <Button onClick={() => { setEditingQuiz(null); setIsQuizDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  เพิ่ม Quiz ใหม่
                </Button>
              </CardHeader>
              <CardContent>
                {quizzes.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    ยังไม่มี Quiz - เริ่มต้นด้วยการเพิ่ม Quiz แรก
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ชื่อ Quiz</TableHead>
                        <TableHead>บทเรียน</TableHead>
                        <TableHead>คะแนนผ่าน</TableHead>
                        <TableHead>เวลาจำกัด</TableHead>
                        <TableHead>สถานะ</TableHead>
                        <TableHead>การจัดการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quizzes.map((quiz) => {
                        const lesson = lessons.find(l => l.id === quiz.lesson_id);
                        return (
                          <TableRow key={quiz.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{quiz.title}</div>
                                {quiz.description && (
                                  <div className="text-sm text-muted-foreground line-clamp-1">
                                    {quiz.description}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {lesson ? (
                                <Badge variant="secondary">
                                  บทที่ {lesson.lesson_order}: {lesson.title}
                                </Badge>
                              ) : (
                                <Badge variant="outline">ทั้งคอร์ส</Badge>
                              )}
                            </TableCell>
                            <TableCell>{quiz.passing_score}%</TableCell>
                            <TableCell>
                              {quiz.time_limit_minutes ? `${quiz.time_limit_minutes} นาที` : 'ไม่จำกัด'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={quiz.is_required ? "default" : "secondary"}>
                                {quiz.is_required ? 'บังคับ' : 'ไม่บังคับ'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => { setEditingQuiz(quiz); setIsQuizDialogOpen(true); }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    if (confirm('คุณแน่ใจหรือไม่ที่จะลบ Quiz นี้?')) {
                                      deleteQuiz.mutate(quiz.id);
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <AssignmentDialog
          open={isAssignmentDialogOpen}
          onOpenChange={setIsAssignmentDialogOpen}
          courseId={courseId || ''}
          lessons={lessons}
          assignment={editingAssignment}
          onSave={(data) => {
            if (editingAssignment) {
              updateAssignment.mutate({ ...data, id: editingAssignment.id });
            } else {
              createAssignment.mutate(data);
            }
          }}
        />

        <QuizDialog
          open={isQuizDialogOpen}
          onOpenChange={setIsQuizDialogOpen}
          courseId={courseId || ''}
          lessons={lessons}
          quiz={editingQuiz}
          onSave={(data) => {
            if (editingQuiz) {
              updateQuiz.mutate({ ...data, id: editingQuiz.id });
            } else {
              createQuiz.mutate(data);
            }
          }}
        />
      </div>
    </AdminLayout>
  );
}