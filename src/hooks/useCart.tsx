import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  item_id: string;
  item_type: 'course' | 'tool' | 'ebook';
  quantity: number;
  title?: string;
  description?: string;
  price?: number;
  image?: string;
}

export interface CartItemWithDetails extends CartItem {
  title: string;
  description: string;
  price: number;
  image: string;
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItemWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const channelRef = useRef<any>(null);
  const broadcastUpdate = () => {
    try {
      channelRef.current?.send({ type: 'broadcast', event: 'cart:update', payload: { userId: user?.id, ts: Date.now() } });
    } catch {}
  };

  const fetchCartItems = async () => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      const { data: items, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const itemsWithDetails = await Promise.all(
        items.map(async (item) => {
          let details = { title: '', description: '', price: 0, image: '/placeholder.svg' };
          
          if (item.item_type === 'course') {
            const { data } = await supabase
              .from('courses')
              .select('title, description, price')
              .eq('id', item.item_id)
              .single();
            if (data) {
              details = { 
                title: data.title, 
                description: data.description || '', 
                price: Number(data.price) || 0,
                image: '/placeholder.svg'
              };
            }
          } else if (item.item_type === 'tool') {
            const { data } = await supabase
              .from('tools')
              .select('title, description, price')
              .eq('id', item.item_id)
              .single();
            if (data) {
              details = { 
                title: data.title, 
                description: data.description || '', 
                price: data.price || 0,
                image: '/placeholder.svg'
              };
            }
          } else if (item.item_type === 'ebook') {
            const { data } = await supabase
              .from('ebooks')
              .select('title, description, price')
              .eq('id', item.item_id)
              .single();
            if (data) {
              details = { 
                title: data.title, 
                description: data.description || '', 
                price: data.price || 0,
                image: '/placeholder.svg'
              };
            }
          }

          return {
            ...item,
            item_type: item.item_type as 'course' | 'tool' | 'ebook',
            ...details
          };
        })
      );

      setCartItems(itemsWithDetails);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast.error('ไม่สามารถโหลดตะกร้าสินค้าได้');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (itemId: string, itemType: 'course' | 'tool' | 'ebook', quantity = 1) => {
    if (!user) {
      toast.error('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้า');
      return;
    }

    try {
      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('id')
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .eq('item_type', itemType)
        .single();

      if (existingItem) {
        toast.success('สินค้านี้อยู่ในตะกร้าแล้ว');
        await fetchCartItems();
        broadcastUpdate();
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          item_id: itemId,
          item_type: itemType,
          quantity: 1
        });

      if (error) throw error;

      await fetchCartItems();
      toast.success('เพิ่มสินค้าลงตะกร้าแล้ว');
      broadcastUpdate();
    } catch (error: any) {
      if (error?.code === '23505') {
        await fetchCartItems();
        toast.success('สินค้านี้อยู่ในตะกร้าแล้ว');
        broadcastUpdate();
        return;
      }
      console.error('Error adding to cart:', error);
      toast.error('ไม่สามารถเพิ่มสินค้าลงตะกร้าได้');
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity === 0) {
      return removeItem(id);
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', id);

      if (error) throw error;

      await fetchCartItems();
      broadcastUpdate();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('ไม่สามารถอัปเดตจำนวนได้');
    }
  };

  const removeItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchCartItems();
      broadcastUpdate();
      toast.success('ลบสินค้าออกจากตะกร้าแล้ว');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('ไม่สามารถลบสินค้าได้');
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setCartItems([]);
      broadcastUpdate();
      toast.success('ลบสินค้าทั้งหมดออกจากตะกร้าแล้ว');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('ไม่สามารถลบสินค้าได้');
    }
  };

  useEffect(() => {
    fetchCartItems();

    if (user) {
      const channel = supabase
        .channel(`cart-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'cart_items',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchCartItems();
          }
        )
        .on('broadcast', { event: 'cart:update' }, () => {
          fetchCartItems();
        })
        .subscribe();

      channelRef.current = channel;

      return () => {
        channelRef.current = null;
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refetchCart: fetchCartItems
  };
}