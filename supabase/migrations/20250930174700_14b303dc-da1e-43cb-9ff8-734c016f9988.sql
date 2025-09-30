-- Create assignments table for homework
CREATE TABLE public.assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  attachment_type TEXT CHECK (attachment_type IN ('file', 'link', 'both')),
  attachment_url TEXT,
  attachment_file_path TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  points INTEGER DEFAULT 0,
  position INTEGER DEFAULT 0,
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INTEGER DEFAULT 70,
  time_limit_minutes INTEGER,
  max_attempts INTEGER,
  position INTEGER DEFAULT 0,
  show_correct_answers BOOLEAN DEFAULT true,
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quiz questions table
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer')),
  points INTEGER DEFAULT 1,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quiz answer options table
CREATE TABLE public.quiz_answer_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student assignments submissions table
CREATE TABLE public.student_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  submission_type TEXT CHECK (submission_type IN ('file', 'link', 'text')),
  submission_url TEXT,
  submission_file_path TEXT,
  submission_text TEXT,
  score INTEGER,
  feedback TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  graded_at TIMESTAMP WITH TIME ZONE,
  graded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student quiz attempts table
CREATE TABLE public.student_quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  score INTEGER NOT NULL,
  total_points INTEGER NOT NULL,
  passed BOOLEAN DEFAULT false,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  time_taken_seconds INTEGER,
  attempt_number INTEGER NOT NULL,
  answers JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for assignment submissions
INSERT INTO storage.buckets (id, name, public) 
VALUES ('assignment-submissions', 'assignment-submissions', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answer_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assignments
CREATE POLICY "Admins can manage assignments" ON public.assignments
  FOR ALL USING (is_admin());

CREATE POLICY "Enrolled users can view assignments" ON public.assignments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.enrollments 
      WHERE enrollments.item_id = assignments.course_id 
      AND enrollments.user_id = auth.uid()
      AND enrollments.item_type = 'course'
    )
  );

-- RLS Policies for quizzes
CREATE POLICY "Admins can manage quizzes" ON public.quizzes
  FOR ALL USING (is_admin());

CREATE POLICY "Enrolled users can view quizzes" ON public.quizzes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.enrollments 
      WHERE enrollments.item_id = quizzes.course_id 
      AND enrollments.user_id = auth.uid()
      AND enrollments.item_type = 'course'
    )
  );

-- RLS Policies for quiz questions
CREATE POLICY "Admins can manage quiz questions" ON public.quiz_questions
  FOR ALL USING (is_admin());

CREATE POLICY "Enrolled users can view quiz questions" ON public.quiz_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quizzes q
      JOIN public.enrollments e ON e.item_id = q.course_id
      WHERE q.id = quiz_questions.quiz_id
      AND e.user_id = auth.uid()
      AND e.item_type = 'course'
    )
  );

-- RLS Policies for quiz answer options
CREATE POLICY "Admins can manage quiz answer options" ON public.quiz_answer_options
  FOR ALL USING (is_admin());

CREATE POLICY "Enrolled users can view quiz answer options" ON public.quiz_answer_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quiz_questions qq
      JOIN public.quizzes q ON q.id = qq.quiz_id
      JOIN public.enrollments e ON e.item_id = q.course_id
      WHERE qq.id = quiz_answer_options.question_id
      AND e.user_id = auth.uid()
      AND e.item_type = 'course'
    )
  );

-- RLS Policies for student assignments
CREATE POLICY "Admins can manage all submissions" ON public.student_assignments
  FOR ALL USING (is_admin());

CREATE POLICY "Users can view their own submissions" ON public.student_assignments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own submissions" ON public.student_assignments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions" ON public.student_assignments
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for student quiz attempts
CREATE POLICY "Admins can view all quiz attempts" ON public.student_quiz_attempts
  FOR SELECT USING (is_admin());

CREATE POLICY "Users can view their own quiz attempts" ON public.student_quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quiz attempts" ON public.student_quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Storage policies for assignment submissions
CREATE POLICY "Users can upload their own assignment files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'assignment-submissions' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own assignment files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'assignment-submissions' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all assignment files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'assignment-submissions' 
    AND is_admin()
  );

-- Create indexes for better performance
CREATE INDEX idx_assignments_course_id ON public.assignments(course_id);
CREATE INDEX idx_assignments_lesson_id ON public.assignments(lesson_id);
CREATE INDEX idx_quizzes_course_id ON public.quizzes(course_id);
CREATE INDEX idx_quizzes_lesson_id ON public.quizzes(lesson_id);
CREATE INDEX idx_quiz_questions_quiz_id ON public.quiz_questions(quiz_id);
CREATE INDEX idx_quiz_answer_options_question_id ON public.quiz_answer_options(question_id);
CREATE INDEX idx_student_assignments_user_id ON public.student_assignments(user_id);
CREATE INDEX idx_student_assignments_assignment_id ON public.student_assignments(assignment_id);
CREATE INDEX idx_student_quiz_attempts_user_id ON public.student_quiz_attempts(user_id);
CREATE INDEX idx_student_quiz_attempts_quiz_id ON public.student_quiz_attempts(quiz_id);

-- Create triggers for updated_at
CREATE TRIGGER update_assignments_updated_at
  BEFORE UPDATE ON public.assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON public.quizzes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quiz_questions_updated_at
  BEFORE UPDATE ON public.quiz_questions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_assignments_updated_at
  BEFORE UPDATE ON public.student_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();