-- Insert the Thai course about AI website building
INSERT INTO public.courses (
  id,
  title,
  slug,
  description,
  instructor,
  total_lessons,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'คอร์ส สร้างเว็บไซต์งานๆด้วย AI (Lovable, Bolt)',
  'ai-website-building-thai',
  'เรียนรู้การสร้างเว็บไซต์ด้วย AI Tools อย่าง Lovable และ Bolt ราคาโปรโมชั่น 1290 บาท จากปกติ 1590 บาท (ถึงวันที่ 5 กันยายน)',
  'AI Expert',
  8,
  now(),
  now()
);

-- Get the course ID for inserting lessons
WITH course_data AS (
  SELECT id as course_id FROM public.courses WHERE slug = 'ai-website-building-thai'
)
INSERT INTO public.lessons (
  id,
  course_id,
  title,
  slug,
  description,
  lesson_order,
  chapter_id,
  chapter_title,
  duration_text,
  video_id,
  created_at,
  updated_at
) VALUES 
-- Lesson 1 (placeholder - no video provided yet)
(
  gen_random_uuid(),
  (SELECT course_id FROM course_data),
  'บทเรียนที่ 1: แนะนำ AI Website Building',
  'lesson-1-introduction',
  'ทำความรู้จักกับ AI Tools สำหรับการสร้างเว็บไซต์',
  1,
  1,
  'เริ่มต้นกับ AI',
  '15 นาที',
  NULL,
  now(),
  now()
),
-- Lesson 2
(
  gen_random_uuid(),
  (SELECT course_id FROM course_data),
  'บทเรียนที่ 2: การใช้งาน Lovable และ Bolt',
  'lesson-2-lovable-bolt-usage',
  'เรียนรู้การใช้งาน Lovable และ Bolt เบื้องต้น - https://youtu.be/6tgcgD5KSAQ',
  2,
  1,
  'เริ่มต้นกับ AI',
  '25 นาที',
  NULL,
  now(),
  now()
),
-- Lesson 3 Part 1
(
  gen_random_uuid(),
  (SELECT course_id FROM course_data),
  'บทเรียนที่ 3: สร้างเว็บไซต์จริง (Part 1)',
  'lesson-3-part-1-create-website',
  'เริ่มสร้างเว็บไซต์จริงด้วย AI - https://youtu.be/zOT6kc1lqoo',
  3,
  2,
  'การสร้างเว็บไซต์',
  '30 นาที',
  NULL,
  now(),
  now()
),
-- Lesson 3 Part 2
(
  gen_random_uuid(),
  (SELECT course_id FROM course_data),
  'บทเรียนที่ 3: สร้างเว็บไซต์จริง (Part 2)',
  'lesson-3-part-2-create-website',
  'ต่อจาก Part 1 - https://youtu.be/w97mJg7ZSYY',
  4,
  2,
  'การสร้างเว็บไซต์',
  '28 นาที',
  NULL,
  now(),
  now()
),
-- Lesson 3 Part 3
(
  gen_random_uuid(),
  (SELECT course_id FROM course_data),
  'บทเรียนที่ 3: สร้างเว็บไซต์จริง (Part 3)',
  'lesson-3-part-3-create-website',
  'จบ Part 3 - https://youtu.be/4VQLESX51Co',
  5,
  2,
  'การสร้างเว็บไซต์',
  '32 นาที',
  NULL,
  now(),
  now()
),
-- Placeholder lessons for the remaining 3 lessons (6, 7, 8)
(
  gen_random_uuid(),
  (SELECT course_id FROM course_data),
  'บทเรียนที่ 4: Advanced AI Features',
  'lesson-4-advanced-features',
  'ฟีเจอร์ขั้นสูงของ AI Website Building',
  6,
  3,
  'ขั้นสูง',
  '35 นาที',
  NULL,
  now(),
  now()
),
(
  gen_random_uuid(),
  (SELECT course_id FROM course_data),
  'บทเรียนที่ 5: Deployment และ Optimization',
  'lesson-5-deployment-optimization',
  'การ Deploy และปรับปรุงเว็บไซต์',
  7,
  3,
  'ขั้นสูง',
  '20 นาที',
  NULL,
  now(),
  now()
),
(
  gen_random_uuid(),
  (SELECT course_id FROM course_data),
  'บทเรียนที่ 6: สรุปและโปรเจคจบ',
  'lesson-6-final-project',
  'สรุปการเรียนรู้และทำโปรเจคจบ',
  8,
  3,
  'ขั้นสูง',
  '40 นาที',
  NULL,
  now(),
  now()
);