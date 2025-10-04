-- Add content_type column to tools table
ALTER TABLE public.tools 
ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'download' CHECK (content_type IN ('download', 'prompt'));