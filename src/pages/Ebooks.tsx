import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, BookOpen, Download, Eye, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ebookCategories = [
  { id: "all", name: "ทั้งหมด" },
  { id: "javascript", name: "JavaScript" },
  { id: "react", name: "React" },
  { id: "design", name: "Design" },
  { id: "career", name: "Career Guide" },
  { id: "fundamentals", name: "พื้นฐาน" }
];

const ebooks = [
  {
    id: "javascript-complete",
    title: "คู่มือ JavaScript ฉบับสมบูรณ์",
    description: "เรียนรู้ JavaScript จากพื้นฐานจนถึงขั้นสูง ครอบคลุมทุกสิ่งที่นักพัฒนาต้องรู้",
    price: 0,
    originalPrice: 690,
    pages: 250,
    readTime: "8 ชั่วโมง",
    category: "javascript",
    rating: 4.9,
    downloads: 5200,
    featured: true,
    tags: ["JavaScript", "ES6", "Fundamentals"]
  },
  {
    id: "react-patterns",
    title: "React Design Patterns",
    description: "รูปแบบการออกแบบและเทคนิคขั้นสุดสำหรับ React Developers",
    price: 490,
    pages: 180,
    readTime: "6 ชั่วโมง",
    category: "react",
    rating: 4.8,
    downloads: 1200,
    tags: ["React", "Design Patterns", "Best Practices"]
  },
  {
    id: "frontend-guide",
    title: "Frontend Developer Roadmap",
    description: "แนวทางการเป็น Frontend Developer มืออาชีพในปี 2024",
    price: 0,
    pages: 120,
    readTime: "4 ชั่วโมง",
    category: "career",
    rating: 4.7,
    downloads: 3800,
    tags: ["Career", "Frontend", "Roadmap"]
  },
  {
    id: "ui-design-basics",
    title: "UI Design สำหรับนักพัฒนา",
    description: "หลักการออกแบบ UI ที่นักพัฒนาควรรู้ เพื่อสร้างแอปที่ใช้งานง่าย",
    price: 390,
    pages: 160,
    readTime: "5 ชั่วโมง",
    category: "design",
    rating: 4.6,
    downloads: 890,
    tags: ["UI", "Design", "UX"]
  },
  {
    id: "api-development",
    title: "การพัฒนา API สมัยใหม่",
    description: "เรียนรู้การสร้าง RESTful API และ GraphQL ที่มีประสิทธิภาพ",
    price: 590,
    pages: 200,
    readTime: "7 ชั่วโมง",
    category: "fundamentals",
    rating: 4.5,
    downloads: 650,
    tags: ["API", "REST", "GraphQL"]
  },
  {
    id: "typescript-mastery",
    title: "TypeScript Mastery",
    description: "เชี่ยวชาญ TypeScript จากเริ่มต้นจนถึงเทคนิคซับซ้อน",
    price: 0,
    pages: 220,
    readTime: "8 ชั่วโมง",
    category: "javascript",
    rating: 4.8,
    downloads: 2100,
    featured: true,
    tags: ["TypeScript", "JavaScript", "Types"]
  }
];

export default function Ebooks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  const filteredEbooks = ebooks.filter(ebook => {
    const matchesSearch = ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ebook.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ebook.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === "all" || ebook.category === categoryFilter;
    
    const matchesPrice = priceFilter === "all" || 
                        (priceFilter === "free" && ebook.price === 0) ||
                        (priceFilter === "paid" && ebook.price > 0);

    return matchesSearch && matchesCategory && matchesPrice;
  });

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
              eBook และคู่มือ
            </h1>
            <p className="text-xl text-white/80 mb-8 animate-fade-in-delay-1">
              คลังความรู้ครบครันในรูปแบบ eBook ที่อ่านง่ายและทำความเข้าใจได้เร็ว
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto animate-fade-in-delay-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
              <Input
                placeholder="ค้นหา eBook..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured eBooks */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">eBook แนะนำ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ebooks.filter(ebook => ebook.featured).map((ebook) => (
              <Card key={ebook.id} className="glass-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="w-24 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          แนะนำ
                        </Badge>
                        <Badge variant="outline" className={ebook.price === 0 ? "badge-free" : "badge-paid"}>
                          {ebook.price === 0 ? "ฟรี" : `฿${ebook.price}`}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{ebook.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{ebook.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span>{ebook.pages} หน้า</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {ebook.readTime}
                        </span>
                        <span>⭐ {ebook.rating}</span>
                      </div>
                      <Button className="w-full" asChild>
                        <Link to={`/ebooks/${ebook.id}`}>
                          {ebook.price === 0 ? "อ่านฟรี" : "ดูรายละเอียด"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Filters & All eBooks */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="หมวดหมู่" />
              </SelectTrigger>
              <SelectContent>
                {ebookCategories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="ราคา" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกราคา</SelectItem>
                <SelectItem value="free">ฟรี</SelectItem>
                <SelectItem value="paid">เสียเงิน</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 text-muted-foreground ml-auto">
              <span>พบ {filteredEbooks.length} เล่ม</span>
            </div>
          </div>

          {/* eBooks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEbooks.map((ebook) => (
              <Card key={ebook.id} className="glass-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex gap-4 mb-4">
                    <div className="w-16 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded flex-shrink-0 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={ebook.price === 0 ? "badge-free" : "badge-paid"}>
                          {ebook.price === 0 ? "ฟรี" : `฿${ebook.price}`}
                        </Badge>
                        {ebook.originalPrice && ebook.price === 0 && (
                          <span className="text-xs text-muted-foreground line-through">
                            ฿{ebook.originalPrice}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold mb-1 line-clamp-2">{ebook.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{ebook.pages} หน้า</span>
                        <span>•</span>
                        <span>⭐ {ebook.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {ebook.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      {ebook.downloads.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {ebook.readTime}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {ebook.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1" asChild>
                      <Link to={`/ebooks/${ebook.id}`}>
                        {ebook.price === 0 ? "อ่านฟรี" : "รายละเอียด"}
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEbooks.length === 0 && (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-16 w-16 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">ไม่พบ eBook ที่ค้นหา</h3>
              <p className="text-muted-foreground mb-6">
                ลองเปลี่ยนคำค้นหาหรือปรับเงื่อนไขการกรอง
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setCategoryFilter("all");
                setPriceFilter("all");
              }}>
                ล้างตัวกรอง
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}