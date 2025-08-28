-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  instructor TEXT,
  total_lessons INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration_seconds INTEGER,
  duration_text TEXT,
  chapter_id INTEGER,
  chapter_title TEXT,
  lesson_order INTEGER,
  video_id UUID REFERENCES public.videos(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(course_id, slug)
);

-- Create lesson_progress table
CREATE TABLE public.lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for courses (public read access)
CREATE POLICY "Courses are viewable by everyone" 
ON public.courses 
FOR SELECT 
USING (true);

-- Create RLS policies for lessons (public read access)
CREATE POLICY "Lessons are viewable by everyone" 
ON public.lessons 
FOR SELECT 
USING (true);

-- Create RLS policies for lesson_progress
CREATE POLICY "Users can view their own lesson progress" 
ON public.lesson_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lesson progress" 
ON public.lesson_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson progress" 
ON public.lesson_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lesson_progress_updated_at
  BEFORE UPDATE ON public.lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert example course data
INSERT INTO public.courses (slug, title, description, instructor, total_lessons) VALUES 
('react-fundamentals', 'React สำหรับผู้เริ่มต้น', 'เรียนรู้ React ตั้งแต่พื้นฐานจนถึงการสร้างแอปพลิเคชันจริง', 'สมชาย นักพัฒนา', 6);

-- Get the course ID for react-fundamentals
DO $$
DECLARE
    course_uuid UUID;
    video_uuid UUID;
BEGIN
    -- Get course ID
    SELECT id INTO course_uuid FROM public.courses WHERE slug = 'react-fundamentals';
    
    -- Insert example videos first
    INSERT INTO public.videos (id, title, description, file_path, course_id, lesson_id, duration) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'ทำความรู้จักกับ React', 'เรียนรู้พื้นฐาน React และเหตุผลที่ทำให้ React เป็น Library ที่นิยม', 'react-fundamentals/lesson-1.mp4', 'react-fundamentals', 'lesson-1', 930),
    ('550e8400-e29b-41d4-a716-446655440001', 'การติดตั้ง Development Environment', 'เรียนรู้วิธีการติดตั้งเครื่องมือพัฒนา', 'react-fundamentals/lesson-2.mp4', 'react-fundamentals', 'lesson-2', 1245),
    ('550e8400-e29b-41d4-a716-446655440002', 'สร้างโปรเจคแรก', 'สร้างโปรเจค React แรกของคุณ', 'react-fundamentals/lesson-3.mp4', 'react-fundamentals', 'lesson-3', 1515),
    ('550e8400-e29b-41d4-a716-446655440003', 'เข้าใจ Components', 'เรียนรู้เกี่ยวกับ React Components', 'react-fundamentals/lesson-4.mp4', 'react-fundamentals', 'lesson-4', 1800),
    ('550e8400-e29b-41d4-a716-446655440004', 'Props และ State', 'เรียนรู้การใช้ Props และ State', 'react-fundamentals/lesson-5.mp4', 'react-fundamentals', 'lesson-5', 2120),
    ('550e8400-e29b-41d4-a716-446655440005', 'Event Handling', 'เรียนรู้การจัดการ Events ใน React', 'react-fundamentals/lesson-6.mp4', 'react-fundamentals', 'lesson-6', 1530);

    -- Insert example lessons
    INSERT INTO public.lessons (course_id, slug, title, description, duration_seconds, duration_text, chapter_id, chapter_title, lesson_order, video_id) VALUES
    (course_uuid, 'lesson-1', 'ทำความรู้จักกับ React', 'เรียนรู้พื้นฐาน React และเหตุผลที่ทำให้ React เป็น Library ที่นิยมในการพัฒนา Frontend', 930, '15:30', 1, 'บทนำและการเตรียมตัว', 1, '550e8400-e29b-41d4-a716-446655440000'),
    (course_uuid, 'lesson-2', 'การติดตั้ง Development Environment', 'เรียนรู้วิธีการติดตั้งเครื่องมือที่จำเป็นสำหรับการพัฒนา React', 1245, '20:45', 1, 'บทนำและการเตรียมตัว', 2, '550e8400-e29b-41d4-a716-446655440001'),
    (course_uuid, 'lesson-3', 'สร้างโปรเจคแรก', 'สร้างโปรเจค React แรกของคุณด้วย Create React App', 1515, '25:15', 1, 'บทนำและการเตรียมตัว', 3, '550e8400-e29b-41d4-a716-446655440002'),
    (course_uuid, 'lesson-4', 'เข้าใจ Components', 'เรียนรู้เกี่ยวกับ React Components และวิธีการสร้าง', 1800, '30:00', 2, 'React Components', 4, '550e8400-e29b-41d4-a716-446655440003'),
    (course_uuid, 'lesson-5', 'Props และ State', 'เรียนรู้การใช้ Props และ State ใน React Components', 2120, '35:20', 2, 'React Components', 5, '550e8400-e29b-41d4-a716-446655440004'),
    (course_uuid, 'lesson-6', 'Event Handling', 'เรียนรู้การจัดการ Events และการโต้ตอบกับผู้ใช้', 1530, '25:30', 2, 'React Components', 6, '550e8400-e29b-41d4-a716-446655440005');
END $$;