import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ArrowLeft, Download, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface MyEbook {
  id: string;
  title: string;
  description: string;
  pages: number;
  download_url: string;
  preview_url: string;
  enrolled_at: string;
}

export default function MyEbooks() {
  const [myEbooks, setMyEbooks] = useState<MyEbook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyEbooks = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsLoading(false);
          return;
        }

        // Fetch user's enrolled ebook IDs
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select('item_id, enrolled_at')
          .eq('user_id', session.user.id)
          .eq('item_type', 'ebook');

        if (enrollmentsError) throw enrollmentsError;

        if (!enrollments || enrollments.length === 0) {
          setMyEbooks([]);
          setIsLoading(false);
          return;
        }

        const ebookIds = enrollments.map(e => e.item_id);
        const enrollMap = Object.fromEntries(enrollments.map(e => [e.item_id, e.enrolled_at]));

        // Fetch ebooks data
        const { data: ebooks, error: ebooksError } = await supabase
          .from('ebooks')
          .select('id, title, description, pages, download_url, preview_url')
          .in('id', ebookIds);

        if (ebooksError) throw ebooksError;

        const ebooksWithEnrollment = (ebooks || []).map(ebook => ({
          ...ebook,
          enrolled_at: enrollMap[ebook.id]
        }));

        setMyEbooks(ebooksWithEnrollment);
      } catch (error) {
        console.error('Error fetching my ebooks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyEbooks();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold">กำลังโหลด...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-hero-gradient py-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="gradient-blob"></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/20">
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                กลับ
              </Link>
            </Button>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              eBook ของฉัน 📖
            </h1>
            <p className="text-white/80 text-lg mb-6">
              หนังสือดิจิทัลที่คุณได้รับแล้ว
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-xl mx-auto">
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{myEbooks.length}</div>
                <div className="text-white/80 text-sm">eBook ทั้งหมด</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {myEbooks.reduce((sum, ebook) => sum + (ebook.pages || 0), 0)}
                </div>
                <div className="text-white/80 text-sm">หน้าทั้งหมด</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {myEbooks.filter(e => e.download_url).length}
                </div>
                <div className="text-white/80 text-sm">พร้อมดาวน์โหลด</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-6 relative z-10">
        
        {myEbooks.length === 0 ? (
          <Card className="glass-card text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">ยังไม่มี eBook ในระบบ</h2>
              <p className="text-muted-foreground mb-6">
                เริ่มต้นอ่านหนังสือดิจิทัลที่หลากหลาย
              </p>
              <Button asChild>
                <Link to="/ebooks">
                  <BookOpen className="h-4 w-4 mr-2" />
                  เลือก eBook
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            
            {/* All eBooks */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  eBook ทั้งหมด ({myEbooks.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myEbooks.map((ebook) => (
                    <div key={ebook.id} className="group border rounded-lg overflow-hidden hover:shadow-lg transition-all">
                      {/* eBook Cover Placeholder */}
                      <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-primary group-hover:scale-110 transition-transform" />
                      </div>
                      
                      <div className="p-4">
                        <h4 className="font-semibold mb-2 line-clamp-2">{ebook.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                          {ebook.description}
                        </p>
                        
                        {ebook.pages && (
                          <div className="flex items-center gap-2 mb-3">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {ebook.pages} หน้า
                            </span>
                          </div>
                        )}
                        
                        <div className="flex flex-col gap-2">
                          {ebook.download_url && (
                            <Button size="sm" asChild>
                              <a href={ebook.download_url} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4 mr-2" />
                                ดาวน์โหลด
                              </a>
                            </Button>
                          )}
                          
                          <div className="flex gap-2">
                            {ebook.preview_url && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={ebook.preview_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  ตัวอย่าง
                                </a>
                              </Button>
                            )}
                            
                            <Button size="sm" variant="outline" asChild>
                              <Link to={`/ebooks/${ebook.id}`}>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                รายละเอียด
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        )}
      </div>
    </div>
  );
}