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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Upload, Link } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";

interface Tool {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  download_url: string;
  download_type: 'url' | 'file';
  file_path: string;
  cover_image_url?: string;
  cover_image_path?: string;
  created_at: string;
}

export default function AdminTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: 0,
    category: '',
    download_url: '',
    download_type: 'url' as 'url' | 'file',
    file_path: '',
    cover_image_url: '',
    cover_image_path: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const toolsList = (data || []).map(tool => ({
        ...tool,
        download_type: tool.download_type as 'url' | 'file'
      }));
      setTools(toolsList);

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(toolsList.map(tool => tool.category).filter(Boolean))
      ) as string[];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching tools:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลเครื่องมือได้",
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
      if (!file.name.toLowerCase().endsWith('.zip')) {
        toast({
          title: "ไฟล์ไม่ถูกต้อง",
          description: "กรุณาเลือกไฟล์ .zip เท่านั้น",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const uploadFile = async (file: File, toolId: string) => {
    const fileExt = 'zip';
    const fileName = `${toolId}.${fileExt}`;
    const filePath = `tools/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('tools')
      .upload(filePath, file);

    if (uploadError) throw uploadError;
    return filePath;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let finalFormData = { 
        ...formData,
        category: isNewCategory ? newCategoryName : formData.category
      };

      if (formData.download_type === 'file' && selectedFile) {
        // Generate ID for new tools or use existing ID
        const toolId = editingTool?.id || crypto.randomUUID();
        
        // Upload file first
        const filePath = await uploadFile(selectedFile, toolId);
        finalFormData.file_path = filePath;
        finalFormData.download_url = ''; // Clear URL when using file
      } else if (formData.download_type === 'url') {
        finalFormData.file_path = ''; // Clear file path when using URL
      }

      if (editingTool) {
        const { error } = await supabase
          .from('tools')
          .update(finalFormData)
          .eq('id', editingTool.id);

        if (error) throw error;

        toast({
          title: "สำเร็จ",
          description: "อัปเดตเครื่องมือเรียบร้อยแล้ว",
        });
      } else {
        const { error } = await supabase
          .from('tools')
          .insert([finalFormData]);

        if (error) throw error;

        toast({
          title: "สำเร็จ",
          description: "เพิ่มเครื่องมือใหม่เรียบร้อยแล้ว",
        });
      }

      setIsDialogOpen(false);
      setEditingTool(null);
      setFormData({ 
        title: '', 
        slug: '', 
        description: '', 
        price: 0, 
        category: '', 
        download_url: '', 
        download_type: 'url', 
        file_path: '',
        cover_image_url: '',
        cover_image_path: ''
      });
      setSelectedFile(null);
      fetchTools();
    } catch (error) {
      console.error('Error saving tool:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (tool: Tool) => {
    setEditingTool(tool);
    setFormData({
      title: tool.title,
      slug: tool.slug,
      description: tool.description || '',
      price: tool.price || 0,
      category: tool.category || '',
      download_url: tool.download_url || '',
      download_type: tool.download_type || 'url',
      file_path: tool.file_path || '',
      cover_image_url: tool.cover_image_url || '',
      cover_image_path: tool.cover_image_path || ''
    });
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบเครื่องมือนี้?')) return;

    try {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "สำเร็จ",
        description: "ลบเครื่องมือเรียบร้อยแล้ว",
      });
      
      fetchTools();
    } catch (error) {
      console.error('Error deleting tool:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบเครื่องมือได้",
        variant: "destructive",
      });
    }
  };

  const openAddDialog = () => {
    setEditingTool(null);
    setFormData({ 
      title: '', 
      slug: '', 
      description: '', 
      price: 0, 
      category: '', 
      download_url: '', 
      download_type: 'url', 
      file_path: '',
      cover_image_url: '',
      cover_image_path: ''
    });
    setSelectedFile(null);
    setIsNewCategory(false);
    setNewCategoryName('');
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>จัดการเครื่องมือ</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มเครื่องมือใหม่
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingTool ? 'แก้ไขเครื่องมือ' : 'เพิ่มเครื่องมือใหม่'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">ชื่อเครื่องมือ</Label>
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
                    <Label htmlFor="category">หมวดหมู่</Label>
                    <Select 
                      value={isNewCategory ? 'new' : formData.category} 
                      onValueChange={(value) => {
                        if (value === 'new') {
                          setIsNewCategory(true);
                          setFormData({ ...formData, category: '' });
                        } else {
                          setIsNewCategory(false);
                          setNewCategoryName('');
                          setFormData({ ...formData, category: value });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกหมวดหมู่" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border z-50">
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                        <SelectItem value="new" className="font-semibold text-primary">
                          + สร้างหมวดหมู่ใหม่
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {isNewCategory && (
                      <Input
                        className="mt-2"
                        placeholder="ชื่อหมวดหมู่ใหม่"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        required
                      />
                    )}
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
                        <span>อัพโหลดไฟล์ ZIP</span>
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
                    <Label htmlFor="tool_file">ไฟล์เครื่องมือ (ZIP)</Label>
                    <Input
                      id="tool_file"
                      type="file"
                      accept=".zip"
                      onChange={handleFileChange}
                      required={formData.download_type === 'file' && !editingTool}
                    />
                    {selectedFile && (
                      <p className="text-sm text-muted-foreground mt-1">
                        ไฟล์ที่เลือก: {selectedFile.name}
                      </p>
                    )}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={uploading}>
                  {uploading ? 'กำลังอัพโหลด...' : (editingTool ? 'อัปเดต' : 'บันทึก')}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {tools.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              ยังไม่มีเครื่องมือ - เริ่มต้นด้วยการเพิ่มเครื่องมือแรก
            </p>
          ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ชื่อเครื่องมือ</TableHead>
                    <TableHead>หมวดหมู่</TableHead>
                    <TableHead>ราคา</TableHead>
                    <TableHead>ประเภท</TableHead>
                    <TableHead>วันที่สร้าง</TableHead>
                    <TableHead>การจัดการ</TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                {tools.map((tool) => (
                  <TableRow key={tool.id}>
                    <TableCell className="font-medium">{tool.title}</TableCell>
                     <TableCell>
                       <Badge variant="outline">{tool.category || 'ไม่ระบุ'}</Badge>
                     </TableCell>
                     <TableCell>
                       <Badge variant={tool.price === 0 ? "secondary" : "default"}>
                         {tool.price === 0 ? "ฟรี" : `฿${tool.price}`}
                       </Badge>
                     </TableCell>
                     <TableCell>
                       <Badge variant={tool.download_type === 'file' ? "default" : "outline"}>
                         {tool.download_type === 'file' ? (
                           <><Upload className="h-3 w-3 mr-1" />ไฟล์</>
                         ) : (
                           <><Link className="h-3 w-3 mr-1" />ลิงก์</>
                         )}
                       </Badge>
                     </TableCell>
                    <TableCell>{new Date(tool.created_at).toLocaleDateString('th-TH')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(tool)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(tool.id)}
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