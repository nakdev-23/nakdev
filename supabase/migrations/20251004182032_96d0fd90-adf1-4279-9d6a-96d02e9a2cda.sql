-- Add prompt and note columns to tools table
ALTER TABLE public.tools 
ADD COLUMN IF NOT EXISTS prompt TEXT,
ADD COLUMN IF NOT EXISTS note TEXT;