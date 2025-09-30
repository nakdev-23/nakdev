import { Link } from "react-router-dom";
import { ArrowRight, Code2, BookOpen, Wrench, Users, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCourses } from "@/hooks/useCourses";
import { useTools } from "@/hooks/useTools";
import { useEbooks } from "@/hooks/useEbooks";
import { useTestimonials } from "@/hooks/useTestimonials";

const valueProps = [
  {
    icon: Code2,
    title: "คอร์สคุณภาพสูง",
    description: "เรียนจากผู้เชี่ยวชาญด้วยหลักสูตรที่ออกแบบมาเพื่อนักพัฒนาระดับเริ่มต้น"
  },
  {
    icon: Wrench,
    title: "เครื่องมือช่วยเหลือ",
    description: "เข้าถึงเครื่องมือและเทมเพลตที่จะช่วยเพิ่มประสิทธิภาพการทำงาน"
  },
  {
    icon: BookOpen,
    title: "eBook และแหล่งเรียนรู้",
    description: "คลังความรู้ที่ครบครันในรูปแบบ eBook ที่อ่านง่ายและทำความเข้าใจได้เร็ว"
  },
  {
    icon: Users,
    title: "ชุมชนนักพัฒนา",
    description: "เข้าร่วมชุมชนนักพัฒนาที่จะช่วยเหลือและแบ่งปันประสบการณ์ซึ่งกันและกัน"
  }
];



export default function Index() {
  const { courses, isLoading: coursesLoading } = useCourses();
  const { tools, isLoading: toolsLoading } = useTools();
  const { ebooks, isLoading: ebooksLoading } = useEbooks();
  const { testimonials, isLoading: testimonialsLoading } = useTestimonials();

  // Use real data from Supabase
  const displayCourses = courses.slice(0, 3);
  const displayTools = tools.slice(0, 2);
  const displayEbooks = ebooks.slice(0, 2);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-hero-gradient overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0">
          <div className="gradient-blob"></div>
          <div className="gradient-blob"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-up">
              เริ่มต้นเส้นทาง
              <span className="block text-gradient">นัก Dev มืออาชีพ</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 animate-fade-in-delay-1">
              เรียนเขียนโปรแกรมด้วยคอร์สคุณภาพ พร้อมเครื่องมือและ eBook 
              ที่จะพาคุณไปสู่ความสำเร็จในวงการเทคโนโลยี
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
              <Button size="lg" className="text-lg px-8 py-6 glow-on-hover" asChild>
                <Link to="/courses">
                  เริ่มเรียนเลย
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 border-white/20 text-white hover:bg-white/20" asChild>
                <Link to="/tools">
                  ดูเครื่องมือ
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((prop, index) => (
              <Card key={prop.title} className={`glass-card hover-lift animate-fade-in-delay-${index + 1}`}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <prop.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{prop.title}</h3>
                  <p className="text-muted-foreground text-sm">{prop.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">คอร์สยอดนิยม</h2>
            <p className="text-xl text-muted-foreground">เรียนรู้จากคอร์สที่ได้รับความนิยมจากนักพัฒนาทั่วประเทศ</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayCourses.map((course) => (
              <Card key={course.id || course.slug} className="hover-lift glass-card">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg overflow-hidden">
                  {course.cover_image_url ? (
                    <img 
                      src={course.cover_image_url} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="badge-level text-xs">
                      เริ่มต้น
                    </Badge>
                    <Badge variant="outline" className={course.price === 0 || course.price === null ? "badge-free" : "badge-paid"}>
                      {course.price === 0 || course.price === null ? "ฟรี" : `฿${course.price}`}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      8 ชั่วโมง
                    </span>
                    <span>{course.total_lessons || 24} บทเรียน</span>
                  </div>
                  <Button className="w-full" asChild>
                    <Link to={`/courses/${course.slug || course.id}`}>รายละเอียด</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link to="/courses">ดูคอร์สทั้งหมด</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Tools & eBooks */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Tools */}
            <div>
              <h2 className="text-3xl font-bold mb-8">เครื่องมือช่วยเหลือ</h2>
              <div className="space-y-6">
                {displayTools.map((tool) => (
                  <Card key={tool.id} className="glass-card hover-lift">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="outline" className="badge-level">
                          {tool.category}
                        </Badge>
                        <Badge variant="outline" className={tool.price === 0 ? "badge-free" : "badge-paid"}>
                          {tool.price === 0 ? "ฟรี" : `฿${tool.price}`}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{tool.description}</p>
                      <Button variant="outline" className="w-full" asChild>
                        <Link to={`/tools/${tool.slug}`}>ดูรายละเอียด</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-8">
                <Button variant="outline" asChild>
                  <Link to="/tools">ดูเครื่องมือทั้งหมด</Link>
                </Button>
              </div>
            </div>

            {/* eBooks */}
            <div>
              <h2 className="text-3xl font-bold mb-8">eBook และคู่มือ</h2>
              <div className="space-y-6">
                {displayEbooks.map((ebook) => (
                  <Card key={ebook.id} className="glass-card hover-lift">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className={ebook.price === 0 ? "badge-free" : "badge-paid"}>
                              {ebook.price === 0 ? "ฟรี" : `฿${ebook.price}`}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{ebook.pages} หน้า</span>
                          </div>
                          <h3 className="font-semibold mb-2">{ebook.title}</h3>
                          <p className="text-muted-foreground text-sm mb-4">{ebook.description}</p>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/ebooks/${ebook.slug}`}>อ่านตัวอย่าง</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-8">
                <Button variant="outline" asChild>
                  <Link to="/ebooks">ดู eBook ทั้งหมด</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">เสียงจากนักเรียน</h2>
            <p className="text-xl text-muted-foreground">ฟังประสบการณ์จากผู้ที่ประสบความสำเร็จ</p>
          </div>
          <div className="relative">
            <div className="flex space-x-6 animate-marquee hover:animation-pause">
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <Card key={index} className="flex-shrink-0 w-80 glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} • {testimonial.company}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="gradient-blob"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            พร้อมเริ่มต้นเส้นทางนักพัฒนาแล้วหรือยัง?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            สมัครสมาชิกฟรีวันนี้ เพื่อเข้าถึงคอร์สฟรี เครื่องมือ และ eBook เบื้องต้น
          </p>
          <Button size="lg" className="text-lg px-8 py-6 glow-on-hover" asChild>
            <Link to="/auth/signup">
              สมัครสมาชิกฟรี
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}