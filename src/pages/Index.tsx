import { Link } from "react-router-dom";
import { ArrowRight, Code2, BookOpen, Wrench, Users, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCourses } from "@/hooks/useCourses";
import { useTools } from "@/hooks/useTools";
import { useEbooks } from "@/hooks/useEbooks";
import { useTestimonials } from "@/hooks/useTestimonials";
const valueProps = [{
  icon: Code2,
  title: "คอร์สคุณภาพสูง",
  description: "เรียนจากผู้เชี่ยวชาญด้วยหลักสูตรที่ออกแบบมาเพื่อนักพัฒนาระดับเริ่มต้น"
}, {
  icon: Wrench,
  title: "เครื่องมือช่วยเหลือ",
  description: "เข้าถึงเครื่องมือและเทมเพลตที่จะช่วยเพิ่มประสิทธิภาพการทำงาน"
}, {
  icon: BookOpen,
  title: "eBook และแหล่งเรียนรู้",
  description: "คลังความรู้ที่ครบครันในรูปแบบ eBook ที่อ่านง่ายและทำความเข้าใจได้เร็ว"
}, {
  icon: Users,
  title: "ชุมชนนักพัฒนา",
  description: "เข้าร่วมชุมชนนักพัฒนาที่จะช่วยเหลือและแบ่งปันประสบการณ์ซึ่งกันและกัน"
}];
export default function Index() {
  const {
    courses,
    isLoading: coursesLoading
  } = useCourses();
  const {
    tools,
    isLoading: toolsLoading
  } = useTools();
  const {
    ebooks,
    isLoading: ebooksLoading
  } = useEbooks();
  const {
    testimonials,
    isLoading: testimonialsLoading
  } = useTestimonials();

  // Use real data from Supabase
  const displayCourses = courses.slice(0, 3);
  const displayTools = tools.slice(0, 2);
  const displayEbooks = ebooks.slice(0, 2);
  return <div className="min-h-screen">
      {/* Hero Section - Futuristic */}
      <section className="relative bg-hero-gradient overflow-hidden min-h-[90vh] flex items-center">
        {/* Animated background blobs */}
        <div className="absolute inset-0">
          <div className="gradient-blob"></div>
          <div className="gradient-blob"></div>
          <div className="gradient-blob"></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
        
        <div className="relative container mx-auto px-4 lg:py-32 py-[10px]">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
              <span className="text-sm font-medium text-white/90">เทคโนโลยีการศึกษายุคใหม่</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 animate-fade-up leading-tight">
              เริ่มต้นเส้นทาง
              <span className="block mt-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
                นัก Dev มืออาชีพ
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/70 mb-10 max-w-3xl mx-auto animate-fade-in-delay-1 leading-relaxed">
              เรียนเขียนโปรแกรมด้วยคอร์สคุณภาพระดับโลก พร้อมเครื่องมือ AI และ eBook 
              ที่จะพาคุณก้าวสู่อนาคตแห่งเทคโนโลยี
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
              <Button size="lg" className="text-lg px-10 py-7 glow-on-hover rounded-full group relative overflow-hidden" asChild>
                <Link to="/courses">
                  <span className="relative z-10 flex items-center">
                    เริ่มเรียนเลย
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-10 py-7 glass-card border-white/20 text-white hover:bg-white/10 rounded-full backdrop-blur-xl" asChild>
                <Link to="/tools">
                  ดูเครื่องมือ
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 animate-fade-in-delay-3">
              {[{
              value: "50+",
              label: "คอร์สเรียน"
            }, {
              value: "5K+",
              label: "นักเรียน"
            }, {
              value: "95%",
              label: "ความพึงพอใจ"
            }].map((stat, i) => <div key={i} className="text-center">
                  
                  
                </div>)}
            </div>
          </div>
        </div>
        
        {/* Bottom fade */}
        
      </section>

      {/* Value Propositions - Enhanced */}
      <section className="py-24 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              ทำไมต้องเลือกเรา
            </h2>
            <p className="text-muted-foreground text-lg">แพลตฟอร์มการเรียนรู้ที่ครบครันที่สุดสำหรับนักพัฒนา</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueProps.map((prop, index) => <Card key={prop.title} className="glass-card hover-lift group relative overflow-hidden" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                <CardContent className="p-8 text-center relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <prop.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{prop.title}</h3>
                  <p className="text-muted-foreground">{prop.description}</p>
                </CardContent>
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                </div>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Popular Courses - Enhanced */}
      <section className="py-24 bg-muted/20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-medium">
              🔥 HOT COURSES
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              คอร์สยอดนิยม
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              เรียนรู้จากคอร์สที่ได้รับความนิยมสูงสุดจากนักพัฒนาทั่วประเทศ
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayCourses.map((course, index) => <Card key={course.id || course.slug} className="hover-lift glass-card group overflow-hidden" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                <div className="aspect-video bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-t-lg overflow-hidden relative">
                  {course.cover_image_url ? <img src={course.cover_image_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center">
                      <Code2 className="h-16 w-16 text-primary/40" />
                    </div>}
                  
                  {/* Overlay gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <Badge variant="outline" className="badge-level text-xs px-3 py-1">
                      เริ่มต้น
                    </Badge>
                    <Badge variant="outline" className={course.price === 0 || course.price === null ? "badge-free px-3 py-1" : "badge-paid px-3 py-1"}>
                      {course.price === 0 || course.price === null ? "ฟรี" : `฿${course.price}`}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-6 pb-6 border-b border-border/50">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      8 ชั่วโมง
                    </span>
                    <span className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      {course.total_lessons || 24} บทเรียน
                    </span>
                  </div>
                  
                  <Button className="w-full group/btn" asChild>
                    <Link to={`/courses/${course.slug || course.id}`}>
                      รายละเอียด
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>)}
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
                {displayTools.map(tool => <Card key={tool.id} className="glass-card hover-lift">
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
                  </Card>)}
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
                {displayEbooks.map(ebook => <Card key={ebook.id} className="glass-card hover-lift">
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
                  </Card>)}
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
              {[...testimonials, ...testimonials].map((testimonial, index) => <Card key={index} className="flex-shrink-0 w-80 glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />)}
                    </div>
                    <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} • {testimonial.company}
                      </p>
                    </div>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-32 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="gradient-blob"></div>
          <div className="gradient-blob"></div>
        </div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card mb-8">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white/90 font-medium">เข้าร่วมกับนักพัฒนากว่า 5,000+ คน</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              พร้อมเริ่มต้นเส้นทาง
              <span className="block mt-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                นักพัฒนาแล้วหรือยัง?
              </span>
            </h2>
            
            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              สมัครสมาชิกฟรีวันนี้ เพื่อเข้าถึงคอร์สฟรี เครื่องมือ AI และ eBook เบื้องต้น 
              พร้อมรับ <span className="text-accent font-semibold">ส่วนลด 20%</span> สำหรับคอร์สแรก
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-10 py-7 glow-on-hover rounded-full bg-white text-primary hover:bg-white/90 group" asChild>
                <Link to="/auth/signup">
                  <span className="flex items-center">
                    สมัครสมาชิกฟรี
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" className="text-lg px-10 py-7 glass-card border-white/20 text-white hover:bg-white/10 rounded-full backdrop-blur-xl" asChild>
                <Link to="/courses">
                  เรียกดูคอร์ส
                </Link>
              </Button>
            </div>
            
            {/* Trust badges */}
            <div className="flex items-center justify-center gap-8 mt-12 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span>ฟรีตลอดชีพ</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span>ไม่ต้องใช้บัตรเครดิต</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span>ยกเลิกได้ทุกเมื่อ</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>
    </div>;
}