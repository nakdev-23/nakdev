import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Clock, FileText, HelpCircle, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";

interface Course {
  id: string;
  title: string;
  slug: string;
  total_lessons: number;
}

interface LessonStats {
  courseId: string;
  totalLessons: number;
  totalDuration: number;
  totalAssignments: number;
  totalQuizzes: number;
}

export default function AdminLessonsOverview() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<Record<string, LessonStats>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCoursesWithStats();
  }, []);

  const fetchCoursesWithStats = async () => {
    try {
      // Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('id, title, slug, total_lessons')
        .order('title');

      if (coursesError) throw coursesError;

      setCourses(coursesData || []);

      // Fetch stats for each course
      const statsPromises = (coursesData || []).map(async (course) => {
        const [lessonsData, assignmentsData, quizzesData] = await Promise.all([
          supabase.from('lessons').select('duration_seconds').eq('course_id', course.id),
          supabase.from('assignments').select('id').eq('course_id', course.id),
          supabase.from('quizzes').select('id').eq('course_id', course.id)
        ]);

        const totalDuration = (lessonsData.data || []).reduce(
          (sum, lesson) => sum + (lesson.duration_seconds || 0),
          0
        );

        return {
          courseId: course.id,
          totalLessons: lessonsData.data?.length || 0,
          totalDuration,
          totalAssignments: assignmentsData.data?.length || 0,
          totalQuizzes: quizzesData.data?.length || 0
        };
      });

      const statsData = await Promise.all(statsPromises);
      const statsMap = statsData.reduce((acc, stat) => {
        acc[stat.courseId] = stat;
        return acc;
      }, {} as Record<string, LessonStats>);

      setStats(statsMap);
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

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} ชม. ${minutes} นาที`;
    }
    return `${minutes} นาที`;
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

  const totalStats = Object.values(stats).reduce(
    (acc, stat) => ({
      lessons: acc.lessons + stat.totalLessons,
      duration: acc.duration + stat.totalDuration,
      assignments: acc.assignments + stat.totalAssignments,
      quizzes: acc.quizzes + stat.totalQuizzes
    }),
    { lessons: 0, duration: 0, assignments: 0, quizzes: 0 }
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gradient">จัดการบทเรียน</h1>
          <p className="text-muted-foreground mt-2">
            จัดการบทเรียน การบ้าน และ Quiz ของทุกคอร์ส
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">บทเรียนทั้งหมด</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gradient">{totalStats.lessons}</div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">เวลารวม</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gradient">
                {formatDuration(totalStats.duration)}
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">การบ้าน</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gradient">{totalStats.assignments}</div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quiz</CardTitle>
              <HelpCircle className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gradient">{totalStats.quizzes}</div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Table */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>คอร์สทั้งหมด</CardTitle>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                ยังไม่มีคอร์ส
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ชื่อคอร์ส</TableHead>
                      <TableHead className="text-center">บทเรียน</TableHead>
                      <TableHead className="text-center">เวลารวม</TableHead>
                      <TableHead className="text-center">การบ้าน</TableHead>
                      <TableHead className="text-center">Quiz</TableHead>
                      <TableHead className="text-right">จัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => {
                      const courseStats = stats[course.id] || {
                        totalLessons: 0,
                        totalDuration: 0,
                        totalAssignments: 0,
                        totalQuizzes: 0
                      };

                      return (
                        <TableRow key={course.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{course.title}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <BookOpen className="h-4 w-4 text-muted-foreground" />
                              {courseStats.totalLessons}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              {formatDuration(courseStats.totalDuration)}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              {courseStats.totalAssignments}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                              {courseStats.totalQuizzes}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              onClick={() => navigate(`/admin/courses/${course.id}/lessons`)}
                              className="gap-2"
                            >
                              จัดการ
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
