import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Tool {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  download_url: string;
  created_at: string;
}

export default function AdminTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: 0,
    category: '',
    download_url: ''
  });

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
      setTools(data || []);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTool) {
        const { error } = await supabase
          .from('tools')
          .update(formData)
          .eq('id', editingTool.id);

        if (error) throw error;

        toast({
          title: "สำเร็จ",
          description: "อัปเดตเครื่องมือเรียบร้อยแล้ว",
        });
      } else {
        const { error } = await supabase
          .from('tools')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "สำเร็จ",
          description: "เพิ่มเครื่องมือใหม่เรียบร้อยแล้ว",
        });
      }

      setIsDialogOpen(false);
      setEditingTool(null);
      setFormData({ title: '', slug: '', description: '', price: 0, category: '', download_url: '' });
      fetchTools();
    } catch (error) {
      console.error('Error saving tool:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้",
        variant: "destructive",
      });
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
      download_url: tool.download_url || ''
    });
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
    setFormData({ title: '', slug: '', description: '', price: 0, category: '', download_url: '' });
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
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="download_url">ลิงก์ดาวน์โหลด</Label>
                  <Input
                    id="download_url"
                    type="url"
                    value={formData.download_url}
                    onChange={(e) => setFormData({ ...formData, download_url: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingTool ? 'อัปเดต' : 'บันทึก'}
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
                  <TableHead>วันที่สร้าง</TableHead>
                  <TableHead>การจัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tools.map((tool) => (
                  <TableRow key={tool.id}>
                    <TableCell className="font-medium">{tool.title}</TableCell>
                    <TableCell>{tool.category || '-'}</TableCell>
                    <TableCell>₿{tool.price}</TableCell>
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
  );
}