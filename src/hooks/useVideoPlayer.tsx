import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VideoData {
  id: string;
  title: string;
  course_id: string;
  lesson_id: string;
}

interface VideoProgress {
  watched_duration: number;
  completed: boolean;
  last_watched_at: string;
}

export const useVideoPlayer = (videoId: string) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<VideoProgress | null>(null);
  const [videoData, setVideoData] = useState<VideoData | null>(null);

  // Get video URL with signed access
  const getVideoUrl = useCallback(async (filePath: string) => {
    if (!videoId || !filePath) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('get-video-url', {
        body: { videoId, filePath }
      });

      if (error) throw error;

      setVideoUrl(data.videoUrl);
      setVideoData(data.video);
    } catch (err) {
      console.error('Error getting video URL:', err);
      setError(err instanceof Error ? err.message : 'Failed to load video');
    } finally {
      setIsLoading(false);
    }
  }, [videoId]);

  // Update video progress
  const updateProgress = useCallback(async (watchedDuration: number, completed: boolean = false) => {
    if (!videoId) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;

      const { data, error } = await supabase.functions.invoke('update-video-progress', {
        body: { videoId, watchedDuration, completed }
      });

      if (error) throw error;

      setProgress(data.progress);
    } catch (err) {
      console.error('Error updating video progress:', err);
    }
  }, [videoId]);

  // Get existing progress
  const getProgress = useCallback(async () => {
    if (!videoId) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;

      const { data, error } = await supabase
        .from('video_progress')
        .select('watched_duration, completed, last_watched_at')
        .eq('video_id', videoId)
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) throw error;

      setProgress(data);
    } catch (err) {
      console.error('Error getting video progress:', err);
    }
  }, [videoId]);

  useEffect(() => {
    getProgress();
  }, [getProgress]);

  return {
    videoUrl,
    videoData,
    progress,
    isLoading,
    error,
    getVideoUrl,
    updateProgress
  };
};