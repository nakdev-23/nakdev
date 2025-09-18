-- Create storage buckets for tools and ebooks
INSERT INTO storage.buckets (id, name, public) VALUES ('tools', 'tools', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('ebooks', 'ebooks', false);

-- Add new columns to tools table
ALTER TABLE public.tools 
ADD COLUMN file_path TEXT,
ADD COLUMN download_type TEXT DEFAULT 'url' CHECK (download_type IN ('url', 'file'));

-- Add new columns to ebooks table  
ALTER TABLE public.ebooks
ADD COLUMN file_path TEXT,
ADD COLUMN download_type TEXT DEFAULT 'url' CHECK (download_type IN ('url', 'file'));

-- Create storage policies for tools bucket
CREATE POLICY "Authenticated users can view tools files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'tools' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins can upload tools files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'tools' AND is_admin());

CREATE POLICY "Admins can update tools files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'tools' AND is_admin());

CREATE POLICY "Admins can delete tools files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'tools' AND is_admin());

-- Create storage policies for ebooks bucket
CREATE POLICY "Authenticated users can view ebooks files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'ebooks' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins can upload ebooks files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'ebooks' AND is_admin());

CREATE POLICY "Admins can update ebooks files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'ebooks' AND is_admin());

CREATE POLICY "Admins can delete ebooks files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'ebooks' AND is_admin());