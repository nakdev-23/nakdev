import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  instructor: string;
  total_lessons: number;
  price: number | null;
  level: string;
  duration_hours: number;
  student_count: number;
  rating: number;
  review_count: number;
  features: string[];
  tags: string[];
  instructor_title: string | null;
  instructor_company: string | null;
  instructor_experience: string | null;
  instructor_bio: string | null;
  about_course: string | null;
  is_free: boolean;
  original_price: number | null;
  cover_image_url: string | null;
  cover_image_path: string | null;
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
}

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCourses(data || []);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { courses, isLoading, error };
};

export const useCourseWithLessons = (courseSlug: string) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseSlug) return;

      try {
        // Fetch course
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('slug', courseSlug)
          .single();

        if (courseError) throw courseError;
        setCourse(courseData);

        // Fetch lessons
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select('*')
          .eq('course_id', courseData.id)
          .order('lesson_order');

        if (lessonsError) throw lessonsError;
        setLessons(lessonsData || []);
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch course data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [courseSlug]);

  return { course, lessons, isLoading, error };
};