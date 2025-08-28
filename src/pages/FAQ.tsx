import { useState } from "react";
import { Search, Plus, Minus, ChevronDown, ChevronRight, MessageCircle, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const faqCategories = [
  { id: "general", name: "ทั่วไป", count: 8 },
  { id: "payment", name: "การชำระเงิน", count: 6 },
  { id: "courses", name: "คอร์สเรียน", count: 12 },
  { id: "technical", name: "ปัญหาทางเทคนิค", count: 5 },
  { id: "certificate", name: "ใบประกาศนียบัตร", count: 4 }
];

const faqs = [
  {
    id: 1,
    category: "general",
    question: "ฉันจำเป็นต้องมีพื้นฐานการเขียนโปรแกรมก่อนหรือไม่?",
    answer: "ไม่จำเป็นครับ คอร์สของเราออกแบบมาให้เหมาะกับผู้เริ่มต้น เราจะเริ่มสอนตั้งแต่พื้นฐานที่สุด รวมถึงการติดตั้งโปรแกรมและเครื่องมือที่จำเป็น คุณเพียงแค่มีความกระตือรือร้นที่จะเรียนรู้ก็เพียงพอแล้ว",
    helpful: 45,
    views: 1250
  },
  {
    id: 2,
    category: "courses",
    question: "คอร์สเรียนมีอายุการใช้งานหรือไม่?",
    answer: "คอร์สทั้งหมดของเราให้เข้าถึงได้ตลอดชีวิต เมื่อคุณซื้อคอร์สแล้ว คุณสามารถดูซ้ำได้ไม่จำกัด และยังได้รับอัปเดตเนื้อหาใหม่ๆ ฟรีด้วย",
    helpful: 38,
    views: 890
  },
  {
    id: 3,
    category: "payment",
    question: "ระบบชำระเงินมีวิธีไหนบ้าง?",
    answer: "เรารับชำระเงินผ่านบัตรเครดิต/เดบิต, โอนเงินผ่านธนาคาร, PromptPay และ TrueMoney Wallet คุณสามารถเลือกวิธีที่สะดวกที่สุดสำหรับคุณได้",
    helpful: 42,
    views: 670
  },
  {
    id: 4,
    category: "courses",
    question: "หากฉันไม่เข้าใจบางส่วนของคอร์ส จะมีการสนับสนุนหรือไม่?",
    answer: "แน่นอนครับ เรามีชุมชนนักเรียนและผู้สอนที่พร้อมช่วยเหลือ คุณสามารถถามคำถามได้ในระบบ Q&A ของแต่ละบทเรียน หรือในกลุ่ม Facebook ของเรา ผู้สอนจะตอบคำถามภายใน 24 ชั่วโมง",
    helpful: 52,
    views: 1100
  },
  {
    id: 5,
    category: "certificate",
    question: "ใบประกาศนียบัตรมีความน่าเชื่อถือหรือไม่?",
    answer: "ใบประกาศนียบัตรของเราได้รับการรับรองจากสมาคมผู้ประกอบการเทคโนโลยีไทย และสามารถใช้ประกอบการสมัครงานได้ โดยมีบริษัทพันธมิตรกว่า 200 แห่งที่ยอมรับใบประกาศนียบัตรของเรา",
    helpful: 67,
    views: 1580
  },
  {
    id: 6,
    category: "technical",
    question: "วิดีโอไม่เล่น หรือมีปัญหาการโหลด",
    answer: "หากพบปัญหาเรื่องวิดีโอ กรุณาลองทำตามขั้นตอนนี้: 1) รีเฟรชหน้าเว็บ 2) ล้าง Cache ของ Browser 3) เปลี่ยน Browser 4) ตรวจสอบความเร็วอินเทอร์เน็ต หากยังมีปัญหา กรุณาติดต่อทีมซัพพอร์ต",
    helpful: 31,
    views: 450
  },
  {
    id: 7,
    category: "general",
    question: "มีการรับประกันคืนเงินหรือไม่?",
    answer: "เรามีนโยบายรับประกันคืนเงิน 100% ภายใน 30 วัน หากคุณไม่พึงพอใจกับคอร์สเรียน โดยไม่มีเงื่อนไขใดๆ เพียงแค่แจ้งทีมซัพพอร์ตเท่านั้น",
    helpful: 28,
    views: 520
  },
  {
    id: 8,
    category: "courses",
    question: "สามารถดาวน์โหลดวิดีโอไปดูออฟไลน์ได้หรือไม่?",
    answer: "ขณะนี้เรายังไม่เปิดให้ดาวน์โหลดวิดีโอ แต่คุณสามารถดูออนไลน์ได้ทุกที่ ทุกเวลา ผ่านเว็บไซต์หรือแอปพลิเคชันของเรา เรากำลังพัฒนาฟีเจอร์ดาวน์โหลดสำหรับดูออฟไลน์และจะเปิดให้ใช้ในเร็วๆ นี้",
    helpful: 22,
    views: 380
  }
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (itemId: number) => {
    setOpenItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const markHelpful = (faqId: number) => {
    // This would typically update the helpful count in a database
    console.log(`Marked FAQ ${faqId} as helpful`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-hero-gradient py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="gradient-blob"></div>
          <div className="gradient-blob"></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-up">
              คำถามที่พบบ่อย
            </h1>
            <p className="text-xl text-white/80 mb-8 animate-fade-in-delay-1">
              หาคำตอบสำหรับคำถามยอดนิยม หรือติดต่อทีมซัพพอร์ตของเรา
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto animate-fade-in-delay-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
              <Input
                placeholder="ค้นหาคำถาม..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className={selectedCategory === "all" ? "glow-on-hover" : ""}
            >
              ทั้งหมด ({faqs.length})
            </Button>
            {faqCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "glow-on-hover" : ""}
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-muted-foreground">
                พบ {filteredFaqs.length} คำถาม
                {searchQuery && ` สำหรับ "${searchQuery}"`}
              </p>
            </div>

            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                <Card key={faq.id} className="glass-card">
                  <Collapsible
                    open={openItems.includes(faq.id)}
                    onOpenChange={() => toggleItem(faq.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="badge-level text-xs">
                                {faqCategories.find(cat => cat.id === faq.category)?.name}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {faq.views.toLocaleString()} ครั้งที่ดู
                              </span>
                            </div>
                            <CardTitle className="text-lg">{faq.question}</CardTitle>
                          </div>
                          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${
                            openItems.includes(faq.id) ? 'rotate-180' : ''
                          }`} />
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="prose max-w-none mb-4">
                          <p className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markHelpful(faq.id)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              มีประโยชน์ ({faq.helpful})
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              แสดงความคิดเห็น
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-20">
                <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-16 w-16 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">ไม่พบคำถามที่ค้นหา</h3>
                <p className="text-muted-foreground mb-6">
                  ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}>
                  ล้างตัวกรอง
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">ไม่พบคำตอบที่ต้องการ?</h2>
            <p className="text-muted-foreground mb-8">
              ทีมซัพพอร์ตของเราพร้อมช่วยเหลือคุณตลอด 24 ชั่วโมง
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="glow-on-hover">
                <MessageCircle className="h-5 w-5 mr-2" />
                แชทสด
              </Button>
              <Button size="lg" variant="outline">
                ส่งอีเมล
              </Button>
            </div>
            <div className="mt-6 text-sm text-muted-foreground">
              ตอบกลับเฉลี่ย: น้อยกว่า 2 ชั่วโมง
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}