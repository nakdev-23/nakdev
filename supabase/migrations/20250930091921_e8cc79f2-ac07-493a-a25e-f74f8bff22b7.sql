-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create policy for public viewing of active testimonials
CREATE POLICY "Active testimonials are viewable by everyone"
ON public.testimonials
FOR SELECT
USING (is_active = true);

-- Admin policies
CREATE POLICY "Admins can insert testimonials"
ON public.testimonials
FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Admins can update testimonials"
ON public.testimonials
FOR UPDATE
USING (is_admin());

CREATE POLICY "Admins can delete testimonials"
ON public.testimonials
FOR DELETE
USING (is_admin());

-- Insert sample testimonials
INSERT INTO public.testimonials (name, role, company, content, rating, sort_order) VALUES
  ('สมชาย เจริญสุข', 'Frontend Developer', 'Tech Startup', 'คอร์สเรียนที่นี่ช่วยให้ผมเข้าใจ React ได้อย่างลึกซึ้ง และสามารถนำไปใช้ในงานจริงได้ทันทีเลย', 5, 1),
  ('วิภาวี สร้างสรรค์', 'Full Stack Developer', 'Digital Agency', 'เครื่องมือและ eBook ที่ได้จากที่นี่ช่วยประหยัดเวลาในการทำงานได้มาก คุ้มค่ามากๆ', 5, 2),
  ('กรกต นวัตกรรม', 'Backend Developer', 'Enterprise', 'จากคนที่ไม่รู้อะไรเลย กลายเป็นสามารถสร้างเว็บแอปพลิเคชันได้จริงๆ ขอบคุณมากครับ', 5, 3);