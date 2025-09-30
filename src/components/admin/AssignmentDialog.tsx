import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Assignment } from "@/hooks/useAssignments";

interface Lesson {
  id: string;
  title: string;
  lesson_order: number;
}

interface AssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  lessons: Lesson[];
  assignment: Assignment | null;
  onSave: (data: any) => void;
}

export default function AssignmentDialog({
  open,
  onOpenChange,
  courseId,
  lessons,
  assignment,
  onSave,
}: AssignmentDialogProps) {
  const [formData, setFormData] = useState({
    title: assignment?.title || '',
    description: assignment?.description || '',
    lesson_id: assignment?.lesson_id || null,
    attachment_type: assignment?.attachment_type || 'link',
    attachment_url: assignment?.attachment_url || '',
    due_date: assignment?.due_date ? assignment.due_date.split('T')[0] : '',
    points: assignment?.points || 10,
    is_required: assignment?.is_required || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      course_id: courseId,
      position: assignment?.position || 0,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {assignment ? 'แก้ไขการบ้าน' : 'เพิ่มการบ้านใหม่'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">ชื่อการบ้าน *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
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

          <div>
            <Label htmlFor="lesson_id">กำหนดให้บทเรียน (ถ้ามี)</Label>
            <Select
              value={formData.lesson_id || 'none'}
              onValueChange={(value) => setFormData({ ...formData, lesson_id: value === 'none' ? null : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกบทเรียน" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">ไม่กำหนด (ทั้งคอร์ส)</SelectItem>
                {lessons.map((lesson) => (
                  <SelectItem key={lesson.id} value={lesson.id}>
                    บทที่ {lesson.lesson_order}: {lesson.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="attachment_type">ประเภทไฟล์แนบ</Label>
            <Select
              value={formData.attachment_type || 'link'}
              onValueChange={(value: any) => setFormData({ ...formData, attachment_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="link">ลิงค์</SelectItem>
                <SelectItem value="file">ไฟล์</SelectItem>
                <SelectItem value="both">ทั้งสองอย่าง</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(formData.attachment_type === 'link' || formData.attachment_type === 'both') && (
            <div>
              <Label htmlFor="attachment_url">URL ไฟล์แนบ</Label>
              <Input
                id="attachment_url"
                type="url"
                value={formData.attachment_url}
                onChange={(e) => setFormData({ ...formData, attachment_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="due_date">วันครบกำหนด</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="points">คะแนน</Label>
              <Input
                id="points"
                type="number"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_required"
              checked={formData.is_required}
              onCheckedChange={(checked) => setFormData({ ...formData, is_required: checked })}
            />
            <Label htmlFor="is_required">บังคับทำ</Label>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {assignment ? 'อัพเดท' : 'บันทึก'}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              ยกเลิก
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
