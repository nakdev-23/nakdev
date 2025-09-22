import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Order {
  id: string;
  user_id: string;
  payment_method_id: string | null;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_proof_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  confirmed_at: string | null;
  confirmed_by: string | null;
  payment_methods?: {
    display_name: string;
    method_type: string;
  };
  profiles?: {
    full_name: string;
    email: string;
  };
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  item_id: string;
  item_type: 'course' | 'ebook' | 'tool';
  quantity: number;
  price: number;
  created_at: string;
}

export interface OrderWithDetails extends Order {
  order_items: (OrderItem & {
    courses?: { title: string };
    ebooks?: { title: string };
    tools?: { title: string };
  })[];
}

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          payment_methods (
            display_name,
            method_type
          ),
          profiles (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูลคำสั่งซื้อ');
        throw error;
      }

      // Get order items separately
      const orderIds = data.map(order => order.id);
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds);

      if (itemsError) {
        toast.error('เกิดข้อผิดพลาดในการโหลดรายการสินค้า');
        throw itemsError;
      }

      // Get item details
      const courseIds = orderItems.filter(item => item.item_type === 'course').map(item => item.item_id);
      const ebookIds = orderItems.filter(item => item.item_type === 'ebook').map(item => item.item_id);
      const toolIds = orderItems.filter(item => item.item_type === 'tool').map(item => item.item_id);

      const [coursesData, ebooksData, toolsData] = await Promise.all([
        courseIds.length > 0 ? supabase.from('courses').select('id, title').in('id', courseIds) : { data: [], error: null },
        ebookIds.length > 0 ? supabase.from('ebooks').select('id, title').in('id', ebookIds) : { data: [], error: null },
        toolIds.length > 0 ? supabase.from('tools').select('id, title').in('id', toolIds) : { data: [], error: null }
      ]);

      // Combine data
      const ordersWithItems = data.map(order => ({
        ...order,
        order_items: orderItems.filter(item => item.order_id === order.id).map(item => {
          const itemData = { ...item } as any;
          if (item.item_type === 'course') {
            const course = coursesData.data?.find(c => c.id === item.item_id);
            if (course) itemData.courses = course;
          } else if (item.item_type === 'ebook') {
            const ebook = ebooksData.data?.find(e => e.id === item.item_id);
            if (ebook) itemData.ebooks = ebook;
          } else if (item.item_type === 'tool') {
            const tool = toolsData.data?.find(t => t.id === item.item_id);
            if (tool) itemData.tools = tool;
          }
          return itemData;
        })
      }));

      return ordersWithItems as any;
    },
  });
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          payment_methods (
            display_name,
            method_type
          ),
          profiles (
            full_name,
            email
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) {
        toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูลคำสั่งซื้อ');
        throw error;
      }

      // Get order items separately
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (itemsError) {
        toast.error('เกิดข้อผิดพลาดในการโหลดรายการสินค้า');
        throw itemsError;
      }

      // Get item details
      const courseIds = orderItems.filter(item => item.item_type === 'course').map(item => item.item_id);
      const ebookIds = orderItems.filter(item => item.item_type === 'ebook').map(item => item.item_id);
      const toolIds = orderItems.filter(item => item.item_type === 'tool').map(item => item.item_id);

      const [coursesData, ebooksData, toolsData] = await Promise.all([
        courseIds.length > 0 ? supabase.from('courses').select('id, title').in('id', courseIds) : { data: [], error: null },
        ebookIds.length > 0 ? supabase.from('ebooks').select('id, title').in('id', ebookIds) : { data: [], error: null },
        toolIds.length > 0 ? supabase.from('tools').select('id, title').in('id', toolIds) : { data: [], error: null }
      ]);

      // Combine data
      const orderWithItems = {
        ...data,
        order_items: orderItems.map(item => {
          const itemData = { ...item } as any;
          if (item.item_type === 'course') {
            const course = coursesData.data?.find(c => c.id === item.item_id);
            if (course) itemData.courses = course;
          } else if (item.item_type === 'ebook') {
            const ebook = ebooksData.data?.find(e => e.id === item.item_id);
            if (ebook) itemData.ebooks = ebook;
          } else if (item.item_type === 'tool') {
            const tool = toolsData.data?.find(t => t.id === item.item_id);
            if (tool) itemData.tools = tool;
          }
          return itemData;
        })
      };

      return orderWithItems as any;
    },
    enabled: !!orderId,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: {
      user_id: string;
      payment_method_id: string;
      total_amount: number;
      items: Array<{
        item_id: string;
        item_type: 'course' | 'ebook' | 'tool';
        quantity: number;
        price: number;
      }>;
    }) => {
      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: orderData.user_id,
          payment_method_id: orderData.payment_method_id,
          total_amount: orderData.total_amount,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItemsData = orderData.items.map(item => ({
        order_id: order.id,
        item_id: item.item_id,
        item_type: item.item_type,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsData);

      if (itemsError) throw itemsError;

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('สร้างคำสั่งซื้อเรียบร้อยแล้ว');
    },
    onError: (error) => {
      console.error('Error creating order:', error);
      toast.error('เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ');
    },
  });
};

export const useConfirmOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      // First, get the order details
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      // Create enrollments for each order item
      const enrollmentsData = order.order_items.map((item: any) => ({
        user_id: order.user_id,
        item_id: item.item_id,
        item_type: item.item_type,
        price_paid: item.price,
      }));

      const { error: enrollmentError } = await supabase
        .from('enrollments')
        .insert(enrollmentsData);

      if (enrollmentError) throw enrollmentError;

      // Update order status
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'confirmed',
          confirmed_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (updateError) throw updateError;

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('ยืนยันคำสั่งซื้อเรียบร้อยแล้ว');
    },
    onError: (error) => {
      console.error('Error confirming order:', error);
      toast.error('เกิดข้อผิดพลาดในการยืนยันคำสั่งซื้อ');
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('ยกเลิกคำสั่งซื้อเรียบร้อยแล้ว');
    },
    onError: (error) => {
      console.error('Error cancelling order:', error);
      toast.error('เกิดข้อผิดพลาดในการยกเลิกคำสั่งซื้อ');
    },
  });
};

export const useUpdateOrderNotes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, notes }: { orderId: string; notes: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ notes })
        .eq('id', orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('อัปเดตหมายเหตุเรียบร้อยแล้ว');
    },
    onError: (error) => {
      console.error('Error updating order notes:', error);
      toast.error('เกิดข้อผิดพลาดในการอัปเดตหมายเหตุ');
    },
  });
};