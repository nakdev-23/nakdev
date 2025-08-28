import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  CheckCircle, 
  Lock, 
  Clock,
  BookOpen,
  MessageSquare,
  FileText,
  ChevronRight,
  ChevronDown,
  Star,
  Flag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SecureVideoPlayer } from "@/components/video/SecureVideoPlayer";
import { supabase } from "@/integrations/supabase/client";

const courseData = {
  "react-fundamentals": {
    title: "React สำหรับผู้เริ่มต้น",
    instructor: "สมชาย นักพัฒนา",
    totalLessons: 24,
    completedLessons: 3,
    currentLesson: {
      id: "lesson-1",
      videoId: "550e8400-e29b-41d4-a716-446655440000", // Mock video ID
      filePath: "react-fundamentals/lesson-1.mp4", // Path in storage bucket
      title: "ทำความรู้จักกับ React",
      duration: "15:30",
      description: "เรียนรู้พื้นฐาน React และเหตุผลที่ทำให้ React เป็น Library ที่นิยมในการพัฒนา Frontend",
      transcript: `สวัสดีครับ ยินดีต้อนรับสู่คอร์ส React สำหรับผู้เริ่มต้น

ในวิดีโอแรกนี้ เราจะมาทำความรู้จักกับ React กัน React คือ JavaScript Library ที่พัฒนาโดย Facebook สำหรับสร้าง User Interface

React มีความนิยมสูงเพราะ:
1. Component-based Architecture
2. Virtual DOM ที่มีประสิทธิภาพ
3. Community และ Ecosystem ที่แข็งแกร่ง
4. การ Reusability ของ Component

ในคอร์สนี้เราจะเรียนรู้ตั้งแต่พื้นฐานจนถึงการสร้างแอปพลิเคชันจริง`
    },
    chapters: [
      {
        id: 1,
        title: "บทนำและการเตรียมตัว",
        lessons: [
          { 
            id: "lesson-1", 
            videoId: "550e8400-e29b-41d4-a716-446655440000",
            filePath: "react-fundamentals/lesson-1.mp4",
            title: "ทำความรู้จักกับ React", 
            duration: "15:30", 
            completed: true, 
            current: true 
          },
          { 
            id: "lesson-2", 
            videoId: "550e8400-e29b-41d4-a716-446655440001",
            filePath: "react-fundamentals/lesson-2.mp4",
            title: "การติดตั้ง Development Environment", 
            duration: "20:45", 
            completed: true 
          },
          { 
            id: "lesson-3", 
            videoId: "550e8400-e29b-41d4-a716-446655440002",
            filePath: "react-fundamentals/lesson-3.mp4",
            title: "สร้างโปรเจคแรก", 
            duration: "25:15", 
            completed: true 
          }
        ]
      },
      {
        id: 2,
        title: "React Components",
        lessons: [
          { 
            id: "lesson-4", 
            videoId: "550e8400-e29b-41d4-a716-446655440003",
            filePath: "react-fundamentals/lesson-4.mp4",
            title: "เข้าใจ Components", 
            duration: "30:00", 
            completed: false 
          },
          { 
            id: "lesson-5", 
            videoId: "550e8400-e29b-41d4-a716-446655440004",
            filePath: "react-fundamentals/lesson-5.mp4",
            title: "Props และ State", 
            duration: "35:20", 
            completed: false 
          },
          { 
            id: "lesson-6", 
            videoId: "550e8400-e29b-41d4-a716-446655440005",
            filePath: "react-fundamentals/lesson-6.mp4",
            title: "Event Handling", 
            duration: "25:30", 
            completed: false 
          }
        ]
      }
    ]
  }
};

export default function Learn() {
  const { courseSlug, lessonSlug } = useParams();
  const [noteText, setNoteText] = useState("");
  const [openChapters, setOpenChapters] = useState<number[]>([1, 2, 3]);
  const [user, setUser] = useState(null);

  const course = courseData[courseSlug as keyof typeof courseData];
  
  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Redirect to login if not authenticated
        window.location.href = '/auth/signin';
        return;
      }
      setUser(session.user);
    };
    
    checkAuth();
  }, []);

  if (!course || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {!user ? 'กรุณาเข้าสู่ระบบ' : 'ไม่พบคอร์สที่ระบุ'}
          </h1>
          <Button asChild>
            <Link to={!user ? "/auth/signin" : "/courses"}>
              {!user ? 'เข้าสู่ระบบ' : 'กลับไปดูคอร์ส'}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const toggleChapter = (chapterId: number) => {
    setOpenChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const progress = (course.completedLessons / course.totalLessons) * 100;

  const handleVideoProgressUpdate = (duration: number, completed: boolean) => {
    console.log('Video progress updated:', { duration, completed });
    // You can add additional logic here if needed
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/courses/${courseSlug}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  กลับ
                </Link>
              </Button>
              <div>
                <h1 className="font-semibold">{course.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {course.currentLesson.title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {course.completedLessons}/{course.totalLessons} บทเรียน
              </div>
              <Progress value={progress} className="w-32" />
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Secure Video Player */}
          <div className="p-6">
            <SecureVideoPlayer
              videoId={course.currentLesson.videoId}
              filePath={course.currentLesson.filePath}
              onProgressUpdate={handleVideoProgressUpdate}
            />
          </div>

          {/* Lesson Content */}
          <div className="p-6 border-b">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">{course.currentLesson.title}</h2>
              <p className="text-muted-foreground mb-6">{course.currentLesson.description}</p>
              
              <Tabs defaultValue="transcript" className="w-full">
                <TabsList>
                  <TabsTrigger value="transcript">Transcript</TabsTrigger>
                  <TabsTrigger value="notes">บันทึก</TabsTrigger>
                  <TabsTrigger value="resources">เอกสารประกอบ</TabsTrigger>
                </TabsList>
                
                <TabsContent value="transcript" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                          {course.currentLesson.transcript}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notes" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        บันทึกของฉัน
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="เขียนบันทึกสำหรับบทเรียนนี้..."
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="min-h-[200px]"
                      />
                      <Button className="mt-4">บันทึก</Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="resources" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <h4 className="font-medium">React Documentation</h4>
                            <p className="text-sm text-muted-foreground">เอกสารอย่างเป็นทางการของ React</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <h4 className="font-medium">Code Examples</h4>
                            <p className="text-sm text-muted-foreground">ตัวอย่างโค้ดจากบทเรียนนี้</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-6">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                บทก่อนหน้า
              </Button>
              <Button>
                บทต่อไป
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="w-80 border-l bg-muted/30">
          <div className="p-4 border-b">
            <h3 className="font-semibold mb-2">เนื้อหาคอร์ส</h3>
            <div className="text-sm text-muted-foreground">
              {course.completedLessons} จาก {course.totalLessons} บทเรียน
            </div>
          </div>
          
          <div className="p-4 space-y-2">
            {course.chapters.map((chapter) => (
              <Collapsible 
                key={chapter.id}
                open={openChapters.includes(chapter.id)}
                onOpenChange={() => toggleChapter(chapter.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between p-3 h-auto"
                  >
                    <span className="font-medium text-left">{chapter.title}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${
                      openChapters.includes(chapter.id) ? 'rotate-180' : ''
                    }`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-1 mt-2">
                    {chapter.lessons.map((lesson) => (
                      <div 
                        key={lesson.id}
                        className={`flex items-center gap-3 p-3 rounded-lg text-sm cursor-pointer hover:bg-muted/50 ${
                          lesson.current ? 'bg-primary/10 border border-primary/20' : ''
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {lesson.completed ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : lesson.current ? (
                            <div className="h-4 w-4 bg-primary rounded-full flex items-center justify-center">
                              <div className="h-2 w-2 bg-primary-foreground rounded-full" />
                            </div>
                          ) : (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium ${lesson.current ? 'text-primary' : ''}`}>
                            {lesson.title}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{lesson.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}