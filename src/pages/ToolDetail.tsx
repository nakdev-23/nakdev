import { useParams } from "react-router-dom";
import { Download, Wrench, Eye, ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";

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
  content_type: 'download' | 'prompt';
  prompt?: string;
  note?: string;
  cover_image_url?: string;
  cover_image_path?: string;
  gallery_images?: string[];
}

export default function ToolDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [tool, setTool] = useState<Tool | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

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
          download_type: data.download_type as 'url' | 'file',
          content_type: data.content_type as 'download' | 'prompt'
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
    if (!tool || isDownloading) return;

    setIsDownloading(true);
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "กรุณาเข้าสู่ระบบ",
          description: "คุณต้องเข้าสู่ระบบก่อนดาวน์โหลด",
          variant: "destructive",
        });
        return;
      }

      // If tool is free, record enrollment
      if (tool.price === 0) {
        // Check if already enrolled
        const { data: existingEnrollment } = await supabase
          .from('enrollments')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('item_id', tool.id)
          .eq('item_type', 'tool')
          .maybeSingle();

        // Add to enrollments if not already enrolled
        if (!existingEnrollment) {
          const { error: enrollmentError } = await supabase
            .from('enrollments')
            .insert({
              user_id: session.user.id,
              item_id: tool.id,
              item_type: 'tool',
              price_paid: 0
            });

          if (enrollmentError) {
            console.error('Error recording enrollment:', enrollmentError);
            // Continue with download even if enrollment fails
          } else {
            toast({
              title: "เพิ่มลงประวัติแล้ว",
              description: "เครื่องมือนี้ได้ถูกเพิ่มลงในประวัติของคุณแล้ว",
            });
          }
        }
      }

      // Proceed with download
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
        // Open in new tab to avoid Chrome blocking
        window.open(downloadUrl, '_blank');
        
        toast({
          title: "เริ่มการดาวน์โหลด",
          description: "กำลังเปิดลิงค์ดาวน์โหลดในหน้าต่างใหม่",
        });
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดาวน์โหลดไฟล์ได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
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
              {/* Tool Icon/Cover Image */}
              <div className="lg:col-span-1">
                <div className="w-full max-w-sm mx-auto bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl overflow-hidden h-96">
                  {tool.cover_image_path || tool.cover_image_url ? (
                    <img
                      src={tool.cover_image_path 
                        ? supabase.storage.from('product-covers').getPublicUrl(tool.cover_image_path).data.publicUrl
                        : tool.cover_image_url}
                      alt={tool.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-8">
                      <Wrench className="h-24 w-24 text-white" />
                    </div>
                  )}
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
                  {tool.content_type === 'download' && (
                    <>
                      {tool.price === 0 ? (
                        <Button 
                          size="lg" 
                          className="bg-white text-primary hover:bg-white/90"
                          onClick={handleDownload}
                          disabled={(!tool.download_url && !tool.file_path) || isDownloading}
                        >
                          <Download className="mr-2 h-5 w-5" />
                          {isDownloading ? "กำลังดาวน์โหลด..." : "ดาวน์โหลดฟรี"}
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
                    </>
                  )}
                  {tool.content_type === 'prompt' && tool.price > 0 && (
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
                {tool.content_type === 'prompt' ? (
                  <>
                    <h2 className="text-2xl font-bold mb-6">Prompt</h2>
                    {tool.prompt && (
                      <div className="mb-8 p-6 bg-muted/50 rounded-lg">
                        <pre className="whitespace-pre-wrap text-foreground font-mono text-sm leading-relaxed">
                          {tool.prompt}
                        </pre>
                      </div>
                    )}
                    
                    {tool.note && (
                      <>
                        <h3 className="text-xl font-bold mb-4">หมายเหตุ</h3>
                        <div className="mb-8 p-6 bg-muted/50 rounded-lg">
                          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {tool.note}
                          </p>
                        </div>
                      </>
                    )}
                    
                    {tool.gallery_images && tool.gallery_images.length > 0 && (
                      <>
                        <h3 className="text-xl font-bold mb-4">ภาพตัวอย่าง</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                          {tool.gallery_images.map((imagePath, index) => (
                            <div key={index} className="rounded-lg overflow-hidden">
                              <img
                                src={supabase.storage.from('product-covers').getPublicUrl(imagePath).data.publicUrl}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-auto object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </>
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
                  </>
                ) : (
                  <>
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
                            disabled={(!tool.download_url && !tool.file_path) || isDownloading}
                          >
                            <Download className="mr-2 h-5 w-5" />
                            {isDownloading ? "กำลังดาวน์โหลด..." : "ดาวน์โหลดทันที"}
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
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}