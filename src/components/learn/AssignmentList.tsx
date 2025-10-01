import { FileText, ExternalLink, Calendar, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Assignment } from "@/hooks/useAssignments";
import { format } from "date-fns";
import { th } from "date-fns/locale";

interface AssignmentListProps {
  assignments: Assignment[];
  onSubmit: (assignmentId: string) => void;
  submissions?: any[];
}

export default function AssignmentList({ assignments, onSubmit, submissions = [] }: AssignmentListProps) {
  const getSubmission = (assignmentId: string) => {
    return submissions.find(s => s.assignment_id === assignmentId);
  };

  if (!assignments || assignments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          ยังไม่มีการบ้านสำหรับคอร์สนี้
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => {
        const submission = getSubmission(assignment.id);
        const isSubmitted = !!submission;
        const isGraded = submission?.graded_at;

        return (
          <Card key={assignment.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {assignment.title}
                    {assignment.is_required && (
                      <Badge variant="destructive" className="ml-2">บังคับ</Badge>
                    )}
                  </CardTitle>
                  {assignment.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {assignment.description}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  {isSubmitted && (
                    <Badge variant={isGraded ? "default" : "secondary"}>
                      {isGraded ? `คะแนน: ${submission.score}/${assignment.points}` : "รอตรวจ"}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>{assignment.points} คะแนน</span>
                  </div>
                  {assignment.due_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        ครบกำหนด: {format(new Date(assignment.due_date), 'dd MMM yyyy', { locale: th })}
                      </span>
                    </div>
                  )}
                </div>

                {assignment.attachment_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={assignment.attachment_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      ดูไฟล์แนบ
                    </a>
                  </Button>
                )}

                {isSubmitted ? (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>ส่งงานแล้วเมื่อ {format(new Date(submission.submitted_at), 'dd MMM yyyy HH:mm', { locale: th })}</span>
                    </div>
                    {submission.feedback && (
                      <div className="mt-2 text-sm">
                        <p className="font-medium">ความเห็นจากผู้สอน:</p>
                        <p className="text-muted-foreground">{submission.feedback}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <Button onClick={() => onSubmit(assignment.id)}>
                    ส่งการบ้าน
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
