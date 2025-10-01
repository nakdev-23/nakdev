import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AssignmentSubmitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignmentId: string;
  onSubmitSuccess: () => void;
}

export default function AssignmentSubmitDialog({ 
  open, 
  onOpenChange, 
  assignmentId,
  onSubmitSuccess 
}: AssignmentSubmitDialogProps) {
  const [submissionType, setSubmissionType] = useState<"text" | "url" | "file">("text");
  const [submissionText, setSubmissionText] = useState("");
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("ไม่พบข้อมูลผู้ใช้");

      const { error } = await supabase
        .from("student_assignments")
        .insert([{
          assignment_id: assignmentId,
          user_id: user.id,
          submission_type: submissionType,
          submission_text: submissionType === "text" ? submissionText : null,
          submission_url: submissionType === "url" ? submissionUrl : null,
        }]);

      if (error) throw error;

      toast({
        title: "สำเร็จ",
        description: "ส่งการบ้านเรียบร้อยแล้ว",
      });

      onSubmitSuccess();
      onOpenChange(false);
      setSubmissionText("");
      setSubmissionUrl("");
    } catch (error: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>ส่งการบ้าน</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>วิธีการส่ง</Label>
            <RadioGroup value={submissionType} onValueChange={(v: any) => setSubmissionType(v)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="text" id="text" />
                <Label htmlFor="text">เขียนข้อความ</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="url" id="url" />
                <Label htmlFor="url">ลิงค์</Label>
              </div>
            </RadioGroup>
          </div>

          {submissionType === "text" && (
            <div>
              <Label htmlFor="submission_text">ข้อความ</Label>
              <Textarea
                id="submission_text"
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                rows={6}
                required
                placeholder="เขียนคำตอบของคุณที่นี่..."
              />
            </div>
          )}

          {submissionType === "url" && (
            <div>
              <Label htmlFor="submission_url">URL</Label>
              <Input
                id="submission_url"
                type="url"
                value={submissionUrl}
                onChange={(e) => setSubmissionUrl(e.target.value)}
                required
                placeholder="https://..."
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "กำลังส่ง..." : "ส่งการบ้าน"}
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
