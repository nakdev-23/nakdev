import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Ebook {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  pages: number;
  download_url?: string;
  preview_url?: string;
  download_type?: 'url' | 'file';
  file_path?: string;
}

export const useEbooks = () => {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const { data, error } = await supabase
          .from('ebooks')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setEbooks((data || []).map(ebook => ({
          ...ebook,
          download_type: ebook.download_type as 'url' | 'file'
        })));
      } catch (err) {
        console.error('Error fetching ebooks:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch ebooks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEbooks();
  }, []);

  return { ebooks, isLoading, error };
};

export const useEbook = (slug: string) => {
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEbook = async () => {
      if (!slug) return;

      try {
        const { data, error } = await supabase
          .from('ebooks')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setEbook({
          ...data,
          download_type: data.download_type as 'url' | 'file'
        });
      } catch (err) {
        console.error('Error fetching ebook:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch ebook');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEbook();
  }, [slug]);

  return { ebook, isLoading, error };
};