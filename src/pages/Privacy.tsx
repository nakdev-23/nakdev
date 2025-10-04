import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, Lock, UserCheck, Database, AlertCircle } from "lucide-react";

const privacyFeatures = [
  {
    icon: Shield,
    title: "ความปลอดภัย",
    description: "ข้อมูลของคุณได้รับการเข้ารหัสและปกป้องด้วยมาตรฐานสากล"
  },
  {
    icon: Lock,
    title: "การควบคุม",
    description: "คุณสามารถควบคุมข้อมูลส่วนตัวและการตั้งค่าความเป็นส่วนตัวได้"
  },
  {
    icon: Eye,
    title: "ความโปร่งใส",
    description: "เราแจ้งให้ทราบอย่างชัดเจนว่าเราเก็บและใช้ข้อมูลอย่างไร"
  },
  {
    icon: UserCheck,
    title: "สิทธิของคุณ",
    description: "คุณมีสิทธิ์ในการเข้าถึง แก้ไข หรือลบข้อมูลของคุณ"
  }
];

export default function Privacy() {
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
              นโยบายความเป็นส่วนตัว
            </h1>
            <p className="text-xl text-white/80 animate-fade-in-delay-1">
              เราให้ความสำคัญกับความเป็นส่วนตัวและการปกป้องข้อมูลของคุณ
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Features */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {privacyFeatures.map((feature, index) => (
              <Card key={feature.title} className={`glass-card hover-lift animate-fade-in-delay-${index + 1}`}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="glass-card">
              <CardContent className="p-8 md:p-12">
                <div className="prose prose-lg max-w-none">
                  <h2 className="text-2xl font-bold mb-4">1. ข้อมูลที่เราเก็บรวบรวม</h2>
                  
                  <h3 className="text-xl font-semibold mb-3">1.1 ข้อมูลที่คุณให้เรา</h3>
                  <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                    <li><strong>ข้อมูลส่วนตัว:</strong> ชื่อ, อีเมล, เบอร์โทรศัพท์</li>
                    <li><strong>ข้อมูลการชำระเงิน:</strong> ข้อมูลบัตรเครดิต/เดบิต (ผ่าน Payment Gateway ที่ปลอดภัย)</li>
                    <li><strong>ข้อมูลโปรไฟล์:</strong> รูปภาพ, ประวัติการศึกษา, ความสนใจ</li>
                    <li><strong>เนื้อหาที่สร้าง:</strong> โพสต์, ความคิดเห็น, คำถาม</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">1.2 ข้อมูลที่เก็บอัตโนมัติ</h3>
                  <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                    <li><strong>ข้อมูลการใช้งาน:</strong> หน้าที่เข้าชม, เวลาที่ใช้, คอร์สที่ดู</li>
                    <li><strong>ข้อมูลอุปกรณ์:</strong> ประเภทเบราว์เซอร์, ระบบปฏิบัติการ, IP Address</li>
                    <li><strong>คุกกี้:</strong> เพื่อปรับปรุงประสบการณ์การใช้งาน</li>
                    <li><strong>ข้อมูลการเรียนรู้:</strong> ความก้าวหน้า, คะแนนทดสอบ, ใบประกาศนียบัตร</li>
                  </ul>

                  <h2 className="text-2xl font-bold mb-4">2. วิธีการใช้ข้อมูล</h2>
                  <p className="text-muted-foreground mb-4">เราใช้ข้อมูลของคุณเพื่อ:</p>
                  <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                    <li>ให้บริการและดำเนินการตามคำสั่งซื้อของคุณ</li>
                    <li>ปรับปรุงและพัฒนาคอร์สเรียนและบริการ</li>
                    <li>ส่งการแจ้งเตือนและข้อมูลที่สำคัญ</li>
                    <li>วิเคราะห์การใช้งานเพื่อปรับปรุงประสบการณ์</li>
                    <li>ป้องกันการใช้งานที่ผิดกฎหมายหรือละเมิดข้อกำหนด</li>
                    <li>ส่งข้อเสนอทางการตลาดที่เกี่ยวข้อง (หากคุณอนุญาต)</li>
                  </ul>

                  <h2 className="text-2xl font-bold mb-4">3. การแชร์ข้อมูล</h2>
                  <p className="text-muted-foreground mb-4">
                    เราไม่ขายหรือให้เช่าข้อมูลส่วนตัวของคุณแก่บุคคลที่สาม แต่อาจแชร์ข้อมูลกับ:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                    <li><strong>ผู้ให้บริการ:</strong> บริษัทที่ช่วยดำเนินการด้านเทคนิค การชำระเงิน การส่งอีเมล</li>
                    <li><strong>หน่วยงานราชการ:</strong> เมื่อมีคำสั่งจากกฎหมาย</li>
                    <li><strong>พันธมิตรทางธุรกิจ:</strong> เมื่อได้รับความยินยอมจากคุณ</li>
                    <li><strong>ผู้สอน:</strong> ข้อมูลการเรียนรู้เพื่อปรับปรุงคอร์ส</li>
                  </ul>

                  <h2 className="text-2xl font-bold mb-4">4. ความปลอดภัยของข้อมูล</h2>
                  <p className="text-muted-foreground mb-4">
                    เราใช้มาตรการรักษาความปลอดภัยตามมาตรฐานอุตสาหกรรม:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                    <li>การเข้ารหัสข้อมูลด้วย SSL/TLS</li>
                    <li>การจัดเก็บข้อมูลบนเซิร์ฟเวอร์ที่ปลอดภัย</li>
                    <li>การจำกัดการเข้าถึงข้อมูลเฉพาะพนักงานที่จำเป็น</li>
                    <li>การสำรองข้อมูลสม่ำเสมอ</li>
                    <li>การตรวจสอบและอัปเดตระบบความปลอดภัยอย่างสม่ำเสมอ</li>
                  </ul>

                  <h2 className="text-2xl font-bold mb-4">5. สิทธิของคุณ</h2>
                  <p className="text-muted-foreground mb-4">คุณมีสิทธิ์:</p>
                  <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                    <li><strong>เข้าถึงข้อมูล:</strong> ขอดูข้อมูลส่วนตัวที่เราเก็บไว้</li>
                    <li><strong>แก้ไขข้อมูล:</strong> อัปเดตหรือแก้ไขข้อมูลที่ไม่ถูกต้อง</li>
                    <li><strong>ลบข้อมูล:</strong> ขอให้ลบข้อมูลของคุณ (มีข้อยกเว้นตามกฎหมาย)</li>
                    <li><strong>จำกัดการใช้:</strong> จำกัดวิธีที่เราใช้ข้อมูลของคุณ</li>
                    <li><strong>ถอนความยินยอม:</strong> ยกเลิกการรับอีเมลการตลาดได้ตลอดเวลา</li>
                    <li><strong>โอนย้ายข้อมูล:</strong> ขอรับสำเนาข้อมูลในรูปแบบที่สามารถอ่านได้</li>
                  </ul>

                  <h2 className="text-2xl font-bold mb-4">6. คุกกี้และเทคโนโลยีติดตาม</h2>
                  <p className="text-muted-foreground mb-4">
                    เราใช้คุกกี้และเทคโนโลยีที่คล้ายคลึงกันเพื่อ:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                    <li>จดจำการตั้งค่าของคุณ</li>
                    <li>วิเคราะห์การใช้งานเว็บไซต์</li>
                    <li>ปรับแต่งเนื้อหาตามความสนใจของคุณ</li>
                    <li>แสดงโฆษณาที่เกี่ยวข้อง</li>
                  </ul>
                  <p className="text-muted-foreground mb-6">
                    คุณสามารถจัดการการตั้งค่าคุกกี้ผ่านเบราว์เซอร์ของคุณ 
                    อ่านเพิ่มเติมใน <a href="/cookies" className="text-primary hover:underline">นโยบายคุกกี้</a>
                  </p>

                  <h2 className="text-2xl font-bold mb-4">7. การเก็บรักษาข้อมูล</h2>
                  <p className="text-muted-foreground mb-6">
                    เราจะเก็บรักษาข้อมูลของคุณตราบเท่าที่จำเป็นเพื่อให้บริการ หรือตามที่กฎหมายกำหนด 
                    เมื่อคุณลบบัญชี เราจะลบหรือทำให้ข้อมูลไม่สามารถระบุตัวตนได้ 
                    ยกเว้นข้อมูลที่จำเป็นต้องเก็บไว้ตามกฎหมาย
                  </p>

                  <h2 className="text-2xl font-bold mb-4">8. การเปลี่ยนแปลงนโยบาย</h2>
                  <p className="text-muted-foreground mb-6">
                    เราอาจปรับปรุงนโยบายนี้เป็นครั้งคราว การเปลี่ยนแปลงที่สำคัญจะมีการแจ้งเตือนผ่านอีเมลหรือบนเว็บไซต์ 
                    กรุณาตรวจสอบหน้านี้เป็นประจำ
                  </p>

                  <h2 className="text-2xl font-bold mb-4">9. ติดต่อเรา</h2>
                  <p className="text-muted-foreground mb-4">
                    หากมีคำถามหรือข้อกังวลเกี่ยวกับความเป็นส่วนตัว กรุณาติดต่อ:
                  </p>
                  <div className="bg-muted/50 p-6 rounded-lg">
                    <p className="text-muted-foreground mb-2">
                      <strong>อีเมล:</strong> nakdev23@gmail.com
                    </p>
                    <p className="text-muted-foreground mb-2">
                      <strong>เว็บไซต์:</strong> nakdevtraining.com
                    </p>
                    <p className="text-muted-foreground">
                      <strong>เวลาทำการ:</strong> จันทร์-ศุกร์ 9:00-18:00 น.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Alert Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="glass-card border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <AlertCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">หมายเหตุสำคัญ</h3>
                    <p className="text-muted-foreground">
                      การใช้งานเว็บไซต์ต่อไปถือว่าคุณยอมรับนโยบายความเป็นส่วนตัวนี้ 
                      หากคุณไม่เห็นด้วย กรุณาหยุดการใช้งานและติดต่อเราเพื่อลบข้อมูลของคุณ
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}