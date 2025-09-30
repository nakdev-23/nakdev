import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Quiz } from "@/hooks/useQuizzes";

interface Lesson {
  id: string;
  title: string;
  lesson_order: number;
}

interface QuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  lessons: Lesson[];
  quiz: Quiz | null;
  onSave: (data: any) => void;
}

export default function QuizDialog({
  open,
  onOpenChange,
  courseId,
  lessons,
  quiz,
  onSave,
}: QuizDialogProps) {
  const [formData, setFormData] = useState({
    title: quiz?.title || '',
    description: quiz?.description || '',
    lesson_id: quiz?.lesson_id || null,
    passing_score: quiz?.passing_score || 70,
    time_limit_minutes: quiz?.time_limit_minutes || null,
    max_attempts: quiz?.max_attempts || null,
    show_correct_answers: quiz?.show_correct_answers ?? true,
    is_required: quiz?.is_required || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      course_id: courseId,
      position: quiz?.position || 0,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {quiz ? 'แก้ไข Quiz' : 'เพิ่ม Quiz ใหม่'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">ชื่อ Quiz *</Label>
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

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="passing_score">คะแนนผ่าน (%)</Label>
              <Input
                id="passing_score"
                type="number"
                value={formData.passing_score}
                onChange={(e) => setFormData({ ...formData, passing_score: parseInt(e.target.value) || 70 })}
                min="0"
                max="100"
              />
            </div>
            <div>
              <Label htmlFor="time_limit_minutes">เวลาจำกัด (นาที)</Label>
              <Input
                id="time_limit_minutes"
                type="number"
                value={formData.time_limit_minutes || ''}
                onChange={(e) => setFormData({ ...formData, time_limit_minutes: e.target.value ? parseInt(e.target.value) : null })}
                min="1"
                placeholder="ไม่จำกัด"
              />
            </div>
            <div>
              <Label htmlFor="max_attempts">ทำได้สูงสุด (ครั้ง)</Label>
              <Input
                id="max_attempts"
                type="number"
                value={formData.max_attempts || ''}
                onChange={(e) => setFormData({ ...formData, max_attempts: e.target.value ? parseInt(e.target.value) : null })}
                min="1"
                placeholder="ไม่จำกัด"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="show_correct_answers"
                checked={formData.show_correct_answers}
                onCheckedChange={(checked) => setFormData({ ...formData, show_correct_answers: checked })}
              />
              <Label htmlFor="show_correct_answers">แสดงเฉลยหลังทำเสร็จ</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_required"
                checked={formData.is_required}
                onCheckedChange={(checked) => setFormData({ ...formData, is_required: checked })}
              />
              <Label htmlFor="is_required">บังคับทำ</Label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {quiz ? 'อัพเดท' : 'บันทึก'}
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
