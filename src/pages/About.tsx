import { Users, Target, Award, Heart, Code2, BookOpen, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const values = [
  {
    icon: Target,
    title: "เป้าหมายชัดเจน",
    description: "มุ่งมั่นสร้างนักพัฒนาที่มีคุณภาพและพร้อมสำหรับตลาดงาน"
  },
  {
    icon: Heart,
    title: "ใส่ใจคุณภาพ",
    description: "คัดสรรเนื้อหาและผู้สอนที่มีประสบการณ์จริงในวงการ"
  },
  {
    icon: Users,
    title: "ชุมชนที่แข็งแกร่ง",
    description: "สร้างเครือข่ายนักพัฒนาที่ช่วยเหลือและแบ่งปันกัน"
  },
  {
    icon: Zap,
    title: "เรียนรู้อย่างมีประสิทธิภาพ",
    description: "วิธีการสอนที่ทันสมัยและเครื่องมือที่ช่วยเพิ่มประสิทธิภาพ"
  }
];

const stats = [
  { number: "10,000+", label: "นักเรียน" },
  { number: "150+", label: "คอร์สเรียน" },
  { number: "50+", label: "เครื่องมือ" },
  { number: "95%", label: "ความพึงพอใจ" }
];

export default function About() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-hero-gradient py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="gradient-blob"></div>
          <div className="gradient-blob"></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-up">
              เกี่ยวกับ<span className="text-gradient"> นัก dev ฝึกหัด</span>
            </h1>
            <p className="text-xl text-white/80 mb-8 animate-fade-in-delay-1">
              แพลตฟอร์มเรียนเขียนโปรแกรมที่ออกแบบมาเพื่อนักพัฒนาระดับเริ่มต้น 
              ด้วยหลักสูตรคุณภาพสูงและเครื่องมือที่จำเป็น
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">พันธกิจของเรา</h2>
              <p className="text-xl text-muted-foreground">
                สร้างโอกาสให้ทุกคนเข้าถึงการศึกษาด้านเทคโนโลยีที่มีคุณภาพ 
                และพัฒนาทักษะที่จำเป็นสำหรับการเป็นนักพัฒนามืออาชีพ
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <Card key={value.title} className={`glass-card hover-lift animate-fade-in-delay-${index + 1}`}>
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">ผลงานของเรา</h2>
            <p className="text-xl text-muted-foreground">
              ตัวเลขที่สะท้อนถึงความสำเร็จและความน่าเชื่อถือ
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className={`text-center animate-fade-in-delay-${index + 1}`}>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">เรื่องราวของเรา</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">นัก dev ฝึกหัด</strong> เกิดขึ้นจากความต้องการที่จะเห็น
                    นักพัฒนาไทยที่มีคุณภาพมากขึ้นในตลาดงาน เราเริ่มต้นจากการสังเกตว่า
                    หลายคนมีความต้องการเรียนรู้เทคโนโลジี แต่ขาดแหล่งเรียนรู้ที่เข้าใจง่าย
                  </p>
                  <p>
                    ด้วยประสบการณ์รวมกันมากกว่า 20 ปีในวงการเทคโนโลยี 
                    เราจึงตัดสินใจสร้างแพลตฟอร์มที่รวบรวมความรู้ เครื่องมือ 
                    และประสบการณ์จริงมาให้ในที่เดียว
                  </p>
                  <p>
                    วันนี้ เรามีนักเรียนมากกว่า 10,000 คน และคอร์สเรียนมากกว่า 150 คอร์ส
                    พร้อมด้วยเครื่องมือและ eBook ที่จะช่วยให้การเรียนรู้มีประสิทธิภาพมากขึ้น
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 w-32 h-32">
                    <div className="bg-primary/20 rounded-lg flex items-center justify-center">
                      <Code2 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="bg-accent/20 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-accent" />
                    </div>
                    <div className="bg-accent/20 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-accent" />
                    </div>
                    <div className="bg-primary/20 rounded-lg flex items-center justify-center">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Services Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">บริการพิเศษ</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">รับปรึกษาและตรวจสอบโปรเจค</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              ให้ผู้เชี่ยวชาญช่วยดูแลโปรเจคของคุณ ตรวจสอบความปลอดภัย และให้คำแนะนำที่เหมาะสม
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="glass-card hover-lift animate-fade-in-delay-1 border-primary/20">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">ตรวจสอบความปลอดภัย</h3>
                <p className="text-muted-foreground mb-4">
                  วิเคราะห์และตรวจสอบช่องโหว่ด้านความปลอดภัยในโค้ดและระบบของคุณ พร้อมให้คำแนะนำในการแก้ไข
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Security Audit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Vulnerability Assessment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Best Practices Review</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-card hover-lift animate-fade-in-delay-2 border-accent/20">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                  <Code2 className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">รีวิวและปรับปรุงโค้ด</h3>
                <p className="text-muted-foreground mb-4">
                  ให้ผู้เชี่ยวชาญตรวจสอบโค้ดของคุณ แนะนำการปรับปรุง และช่วยให้โค้ดมีคุณภาพและ maintainable มากขึ้น
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">✓</span>
                    <span>Code Quality Review</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">✓</span>
                    <span>Performance Optimization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">✓</span>
                    <span>Refactoring Suggestions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-card hover-lift animate-fade-in-delay-3 border-primary/20">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">ตรวจสอบ Supabase Flow</h3>
                <p className="text-muted-foreground mb-4">
                  วิเคราะห์การออกแบบฐานข้อมูล RLS policies และ architecture ของ Supabase ให้เหมาะสมและปลอดภัย
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Database Schema Review</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>RLS Policies Audit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Architecture Consultation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Card className="glass-card max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-4">สนใจบริการปรึกษา?</h3>
                <p className="text-muted-foreground mb-6">
                  ติดต่อเราเพื่อขอคำปรึกษาและรับ quote ตามความต้องการของคุณ
                </p>
                <Button size="lg" className="glow-on-hover">
                  ติดต่อเรา
                </Button>
              </CardContent>
            </Card>
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
            พร้อมเริ่มต้นเส้นทางแล้วหรือยัง?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            มาร่วมเป็นส่วนหนึ่งของชุมชนนักพัฒนาที่กำลังเติบโต 
            และพัฒนาทักษะไปด้วยกัน
          </p>
          <Button size="lg" className="text-lg px-8 py-6 glow-on-hover" onClick={() => navigate('/auth/signin')}>
            เริ่มเรียนฟรี
          </Button>
        </div>
      </section>
    </div>
  );
}