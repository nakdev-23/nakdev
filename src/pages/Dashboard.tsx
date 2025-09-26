import { Link } from "react-router-dom";
import { BookOpen, Clock, Trophy, Target, Play, CheckCircle, Circle, TrendingUp, Award, AlertCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUserStats } from "@/hooks/useUserStats";
import { useEnrolledCourses } from "@/hooks/useEnrolledCourses";
import { useOrders } from "@/hooks/useOrders";
export default function Dashboard() {
  const {
    stats,
    profile,
    isLoading: userLoading
  } = useUserStats();
  const {
    enrolledCourses,
    continuingCourses,
    completedCourses,
    notStartedCourses,
    isLoading: coursesLoading
  } = useEnrolledCourses();
  const {
    data: orders,
    isLoading: ordersLoading
  } = useOrders();
  if (userLoading || coursesLoading || ordersLoading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold">กำลังโหลด...</h1>
        </div>
      </div>;
  }
  const totalLearningHours = enrolledCourses.reduce((sum, course) => sum + (course.duration_hours || 0), 0);
  const overallProgress = enrolledCourses.length > 0 ? enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCourses.length : 0;

  // Check for pending orders
  const pendingOrders = orders?.filter(order => order.status === 'pending') || [];
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-hero-gradient py-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="gradient-blob"></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              สวัสดี {profile?.full_name || 'คุณผู้ใช้'}! 👋
            </h1>
            <p className="text-white/80 text-lg mb-6">
              ความคืบหน้าการเรียนของคุณ
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{enrolledCourses.length}</div>
                <div className="text-white/80 text-sm">คอร์สทั้งหมด</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{completedCourses.length}</div>
                <div className="text-white/80 text-sm">จบแล้ว</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{continuingCourses.length}</div>
                <div className="text-white/80 text-sm">กำลังเรียน</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{Math.round(overallProgress)}%</div>
                <div className="text-white/80 text-sm">ความคืบหน้า</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-6 relative z-10">
        
        {/* Pending Orders Alert */}
        {pendingOrders.length > 0 && <Alert className="mb-6 border-warning bg-warning/10 my-[35px]">
            <AlertCircle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning-foreground">
              <div className="flex items-center justify-between">
                <span className="text-stone-800">
                  คุณมี {pendingOrders.length} คำสั่งซื้อรอการยืนยัน กรุณารอการยืนยันจากแอดมิน
                </span>
                <Button variant="outline" size="sm" asChild className="ml-4">
                  <Link to="/my-courses">
                    <CreditCard className="h-4 w-4 mr-2" />
                    ดูสถานะ
                  </Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>}
        
        {enrolledCourses.length === 0 ? <Card className="glass-card text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">ยังไม่มีคอร์สในระบบ</h2>
              <p className="text-muted-foreground mb-6">
                เริ่มต้นการเรียนรู้ของคุณด้วยคอร์สที่หลากหลาย
              </p>
              <Button asChild>
                <Link to="/courses">
                  <BookOpen className="h-4 w-4 mr-2" />
                  เลือกคอร์สเรียน
                </Link>
              </Button>
            </CardContent>
          </Card> : <div className="space-y-8">
            
            {/* Continue Learning */}
            {continuingCourses.length > 0 && <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-primary" />
                    คอร์สที่กำลังเรียน
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {continuingCourses.map(course => <div key={course.id} className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-20 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex-shrink-0 flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{course.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              บทต่อไป: {course.nextLesson}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              โดย {course.instructor}
                            </p>
                          </div>
                          <Button size="sm" asChild>
                              <Link to={course.nextLessonSlug ? `/learn/${course.slug}/${course.nextLessonSlug}` : course.firstLessonSlug ? `/learn/${course.slug}/${course.firstLessonSlug}` : `/courses/${course.slug}`}>
                                เรียนต่อ
                              </Link>
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{course.completedLessons}/{course.total_lessons} บทเรียน</span>
                            <span>{course.progress}% เสร็จสิ้น</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      </div>
                    </div>)}
                </CardContent>
              </Card>}

            {/* All My Courses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Completed Courses */}
              {completedCourses.length > 0 && <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-success" />
                      คอร์สที่จบแล้ว ({completedCourses.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {completedCourses.slice(0, 3).map(course => <div key={course.id} className="flex items-center gap-3 p-3 border rounded-lg bg-success/5 border-success/20">
                        <Trophy className="h-5 w-5 text-success flex-shrink-0" />
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{course.title}</h5>
                          <p className="text-xs text-muted-foreground">โดย {course.instructor}</p>
                        </div>
                        <Badge className="bg-success/10 text-success border-success/20">
                          100%
                        </Badge>
                      </div>)}
                    {completedCourses.length > 3 && <p className="text-sm text-muted-foreground text-center">
                        และอีก {completedCourses.length - 3} คอร์ส
                      </p>}
                  </CardContent>
                </Card>}

              {/* Not Started Courses */}
              {notStartedCourses.length > 0 && <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Circle className="h-5 w-5 text-muted-foreground" />
                      คอร์สที่ยังไม่เริ่ม ({notStartedCourses.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {notStartedCourses.slice(0, 3).map(course => <div key={course.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{course.title}</h5>
                          <p className="text-xs text-muted-foreground">โดย {course.instructor}</p>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link to={course.firstLessonSlug ? `/learn/${course.slug}/${course.firstLessonSlug}` : `/courses/${course.slug}`}>
                            เริ่มเรียน
                          </Link>
                        </Button>
                      </div>)}
                    {notStartedCourses.length > 3 && <p className="text-sm text-muted-foreground text-center">
                        และอีก {notStartedCourses.length - 3} คอร์ส
                      </p>}
                  </CardContent>
                </Card>}

            </div>

            {/* Learning Progress Summary */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  สรุปความคืบหน้า
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{Math.round(overallProgress)}%</div>
                    <p className="text-muted-foreground">ความคืบหน้าโดยรวม</p>
                    <Progress value={overallProgress} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-2">{totalLearningHours}</div>
                    <p className="text-muted-foreground">ชั่วโมงเรียนทั้งหมด</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success mb-2">{stats?.current_streak || 0}</div>
                    <p className="text-muted-foreground">วันต่อเนื่อง</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>การดำเนินการด่วน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-auto flex-col py-4" asChild>
                    <Link to="/my-courses">
                      <BookOpen className="h-6 w-6 mb-2" />
                      คอร์สทั้งหมดของฉัน
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col py-4" asChild>
                    <Link to="/my-tools">
                      <Target className="h-6 w-6 mb-2" />
                      เครื่องมือทั้งหมดของฉัน
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col py-4" asChild>
                    <Link to="/my-ebooks">
                      <BookOpen className="h-6 w-6 mb-2" />
                      eBook ของฉัน
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col py-4" asChild>
                    <Link to="/my-certificates">
                      <Award className="h-6 w-6 mb-2" />
                      ใบประกาศของฉัน
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>}
      </div>
    </div>;
}