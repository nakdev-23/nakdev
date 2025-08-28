-- Fix security vulnerability: Remove public access to profiles table
-- This addresses the issue where customer email addresses are exposed to public

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a more secure policy for users to view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Note: The "Admins can view all profiles" policy already exists and is appropriate
-- Note: This ensures only authenticated users can view profiles, and only their own profile unless they are admin