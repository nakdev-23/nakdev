import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, BookOpen, Download, Eye, Star, Clock, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEbooks } from "@/hooks/useEbooks";
import { useCart } from "@/hooks/useCart";

const ebookCategories = [
  { id: "all", name: "ทั้งหมด" },
  { id: "javascript", name: "JavaScript" },
  { id: "react", name: "React" },
  { id: "design", name: "Design" },
  { id: "career", name: "Career Guide" },
  { id: "fundamentals", name: "พื้นฐาน" }
];


export default function Ebooks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  
  const { ebooks, isLoading, error } = useEbooks();
  const { addToCart } = useCart();

  const filteredEbooks = ebooks.filter(ebook => {
    const matchesSearch = ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ebook.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPrice = priceFilter === "all" || 
                        (priceFilter === "free" && ebook.price === 0) ||
                        (priceFilter === "paid" && ebook.price > 0);

    return matchesSearch && matchesPrice;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">กำลังโหลด...</h1>
        </div>
      </div>
    );
  }

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
            {ebooks.slice(0, 2).map((ebook) => (
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
                      </div>
                      <Button className="w-full" asChild>
                        <Link to={`/ebooks/${ebook.slug}`}>
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
                      </div>
                      <h3 className="font-semibold mb-1 line-clamp-2">{ebook.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{ebook.pages} หน้า</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {ebook.description}
                  </p>
                  
                  {ebook.price === 0 ? (
                    <Button className="w-full" asChild>
                      <Link to={`/ebooks/${ebook.slug}`}>
                        <Download className="mr-2 h-4 w-4" />
                        อ่านฟรี
                      </Link>
                    </Button>
                  ) : (
                    <Button className="w-full" asChild>
                      <Link to={`/ebooks/${ebook.slug}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        ดูรายละเอียด ฿{ebook.price}
                      </Link>
                    </Button>
                  )}
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