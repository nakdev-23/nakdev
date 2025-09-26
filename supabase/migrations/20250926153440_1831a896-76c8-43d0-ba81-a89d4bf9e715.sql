-- Create storage bucket for payment slips
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-slips', 'payment-slips', false);

-- Create RLS policies for payment slips bucket
CREATE POLICY "Users can upload their own payment slips" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'payment-slips' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own payment slips" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'payment-slips' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all payment slips" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'payment-slips' AND is_admin());