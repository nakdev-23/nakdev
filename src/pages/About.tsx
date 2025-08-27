import { Users, Target, Award, Heart, Code2, BookOpen, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

const team = [
  {
    name: "สมชาย นักพัฒนา",
    role: "Co-Founder & Lead Instructor",
    experience: "8+ ปี",
    specialty: "Full Stack Development",
    description: "อดีต Senior Developer จากบริษัทเทคโนโลยีชั้นนำ มีประสบการณ์สอนมากกว่า 5 ปี"
  },
  {
    name: "วิภาวี สร้างสรรค์",
    role: "Co-Founder & UX Director", 
    experience: "6+ ปี",
    specialty: "UI/UX Design",
    description: "ผู้เชี่ยวชาญด้านการออกแบบ UI/UX และการวิจัยผู้ใช้งาน"
  },
  {
    name: "กรกต เทคโนโลยี",
    role: "Technical Director",
    experience: "10+ ปี",
    specialty: "Backend & Infrastructure",
    description: "ผู้เชี่ยวชาญด้านสถาปัตยกรรมระบบและการพัฒนา Backend"
  }
];

export default function About() {
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

      {/* Team Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">ทีมงานของเรา</h2>
            <p className="text-xl text-muted-foreground">
              กลุ่มผู้เชี่ยวชาญที่มีประสบการณ์และหลงใหลในการสอน
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={member.name} className={`glass-card hover-lift animate-fade-in-delay-${index + 1}`}>
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.role}</p>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Badge variant="outline" className="badge-level text-xs">
                      {member.experience}
                    </Badge>
                    <Badge variant="outline" className="badge-free text-xs">
                      {member.specialty}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
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
          <Button size="lg" className="text-lg px-8 py-6 glow-on-hover">
            เริ่มเรียนฟรี
          </Button>
        </div>
      </section>
    </div>
  );
}