import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Target, ArrowLeft, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface MyTool {
  id: string;
  title: string;
  description: string;
  category: string;
  download_url: string;
  enrolled_at: string;
}

export default function MyTools() {
  const [myTools, setMyTools] = useState<MyTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyTools = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsLoading(false);
          return;
        }

        // Fetch user's enrolled tool IDs
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select('item_id, enrolled_at')
          .eq('user_id', session.user.id)
          .eq('item_type', 'tool');

        if (enrollmentsError) throw enrollmentsError;

        if (!enrollments || enrollments.length === 0) {
          setMyTools([]);
          setIsLoading(false);
          return;
        }

        const toolIds = enrollments.map(e => e.item_id);
        const enrollMap = Object.fromEntries(enrollments.map(e => [e.item_id, e.enrolled_at]));

        // Fetch tools data
        const { data: tools, error: toolsError } = await supabase
          .from('tools')
          .select('id, title, description, category, download_url')
          .in('id', toolIds);

        if (toolsError) throw toolsError;

        const toolsWithEnrollment = (tools || []).map(tool => ({
          ...tool,
          enrolled_at: enrollMap[tool.id]
        }));

        setMyTools(toolsWithEnrollment);
      } catch (error) {
        console.error('Error fetching my tools:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyTools();
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

  const categories = [...new Set(myTools.map(tool => tool.category))].filter(Boolean);

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
              เครื่องมือทั้งหมดของฉัน 🛠️
            </h1>
            <p className="text-white/80 text-lg mb-6">
              เครื่องมือที่คุณได้รับแล้ว
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-xl mx-auto">
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{myTools.length}</div>
                <div className="text-white/80 text-sm">เครื่องมือทั้งหมด</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{categories.length}</div>
                <div className="text-white/80 text-sm">หมวดหมู่</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{myTools.filter(t => t.download_url).length}</div>
                <div className="text-white/80 text-sm">พร้อมดาวน์โหลด</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-6 relative z-10">
        
        {myTools.length === 0 ? (
          <Card className="glass-card text-center py-12">
            <CardContent>
              <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">ยังไม่มีเครื่องมือในระบบ</h2>
              <p className="text-muted-foreground mb-6">
                เริ่มต้นใช้เครื่องมือที่หลากหลายเพื่อเพิ่มประสิทธิภาพการทำงาน
              </p>
              <Button asChild>
                <Link to="/tools">
                  <Target className="h-4 w-4 mr-2" />
                  เลือกเครื่องมือ
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            
            {/* Tools by Category */}
            {categories.length > 0 ? (
              categories.map(category => {
                const categoryTools = myTools.filter(tool => tool.category === category);
                
                return (
                  <Card key={category} className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        {category} ({categoryTools.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryTools.map((tool) => (
                          <div key={tool.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-semibold mb-2">{tool.title}</h4>
                                <p className="text-sm text-muted-foreground mb-3">
                                  {tool.description}
                                </p>
                                <Badge variant="secondary" className="mb-3">
                                  {tool.category}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              {tool.download_url && (
                                <Button size="sm" asChild>
                                  <a href={tool.download_url} target="_blank" rel="noopener noreferrer">
                                    <Download className="h-4 w-4 mr-2" />
                                    ดาวน์โหลด
                                  </a>
                                </Button>
                              )}
                              <Button size="sm" variant="outline" asChild>
                                <Link to={`/tools/${tool.id}`}>
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  ดูรายละเอียด
                                </Link>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              // All tools without categories
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    เครื่องมือทั้งหมด ({myTools.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myTools.map((tool) => (
                      <div key={tool.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-2">{tool.title}</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              {tool.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {tool.download_url && (
                            <Button size="sm" asChild>
                              <a href={tool.download_url} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4 mr-2" />
                                ดาวน์โหลด
                              </a>
                            </Button>
                          )}
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/tools/${tool.id}`}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              ดูรายละเอียด
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          </div>
        )}
      </div>
    </div>
  );
}