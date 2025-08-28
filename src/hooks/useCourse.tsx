import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  instructor: string;
  total_lessons: number;
}

interface Lesson {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration_text: string;
  chapter_id: number;
  chapter_title: string;
  lesson_order: number;
  video_id: string;
  youtube_url: string | null;
  video: {
    file_path: string;
  };
}

interface LessonProgress {
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
}

interface Chapter {
  id: number;
  title: string;
  lessons: (Lesson & { completed: boolean; current: boolean })[];
}

export const useCourse = (courseSlug: string, lessonSlug?: string) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseSlug) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch course
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('slug', courseSlug)
          .single();

        if (courseError) throw courseError;
        setCourse(courseData);

        // Fetch lessons with video data
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select(`
            *,
            video:videos(file_path)
          `)
          .eq('course_id', courseData.id)
          .order('lesson_order');

        if (lessonsError) throw lessonsError;
        setLessons(lessonsData || []);

        // Fetch user progress if authenticated
        let progressData: LessonProgress[] = [];
        const { data: { session } } = await supabase.auth.getSession();
        if (session && lessonsData && lessonsData.length > 0) {
          const { data: userProgressData, error: progressError } = await supabase
            .from('lesson_progress')
            .select('lesson_id, completed, completed_at')
            .eq('user_id', session.user.id)
            .in('lesson_id', lessonsData.map(l => l.id));

          if (!progressError && userProgressData) {
            progressData = userProgressData;
            setProgress(userProgressData);
          }
        }

        // Group lessons by chapters using the fresh progress data
        const chaptersMap = new Map<number, Chapter>();
        const progressMap = new Map(progressData.map(p => [p.lesson_id, p]));

        (lessonsData || []).forEach((lesson) => {
          const chapterId = lesson.chapter_id;
          const lessonProgress = progressMap.get(lesson.id);
          const isCurrent = lessonSlug === lesson.slug;

          if (!chaptersMap.has(chapterId)) {
            chaptersMap.set(chapterId, {
              id: chapterId,
              title: lesson.chapter_title,
              lessons: []
            });
          }

          chaptersMap.get(chapterId)!.lessons.push({
            ...lesson,
            completed: lessonProgress?.completed || false,
            current: isCurrent
          });
        });

        const chaptersArray = Array.from(chaptersMap.values()).sort((a, b) => a.id - b.id);
        setChapters(chaptersArray);

        // Set current lesson
        if (lessonSlug) {
          const current = lessonsData?.find(l => l.slug === lessonSlug) || null;
          setCurrentLesson(current);
        } else if (lessonsData && lessonsData.length > 0) {
          setCurrentLesson(lessonsData[0]);
        }

      } catch (err) {
        console.error('Error fetching course data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load course data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [courseSlug, lessonSlug]);

  const completedLessons = progress.filter(p => p.completed).length;

  return {
    course,
    lessons,
    chapters,
    currentLesson,
    completedLessons,
    isLoading,
    error
  };
};