-- Create security definer function to check if user has cart items
CREATE OR REPLACE FUNCTION public.user_has_cart_items()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.cart_items 
    WHERE user_id = auth.uid()
  );
$$;

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view active payment methods" ON public.payment_methods;

-- Create new restricted policy: only users with cart items can view payment methods
CREATE POLICY "Users with cart items can view active payment methods"
ON public.payment_methods
FOR SELECT
USING (
  (auth.uid() IS NOT NULL) 
  AND (is_active = true) 
  AND (public.user_has_cart_items() OR public.is_admin())
);