-- Create table for payment methods
CREATE TABLE public.payment_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  method_type TEXT NOT NULL, -- 'bank_transfer', 'qr_code', 'promptpay'
  display_name TEXT NOT NULL,
  account_number TEXT,
  account_name TEXT,
  bank_name TEXT,
  qr_code_url TEXT,
  qr_code_file_path TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Payment methods are viewable by everyone" 
ON public.payment_methods 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can insert payment methods" 
ON public.payment_methods 
FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "Admins can update payment methods" 
ON public.payment_methods 
FOR UPDATE 
USING (is_admin());

CREATE POLICY "Admins can delete payment methods" 
ON public.payment_methods 
FOR DELETE 
USING (is_admin());

CREATE POLICY "Admins can view all payment methods" 
ON public.payment_methods 
FOR SELECT 
USING (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_payment_methods_updated_at
BEFORE UPDATE ON public.payment_methods
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();