import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEbookEnrollment = (ebookId: string) => {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!ebookId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsEnrolled(false);
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('enrollments')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('item_id', ebookId)
          .eq('item_type', 'ebook')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking ebook enrollment:', error);
        }

        setIsEnrolled(!!data);
      } catch (err) {
        console.error('Error checking ebook enrollment:', err);
        setIsEnrolled(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkEnrollment();
  }, [ebookId]);

  return { isEnrolled, isLoading };
};