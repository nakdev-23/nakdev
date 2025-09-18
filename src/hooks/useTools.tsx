import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Tool {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  category: string;
  download_url?: string;
  download_type?: 'url' | 'file';
  file_path?: string;
}

export const useTools = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTools((data || []).map(tool => ({
          ...tool,
          download_type: tool.download_type as 'url' | 'file'
        })));
      } catch (err) {
        console.error('Error fetching tools:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch tools');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTools();
  }, []);

  return { tools, isLoading, error };
};

export const useTool = (slug: string) => {
  const [tool, setTool] = useState<Tool | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTool = async () => {
      if (!slug) return;

      try {
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setTool({
          ...data,
          download_type: data.download_type as 'url' | 'file'
        });
      } catch (err) {
        console.error('Error fetching tool:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch tool');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTool();
  }, [slug]);

  return { tool, isLoading, error };
};