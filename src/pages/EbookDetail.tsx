import { useParams } from "react-router-dom";
import { Download, BookOpen, Eye, Clock, ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEbook } from "@/hooks/useEbooks";
import { useEbookEnrollment } from "@/hooks/useEbookEnrollment";
import { useCart } from "@/hooks/useCart";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function EbookDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { ebook, isLoading, error } = useEbook(slug || '');
  const { isEnrolled, isLoading: enrollmentLoading } = useEbookEnrollment(ebook?.id || '');
  const { addToCart } = useCart();

  const handleDownload = async () => {
    if (!ebook) return;

    try {
      let downloadUrl = '';
      
      if (ebook.download_type === 'file' && ebook.file_path) {
        // Generate signed URL for file download from Supabase Storage
        const { data, error } = await supabase.storage
          .from('ebooks')
          .createSignedUrl(ebook.file_path, 3600); // URL valid for 1 hour
        
        if (error) throw error;
        downloadUrl = data.signedUrl;
      } else if (ebook.download_type === 'url' && ebook.download_url) {
        downloadUrl = ebook.download_url;
      }

      if (downloadUrl) {
        // Create a temporary link to trigger download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${ebook.title}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์');
    }
  };

  const handlePreview = () => {
    if (ebook?.preview_url) {
      window.open(ebook.preview_url, '_blank');
    }
  };

  if (isLoading || enrollmentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">กำลังโหลด...</h1>
        </div>
      </div>
    );
  }

  if (error || !ebook) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">ไม่พบ eBook ที่ต้องการ</h1>
          <Button asChild>
            <Link to="/ebooks">กลับไปหน้า eBook</Link>
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
              <Link to="/ebooks">
                <ArrowLeft className="mr-2 h-4 w-4" />
                กลับไปหน้า eBook
              </Link>
            </Button>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* eBook Cover */}
              <div className="lg:col-span-1">
                <div className="w-full max-w-sm mx-auto bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl p-8 flex items-center justify-center h-96">
                  <BookOpen className="h-24 w-24 text-white" />
                </div>
              </div>
              
              {/* eBook Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-primary/20 text-white border-white/20">
                    eBook
                  </Badge>
                  <Badge variant="outline" className="border-white/20 text-white">
                    {ebook.price === 0 ? "ฟรี" : `฿${ebook.price}`}
                  </Badge>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {ebook.title}
                </h1>
                
                <p className="text-white/80 text-lg mb-6">
                  {ebook.description}
                </p>
                
                <div className="flex items-center gap-6 text-white/80 mb-8">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>{ebook.pages} หน้า</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {ebook.price === 0 || isEnrolled ? (
                    <Button 
                      size="lg" 
                      className="bg-white text-primary hover:bg-white/90"
                      onClick={handleDownload}
                      disabled={!ebook.download_url && !ebook.file_path}
                    >
                      <Download className="mr-2 h-5 w-5" />
                      ดาวน์โหลด PDF
                    </Button>
                  ) : (
                    <Button 
                      size="lg" 
                      className="bg-white text-primary hover:bg-white/90"
                      onClick={() => addToCart(ebook.id, 'ebook')}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      เพิ่มลงตะกร้า ฿{ebook.price}
                    </Button>
                  )}
                  
                  {ebook.preview_url && (
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={handlePreview}
                    >
                      <Eye className="mr-2 h-5 w-5" />
                      ดูตัวอย่าง
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* eBook Content Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="glass-card">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">เกี่ยวกับ eBook นี้</h2>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {ebook.description}
                  </p>
                  
                  <div className="mt-8 p-6 bg-muted/50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">รายละเอียด</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">จำนวนหน้า:</span>
                        <span className="ml-2 text-muted-foreground">{ebook.pages} หน้า</span>
                      </div>
                      <div>
                        <span className="font-medium">ราคา:</span>
                        <span className="ml-2 text-muted-foreground">
                          {ebook.price === 0 ? "ฟรี" : `฿${ebook.price}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {(ebook.price === 0 || isEnrolled) && (
                    <div className="mt-6 text-center">
                      <Button 
                        size="lg" 
                        onClick={handleDownload}
                        disabled={!ebook.download_url && !ebook.file_path}
                      >
                        <Download className="mr-2 h-5 w-5" />
                        ดาวน์โหลดทันที
                      </Button>
                    </div>
                  )}
                  
                  {ebook.price > 0 && !isEnrolled && (
                    <div className="mt-6 text-center">
                      <Button 
                        size="lg" 
                        onClick={() => addToCart(ebook.id, 'ebook')}
                      >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        เพิ่มลงตะกร้า ฿{ebook.price}
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