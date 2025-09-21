import { useParams } from "react-router-dom";
import { Download, Wrench, Eye, ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";

interface Tool {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  download_url: string;
  download_type: 'url' | 'file';
  file_path: string;
  category: string;
  created_at: string;
}

export default function ToolDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [tool, setTool] = useState<Tool | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchTool = async () => {
      if (!slug) return;

      try {
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setTool({
          ...data,
          download_type: data.download_type as 'url' | 'file'
        });
      } catch (err) {
        console.error('Error fetching tool:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch tool');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTool();
  }, [slug]);

  const handleDownload = async () => {
    if (!tool) return;

    try {
      let downloadUrl = '';
      
      if (tool.download_type === 'file' && tool.file_path) {
        // Generate signed URL for file download from Supabase Storage
        const { data, error } = await supabase.storage
          .from('tools')
          .createSignedUrl(tool.file_path, 3600); // URL valid for 1 hour
        
        if (error) throw error;
        downloadUrl = data.signedUrl;
      } else if (tool.download_type === 'url' && tool.download_url) {
        downloadUrl = tool.download_url;
      }

      if (downloadUrl) {
        // Create a temporary link to trigger download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = tool.title;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">กำลังโหลด...</h1>
        </div>
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">ไม่พบเครื่องมือที่ต้องการ</h1>
          <Button asChild>
            <Link to="/tools">กลับไปหน้าเครื่องมือ</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-hero-gradient py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="gradient-blob"></div>
          <div className="gradient-blob"></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" className="mb-6 text-white/80 hover:text-white" asChild>
              <Link to="/tools">
                <ArrowLeft className="mr-2 h-4 w-4" />
                กลับไปหน้าเครื่องมือ
              </Link>
            </Button>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Tool Icon */}
              <div className="lg:col-span-1">
                <div className="w-full max-w-sm mx-auto bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl p-8 flex items-center justify-center h-96">
                  <Wrench className="h-24 w-24 text-white" />
                </div>
              </div>
              
              {/* Tool Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-primary/20 text-white border-white/20">
                    {tool.category || 'เครื่องมือ'}
                  </Badge>
                  <Badge variant="outline" className="border-white/20 text-white">
                    {tool.price === 0 ? "ฟรี" : `฿${tool.price}`}
                  </Badge>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {tool.title}
                </h1>
                
                <p className="text-white/80 text-lg mb-6">
                  {tool.description}
                </p>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {tool.price === 0 ? (
                    <Button 
                      size="lg" 
                      className="bg-white text-primary hover:bg-white/90"
                      onClick={handleDownload}
                      disabled={!tool.download_url && !tool.file_path}
                    >
                      <Download className="mr-2 h-5 w-5" />
                      ดาวน์โหลดฟรี
                    </Button>
                  ) : (
                    <Button 
                      size="lg" 
                      className="bg-white text-primary hover:bg-white/90"
                      onClick={() => addToCart(tool.id, 'tool')}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      เพิ่มลงตะกร้า ฿{tool.price}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Content Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="glass-card">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">เกี่ยวกับเครื่องมือนี้</h2>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {tool.description}
                  </p>
                  
                  <div className="mt-8 p-6 bg-muted/50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">รายละเอียด</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">หมวดหมู่:</span>
                        <span className="ml-2 text-muted-foreground">{tool.category || 'เครื่องมือ'}</span>
                      </div>
                      <div>
                        <span className="font-medium">ราคา:</span>
                        <span className="ml-2 text-muted-foreground">
                          {tool.price === 0 ? "ฟรี" : `฿${tool.price}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {tool.price === 0 && (
                    <div className="mt-6 text-center">
                      <Button 
                        size="lg" 
                        onClick={handleDownload}
                        disabled={!tool.download_url && !tool.file_path}
                      >
                        <Download className="mr-2 h-5 w-5" />
                        ดาวน์โหลดทันที
                      </Button>
                    </div>
                  )}
                  
                  {tool.price > 0 && (
                    <div className="mt-6 text-center">
                      <Button 
                        size="lg" 
                        onClick={() => addToCart(tool.id, 'tool')}
                      >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        เพิ่มลงตะกร้า ฿{tool.price}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}