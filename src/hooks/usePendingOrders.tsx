import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export function usePendingOrdersCount() {
  const query = useQuery({
    queryKey: ['pending-orders-count'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: false })
        .eq('status', 'pending');

      if (error) throw error;
      return data?.length || 0;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: 'status=eq.pending',
        },
        () => {
          query.refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [query]);

  return query;
}
