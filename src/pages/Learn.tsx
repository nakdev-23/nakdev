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
import { useCourse } from "@/hooks/useCourse";
import { useToast } from "@/hooks/use-toast";

// Mock transcript data - in a real app, this would come from the database
const getTranscript = (lessonSlug: string) => {
  if (lessonSlug === 'lesson-1') {
    return `สวัสดีครับ ยินดีต้อนรับสู่คอร์ส React สำหรับผู้เริ่มต้น

ในวิดีโอแรกนี้ เราจะมาทำความรู้จักกับ React กัน React คือ JavaScript Library ที่พัฒนาโดย Facebook สำหรับสร้าง User Interface

React มีความนิยมสูงเพราะ:
1. Component-based Architecture
2. Virtual DOM ที่มีประสิทธิภาพ
3. Community และ Ecosystem ที่แข็งแกร่ง
4. การ Reusability ของ Component

ในคอร์สนี้เราจะเรียนรู้ตั้งแต่พื้นฐานจนถึงการสร้างแอปพลิเคชันจริง`;
  }
  return 'ยังไม่มี Transcript สำหรับบทเรียนนี้';
};

export default function Learn() {
  const { courseSlug, lessonSlug } = useParams();
  const [noteText, setNoteText] = useState("");
  const [openChapters, setOpenChapters] = useState<number[]>([1, 2, 3]);
  const [user, setUser] = useState(null);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const { toast } = useToast();

  const { course, lessons, chapters, currentLesson, completedLessons, markLessonComplete, isLoading, error } = useCourse(
    courseSlug || '', 
    lessonSlug
  );
  
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">กำลังโหลด...</h1>
        </div>
      </div>
    );
  }

  if (error || !course || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {error || (!user ? 'กรุณาเข้าสู่ระบบ' : 'ไม่พบคอร์สที่ระบุ')}
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

  if (!currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">ไม่พบบทเรียนที่ระบุ</h1>
          <Button asChild>
            <Link to={`/courses/${courseSlug}`}>กลับไปดูคอร์ส</Link>
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

  const progress = (completedLessons / course.total_lessons) * 100;

  // Navigation helpers
  const getCurrentLessonIndex = () => {
    return lessons.findIndex(lesson => lesson.slug === currentLesson?.slug);
  };

  const getPreviousLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    return currentIndex > 0 ? lessons[currentIndex - 1] : null;
  };

  const getNextLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    return currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  };

  const previousLesson = getPreviousLesson();
  const nextLesson = getNextLesson();

  const handleVideoProgressUpdate = (duration: number, completed: boolean) => {
    console.log('Video progress updated:', { duration, completed });
    // You can add additional logic here if needed
  };

  const handleMarkComplete = async () => {
    if (!currentLesson) return;

    setIsMarkingComplete(true);
    try {
      const result = await markLessonComplete(currentLesson.id);
      if (result.success) {
        toast({
          title: "เรียนจบแล้ว!",
          description: "บทเรียนนี้ได้ถูกทำเครื่องหมายว่าเรียนจบแล้ว",
        });
      } else {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: result.error || "ไม่สามารถทำเครื่องหมายเรียนจบได้",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถทำเครื่องหมายเรียนจบได้",
        variant: "destructive",
      });
    } finally {
      setIsMarkingComplete(false);
    }
  };

  const isLessonCompleted = chapters
    .flatMap(c => c.lessons)
    .find(l => l.id === currentLesson?.id)?.completed || false;

  // Helper function to check if a lesson is locked
  const isLessonLocked = (lesson: any, lessonIndex: number) => {
    // First lesson is always unlocked
    if (lessonIndex === 0) return false;
    
    // Get all lessons flattened with their global index
    const allLessons = chapters.flatMap(c => c.lessons);
    const globalIndex = allLessons.findIndex(l => l.id === lesson.id);
    
    // Check if all previous lessons are completed
    for (let i = 0; i < globalIndex; i++) {
      if (!allLessons[i].completed) {
        return true;
      }
    }
    
    return false;
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
                  {currentLesson.title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {completedLessons}/{course.total_lessons} บทเรียน
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
          {/* Video Player */}
          <div className="p-6">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              {currentLesson.youtube_url ? (
                <iframe
                  src={currentLesson.youtube_url}
                  title={currentLesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <SecureVideoPlayer
                  videoId={currentLesson.video_id}
                  filePath={currentLesson.video?.file_path || ''}
                  onProgressUpdate={handleVideoProgressUpdate}
                />
              )}
            </div>
            
            {/* Mark Complete Button for YouTube videos */}
            {currentLesson.youtube_url && (
              <div className="mt-4 flex justify-center">
                {isLessonCompleted ? (
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">เรียนจบแล้ว</span>
                  </div>
                ) : (
                  <Button 
                    onClick={handleMarkComplete}
                    disabled={isMarkingComplete}
                    className="gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    {isMarkingComplete ? "กำลังบันทึก..." : "ยืนยันการเรียนจบ"}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Lesson Content */}
          <div className="p-6 border-b">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">{currentLesson.title}</h2>
              <p className="text-muted-foreground mb-6">{currentLesson.description}</p>
              
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
                          {getTranscript(currentLesson.slug)}
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
              {previousLesson ? (
                <Button variant="outline" asChild>
                  <Link to={`/learn/${courseSlug}/${previousLesson.slug}`}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    บทก่อนหน้า
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" disabled>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  บทก่อนหน้า
                </Button>
              )}
              
              {nextLesson ? (
                <Button asChild>
                  <Link to={`/learn/${courseSlug}/${nextLesson.slug}`}>
                    บทต่อไป
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              ) : (
                <Button disabled>
                  บทต่อไป
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="w-80 border-l bg-muted/30">
          <div className="p-4 border-b">
            <h3 className="font-semibold mb-2">เนื้อหาคอร์ส</h3>
            <div className="text-sm text-muted-foreground">
              {completedLessons} จาก {course.total_lessons} บทเรียน
            </div>
          </div>
          
          <div className="p-4 space-y-2">
            {chapters.map((chapter) => (
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
                    {chapter.lessons.map((lesson, lessonIndex) => {
                      const globalLessonIndex = chapters.slice(0, chapter.id - 1).reduce((acc, ch) => acc + ch.lessons.length, 0) + lessonIndex;
                      const isLocked = isLessonLocked(lesson, globalLessonIndex);
                      
                      return isLocked ? (
                        <div 
                          key={lesson.id}
                          className="flex items-center gap-3 p-3 rounded-lg text-sm cursor-not-allowed opacity-60 bg-muted/20"
                        >
                          <div className="flex-shrink-0">
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-muted-foreground">
                              {lesson.title}
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{lesson.duration_text}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Link 
                          key={lesson.id}
                          to={`/learn/${courseSlug}/${lesson.slug}`}
                          className={`flex items-center gap-3 p-3 rounded-lg text-sm cursor-pointer hover:bg-muted/50 transition-colors block ${
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
                              <div className="h-4 w-4 border-2 border-muted-foreground rounded-full" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium ${lesson.current ? 'text-primary' : ''}`}>
                              {lesson.title}
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{lesson.duration_text}</span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
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