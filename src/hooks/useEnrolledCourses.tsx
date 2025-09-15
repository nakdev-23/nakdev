import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EnrolledCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  instructor: string;
  total_lessons: number;
  duration_hours: number;
  enrolled_at: string;
  completedLessons: number;
  progress: number;
  lastWatchedLesson?: string;
  nextLesson?: string;
  nextLessonSlug?: string;
  firstLessonSlug?: string;
}

export const useEnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsLoading(false);
          return;
        }

        // Fetch user's enrolled course IDs first (no FK join)
        const { data: enrollmentRows, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select('item_id, enrolled_at')
          .eq('user_id', session.user.id)
          .eq('item_type', 'course');

        if (enrollmentsError) throw enrollmentsError;

        if (!enrollmentRows || enrollmentRows.length === 0) {
          setEnrolledCourses([]);
          setIsLoading(false);
          return;
        }

        const courseIds = enrollmentRows.map((e: any) => e.item_id);
        const enrollMap = Object.fromEntries(enrollmentRows.map((e: any) => [e.item_id, e.enrolled_at]));

        const { data: courses, error: coursesError } = await supabase
          .from('courses')
          .select('id, slug, title, description, instructor, total_lessons, duration_hours')
          .in('id', courseIds);

        if (coursesError) throw coursesError;

        // For each enrolled course, calculate progress
        const coursesWithProgress = await Promise.all(
          (courses || []).map(async (course: any) => {
            // Get lesson ids for this course
            const { data: lessons } = await supabase
              .from('lessons')
              .select('id, slug')
              .eq('course_id', course.id)
              .order('lesson_order');

            const { data: completedLessons } = await supabase
              .from('lesson_progress')
              .select('lesson_id')
              .eq('user_id', session.user.id)
              .eq('completed', true)
              .in('lesson_id', lessons?.map((l: any) => l.id) || []);

            const totalLessons = lessons?.length || 0;
            const completed = completedLessons?.length || 0;
            const progress = totalLessons > 0 ? (completed / totalLessons) * 100 : 0;
            const firstLessonSlug = lessons?.[0]?.slug || null;

            let nextLessonTitle = 'เริ่มต้นเรียน';
            let nextLessonSlug = firstLessonSlug || undefined;
            if (totalLessons > 0) {
              if (completed > 0) {
                const completedIds = completedLessons!.map((cl: any) => cl.lesson_id);
                const { data: nextLessonData } = await supabase
                  .from('lessons')
                  .select('title, slug')
                  .eq('course_id', course.id)
                  .not('id', 'in', `(${completedIds.join(',')})`)
                  .order('lesson_order')
                  .limit(1);
                nextLessonTitle = nextLessonData?.[0]?.title || nextLessonTitle;
                nextLessonSlug = nextLessonData?.[0]?.slug || nextLessonSlug;
              } else {
                const { data: firstLesson } = await supabase
                  .from('lessons')
                  .select('title')
                  .eq('course_id', course.id)
                  .order('lesson_order')
                  .limit(1);
                nextLessonTitle = firstLesson?.[0]?.title || nextLessonTitle;
              }
            }

            return {
              id: course.id,
              slug: course.slug,
              title: course.title,
              description: course.description,
              instructor: course.instructor,
              total_lessons: course.total_lessons || totalLessons,
              duration_hours: course.duration_hours,
              enrolled_at: enrollMap[course.id] || null,
              completedLessons: completed,
              progress: Math.round(progress),
              nextLesson: nextLessonTitle,
              nextLessonSlug,
              firstLessonSlug
            };
          })
        );

        setEnrolledCourses(coursesWithProgress);
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch enrolled courses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const continuingCourses = enrolledCourses.filter(course => course.progress > 0 && course.progress < 100);
  const completedCourses = enrolledCourses.filter(course => course.progress === 100);
  const notStartedCourses = enrolledCourses.filter(course => course.progress === 0);

  return { 
    enrolledCourses, 
    continuingCourses,
    completedCourses,
    notStartedCourses,
    isLoading, 
    error 
  };
};