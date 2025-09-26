import { Link } from "react-router-dom";
import { BookOpen, Clock, Trophy, Target, Play, CheckCircle, Circle, ArrowLeft, AlertCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEnrolledCourses } from "@/hooks/useEnrolledCourses";
import { useOrders } from "@/hooks/useOrders";

export default function MyCourses() {
  const { 
    enrolledCourses, 
    continuingCourses, 
    completedCourses,
    notStartedCourses,
    isLoading 
  } = useEnrolledCourses();
  const { data: orders, isLoading: ordersLoading } = useOrders();

  if (isLoading || ordersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold">กำลังโหลด...</h1>
        </div>
      </div>
    );
  }

  // Check for pending orders
  const pendingOrders = orders?.filter(order => order.status === 'pending') || [];

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
              คอร์สทั้งหมดของฉัน 📚
            </h1>
            <p className="text-white/80 text-lg mb-6">
              คอร์สที่คุณลงทะเบียนเรียนแล้ว
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
                <div className="text-2xl font-bold text-white mb-1">{notStartedCourses.length}</div>
                <div className="text-white/80 text-sm">ยังไม่เริ่ม</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-6 relative z-10">
        
        {/* Pending Orders Section */}
        {pendingOrders.length > 0 && (
          <Card className="glass-card mb-6 border-warning bg-warning/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <AlertCircle className="h-5 w-5" />
                คำสั่งซื้อรอการยืนยัน ({pendingOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-warning text-sm mb-4">
                คำสั่งซื้อของคุณกำลังรอการยืนยันจากแอดมิน หลังจากได้รับการยืนยันแล้ว คุณจะสามารถเข้าเรียนได้ทันที
              </p>
              {pendingOrders.map((order) => (
                <div key={order.id} className="p-4 border border-warning/20 rounded-lg bg-warning/5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-warning">คำสั่งซื้อ #{order.id.slice(0, 8)}</h4>
                      <p className="text-sm text-muted-foreground">
                        วันที่สั่งซื้อ: {new Date(order.created_at).toLocaleDateString('th-TH')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ช่องทางการชำระ: {order.payment_methods?.display_name}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-warning text-warning">
                      รอการยืนยัน
                    </Badge>
                  </div>
                  <div className="text-lg font-semibold text-warning">
                    ยอดรวม: ฿{order.total_amount?.toLocaleString()}
                  </div>
                  {order.order_items && order.order_items.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">รายการที่สั่งซื้อ:</p>
                      <div className="space-y-1">
                        {order.order_items.map((item) => (
                          <div key={item.id} className="text-sm text-muted-foreground flex justify-between">
                            <span>
                              {item.courses?.title || item.ebooks?.title || item.tools?.title || 'รายการสินค้า'}
                            </span>
                            <span>฿{item.price?.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        
        {enrolledCourses.length === 0 ? (
          <Card className="glass-card text-center py-12">
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
          </Card>
        ) : (
          <div className="space-y-8">
            
            {/* Continue Learning */}
            {continuingCourses.length > 0 && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-primary" />
                    คอร์สที่กำลังเรียน ({continuingCourses.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {continuingCourses.map((course) => (
                    <div key={course.id} className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
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
                            <Link to={course.nextLessonSlug ? `/learn/${course.slug}/${course.nextLessonSlug}` : (course.firstLessonSlug ? `/learn/${course.slug}/${course.firstLessonSlug}` : `/courses/${course.slug}`)}>
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
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* All My Courses Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Completed Courses */}
              {completedCourses.length > 0 && (
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-success" />
                      คอร์สที่จบแล้ว ({completedCourses.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {completedCourses.map((course) => (
                      <div key={course.id} className="flex items-center gap-3 p-3 border rounded-lg bg-success/5 border-success/20">
                        <Trophy className="h-5 w-5 text-success flex-shrink-0" />
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{course.title}</h5>
                          <p className="text-xs text-muted-foreground">โดย {course.instructor}</p>
                        </div>
                        <Badge className="bg-success/10 text-success border-success/20">
                          100%
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Not Started Courses */}
              {notStartedCourses.length > 0 && (
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Circle className="h-5 w-5 text-muted-foreground" />
                      คอร์สที่ยังไม่เริ่ม ({notStartedCourses.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {notStartedCourses.map((course) => (
                      <div key={course.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
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
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

            </div>

          </div>
        )}
      </div>
    </div>
  );
}