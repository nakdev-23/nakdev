import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Award, ArrowLeft, Download, Calendar, Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface MyCertificate {
  id: string;
  course_title: string;
  course_slug: string;
  instructor: string;
  completion_date: string;
  grade?: string;
  certificate_url?: string;
}

export default function MyCertificates() {
  const [myCertificates, setMyCertificates] = useState<MyCertificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyCertificates = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsLoading(false);
          return;
        }

        // Get completed courses from enrollments and course data
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select('item_id, enrolled_at')
          .eq('user_id', session.user.id)
          .eq('item_type', 'course');

        if (enrollmentsError) throw enrollmentsError;

        if (!enrollments || enrollments.length === 0) {
          setMyCertificates([]);
          setIsLoading(false);
          return;
        }

        const courseIds = enrollments.map(e => e.item_id);

        // Get courses data
        const { data: courses, error: coursesError } = await supabase
          .from('courses')
          .select('id, title, slug, instructor')
          .in('id', courseIds);

        if (coursesError) throw coursesError;

        // Check progress for each course to find completed ones
        const completedCourses = [];
        
        for (const course of courses || []) {
          // Get lesson ids for this course
          const { data: lessons } = await supabase
            .from('lessons')
            .select('id')
            .eq('course_id', course.id);

          if (!lessons || lessons.length === 0) continue;

          // Get completed lessons
          const { data: completedLessons } = await supabase
            .from('lesson_progress')
            .select('lesson_id, completed_at')
            .eq('user_id', session.user.id)
            .eq('completed', true)
            .in('lesson_id', lessons.map(l => l.id));

          const totalLessons = lessons.length;
          const completed = completedLessons?.length || 0;

          // If course is 100% completed, add to certificates
          if (completed === totalLessons && totalLessons > 0) {
            const latestCompletion = completedLessons
              ?.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())[0];

            completedCourses.push({
              id: course.id,
              course_title: course.title,
              course_slug: course.slug,
              instructor: course.instructor,
              completion_date: latestCompletion?.completed_at || new Date().toISOString(),
              grade: 'ผ่าน', // Default grade for completed courses
            });
          }
        }

        setMyCertificates(completedCourses);
      } catch (error) {
        console.error('Error fetching my certificates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyCertificates();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold">กำลังโหลด...</h1>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-hero-gradient py-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="gradient-blob"></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/20">
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                กลับ
              </Link>
            </Button>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              ใบประกาศของฉัน 🏆
            </h1>
            <p className="text-white/80 text-lg mb-6">
              ใบประกาศนียบัตรที่คุณได้รับจากการเรียนจบคอร์ส
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-xl mx-auto">
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{myCertificates.length}</div>
                <div className="text-white/80 text-sm">ใบประกาศทั้งหมด</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {new Set(myCertificates.map(c => c.instructor)).size}
                </div>
                <div className="text-white/80 text-sm">ผู้สอน</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {myCertificates.filter(c => c.grade === 'ผ่าน').length}
                </div>
                <div className="text-white/80 text-sm">ผ่านเกณฑ์</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-6 relative z-10">
        
        {myCertificates.length === 0 ? (
          <Card className="glass-card text-center py-12">
            <CardContent>
              <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">ยังไม่มีใบประกาศในระบบ</h2>
              <p className="text-muted-foreground mb-6">
                เรียนจบคอร์สเพื่อรับใบประกาศนียบัตร
              </p>
              <Button asChild>
                <Link to="/my-courses">
                  <Trophy className="h-4 w-4 mr-2" />
                  ดูคอร์สของฉัน
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            
            {/* All Certificates */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  ใบประกาศทั้งหมด ({myCertificates.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myCertificates.map((certificate) => (
                    <div key={certificate.id} className="group border rounded-lg overflow-hidden hover:shadow-lg transition-all bg-gradient-to-br from-primary/5 to-accent/5">
                      {/* Certificate Header */}
                      <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                          <Trophy className="h-8 w-8" />
                          <Badge className="bg-white/20 text-white border-white/30">
                            ใบประกาศนียบัตร
                          </Badge>
                        </div>
                        <h3 className="font-bold text-lg mb-2">ใบประกาศนียบัตร</h3>
                        <p className="text-white/90 text-sm">การเรียนจบคอร์สเรียน</p>
                      </div>
                      
                      {/* Certificate Content */}
                      <div className="p-6">
                        <div className="text-center mb-4">
                          <h4 className="font-semibold text-lg mb-2">{certificate.course_title}</h4>
                          <p className="text-muted-foreground">โดย {certificate.instructor}</p>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>เรียนจบเมื่อ: {formatDate(certificate.completion_date)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <Star className="h-4 w-4 text-muted-foreground" />
                            <span>ผลการเรียน: </span>
                            <Badge variant={certificate.grade === 'ผ่าน' ? 'default' : 'secondary'}>
                              {certificate.grade}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {certificate.certificate_url ? (
                            <Button size="sm" asChild className="flex-1">
                              <a href={certificate.certificate_url} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4 mr-2" />
                                ดาวน์โหลดใบประกาศ
                              </a>
                            </Button>
                          ) : (
                            <Button size="sm" disabled className="flex-1">
                              <Award className="h-4 w-4 mr-2" />
                              ใบประกาศพร้อมเร็วๆ นี้
                            </Button>
                          )}
                          
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/courses/${certificate.course_slug}`}>
                              ดูคอร์ส
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievement Message */}
            <Card className="glass-card bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="text-center py-8">
                <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">ยินดีด้วยกับผลงานของคุณ!</h3>
                <p className="text-muted-foreground">
                  คุณได้เรียนจบ {myCertificates.length} คอร์สแล้ว เก่งมาก! 🎉
                </p>
              </CardContent>
            </Card>

          </div>
        )}
      </div>
    </div>
  );
}