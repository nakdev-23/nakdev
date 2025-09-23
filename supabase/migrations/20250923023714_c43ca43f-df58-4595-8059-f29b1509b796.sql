-- Fix security vulnerability: Restrict payment methods access to authenticated users only
DROP POLICY IF EXISTS "Payment methods are viewable by everyone" ON public.payment_methods;

-- Create a new policy that only allows authenticated users to view active payment methods
CREATE POLICY "Authenticated users can view active payment methods" 
ON public.payment_methods 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND is_active = true);