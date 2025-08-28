import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';

interface SecureVideoPlayerProps {
  videoId: string;
  filePath: string;
  onProgressUpdate?: (duration: number, completed: boolean) => void;
}

export const SecureVideoPlayer = ({ videoId, filePath, onProgressUpdate }: SecureVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const progressUpdateInterval = useRef<number>();

  const { videoUrl, isLoading, error, getVideoUrl, updateProgress, progress } = useVideoPlayer(videoId);

  // Load video URL when component mounts
  useEffect(() => {
    getVideoUrl(filePath);
  }, [getVideoUrl, filePath]);

  // Set up video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setDuration(video.duration);
      // Restore previous progress if available
      if (progress?.watched_duration) {
        video.currentTime = progress.watched_duration;
        setCurrentTime(progress.watched_duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      updateProgress(video.duration, true);
      onProgressUpdate?.(video.duration, true);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [progress, updateProgress, onProgressUpdate]);

  // Update progress periodically while playing
  useEffect(() => {
    if (isPlaying) {
      progressUpdateInterval.current = window.setInterval(() => {
        if (videoRef.current) {
          const watchedDuration = videoRef.current.currentTime;
          const completed = watchedDuration >= duration * 0.9; // Consider 90% as completed
          updateProgress(watchedDuration, completed);
          onProgressUpdate?.(watchedDuration, completed);
        }
      }, 5000); // Update every 5 seconds
    } else {
      if (progressUpdateInterval.current) {
        clearInterval(progressUpdateInterval.current);
      }
    }

    return () => {
      if (progressUpdateInterval.current) {
        clearInterval(progressUpdateInterval.current);
      }
    };
  }, [isPlaying, duration, updateProgress, onProgressUpdate]);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (newTime: number) => {
    if (!videoRef.current) return;
    
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const changeVolume = (newVolume: number) => {
    if (!videoRef.current) return;

    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (!isFullscreen) {
      videoRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    handleSeek(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
        <div className="text-white">กำลังโหลดวิดีโอ...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="aspect-video bg-red-900/20 border border-red-500/20 rounded-lg flex items-center justify-center">
        <div className="text-red-400">เกิดข้อผิดพลาด: {error}</div>
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <div className="text-muted-foreground">ไม่พบวิดีโอ</div>
      </div>
    );
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden group">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full"
        playsInline
        preload="metadata"
      />

      {/* Play button overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Button
            size="lg"
            className="rounded-full w-16 h-16 bg-primary/90 hover:bg-primary"
            onClick={togglePlay}
          >
            <Play className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-white hover:bg-white/20"
            onClick={() => skipTime(-10)}
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-white hover:bg-white/20"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-white hover:bg-white/20"
            onClick={() => skipTime(10)}
          >
            <SkipForward className="h-4 w-4" />
          </Button>

          <div className="flex-1 mx-4">
            <Progress 
              value={progressPercentage} 
              className="cursor-pointer" 
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percentage = clickX / rect.width;
                handleSeek(percentage * duration);
              }}
            />
          </div>

          <span className="text-sm whitespace-nowrap">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-white hover:bg-white/20"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-white hover:bg-white/20"
            onClick={toggleFullscreen}
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};