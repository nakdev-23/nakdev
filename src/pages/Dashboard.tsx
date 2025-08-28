import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Target, 
  Calendar,
  TrendingUp,
  Play,
  Download,
  Star,
  ChevronRight,
  Settings,
  Bell,
  FileText,
  Award,
  Users,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserStats } from "@/hooks/useUserStats";
import { useCourses } from "@/hooks/useCourses";

// Removed mock stats - now using real data from Supabase

// Mock data for display purposes
const mockRecentCourses = [
  {
    slug: "react-fundamentals",
    title: "React สำหรับผู้เริ่มต้น",
    progress: 45,
    lastWatched: "2 วันที่แล้ว",
    nextLesson: "useState Hook", 
    totalLessons: 24,
    completedLessons: 11
  }
];

const achievements = [
  {
    title: "First Course Completed",
    description: "จบคอร์สแรกเรียบร้อยแล้ว",
    date: "2 สัปดาห์ที่แล้ว",
    icon: Trophy,
    earned: true
  },
  {
    title: "Week Warrior",
    description: "เรียนต่อเนื่อง 7 วันติดต่อกัน",
    date: "1 สัปดาห์ที่แล้ว",
    icon: Target,
    earned: true
  },
  {
    title: "Speed Learner",
    description: "จบ 3 คอร์สใน 1 เดือน",
    date: "ยังไม่ได้รับ",
    icon: TrendingUp,
    earned: false
  },
  {
    title: "Community Helper",
    description: "ช่วยเหลือเพื่อนนักเรียน 10 ครั้ง",
    date: "ยังไม่ได้รับ",
    icon: Users,
    earned: false
  }
];

const weeklyActivity = [
  { day: "จ", hours: 2.5, completed: true },
  { day: "อ", hours: 1.8, completed: true },
  { day: "พ", hours: 3.2, completed: true },
  { day: "พฤ", hours: 0, completed: false },
  { day: "ศ", hours: 2.1, completed: true },
  { day: "ส", hours: 1.5, completed: true },
  { day: "อา", hours: 0.8, completed: false }
];

const notifications = [
  {
    id: 1,
    title: "คอร์สใหม่: Vue.js Complete Guide",
    message: "มีคอร์ส Vue.js ใหม่ที่คุณอาจสนใจ",
    time: "2 ชั่วโมงที่แล้ว",
    read: false
  },
  {
    id: 2,
    title: "การบ้านใกล้หมดเขต",
    message: "การบ้านคอร์ส React จะหมดเขตใน 2 วัน",
    time: "1 วันที่แล้ว",
    read: false
  },
  {
    id: 3,
    title: "ยินดีด้วย! คุณจบคอร์สแล้ว",
    message: "คุณจบคอร์ส JavaScript เบื้องต้นเรียบร้อยแล้ว",
    time: "3 วันที่แล้ว",
    read: true
  }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { stats, profile, isLoading: userLoading } = useUserStats();
  const { courses } = useCourses();

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">กำลังโหลด...</h1>
        </div>
      </div>
    );
  }

  const displayStats = [
    { 
      title: "คอร์สที่กำลังเรียน", 
      value: stats?.total_courses?.toString() || "1", 
      icon: BookOpen, 
      color: "text-blue-500",
      change: "+1 จากเดือนที่แล้ว"
    },
    { 
      title: "ชั่วโมงการเรียน", 
      value: stats?.total_hours?.toString() || "8.5", 
      icon: Clock, 
      color: "text-green-500",
      change: "+2.5 ชั่วโมงสัปดาห์นี้"
    },
    { 
      title: "ใบประกาศนียบัตร", 
      value: stats?.certificates_earned?.toString() || "0", 
      icon: Trophy, 
      color: "text-yellow-500",
      change: "ยังไม่มี"
    },
    { 
      title: "เรียนต่อเนื่อง", 
      value: stats?.current_streak?.toString() || "7", 
      icon: Target, 
      color: "text-purple-500",
      change: "วันติดต่อกัน"
    }
  ];

  const displayCourses = courses.length > 0 ? courses.slice(0, 1) : mockRecentCourses;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-hero-gradient py-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="gradient-blob"></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                สวัสดี {profile?.full_name || 'คุณผู้ใช้'}! 👋
              </h1>
              <p className="text-white/80 text-lg">
                วันนี้เรียนอะไรดี? มาดูความคืบหน้าของคุณกัน
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Settings className="h-4 w-4 mr-2" />
                ตั้งค่า
              </Button>
              <Button className="bg-white text-primary hover:bg-white/90">
                <BookOpen className="h-4 w-4 mr-2" />
                ดูคอร์สใหม่
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-6 relative z-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {displayStats.map((stat) => (
            <Card key={stat.title} className="glass-card hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  <Badge variant="secondary" className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                <p className="text-muted-foreground text-sm">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Continue Learning */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  เรียนต่อ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {displayCourses.map((course) => (
                  <div key={course.id || course.slug} className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-20 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{course.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            บทต่อไป: useState Hook
                          </p>
                        </div>
                        <Button size="sm" asChild>
                          <Link to={`/learn/${course.slug || course.id}/lesson-1`}>
                            เรียนต่อ
                          </Link>
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>3/{course.total_lessons || 24} บทเรียน</span>
                          <span>2 วันที่แล้ว</span>
                        </div>
                        <Progress value={15} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/courses">
                    ดูคอร์สทั้งหมด
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Weekly Activity */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  กิจกรรมสัปดาห์นี้
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end h-32">
                  {weeklyActivity.map((day, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <div 
                        className={`w-8 bg-primary/20 rounded-t transition-all ${
                          day.completed ? 'bg-primary' : 'bg-muted'
                        }`}
                        style={{ height: `${day.hours * 20}px`, minHeight: '4px' }}
                      />
                      <div className="text-xs text-muted-foreground">{day.day}</div>
                      <div className="text-xs font-medium">{day.hours}ช</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  ความสำเร็จ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div 
                      key={index} 
                      className={`p-4 border rounded-lg ${
                        achievement.earned 
                          ? 'bg-success/10 border-success/20' 
                          : 'bg-muted/50 border-muted-foreground/20'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <achievement.icon 
                          className={`h-6 w-6 ${
                            achievement.earned ? 'text-success' : 'text-muted-foreground'
                          }`} 
                        />
                        <div className="flex-1">
                          <h4 className={`font-medium ${
                            achievement.earned ? 'text-success' : 'text-muted-foreground'
                          }`}>
                            {achievement.title}
                          </h4>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {achievement.date}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    การแจ้งเตือน
                  </div>
                  <Badge variant="secondary">{notifications.filter(n => !n.read).length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.slice(0, 3).map((notification) => (
                  <div key={notification.id} className={`p-3 border rounded-lg ${
                    !notification.read ? 'bg-primary/5 border-primary/20' : 'bg-muted/30'
                  }`}>
                    <div className="flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        !notification.read ? 'bg-primary' : 'bg-muted-foreground'
                      }`} />
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{notification.title}</h5>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  ดูการแจ้งเตือนทั้งหมด
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>การดำเนินการด่วน</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/courses">
                    <BookOpen className="h-4 w-4 mr-3" />
                    เรียนคอร์สใหม่
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/tools">
                    <Download className="h-4 w-4 mr-3" />
                    ดาวน์โหลดเครื่องมือ
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/ebooks">
                    <FileText className="h-4 w-4 mr-3" />
                    อ่าน eBook
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Award className="h-4 w-4 mr-3" />
                  ดูใบประกาศนียบัตร
                </Button>
              </CardContent>
            </Card>

            {/* Learning Streak */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  เรียนต่อเนื่อง
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">7</div>
                <p className="text-muted-foreground mb-4">วันติดต่อกัน</p>
                <div className="text-sm text-muted-foreground mb-4">
                  เป้าหมายประจำเดือน: เรียน 20 วัน
                </div>
                <Progress value={35} className="mb-2" />
                <p className="text-xs text-muted-foreground">7/20 วัน (35%)</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}