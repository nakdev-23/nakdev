import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Clock, CheckCircle, XCircle } from "lucide-react";

interface QuizTakingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizId: string;
  onComplete: () => void;
}

export default function QuizTakingDialog({ 
  open, 
  onOpenChange, 
  quizId,
  onComplete 
}: QuizTakingDialogProps) {
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open && quizId) {
      loadQuiz();
    }
  }, [open, quizId]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev! - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const loadQuiz = async () => {
    try {
      const { data: quizData, error: quizError } = await supabase
        .from("quizzes")
        .select("*")
        .eq("id", quizId)
        .single();

      if (quizError) throw quizError;

      const { data: questionsData, error: questionsError } = await supabase
        .from("quiz_questions")
        .select(`
          *,
          quiz_answer_options (*)
        `)
        .eq("quiz_id", quizId)
        .order("order_number", { ascending: true });

      if (questionsError) throw questionsError;

      setQuiz(quizData);
      setQuestions(questionsData);
      
      if (quizData.time_limit_minutes) {
        setTimeLeft(quizData.time_limit_minutes * 60);
      }
    } catch (error: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAnswerChange = (questionId: string, answerId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("ไม่พบข้อมูลผู้ใช้");

      // Calculate score
      let totalPoints = 0;
      let earnedPoints = 0;

      questions.forEach(question => {
        totalPoints += question.points;
        const selectedAnswer = answers[question.id];
        if (selectedAnswer) {
          const correctOption = question.quiz_answer_options.find((opt: any) => opt.is_correct);
          if (correctOption && correctOption.id === selectedAnswer) {
            earnedPoints += question.points;
          }
        }
      });

      const scorePercentage = (earnedPoints / totalPoints) * 100;
      const passed = scorePercentage >= quiz.passing_score;

      // Get attempt number
      const { data: previousAttempts } = await supabase
        .from("student_quiz_attempts")
        .select("attempt_number")
        .eq("quiz_id", quizId)
        .eq("user_id", user.id)
        .order("attempt_number", { ascending: false })
        .limit(1);

      const attemptNumber = (previousAttempts?.[0]?.attempt_number || 0) + 1;

      // Save attempt
      const { error } = await supabase
        .from("student_quiz_attempts")
        .insert([{
          quiz_id: quizId,
          user_id: user.id,
          score: earnedPoints,
          total_points: totalPoints,
          passed,
          answers,
          attempt_number: attemptNumber,
          completed_at: new Date().toISOString(),
        }]);

      if (error) throw error;

      setResults({
        score: earnedPoints,
        totalPoints,
        percentage: scorePercentage,
        passed,
      });
      setShowResults(true);

      toast({
        title: passed ? "ยินดีด้วย! คุณผ่าน Quiz" : "ไม่ผ่าน",
        description: `คะแนน: ${Math.round(scorePercentage)}%`,
        variant: passed ? "default" : "destructive",
      });

      onComplete();
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

  if (!quiz || questions.length === 0) {
    return null;
  }

  if (showResults && results) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>ผลลัพธ์ Quiz</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <Card className={results.passed ? "border-success" : "border-destructive"}>
              <CardContent className="p-6 text-center">
                {results.passed ? (
                  <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                ) : (
                  <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                )}
                <h3 className="text-2xl font-bold mb-2">
                  {results.passed ? "ยินดีด้วย! คุณผ่าน" : "ไม่ผ่าน"}
                </h3>
                <p className="text-4xl font-bold mb-2">
                  {Math.round(results.percentage)}%
                </p>
                <p className="text-muted-foreground">
                  คะแนน: {results.score}/{results.totalPoints}
                </p>
              </CardContent>
            </Card>
            <Button onClick={() => onOpenChange(false)} className="w-full">
              ปิด
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{quiz.title}</DialogTitle>
            {timeLeft !== null && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>คำถามที่ {currentQuestionIndex + 1} จาก {questions.length}</span>
              <span>{currentQuestion.points} คะแนน</span>
            </div>
            <Progress value={progress} />
          </div>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">{currentQuestion.question_text}</h3>
              
              <RadioGroup
                value={answers[currentQuestion.id] || ""}
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
              >
                {currentQuestion.quiz_answer_options
                  .sort((a: any, b: any) => a.order_number - b.order_number)
                  .map((option: any) => (
                    <div key={option.id} className="flex items-center space-x-2 p-3 border rounded-lg mb-2">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                        {option.option_text}
                      </Label>
                    </div>
                  ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            {currentQuestionIndex > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              >
                ก่อนหน้า
              </Button>
            )}
            
            {currentQuestionIndex < questions.length - 1 ? (
              <Button
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                className="flex-1"
              >
                ถัดไป
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || Object.keys(answers).length < questions.length}
                className="flex-1"
              >
                {isSubmitting ? "กำลังส่ง..." : "ส่งคำตอบ"}
              </Button>
            )}
          </div>

          {Object.keys(answers).length < questions.length && (
            <p className="text-sm text-muted-foreground text-center">
              กรุณาตอบคำถามให้ครบทุกข้อก่อนส่ง ({Object.keys(answers).length}/{questions.length})
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
