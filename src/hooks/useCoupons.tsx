import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Coupon {
  id: string;
  code: string;
  discount_percentage: number;
  active: boolean;
}

export function useCoupons() {
  const [loading, setLoading] = useState(false);

  const validateCoupon = async (code: string): Promise<Coupon | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('active', true)
        .single();

      if (error || !data) {
        toast.error('รหัสส่วนลดไม่ถูกต้องหรือหมดอายุแล้ว');
        return null;
      }

      toast.success(`ใช้รหัสส่วนลดได้สำเร็จ! ลด ${data.discount_percentage}%`);
      return data;
    } catch (error) {
      console.error('Error validating coupon:', error);
      toast.error('ไม่สามารถตรวจสอบรหัสส่วนลดได้');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    validateCoupon,
    loading
  };
}