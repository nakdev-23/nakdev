-- Add admin RLS policies for enrollments to allow admin CRUD and view all
-- Ensure RLS is enabled (no-op if already enabled)
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Allow admins to view all enrollments
CREATE POLICY "Admins can view all enrollments"
ON public.enrollments
FOR SELECT
USING (is_admin());

-- Allow admins to insert enrollments for any user
CREATE POLICY "Admins can insert enrollments for any user"
ON public.enrollments
FOR INSERT
WITH CHECK (is_admin());

-- Allow admins to delete any enrollments
CREATE POLICY "Admins can delete any enrollments"
ON public.enrollments
FOR DELETE
USING (is_admin());

-- Allow admins to update any enrollments
CREATE POLICY "Admins can update any enrollments"
ON public.enrollments
FOR UPDATE
USING (is_admin());