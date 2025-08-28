-- Add YouTube URL column to lessons table
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS youtube_url TEXT;

-- Update lessons with YouTube embed URLs
UPDATE lessons SET youtube_url = 'https://www.youtube.com/embed/6tgcgD5KSAQ?si=MXegpg6QvSjC6PbK' 
WHERE slug = 'lesson-2-lovable-bolt-usage';

UPDATE lessons SET youtube_url = 'https://www.youtube.com/embed/zOT6kc1lqoo?si=iRtC1bC5sAh-Grjt' 
WHERE slug = 'lesson-3-part-1-create-website';

UPDATE lessons SET youtube_url = 'https://www.youtube.com/embed/w97mJg7ZSYY?si=Y8wMIUOQzN2cvafK' 
WHERE slug = 'lesson-3-part-2-create-website';

UPDATE lessons SET youtube_url = 'https://www.youtube.com/embed/4VQLESX51Co?si=6jW-A8-Obdny8wEi' 
WHERE slug = 'lesson-3-part-3-create-website';