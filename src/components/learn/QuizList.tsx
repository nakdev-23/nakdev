import { Trophy, Clock, CheckCircle, AlertCircle, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Quiz } from "@/hooks/useQuizzes";

interface QuizListProps {
  quizzes: Quiz[];
  onTakeQuiz: (quizId: string) => void;
  attempts?: any[];
}

export default function QuizList({ quizzes, onTakeQuiz, attempts = [] }: QuizListProps) {
  const getAttempts = (quizId: string) => {
    return attempts.filter(a => a.quiz_id === quizId);
  };

  const getBestScore = (quizId: string) => {
    const quizAttempts = getAttempts(quizId);
    if (quizAttempts.length === 0) return null;
    return Math.max(...quizAttempts.map(a => (a.score / a.total_points) * 100));
  };

  if (!quizzes || quizzes.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          ยังไม่มี Quiz สำหรับคอร์สนี้
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {quizzes.map((quiz) => {
        const quizAttempts = getAttempts(quiz.id);
        const attemptCount = quizAttempts.length;
        const bestScore = getBestScore(quiz.id);
        const lastAttempt = quizAttempts[quizAttempts.length - 1];
        const isPassed = lastAttempt?.passed;
        const canRetake = !quiz.max_attempts || attemptCount < quiz.max_attempts;

        return (
          <Card key={quiz.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    {quiz.title}
                    {quiz.is_required && (
                      <Badge variant="destructive" className="ml-2">บังคับ</Badge>
                    )}
                  </CardTitle>
                  {quiz.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {quiz.description}
                    </p>
                  )}
                </div>
                {bestScore !== null && (
                  <Badge variant={isPassed ? "default" : "secondary"}>
                    คะแนนสูงสุด: {Math.round(bestScore)}%
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    <span>คะแนนผ่าน: {quiz.passing_score}%</span>
                  </div>
                  {quiz.time_limit_minutes && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>เวลา: {quiz.time_limit_minutes} นาที</span>
                    </div>
                  )}
                  {quiz.max_attempts && (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>ทำได้: {attemptCount}/{quiz.max_attempts} ครั้ง</span>
                    </div>
                  )}
                </div>

                {lastAttempt && (
                  <div className={`p-3 rounded-lg ${isPassed ? 'bg-success/10' : 'bg-destructive/10'}`}>
                    <div className="flex items-center gap-2 text-sm">
                      {isPassed ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                      <span>
                        ครั้งล่าสุด: {Math.round((lastAttempt.score / lastAttempt.total_points) * 100)}%
                        {isPassed ? ' (ผ่าน)' : ' (ไม่ผ่าน)'}
                      </span>
                    </div>
                  </div>
                )}

                {attemptCount === 0 ? (
                  <Button onClick={() => onTakeQuiz(quiz.id)}>
                    เริ่มทำ Quiz
                  </Button>
                ) : canRetake ? (
                  <Button 
                    variant={isPassed ? "outline" : "default"}
                    onClick={() => onTakeQuiz(quiz.id)}
                  >
                    {isPassed ? 'ทำอีกครั้ง' : 'ลองใหม่'}
                  </Button>
                ) : (
                  <Button disabled>
                    ทำครบจำนวนครั้งแล้ว
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
