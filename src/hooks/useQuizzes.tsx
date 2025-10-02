import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Quiz {
  id: string;
  course_id: string;
  lesson_id: string | null;
  title: string;
  description: string | null;
  passing_score: number;
  time_limit_minutes: number | null;
  max_attempts: number | null;
  position: number;
  show_correct_answers: boolean;
  is_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  points: number;
  order_number: number;
  created_at: string;
  updated_at: string;
}

export interface QuizAnswerOption {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
  order_number: number;
  created_at: string;
}

export const useQuizzes = (courseId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: quizzes = [], isLoading } = useQuery({
    queryKey: ["quizzes", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .eq("course_id", courseId)
        .order("position", { ascending: true });

      if (error) throw error;
      return data as Quiz[];
    },
  });

  const createQuiz = useMutation({
    mutationFn: async (quizData: any) => {
      const { questions, ...quiz } = quizData;
      
      // Step 1: Create quiz
      const { data: quizRecord, error: quizError } = await supabase
        .from("quizzes")
        .insert([quiz])
        .select()
        .single();

      if (quizError) throw quizError;

      // Step 2: Create questions if provided
      if (questions && questions.length > 0) {
        for (const question of questions) {
          const { options, ...questionData } = question;
          
          const { data: questionRecord, error: questionError } = await supabase
            .from("quiz_questions")
            .insert([{
              quiz_id: quizRecord.id,
              question_text: questionData.question_text,
              question_type: questionData.question_type,
              points: questionData.points,
              order_number: questionData.order_number,
            }])
            .select()
            .single();

          if (questionError) throw questionError;

          // Step 3: Create options for this question
          if (options && options.length > 0) {
            const optionsToInsert = options.map((opt: any) => ({
              question_id: questionRecord.id,
              option_text: opt.option_text,
              is_correct: opt.is_correct,
              order_number: opt.order_number,
            }));

            const { error: optionsError } = await supabase
              .from("quiz_answer_options")
              .insert(optionsToInsert);

            if (optionsError) throw optionsError;
          }
        }
      }

      return quizRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes", courseId] });
      toast({
        title: "สำเร็จ",
        description: "เพิ่ม Quiz พร้อมคำถามเรียบร้อยแล้ว",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateQuiz = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Quiz> & { id: string }) => {
      const { data, error } = await supabase
        .from("quizzes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes", courseId] });
      toast({
        title: "สำเร็จ",
        description: "อัพเดท Quiz เรียบร้อยแล้ว",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteQuiz = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("quizzes")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes", courseId] });
      toast({
        title: "สำเร็จ",
        description: "ลบ Quiz เรียบร้อยแล้ว",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    quizzes,
    isLoading,
    createQuiz,
    updateQuiz,
    deleteQuiz,
  };
};
