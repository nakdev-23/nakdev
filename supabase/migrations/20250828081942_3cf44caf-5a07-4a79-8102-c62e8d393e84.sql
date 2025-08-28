-- Add videos for the Thai AI course lessons (fixed type casting)
WITH course_data AS (
  SELECT id as course_id FROM public.courses WHERE slug = 'ai-website-building-thai'
),
lesson_data AS (
  SELECT l.id, l.lesson_order, l.title, c.course_id
  FROM public.lessons l
  JOIN course_data c ON l.course_id = c.course_id
  WHERE l.course_id = (SELECT course_id FROM course_data)
)
INSERT INTO public.videos (
  id,
  title,
  description,
  file_path,
  duration,
  lesson_id,
  course_id,
  thumbnail_path,
  created_at,
  updated_at
) VALUES 
-- Video for Lesson 2
(
  gen_random_uuid(),
  'บทเรียนที่ 2: การใช้งาน Lovable และ Bolt',
  'เรียนรู้การใช้งาน Lovable และ Bolt เบื้องต้น',
  'https://youtu.be/6tgcgD5KSAQ',
  1500, -- 25 minutes in seconds
  (SELECT id::text FROM lesson_data WHERE lesson_order = 2),
  (SELECT course_id::text FROM course_data),
  NULL,
  now(),
  now()
),
-- Video for Lesson 3 Part 1
(
  gen_random_uuid(),
  'บทเรียนที่ 3: สร้างเว็บไซต์จริง (Part 1)',
  'เริ่มสร้างเว็บไซต์จริงด้วย AI',
  'https://youtu.be/zOT6kc1lqoo',
  1800, -- 30 minutes in seconds
  (SELECT id::text FROM lesson_data WHERE lesson_order = 3),
  (SELECT course_id::text FROM course_data),
  NULL,
  now(),
  now()
),
-- Video for Lesson 3 Part 2
(
  gen_random_uuid(),
  'บทเรียนที่ 3: สร้างเว็บไซต์จริง (Part 2)',
  'ต่อจาก Part 1',
  'https://youtu.be/w97mJg7ZSYY',
  1680, -- 28 minutes in seconds
  (SELECT id::text FROM lesson_data WHERE lesson_order = 4),
  (SELECT course_id::text FROM course_data),
  NULL,
  now(),
  now()
),
-- Video for Lesson 3 Part 3
(
  gen_random_uuid(),
  'บทเรียนที่ 3: สร้างเว็บไซต์จริง (Part 3)',
  'จบ Part 3',
  'https://youtu.be/4VQLESX51Co',
  1920, -- 32 minutes in seconds
  (SELECT id::text FROM lesson_data WHERE lesson_order = 5),
  (SELECT course_id::text FROM course_data),
  NULL,
  now(),
  now()
);

-- Update lessons to reference the video IDs
WITH course_data AS (
  SELECT id as course_id FROM public.courses WHERE slug = 'ai-website-building-thai'
),
video_lesson_mapping AS (
  SELECT 
    v.id as video_id,
    l.id as lesson_id,
    l.lesson_order
  FROM public.videos v
  JOIN public.lessons l ON v.lesson_id = l.id::text
  WHERE l.course_id = (SELECT course_id FROM course_data)
)
UPDATE public.lessons 
SET video_id = vlm.video_id
FROM video_lesson_mapping vlm
WHERE lessons.id = vlm.lesson_id
AND lessons.course_id = (SELECT course_id FROM course_data);