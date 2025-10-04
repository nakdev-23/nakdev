import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Download, ExternalLink, Code2, Palette, Zap, FileText, ShoppingCart, MessageSquare, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTools } from "@/hooks/useTools";
import { useCart } from "@/hooks/useCart";
const toolCategories = [{
  id: "all",
  name: "ทั้งหมด",
  icon: Filter
}, {
  id: "prompt",
  name: "Prompt",
  icon: MessageSquare
}, {
  id: "template",
  name: "เทมเพลต",
  icon: FileText
}, {
  id: "ui",
  name: "UI Components",
  icon: Palette
}, {
  id: "automation",
  name: "เครื่องมืออัตโนมัติ",
  icon: Zap
}, {
  id: "development",
  name: "Development",
  icon: Code2
}];
export default function Tools() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const {
    tools,
    isLoading,
    error
  } = useTools();
  const {
    addToCart
  } = useCart();

  const handleCopyPrompt = (toolId: string, prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(toolId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || tool.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || tool.category === categoryFilter;
    const matchesPrice = priceFilter === "all" || priceFilter === "free" && tool.price === 0 || priceFilter === "paid" && tool.price > 0;
    return matchesSearch && matchesCategory && matchesPrice;
  });
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">กำลังโหลด...</h1>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
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
              <Input placeholder="ค้นหาเครื่องมือ..." className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {toolCategories.map(category => <Button key={category.id} variant={categoryFilter === category.id ? "default" : "outline"} className={`flex items-center gap-2 ${categoryFilter === category.id ? "glow-on-hover" : ""}`} onClick={() => setCategoryFilter(category.id)}>
                <category.icon className="h-4 w-4" />
                {category.name}
              </Button>)}
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
            {filteredTools.map(tool => <Card key={tool.id} className="glass-card hover-lift">
                <CardContent className="p-6">
                  {/* Cover Image for Prompts */}
                  {tool.category === 'prompt' && (tool.cover_image_url || tool.cover_image_path) && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img 
                        src={tool.cover_image_url || tool.cover_image_path} 
                        alt={tool.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="badge-level text-xs">
                      {tool.category}
                    </Badge>
                    <Badge variant="outline" className={tool.price === 0 ? "badge-free" : "badge-paid"}>
                      {tool.price === 0 ? "ฟรี" : `฿${tool.price.toLocaleString()}`}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {tool.description}
                  </p>
                  
                  <div className="flex gap-2">
                    {tool.category === 'prompt' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        onClick={() => tool.description && handleCopyPrompt(tool.id, tool.description)}
                      >
                        {copiedId === tool.id ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            คัดลอกแล้ว
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Prompt
                          </>
                        )}
                      </Button>
                    )}
                    
                    {tool.price === 0 ? (
                      <Button className={tool.category === 'prompt' ? 'flex-1' : 'w-full'} asChild>
                        <Link to={`/tools/${tool.slug}`}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          {tool.category === 'prompt' ? 'ดูรายละเอียด' : 'ดาวน์โหลดฟรี'}
                        </Link>
                      </Button>
                    ) : (
                      <Button className={tool.category === 'prompt' ? 'flex-1' : 'w-full'} onClick={() => addToCart(tool.id, 'tool')}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        เพิ่มลงตะกร้า ฿{tool.price.toLocaleString()}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>)}
          </div>

          {filteredTools.length === 0 && <div className="text-center py-20">
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
            </div>}
        </div>
      </section>

      {/* CTA Section */}
      
    </div>;
}