import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cookie, Settings, BarChart3, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const cookieTypes = [
  {
    icon: Cookie,
    title: "คุกกี้ที่จำเป็น",
    description: "จำเป็นสำหรับการทำงานพื้นฐานของเว็บไซต์",
    examples: ["การเข้าสู่ระบบ", "ตะกร้าสินค้า", "ความปลอดภัย"],
    required: true
  },
  {
    icon: Settings,
    title: "คุกกี้การทำงาน",
    description: "จดจำการตั้งค่าและความชอบของคุณ",
    examples: ["ภาษา", "ธีมสี", "การตั้งค่าการแสดงผล"],
    required: false
  },
  {
    icon: BarChart3,
    title: "คุกกี้เชิงวิเคราะห์",
    description: "ช่วยให้เราเข้าใจการใช้งานของผู้เยี่ยมชม",
    examples: ["Google Analytics", "การวัดผลการใช้งาน", "พฤติกรรมผู้ใช้"],
    required: false
  },
  {
    icon: Target,
    title: "คุกกี้การตลาด",
    description: "ใช้แสดงโฆษณาที่เกี่ยวข้องกับคุณ",
    examples: ["Facebook Pixel", "Google Ads", "Retargeting"],
    required: false
  }
];

export default function Cookies() {
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
            <Badge className="mb-4">อัปเดตล่าสุด: 1 มกราคม 2567</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-up">
              นโยบายคุกกี้
            </h1>
            <p className="text-xl text-white/80 animate-fade-in-delay-1">
              ทำความเข้าใจว่าเราใช้คุกกี้อย่างไรเพื่อปรับปรุงประสบการณ์ของคุณ
            </p>
          </div>
        </div>
      </section>

      {/* Cookie Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">ประเภทของคุกกี้ที่เราใช้</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              เราใช้คุกกี้หลายประเภทเพื่อวัตถุประสงค์ที่แตกต่างกัน 
              คุณสามารถควบคุมการใช้งานบางประเภทได้
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12">
            {cookieTypes.map((type, index) => (
              <Card key={type.title} className={`glass-card hover-lift animate-fade-in-delay-${index + 1}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <type.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{type.title}</h3>
                        {type.required && (
                          <Badge variant="outline" className="text-xs">จำเป็น</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {type.description}
                      </p>
                      <div className="space-y-1">
                        <p className="text-xs font-medium">ตัวอย่าง:</p>
                        {type.examples.map((example) => (
                          <p key={example} className="text-xs text-muted-foreground">
                            • {example}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Content */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="glass-card">
              <CardContent className="p-8 md:p-12">
                <div className="prose prose-lg max-w-none">
                  <h2 className="text-2xl font-bold mb-4">1. คุกกี้คืออะไร?</h2>
                  <p className="text-muted-foreground mb-6">
                    คุกกี้ (Cookies) คือไฟล์ข้อความขนาดเล็กที่เว็บไซต์บันทึกลงในอุปกรณ์ของคุณเมื่อคุณเข้าเยี่ยมชม 
                    คุกกี้ช่วยให้เว็บไซต์จดจำข้อมูลเกี่ยวกับการเยี่ยมชมของคุณ เช่น ภาษาที่เลือก 
                    และการตั้งค่าอื่นๆ ซึ่งทำให้การเข้าชมครั้งต่อไปง่ายขึ้นและเว็บไซต์มีประโยชน์มากขึ้น
                  </p>

                  <h2 className="text-2xl font-bold mb-4">2. เราใช้คุกกี้เพื่ออะไร?</h2>
                  
                  <h3 className="text-xl font-semibold mb-3">2.1 คุกกี้ที่จำเป็น (Essential Cookies)</h3>
                  <p className="text-muted-foreground mb-4">
                    คุกกี้เหล่านี้จำเป็นสำหรับการทำงานของเว็บไซต์และไม่สามารถปิดได้:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                    <li><strong>Session Cookies:</strong> จดจำการเข้าสู่ระบบและตะกร้าสินค้า</li>
                    <li><strong>Security Cookies:</strong> ตรวจจับและป้องกันการใช้งานที่ผิดปกติ</li>
                    <li><strong>Load Balancing:</strong> กระจายโหลดเพื่อความเสถียรของระบบ</li>
                    <li>อายุการใช้งาน: สิ้นสุดเมื่อปิดเบราว์เซอร์หรือ 1 ปี</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">2.2 คุกกี้การทำงาน (Functional Cookies)</h3>
                  <p className="text-muted-foreground mb-4">
                    คุกกี้เหล่านี้ช่วยปรับปรุงการทำงานและความสะดวกในการใช้งาน:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                    <li>จดจำภาษาที่เลือก</li>
                    <li>บันทึกธีมสี (โหมดสว่าง/มืด)</li>
                    <li>จดจำความชอบในการแสดงผล</li>
                    <li>บันทึกความคืบหน้าในวิดีโอ</li>
                    <li>อายุการใช้งาน: 1 ปี</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">2.3 คุกกี้เชิงวิเคราะห์ (Analytics Cookies)</h3>
                  <p className="text-muted-foreground mb-4">
                    เราใช้คุกกี้เหล่านี้เพื่อเข้าใจว่าผู้ใช้โต้ตอบกับเว็บไซต์อย่างไร:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                    <li><strong>Google Analytics:</strong> วิเคราะห์การเข้าชมและพฤติกรรม</li>
                    <li><strong>Hotjar:</strong> บันทึกการใช้งานเพื่อปรับปรุง UX</li>
                    <li>วัดประสิทธิภาพของหน้าเว็บ</li>
                    <li>ติดตามแหล่งที่มาของผู้เยี่ยมชม</li>
                    <li>อายุการใช้งาน: 2 ปี</li>
                  </ul>
                  <p className="text-muted-foreground mb-6">
                    ข้อมูลที่รวบรวมจะถูกทำให้ไม่สามารถระบุตัวตนได้และใช้เพื่อวัตถุประสงค์ทางสถิติเท่านั้น
                  </p>

                  <h3 className="text-xl font-semibold mb-3">2.4 คุกกี้การตลาด (Marketing Cookies)</h3>
                  <p className="text-muted-foreground mb-4">
                    คุกกี้เหล่านี้ใช้เพื่อแสดงโฆษณาที่เกี่ยวข้องกับคุณ:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                    <li><strong>Facebook Pixel:</strong> แสดงโฆษณาที่เกี่ยวข้องบน Facebook</li>
                    <li><strong>Google Ads:</strong> ติดตามประสิทธิภาพของโฆษณา</li>
                    <li><strong>Retargeting:</strong> แสดงโฆษณาให้ผู้เยี่ยมชมเก่า</li>
                    <li>วัดผล ROI ของแคมเปญการตลาด</li>
                    <li>อายุการใช้งาน: 1 ปี</li>
                  </ul>

                  <h2 className="text-2xl font-bold mb-4">3. คุกกี้บุคคลที่สาม (Third-Party Cookies)</h2>
                  <p className="text-muted-foreground mb-4">
                    เราใช้บริการจากบุคคลที่สามที่อาจตั้งคุกกี้บนเว็บไซต์ของเรา:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                    <li><strong>Google Analytics:</strong> วิเคราะห์การใช้งาน</li>
                    <li><strong>Facebook:</strong> Social plugins และโฆษณา</li>
                    <li><strong>YouTube:</strong> วิดีโอที่ฝังตัว</li>
                    <li><strong>Payment Gateways:</strong> การชำระเงินที่ปลอดภัย</li>
                  </ul>
                  <p className="text-muted-foreground mb-6">
                    คุกกี้เหล่านี้อยู่ภายใต้นโยบายความเป็นส่วนตัวของบริษัทที่สาม 
                    เราไม่สามารถควบคุมหรือรับผิดชอบต่อคุกกี้เหล่านี้ได้
                  </p>

                  <h2 className="text-2xl font-bold mb-4">4. การจัดการคุกกี้</h2>
                  <p className="text-muted-foreground mb-4">
                    คุณสามารถควบคุมและจัดการคุกกี้ได้หลายวิธี:
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-3">4.1 การตั้งค่าบนเว็บไซต์</h3>
                  <p className="text-muted-foreground mb-4">
                    คุณสามารถเลือกประเภทของคุกกี้ที่ยอมรับได้จากแบนเนอร์ที่แสดงเมื่อเข้าเว็บไซต์ครั้งแรก 
                    หรือเปลี่ยนการตั้งค่าได้ทุกเวลาใน:
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg mb-6">
                    <Button className="glow-on-hover">
                      <Settings className="h-4 w-4 mr-2" />
                      จัดการการตั้งค่าคุกกี้
                    </Button>
                  </div>

                  <h3 className="text-xl font-semibold mb-3">4.2 การตั้งค่าเบราว์เซอร์</h3>
                  <p className="text-muted-foreground mb-4">
                    เบราว์เซอร์ส่วนใหญ่อนุญาตให้คุณควบคุมคุกกี้ผ่านการตั้งค่า:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                    <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies</li>
                    <li><strong>Firefox:</strong> Preferences → Privacy & Security → Cookies</li>
                    <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
                    <li><strong>Edge:</strong> Settings → Privacy → Cookies</li>
                  </ul>
                  <p className="text-muted-foreground mb-6">
                    <strong>หมายเหตุ:</strong> การปิดคุกกี้บางประเภทอาจส่งผลต่อการทำงานของเว็บไซต์ 
                    เช่น การไม่สามารถเข้าสู่ระบบหรือจดจำตะกร้าสินค้า
                  </p>

                  <h3 className="text-xl font-semibold mb-3">4.3 เครื่องมือปิดการติดตาม</h3>
                  <p className="text-muted-foreground mb-6">
                    คุณสามารถใช้เครื่องมือเหล่านี้เพื่อจัดการการติดตาม:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                    <li><a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics Opt-out Browser Add-on</a></li>
                    <li><a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Your Online Choices</a></li>
                    <li><a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Network Advertising Initiative</a></li>
                  </ul>

                  <h2 className="text-2xl font-bold mb-4">5. การเปลี่ยนแปลงนโยบาย</h2>
                  <p className="text-muted-foreground mb-6">
                    เราอาจปรับปรุงนโยบายคุกกี้นี้เป็นครั้งคราว 
                    การเปลี่ยนแปลงจะมีผลทันทีเมื่อเผยแพร่บนหน้านี้ 
                    เราจะแจ้งให้ทราบหากมีการเปลี่ยนแปลงสำคัญ
                  </p>

                  <h2 className="text-2xl font-bold mb-4">6. ติดต่อเรา</h2>
                  <p className="text-muted-foreground mb-4">
                    หากมีคำถามเกี่ยวกับการใช้คุกกี้ กรุณาติดต่อ:
                  </p>
                  <div className="bg-muted/50 p-6 rounded-lg">
                    <p className="text-muted-foreground mb-2">
                      <strong>อีเมล:</strong> nakdev23@gmail.com
                    </p>
                    <p className="text-muted-foreground">
                      <strong>เว็บไซต์:</strong> nakdevtraining.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="glass-card">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-4 text-center">เอกสารที่เกี่ยวข้อง</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button variant="outline" onClick={() => window.location.href = '/privacy'}>
                    นโยบายความเป็นส่วนตัว
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = '/terms'}>
                    ข้อกำหนดการใช้งาน
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = '/faq'}>
                    คำถามที่พบบ่อย
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}