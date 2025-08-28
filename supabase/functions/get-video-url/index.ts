import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Authorization header
    const authHeader = req.headers.get('Authorization')!;
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Get user from JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    const { videoId, filePath } = await req.json();

    if (!videoId || !filePath) {
      return new Response(JSON.stringify({ error: 'Missing videoId or filePath' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Generating signed URL for user:', user.id, 'video:', videoId);

    // Verify user has access to this video (check if video exists and user is authenticated)
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('id, title, course_id, lesson_id')
      .eq('id', videoId)
      .single();

    if (videoError || !video) {
      console.error('Video not found:', videoError);
      return new Response(JSON.stringify({ error: 'Video not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate signed URL for the video (expires in 1 hour)
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from('course-videos')
      .createSignedUrl(filePath, 3600); // 1 hour

    if (urlError || !signedUrlData) {
      console.error('Error generating signed URL:', urlError);
      return new Response(JSON.stringify({ error: 'Failed to generate video URL' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Log video access for analytics
    console.log(`User ${user.id} accessed video ${videoId}`);

    // Update or insert video progress
    const { error: progressError } = await supabase
      .from('video_progress')
      .upsert({
        user_id: user.id,
        video_id: videoId,
        last_watched_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,video_id'
      });

    if (progressError) {
      console.error('Error updating video progress:', progressError);
      // Don't fail the request, just log the error
    }

    return new Response(JSON.stringify({
      videoUrl: signedUrlData.signedUrl,
      expiresIn: 3600,
      video: {
        id: video.id,
        title: video.title,
        course_id: video.course_id,
        lesson_id: video.lesson_id
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});