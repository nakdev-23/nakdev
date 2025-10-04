-- Add gallery_images column to tools table for multiple images
ALTER TABLE public.tools 
ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}';

-- Add comment for clarity
COMMENT ON COLUMN public.tools.gallery_images IS 'Array of storage paths for gallery images displayed on tool detail page';