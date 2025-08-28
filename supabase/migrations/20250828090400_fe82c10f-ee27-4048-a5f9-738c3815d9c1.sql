-- Add ADMIN role to enum if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'ADMIN' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
    ) THEN
        ALTER TYPE user_role ADD VALUE 'ADMIN';
    END IF;
END $$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'ADMIN'
  );
$$;

-- Courses table policies for admin
CREATE POLICY "Admins can insert courses" 
ON public.courses 
FOR INSERT 
TO authenticated 
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update courses" 
ON public.courses 
FOR UPDATE 
TO authenticated 
USING (public.is_admin());

CREATE POLICY "Admins can delete courses" 
ON public.courses 
FOR DELETE 
TO authenticated 
USING (public.is_admin());

-- Ebooks table policies for admin
CREATE POLICY "Admins can insert ebooks" 
ON public.ebooks 
FOR INSERT 
TO authenticated 
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update ebooks" 
ON public.ebooks 
FOR UPDATE 
TO authenticated 
USING (public.is_admin());

CREATE POLICY "Admins can delete ebooks" 
ON public.ebooks 
FOR DELETE 
TO authenticated 
USING (public.is_admin());

-- Tools table policies for admin
CREATE POLICY "Admins can insert tools" 
ON public.tools 
FOR INSERT 
TO authenticated 
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update tools" 
ON public.tools 
FOR UPDATE 
TO authenticated 
USING (public.is_admin());

CREATE POLICY "Admins can delete tools" 
ON public.tools 
FOR DELETE 
TO authenticated 
USING (public.is_admin());

-- Lessons table policies for admin (for managing course content)
CREATE POLICY "Admins can insert lessons" 
ON public.lessons 
FOR INSERT 
TO authenticated 
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update lessons" 
ON public.lessons 
FOR UPDATE 
TO authenticated 
USING (public.is_admin());

CREATE POLICY "Admins can delete lessons" 
ON public.lessons 
FOR DELETE 
TO authenticated 
USING (public.is_admin());

-- Profiles table policies for admin (for customer management)
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (public.is_admin());

CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (public.is_admin());

CREATE POLICY "Admins can delete profiles" 
ON public.profiles 
FOR DELETE 
TO authenticated 
USING (public.is_admin());