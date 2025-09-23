-- Add cover image fields to courses table
ALTER TABLE public.courses 
ADD COLUMN cover_image_url TEXT,
ADD COLUMN cover_image_path TEXT;

-- Add cover image fields to ebooks table
ALTER TABLE public.ebooks 
ADD COLUMN cover_image_url TEXT,
ADD COLUMN cover_image_path TEXT;

-- Add cover image fields to tools table
ALTER TABLE public.tools 
ADD COLUMN cover_image_url TEXT,
ADD COLUMN cover_image_path TEXT;

-- Create storage bucket for product cover images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-covers', 'product-covers', true);

-- Create storage policies for product cover images
CREATE POLICY "Product cover images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-covers');

CREATE POLICY "Admins can upload product cover images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'product-covers' AND is_admin());

CREATE POLICY "Admins can update product cover images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'product-covers' AND is_admin());

CREATE POLICY "Admins can delete product cover images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'product-covers' AND is_admin());