import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const courses = [
  {
    id: "react-fundamentals",
    title: "React สำหรับผู้เริ่มต้น",
    description: "เรียนรู้พื้นฐาน React จากศูนย์จนสามารถสร้างเว็บแอปพลิเคชันได้",
    price: 0,
    duration: "8 ชั่วโมง",
    lessons: 24,
    level: "เริ่มต้น",
    students: 1250,
    tags: ["React", "JavaScript", "Frontend"]
  },
  {
    id: "javascript-advanced",
    title: "JavaScript ขั้นสูง",
    description: "เจาะลึก JavaScript ES6+ และเทคนิคขั้นสูงสำหรับนักพัฒนา",
    price: 1990,
    duration: "12 ชั่วโมง",
    lessons: 32,
    level: "กลาง",
    students: 890,
    tags: ["JavaScript", "ES6", "Advanced"]
  },
  {
    id: "fullstack-developer",
    title: "Full Stack Developer",
    description: "พัฒนาเว็บแอปพลิเคชันแบบเต็มรูปแบบด้วย Node.js และ React",
    price: 2990,
    duration: "20 ชั่วโมง",
    lessons: 48,
    level: "สูง",
    students: 654,
    tags: ["Full Stack", "Node.js", "React", "Database"]
  },
  {
    id: "typescript-basics",
    title: "TypeScript เบื้องต้น",
    description: "เรียนรู้ TypeScript และการใช้งานร่วมกับ JavaScript",
    price: 0,
    duration: "6 ชั่วโมง",
    lessons: 18,
    level: "เริ่มต้น",
    students: 2100,
    tags: ["TypeScript", "JavaScript", "Types"]
  },
  {
    id: "vue-complete",
    title: "Vue.js Complete Guide",
    description: "เรียนรู้ Vue.js จากพื้นฐานจนสามารถสร้างแอปพลิเคชันขนาดใหญ่",
    price: 2490,
    duration: "15 ชั่วโมง",
    lessons: 42,
    level: "กลาง",
    students: 432,
    tags: ["Vue.js", "Frontend", "SPA"]
  },
  {
    id: "python-web-dev",
    title: "Python Web Development",
    description: "สร้างเว็บแอปพลิเคชันด้วย Python Django และ FastAPI",
    price: 3490,
    duration: "18 ชั่วโมง",
    lessons: 36,
    level: "กลาง",
    students: 567,
    tags: ["Python", "Django", "FastAPI", "Backend"]
  }
];

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLevel = levelFilter === "all" || course.level === levelFilter;
    
    const matchesPrice = priceFilter === "all" || 
                        (priceFilter === "free" && course.price === 0) ||
                        (priceFilter === "paid" && course.price > 0);

    return matchesSearch && matchesLevel && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-hero-gradient py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-up">
              คอร์สเรียนทั้งหมด
            </h1>
            <p className="text-xl text-white/80 mb-8 animate-fade-in-delay-1">
              เรียนเขียนโปรแกรมจากผู้เชี่ยวชาญ พร้อมใบประกาศนียบัตร
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto animate-fade-in-delay-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="ค้นหาคอร์สเรียน..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="ระดับความยาก" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกระดับ</SelectItem>
                <SelectItem value="เริ่มต้น">เริ่มต้น</SelectItem>
                <SelectItem value="กลาง">กลาง</SelectItem>
                <SelectItem value="สูง">สูง</SelectItem>
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
              <span>พบ {filteredCourses.length} คอร์ส</span>
            </div>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="glass-card hover-lift">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="badge-level text-xs">
                      {course.level}
                    </Badge>
                    <Badge variant="outline" className={course.price === 0 ? "badge-free" : "badge-paid"}>
                      {course.price === 0 ? "ฟรี" : `฿${course.price.toLocaleString()}`}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                      </span>
                      <span>{course.lessons} บทเรียน</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{course.students.toLocaleString()} นักเรียน</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {course.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button className="w-full" asChild>
                    <Link to={`/courses/${course.id}`}>ดูรายละเอียด</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-16 w-16 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">ไม่พบคอร์สที่ค้นหา</h3>
              <p className="text-muted-foreground mb-6">
                ลองเปลี่ยนคำค้นหาหรือปรับเงื่อนไขการกรอง
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setLevelFilter("all");
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