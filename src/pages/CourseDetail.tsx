import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, Users, Star, Play, Lock, CheckCircle, ArrowRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { useCourseWithLessons } from "@/hooks/useCourses";

// Mock data for features and additional info
const courseFeatures = [
  "วิดีโอ HD คุณภาพสูง",
  "แบบฝึกหัดและโปรเจค", 
  "ใบประกาศนียบัตร",
  "เข้าถึงได้ตลอดชีวิต",
  "ชุมชนนักเรียน",
  "การสนับสนุนจากผู้สอน"
];

export default function CourseDetail() {
  const { slug } = useParams();
  const [couponCode, setCouponCode] = useState("");
  
  const { course, lessons, isLoading, error } = useCourseWithLessons(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">กำลังโหลด...</h1>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">ไม่พบคอร์สที่ค้นหา</h1>
          <Button asChild>
            <Link to="/courses">กลับไปดูคอร์สอื่น</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Group lessons by chapter
  const chapters = lessons.reduce((acc, lesson) => {
    const chapterTitle = lesson.chapter_title;
    if (!acc[chapterTitle]) {
      acc[chapterTitle] = [];
    }
    acc[chapterTitle].push(lesson);
    return acc;
  }, {} as Record<string, typeof lessons>);

  // Get first lesson slug for navigation
  const firstLesson = lessons.length > 0 ? lessons[0] : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Course Header */}
      <section className="bg-hero-gradient py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="badge-level">
                  เริ่มต้น
                </Badge>
                <Badge variant="outline" className="badge-free">
                  ฟรี
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-up">
                {course.title}
              </h1>
              
              <p className="text-xl text-white/80 mb-8 animate-fade-in-delay-1">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-6 text-white/80 mb-8 animate-fade-in-delay-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>8 ชั่วโมง</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>1,250 นักเรียน</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span>4.8 (89 รีวิว)</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 animate-fade-in-delay-3">
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                  React
                </Badge>
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20">  
                  JavaScript
                </Badge>
              </div>
            </div>

            {/* Sticky Buy Panel - Desktop */}
            <div className="lg:col-span-1">
              <Card className="glass-card sticky top-24">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button size="lg" className="rounded-full w-16 h-16">
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div>
                      <div className="text-3xl font-bold text-success mb-2">ฟรี!</div>
                      <div className="text-muted-foreground line-through">
                        ฿1,990
                      </div>
                    </div>
                  </div>

                  <Button className="w-full glow-on-hover mb-4" size="lg" asChild>
                    <Link to={firstLesson ? `/learn/${course.slug}/${firstLesson.slug}` : '#'}>
                      เริ่มเรียนฟรี
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>

                  <Button variant="outline" className="w-full mb-6">
                    <Share2 className="mr-2 h-4 w-4" />
                    แชร์คอร์สนี้
                  </Button>

                  <div className="space-y-2 text-sm">
                    <h4 className="font-semibold mb-3">สิ่งที่คุณจะได้รับ:</h4>
                    {courseFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Details */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
                  <TabsTrigger value="curriculum">หลักสูตร</TabsTrigger>
                  <TabsTrigger value="reviews">รีวิว</TabsTrigger>
                  <TabsTrigger value="instructor">ผู้สอน</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-8">
                  <Card className="glass-card">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold mb-6">เกี่ยวกับคอร์สนี้</h3>
                      <div className="prose max-w-none">
                        <p className="text-muted-foreground mb-4">
                          คอร์ส React สำหรับผู้เริ่มต้นนี้ ออกแบบมาเพื่อให้คุณเรียนรู้ React จากพื้นฐานจนสามารถสร้างเว็บแอปพลิเคชันได้จริง ไม่ว่าคุณจะเป็นมือใหม่หรือมีพื้นฐาน JavaScript อยู่แล้ว
                        </p>
                        <p className="text-muted-foreground mb-4">
                          ด้วยเนื้อหาที่ครอบคลุมและตัวอย่างที่เข้าใจง่าย คุณจะได้เรียนรู้การใช้งาน Components, Props, State, Hooks และอื่นๆ อีกมากมาย
                        </p>
                        <h4 className="font-semibold mb-3">สิ่งที่คุณจะได้เรียนรู้:</h4>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                          <li>พื้นฐาน React และการทำงาน</li>
                          <li>การสร้างและใช้งาน Components</li>
                          <li>การจัดการ State และ Props</li>
                          <li>React Hooks: useState, useEffect และอื่นๆ</li>
                          <li>การสร้างแอปพลิเคชันจริง</li>
                          <li>Best Practices และเทคนิคขั้นสูง</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="curriculum" className="mt-8">
                  <Card className="glass-card">
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold">หลักสูตร</h3>
                        <div className="text-muted-foreground">
                          {course.total_lessons} บทเรียน • 8 ชั่วโมง
                        </div>
                      </div>

                      <Accordion type="single" collapsible defaultValue="item-0">
                        {Object.entries(chapters).map(([chapterTitle, chapterLessons], sectionIndex) => (
                          <AccordionItem key={sectionIndex} value={`item-${sectionIndex}`}>
                            <AccordionTrigger className="text-left">
                              <div>
                                <div className="font-semibold">{chapterTitle}</div>
                                <div className="text-sm text-muted-foreground">
                                  {chapterLessons.length} บทเรียน
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2">
                                {chapterLessons.map((lesson, lessonIndex) => (
                                  <div key={lessonIndex} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                                    <div className="flex items-center gap-3">
                                      {lessonIndex < 2 ? (
                                        <Play className="h-4 w-4 text-primary" />
                                      ) : (
                                        <Lock className="h-4 w-4 text-muted-foreground" />
                                      )}
                                      <span className={lessonIndex < 2 ? "text-primary" : "text-foreground"}>
                                        {lesson.title}
                                      </span>
                                      {lessonIndex < 2 && (
                                        <Badge variant="outline" className="badge-free text-xs">
                                          ดูฟรี
                                        </Badge>
                                      )}
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                      {lesson.duration_text}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-8">
                  <Card className="glass-card">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold mb-6">รีวิวจากนักเรียน</h3>
                      <div className="text-center py-20 text-muted-foreground">
                        <Star className="h-16 w-16 mx-auto mb-4" />
                        <p>รีวิวจะมาเร็วๆ นี้</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="instructor" className="mt-8">
                  <Card className="glass-card">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold mb-6">ผู้สอน</h3>
                        <div className="flex items-start gap-6">
                          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex-shrink-0"></div>
                          <div>
                            <h4 className="text-xl font-semibold mb-2">{course.instructor}</h4>
                            <p className="text-muted-foreground mb-2">
                              Senior Frontend Developer • Tech Corp
                            </p>
                            <p className="text-muted-foreground mb-4">
                              ประสบการณ์ 5+ ปี
                            </p>
                            <p className="text-muted-foreground">
                              ผู้เชี่ยวชาญด้าน Frontend Development ที่มีประสบการณ์ในการสอนและพัฒนาเว็บแอปพลิเคชันมากกว่า 5 ปี 
                              เชี่ยวชาญเรื่อง React, JavaScript และเทคโนโลยีสมัยใหม่
                            </p>
                          </div>
                        </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Mobile Buy Panel */}
            <div className="lg:hidden">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-success">ฟรี!</div>
                  </div>
                  <Button className="w-full glow-on-hover" size="lg" asChild>
                    <Link to={firstLesson ? `/learn/${course.slug}/${firstLesson.slug}` : '#'}>
                      เริ่มเรียนฟรี
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}