import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Download, ExternalLink, Code2, Palette, Zap, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const toolCategories = [
  { id: "all", name: "ทั้งหมด", icon: Filter },
  { id: "template", name: "เทมเพลต", icon: FileText },
  { id: "ui", name: "UI Components", icon: Palette },
  { id: "automation", name: "เครื่องมืออัตโนมัติ", icon: Zap },
  { id: "development", name: "Development", icon: Code2 }
];

const tools = [
  {
    id: "react-starter",
    title: "React Starter Template",
    description: "เทมเพลต React ที่พร้อมใช้งาน มาพร้อม TypeScript, Tailwind CSS, และ ESLint",
    price: 0,
    category: "template",
    downloadCount: 2450,
    rating: 4.9,
    tags: ["React", "TypeScript", "Tailwind"],
    featured: true
  },
  {
    id: "api-client",
    title: "API Client Generator",
    description: "เครื่องมือสร้าง API client อัตโนมัติจาก OpenAPI/Swagger specification",
    price: 590,
    category: "automation",
    downloadCount: 1200,
    rating: 4.7,
    tags: ["API", "TypeScript", "OpenAPI"]
  },
  {
    id: "ui-components",
    title: "Modern UI Components",
    description: "ชุด UI Components สำเร็จรูปที่ออกแบบสวยงามและใช้งานง่าย",
    price: 990,
    category: "ui",
    downloadCount: 890,
    rating: 4.8,
    tags: ["UI", "Components", "Design System"]
  },
  {
    id: "code-formatter",
    title: "Smart Code Formatter",
    description: "เครื่องมือจัดรูปแบบโค้ดอัตโนมัติที่รองรับหลายภาษา",
    price: 0,
    category: "development",
    downloadCount: 3200,
    rating: 4.6,
    tags: ["Formatter", "Code Quality"]
  },
  {
    id: "dashboard-template",
    title: "Admin Dashboard Template",
    description: "เทมเพลต Admin Dashboard ที่สมบูรณ์พร้อมใช้งาน",
    price: 1490,
    category: "template",
    downloadCount: 560,
    rating: 4.5,
    tags: ["Dashboard", "Admin Panel", "Charts"]
  },
  {
    id: "color-palette",
    title: "Color Palette Generator",
    description: "เครื่องมือสร้างชุดสีที่สวยงามสำหรับโปรเจค",
    price: 0,
    category: "ui",
    downloadCount: 1800,
    rating: 4.4,
    tags: ["Colors", "Design", "Palette"]
  }
];

export default function Tools() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === "all" || tool.category === categoryFilter;
    
    const matchesPrice = priceFilter === "all" || 
                        (priceFilter === "free" && tool.price === 0) ||
                        (priceFilter === "paid" && tool.price > 0);

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
              เครื่องมือช่วยเหลือ
            </h1>
            <p className="text-xl text-white/80 mb-8 animate-fade-in-delay-1">
              เครื่องมือและเทมเพลตคุณภาพสูงที่จะช่วยเพิ่มประสิทธิภาพการทำงานของคุณ
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto animate-fade-in-delay-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
              <Input
                placeholder="ค้นหาเครื่องมือ..."
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
            {toolCategories.map((category) => (
              <Button
                key={category.id}
                variant={categoryFilter === category.id ? "default" : "outline"}
                className={`flex items-center gap-2 ${
                  categoryFilter === category.id ? "glow-on-hover" : ""
                }`}
                onClick={() => setCategoryFilter(category.id)}
              >
                <category.icon className="h-4 w-4" />
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Filters & Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
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
              <span>พบ {filteredTools.length} เครื่องมือ</span>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTools.map((tool) => (
              <Card key={tool.id} className={`glass-card hover-lift ${tool.featured ? 'ring-2 ring-primary/20' : ''}`}>
                <CardContent className="p-6">
                  {tool.featured && (
                    <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">
                      ยอดนิยม
                    </Badge>
                  )}
                  
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="badge-level text-xs">
                      {toolCategories.find(cat => cat.id === tool.category)?.name}
                    </Badge>
                    <Badge variant="outline" className={tool.price === 0 ? "badge-free" : "badge-paid"}>
                      {tool.price === 0 ? "ฟรี" : `฿${tool.price.toLocaleString()}`}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {tool.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      {tool.downloadCount.toLocaleString()}
                    </span>
                    <span>⭐ {tool.rating}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {tool.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1" asChild>
                      <Link to={`/tools/${tool.id}`}>
                        ดูรายละเอียด
                      </Link>
                    </Button>
                    {tool.price === 0 && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-16 w-16 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">ไม่พบเครื่องมือที่ค้นหา</h3>
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

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">ไม่พบเครื่องมือที่ต้องการ?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            แจ้งความต้องการของคุณให้เราทราบ เราจะพัฒนาเครื่องมือที่ตรงกับความต้องการของคุณ
          </p>
          <Button size="lg" className="glow-on-hover">
            แจ้งความต้องการ
            <ExternalLink className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}