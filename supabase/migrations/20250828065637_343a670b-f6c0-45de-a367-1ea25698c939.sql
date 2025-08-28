-- สร้างตารางสำหรับข้อมูลวิดีโอ
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL, -- path ใน storage bucket
  thumbnail_path TEXT,
  duration INTEGER, -- ความยาวเป็นวินาที
  course_id TEXT,
  lesson_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- สร้างตารางสำหรับ video views/progress
CREATE TABLE public.video_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  watched_duration INTEGER DEFAULT 0, -- เวลาที่ดูไปแล้ว (วินาที)
  completed BOOLEAN DEFAULT FALSE,
  last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- เปิด RLS สำหรับความปลอดภัย
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_progress ENABLE ROW LEVEL SECURITY;

-- สร้าง policies สำหรับ videos (ดูได้ทุกคนที่ login)
CREATE POLICY "Videos are viewable by authenticated users" 
ON public.videos 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- สร้าง policies สำหรับ video_progress
CREATE POLICY "Users can view their own video progress" 
ON public.video_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own video progress" 
ON public.video_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own video progress" 
ON public.video_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- สร้าง storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('course-videos', 'course-videos', false),
  ('video-thumbnails', 'video-thumbnails', false);

-- สร้าง policies สำหรับ storage buckets
-- Video storage policies (เฉพาะ admin เท่านั้นที่อัปโหลดได้)
CREATE POLICY "Admin can upload videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'course-videos' AND 
  public.get_current_user_role() = 'ADMIN'
);

CREATE POLICY "Admin can update videos" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'course-videos' AND 
  public.get_current_user_role() = 'ADMIN'
);

CREATE POLICY "Admin can delete videos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'course-videos' AND 
  public.get_current_user_role() = 'ADMIN'
);

-- Thumbnail storage policies
CREATE POLICY "Admin can upload thumbnails" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'video-thumbnails' AND 
  public.get_current_user_role() = 'ADMIN'
);

CREATE POLICY "Authenticated users can view thumbnails" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'video-thumbnails' AND 
  auth.uid() IS NOT NULL
);

-- สร้าง triggers สำหรับ auto-update timestamps
CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_video_progress_updated_at
  BEFORE UPDATE ON public.video_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();