import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Pencil, Trash2, Upload, Link } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";

interface Ebook {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  pages: number;
  download_url: string;
  preview_url: string;
  download_type: 'url' | 'file';
  file_path: string;
  created_at: string;
}

export default function AdminEbooks() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEbook, setEditingEbook] = useState<Ebook | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: 0,
    pages: 0,
    download_url: '',
    preview_url: '',
    download_type: 'url' as 'url' | 'file',
    file_path: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchEbooks();
  }, []);

  const fetchEbooks = async () => {
    try {
      const { data, error } = await supabase
        .from('ebooks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEbooks((data || []).map(ebook => ({
        ...ebook,
        download_type: ebook.download_type as 'url' | 'file'
      })));
    } catch (error) {
      console.error('Error fetching ebooks:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูล e-book ได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        toast({
          title: "ไฟล์ไม่ถูกต้อง",
          description: "กรุณาเลือกไฟล์ .pdf เท่านั้น",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const uploadFile = async (file: File, ebookId: string, isEdit: boolean = false) => {
    const fileExt = 'pdf';
    const fileName = `${ebookId}.${fileExt}`;
    const filePath = `ebooks/${fileName}`;

    // If editing, remove the existing file first
    if (isEdit) {
      await supabase.storage
        .from('ebooks')
        .remove([filePath]);
    }

    const { error: uploadError } = await supabase.storage
      .from('ebooks')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;
    return filePath;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let finalFormData = { ...formData };

      if (formData.download_type === 'file' && selectedFile) {
        // Generate ID for new ebooks or use existing ID
        const ebookId = editingEbook?.id || crypto.randomUUID();
        
        // Upload file first, pass isEdit flag
        const filePath = await uploadFile(selectedFile, ebookId, !!editingEbook);
        finalFormData.file_path = filePath;
        finalFormData.download_url = ''; // Clear URL when using file
      } else if (formData.download_type === 'url') {
        finalFormData.file_path = ''; // Clear file path when using URL
      }

      if (editingEbook) {
        const { error } = await supabase
          .from('ebooks')
          .update(finalFormData)
          .eq('id', editingEbook.id);

        if (error) throw error;

        toast({
          title: "สำเร็จ",
          description: "อัปเดต e-book เรียบร้อยแล้ว",
        });
      } else {
        const { error } = await supabase
          .from('ebooks')
          .insert([finalFormData]);

        if (error) throw error;

        toast({
          title: "สำเร็จ",
          description: "เพิ่ม e-book ใหม่เรียบร้อยแล้ว",
        });
      }

      setIsDialogOpen(false);
      setEditingEbook(null);
      setFormData({ title: '', slug: '', description: '', price: 0, pages: 0, download_url: '', preview_url: '', download_type: 'url', file_path: '' });
      setSelectedFile(null);
      fetchEbooks();
    } catch (error) {
      console.error('Error saving ebook:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (ebook: Ebook) => {
    setEditingEbook(ebook);
    setFormData({
      title: ebook.title,
      slug: ebook.slug,
      description: ebook.description || '',
      price: ebook.price || 0,
      pages: ebook.pages || 0,
      download_url: ebook.download_url || '',
      preview_url: ebook.preview_url || '',
      download_type: ebook.download_type || 'url',
      file_path: ebook.file_path || ''
    });
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบ e-book นี้?')) return;

    try {
      const { error } = await supabase
        .from('ebooks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "สำเร็จ",
        description: "ลบ e-book เรียบร้อยแล้ว",
      });
      
      fetchEbooks();
    } catch (error) {
      console.error('Error deleting ebook:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบ e-book ได้",
        variant: "destructive",
      });
    }
  };

  const openAddDialog = () => {
    setEditingEbook(null);
    setFormData({ title: '', slug: '', description: '', price: 0, pages: 0, download_url: '', preview_url: '', download_type: 'url', file_path: '' });
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>จัดการ E-books</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAddDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  เพิ่ม E-book ใหม่
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingEbook ? 'แก้ไข E-book' : 'เพิ่ม E-book ใหม่'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">ชื่อ E-book</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">คำอธิบาย</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">ราคา (บาท)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pages">จำนวนหน้า</Label>
                      <Input
                        id="pages"
                        type="number"
                        value={formData.pages}
                        onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>ประเภทการดาวน์โหลด</Label>
                    <RadioGroup 
                      value={formData.download_type} 
                      onValueChange={(value: 'url' | 'file') => setFormData({ ...formData, download_type: value })}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="url" id="url" />
                        <Label htmlFor="url" className="flex items-center space-x-1">
                          <Link className="h-4 w-4" />
                          <span>ลิงก์</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="file" id="file" />
                        <Label htmlFor="file" className="flex items-center space-x-1">
                          <Upload className="h-4 w-4" />
                          <span>อัพโหลดไฟล์ PDF</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.download_type === 'url' ? (
                    <div>
                      <Label htmlFor="download_url">ลิงก์ดาวน์โหลด</Label>
                      <Input
                        id="download_url"
                        type="url"
                        value={formData.download_url}
                        onChange={(e) => setFormData({ ...formData, download_url: e.target.value })}
                        required={formData.download_type === 'url'}
                      />
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="ebook_file">ไฟล์ E-book (PDF)</Label>
                      <Input
                        id="ebook_file"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        required={formData.download_type === 'file' && !editingEbook}
                      />
                      {selectedFile && (
                        <p className="text-sm text-muted-foreground mt-1">
                          ไฟล์ที่เลือก: {selectedFile.name}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="preview_url">ลิงก์ตัวอย่าง</Label>
                    <Input
                      id="preview_url"
                      type="url"
                      value={formData.preview_url}
                      onChange={(e) => setFormData({ ...formData, preview_url: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={uploading}>
                    {uploading ? 'กำลังอัพโหลด...' : (editingEbook ? 'อัปเดต' : 'บันทึก')}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {ebooks.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                ยังไม่มี E-books - เริ่มต้นด้วยการเพิ่ม E-book แรก
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ชื่อ E-book</TableHead>
                    <TableHead>หน้า</TableHead>
                    <TableHead>ราคา</TableHead>
                    <TableHead>ประเภท</TableHead>
                    <TableHead>วันที่สร้าง</TableHead>
                    <TableHead>การจัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ebooks.map((ebook) => (
                    <TableRow key={ebook.id}>
                      <TableCell className="font-medium">{ebook.title}</TableCell>
                      <TableCell>{ebook.pages} หน้า</TableCell>
                      <TableCell>
                        <Badge variant={ebook.price === 0 ? "secondary" : "default"}>
                          {ebook.price === 0 ? "ฟรี" : `฿${ebook.price}`}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={ebook.download_type === 'file' ? "default" : "outline"}>
                          {ebook.download_type === 'file' ? (
                            <><Upload className="h-3 w-3 mr-1" />ไฟล์</>
                          ) : (
                            <><Link className="h-3 w-3 mr-1" />ลิงก์</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(ebook.created_at).toLocaleDateString('th-TH')}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(ebook)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(ebook.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}