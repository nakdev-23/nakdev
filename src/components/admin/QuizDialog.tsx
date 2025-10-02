import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical } from "lucide-react";
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

interface QuestionOption {
  id: string;
  option_text: string;
  is_correct: boolean;
  order_number: number;
}

interface QuizQuestion {
  id: string;
  question_text: string;
  question_type: string;
  points: number;
  order_number: number;
  options: QuestionOption[];
}

export default function QuizDialog({
  open,
  onOpenChange,
  courseId,
  lessons,
  quiz,
  onSave,
}: QuizDialogProps) {
  const [step, setStep] = useState(1);
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

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `temp-${Date.now()}`,
      question_text: '',
      question_type: 'multiple_choice',
      points: 1,
      order_number: questions.length + 1,
      options: [
        { id: `opt-${Date.now()}-1`, option_text: '', is_correct: false, order_number: 1 },
        { id: `opt-${Date.now()}-2`, option_text: '', is_correct: false, order_number: 2 },
      ],
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const updateQuestion = (questionId: string, field: string, value: any) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, [field]: value } : q
    ));
  };

  const addOption = (questionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOption: QuestionOption = {
          id: `opt-${Date.now()}`,
          option_text: '',
          is_correct: false,
          order_number: q.options.length + 1,
        };
        return { ...q, options: [...q.options, newOption] };
      }
      return q;
    }));
  };

  const removeOption = (questionId: string, optionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return { ...q, options: q.options.filter(o => o.id !== optionId) };
      }
      return q;
    }));
  };

  const updateOption = (questionId: string, optionId: string, field: string, value: any) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: q.options.map(o =>
            o.id === optionId ? { ...o, [field]: value } : o
          ),
        };
      }
      return q;
    }));
  };

  const toggleCorrectOption = (questionId: string, optionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: q.options.map(o => ({
            ...o,
            is_correct: o.id === optionId,
          })),
        };
      }
      return q;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }

    // Validate questions
    if (questions.length === 0) {
      alert('กรุณาเพิ่มคำถามอย่างน้อย 1 ข้อ');
      return;
    }

    for (const q of questions) {
      if (!q.question_text.trim()) {
        alert('กรุณากรอกคำถามให้ครบทุกข้อ');
        return;
      }
      if (q.options.length < 2) {
        alert('แต่ละคำถามต้องมีตัวเลือกอย่างน้อย 2 ตัวเลือก');
        return;
      }
      if (!q.options.some(o => o.is_correct)) {
        alert('กรุณาเลือกคำตอบที่ถูกต้องในทุกคำถาม');
        return;
      }
      for (const o of q.options) {
        if (!o.option_text.trim()) {
          alert('กรุณากรอกตัวเลือกให้ครบทุกข้อ');
          return;
        }
      }
    }

    onSave({
      ...formData,
      course_id: courseId,
      position: quiz?.position || 0,
      questions,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {quiz ? 'แก้ไข Quiz' : 'เพิ่ม Quiz ใหม่'} - {step === 1 ? 'ข้อมูลพื้นฐาน' : 'คำถามและคำตอบ'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 ? (
            <>
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
                  ถัดไป: เพิ่มคำถาม
                </Button>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  ยกเลิก
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Questions Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">คำถาม ({questions.length} ข้อ)</h3>
                  <Button type="button" onClick={addQuestion} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    เพิ่มคำถาม
                  </Button>
                </div>

                {questions.map((question, qIndex) => (
                  <Card key={question.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                          คำถามที่ {qIndex + 1}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">คะแนน:</Label>
                          <Input
                            type="number"
                            min="1"
                            value={question.points}
                            onChange={(e) => updateQuestion(question.id, 'points', parseInt(e.target.value) || 1)}
                            className="w-20"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(question.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>คำถาม *</Label>
                        <Textarea
                          value={question.question_text}
                          onChange={(e) => updateQuestion(question.id, 'question_text', e.target.value)}
                          placeholder="พิมพ์คำถาม..."
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>ตัวเลือก (เลือกข้อที่ถูกต้อง)</Label>
                          <Button
                            type="button"
                            onClick={() => addOption(question.id)}
                            size="sm"
                            variant="outline"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            เพิ่มตัวเลือก
                          </Button>
                        </div>

                        {question.options.map((option, oIndex) => (
                          <div key={option.id} className="flex items-center gap-2">
                            <Checkbox
                              checked={option.is_correct}
                              onCheckedChange={() => toggleCorrectOption(question.id, option.id)}
                            />
                            <span className="text-sm font-medium w-6">{String.fromCharCode(65 + oIndex)}.</span>
                            <Input
                              value={option.option_text}
                              onChange={(e) => updateOption(question.id, option.id, 'option_text', e.target.value)}
                              placeholder={`ตัวเลือก ${String.fromCharCode(65 + oIndex)}`}
                              className="flex-1"
                            />
                            {question.options.length > 2 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeOption(question.id, option.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {questions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>ยังไม่มีคำถาม กดปุ่ม "เพิ่มคำถาม" เพื่อเริ่มต้น</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  ย้อนกลับ
                </Button>
                <Button type="submit" className="flex-1">
                  {quiz ? 'อัพเดท Quiz' : 'สร้าง Quiz'}
                </Button>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  ยกเลิก
                </Button>
              </div>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
