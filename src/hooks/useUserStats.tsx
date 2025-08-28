import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserStats {
  total_courses: number;
  completed_courses: number;
  total_hours: number;
  certificates_earned: number;
  current_streak: number;
}

interface UserProfile {
  full_name: string;
  email: string;
  avatar_url?: string;
}

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsLoading(false);
          return;
        }

        // Fetch user stats
        const { data: statsData, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (statsError && statsError.code !== 'PGRST116') {
          throw statsError;
        }

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        setStats(statsData || {
          total_courses: 0,
          completed_courses: 0,
          total_hours: 0,
          certificates_earned: 0,
          current_streak: 0
        });

        setProfile(profileData || {
          full_name: session.user.user_metadata?.full_name || 'ผู้ใช้',
          email: session.user.email || ''
        });

      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { stats, profile, isLoading, error };
};