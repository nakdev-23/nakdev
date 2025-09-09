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

        // Fetch user's enrolled courses
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select(`
            *,
            courses!inner(*)
          `)
          .eq('user_id', session.user.id)
          .eq('item_type', 'course');

        if (enrollmentsError) throw enrollmentsError;

        if (!enrollments) {
          setEnrolledCourses([]);
          setIsLoading(false);
          return;
        }

        // For each enrolled course, calculate progress
        const coursesWithProgress = await Promise.all(
          enrollments.map(async (enrollment: any) => {
            const course = enrollment.courses;
            
            // Get lesson progress for this course
            const { data: lessons } = await supabase
              .from('lessons')
              .select('id')
              .eq('course_id', course.id);

            const { data: completedLessons } = await supabase
              .from('lesson_progress')
              .select('lesson_id')
              .eq('user_id', session.user.id)
              .eq('completed', true)
              .in('lesson_id', lessons?.map(l => l.id) || []);

            const totalLessons = lessons?.length || 0;
            const completed = completedLessons?.length || 0;
            const progress = totalLessons > 0 ? (completed / totalLessons) * 100 : 0;

            // Get next incomplete lesson
            const { data: nextLessonData } = await supabase
              .from('lessons')
              .select('title, slug')
              .eq('course_id', course.id)
              .not('id', 'in', `(${completedLessons?.map(cl => cl.lesson_id).join(',') || 'null'})`)
              .order('lesson_order')
              .limit(1);

            return {
              id: course.id,
              slug: course.slug,
              title: course.title,
              description: course.description,
              instructor: course.instructor,
              total_lessons: course.total_lessons || totalLessons,
              duration_hours: course.duration_hours,
              enrolled_at: enrollment.enrolled_at,
              completedLessons: completed,
              progress: Math.round(progress),
              nextLesson: nextLessonData?.[0]?.title || 'เริ่มต้นเรียน'
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