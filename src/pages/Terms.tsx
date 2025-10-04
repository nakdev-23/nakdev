import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Terms() {
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
              ข้อกำหนดการใช้งาน
            </h1>
            <p className="text-xl text-white/80 animate-fade-in-delay-1">
              กรุณาอ่านข้อกำหนดการใช้งานอย่างละเอียดก่อนใช้บริการของเรา
            </p>
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
                  <h2 className="text-2xl font-bold mb-4">1. การยอมรับข้อกำหนด</h2>
                  <p className="text-muted-foreground mb-6">
                    การเข้าใช้งานเว็บไซต์ นัก dev ฝึกหัด (nakdevtraining.com) ถือว่าคุณยอมรับและตกลงที่จะปฏิบัติตามข้อกำหนดการใช้งานนี้ทุกประการ 
                    หากคุณไม่เห็นด้วยกับข้อกำหนดใดๆ กรุณาหยุดการใช้งานเว็บไซต์ทันที
                  </p>

                  <h2 className="text-2xl font-bold mb-4">2. การใช้งานบริการ</h2>
                  <h3 className="text-xl font-semibold mb-3">2.1 การสมัครสมาชิก</h3>
                  <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                    <li>คุณต้องมีอายุอย่างน้อย 13 ปีในการสมัครสมาชิก</li>
                    <li>ข้อมูลที่ให้ไว้ต้องถูกต้องและเป็นปัจจุบัน</li>
                    <li>คุณรับผิดชอบในการรักษาความปลอดภัยของบัญชีของคุณ</li>
                    <li>ห้ามแชร์บัญชีหรือข้อมูลเข้าสู่ระบบกับผู้อื่น</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">2.2 การใช้งานคอร์สเรียน</h3>
                  <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                    <li>คอร์สเรียนมีไว้สำหรับการใช้งานส่วนบุคคลเท่านั้น</li>
                    <li>ห้ามทำสำเนา แจกจ่าย หรือนำไปใช้เชิงพาณิชย์</li>
                    <li>ห้ามดาวน์โหลดหรือแชร์เนื้อหาคอร์สโดยไม่ได้รับอนุญาต</li>
                    <li>เราขอสงวนสิทธิ์ในการเปลี่ยนแปลงเนื้อหาคอร์สเพื่อปรับปรุงคุณภาพ</li>
                  </ul>

                  <h2 className="text-2xl font-bold mb-4">3. ทรัพย์สินทางปัญญา</h2>
                  <p className="text-muted-foreground mb-4">
                    เนื้อหาทั้งหมดบนเว็บไซต์ รวมถึงแต่ไม่จำกัดเพียง ข้อความ รูปภาพ วิดีโอ โค้ด และเอกสาร 
                    เป็นทรัพย์สินของ นัก dev ฝึกหัด หรือผู้ให้ใบอนุญาต ได้รับความคุ้มครองตามกฎหมายทรัพย์สินทางปัญญา
                  </p>
                  <p className="text-muted-foreground mb-6">
                    การละเมิดลิขสิทธิ์อาจส่งผลให้บัญชีของคุณถูกระงับหรือยกเลิกโดยไม่ต้องแจ้งให้ทราบล่วงหน้า
                    และอาจมีความรับผิดตามกฎหมาย
                  </p>

                  <h2 className="text-2xl font-bold mb-4">4. การชำระเงินและการคืนเงิน</h2>
                  <h3 className="text-xl font-semibold mb-3">4.1 ราคาและการชำระเงิน</h3>
                  <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                    <li>ราคาทั้งหมดเป็นสกุลเงินบาทไทย (THB) รวม VAT 7%</li>
                    <li>เราขอสงวนสิทธิ์ในการเปลี่ยนแปลงราคาโดยไม่ต้องแจ้งให้ทราบล่วงหน้า</li>
                    <li>การชำระเงินจะดำเนินการผ่านระบบชำระเงินที่ปลอดภัย</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">4.2 นโยบายการคืนเงิน</h3>
                  <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                    <li>คืนเงิน 100% ภายใน 30 วัน หากไม่พึงพอใจ</li>
                    <li>ต้องดูเนื้อหาไม่เกิน 30% ของคอร์ส</li>
                    <li>ไม่สามารถคืนเงินหลังจากผ่าน 30 วัน</li>
                    <li>ระยะเวลาในการคืนเงิน 7-14 วันทำการ</li>
                  </ul>

                  <h2 className="text-2xl font-bold mb-4">5. ความรับผิดชอบและข้อจำกัด</h2>
                  <p className="text-muted-foreground mb-4">
                    เนื้อหาที่นำเสนอมีไว้เพื่อการศึกษาเท่านั้น เราไม่รับประกันผลลัพธ์ใดๆ จากการใช้ความรู้ที่ได้รับ 
                    ความสำเร็จขึ้นอยู่กับความพยายามและความสามารถของแต่ละบุคคล
                  </p>
                  <p className="text-muted-foreground mb-6">
                    เราไม่รับผิดชอบต่อความเสียหายใดๆ ที่เกิดจากการใช้งานเว็บไซต์หรือเนื้อหา 
                    รวมถึงความเสียหายทางตรง ทางอ้อม หรือความเสียหายต่อเนื่อง
                  </p>

                  <h2 className="text-2xl font-bold mb-4">6. การระงับบัญชี</h2>
                  <p className="text-muted-foreground mb-4">
                    เราขอสงวนสิทธิ์ในการระงับหรือยกเลิกบัญชีของคุณทันทีโดยไม่ต้องแจ้งให้ทราบล่วงหน้า หากพบว่า:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                    <li>ละเมิดข้อกำหนดการใช้งาน</li>
                    <li>ใช้บริการโดยมิชอบ</li>
                    <li>แชร์หรือขายบัญชี</li>
                    <li>ดาวน์โหลดหรือแจกจ่ายเนื้อหาโดยไม่ได้รับอนุญาต</li>
                  </ul>

                  <h2 className="text-2xl font-bold mb-4">7. การเปลี่ยนแปลงข้อกำหนด</h2>
                  <p className="text-muted-foreground mb-6">
                    เราขอสงวนสิทธิ์ในการเปลี่ยนแปลงข้อกำหนดการใช้งานนี้ได้ตลอดเวลา 
                    การเปลี่ยนแปลงจะมีผลทันทีเมื่อเผยแพร่บนเว็บไซต์ 
                    การใช้งานต่อไปถือว่าคุณยอมรับข้อกำหนดที่เปลี่ยนแปลง
                  </p>

                  <h2 className="text-2xl font-bold mb-4">8. กฎหมายที่ใช้บังคับ</h2>
                  <p className="text-muted-foreground mb-6">
                    ข้อกำหนดนี้อยู่ภายใต้กฎหมายไทย ข้อพิพาทใดๆ จะอยู่ในเขตอำนาจของศาลไทย
                  </p>

                  <h2 className="text-2xl font-bold mb-4">9. ติดต่อเรา</h2>
                  <p className="text-muted-foreground mb-2">
                    หากมีคำถามเกี่ยวกับข้อกำหนดการใช้งาน กรุณาติดต่อ:
                  </p>
                  <ul className="list-none text-muted-foreground space-y-2">
                    <li>อีเมล: nakdev23@gmail.com</li>
                    <li>เว็บไซต์: nakdevtraining.com</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}