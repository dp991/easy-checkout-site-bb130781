import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product?: {
    id: string;
    name_zh: string;
    name_en: string;
    price_min: number | null;
    price_max: number | null;
    images: string[] | null;
    slug: string;
    category_id: string | null;
    category?: {
      name_zh: string;
      name_en: string | null;
    } | null;
  };
}

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  itemCount: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const refreshCart = async () => {
    if (!user) {
      setItems([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('wh_cart_items')
        .select(`
          id,
          product_id,
          quantity,
          wh_products (
            id,
            name_zh,
            name_en,
            price_min,
            price_max,
            images,
            slug,
            category_id,
            wh_categories (
              name_zh,
              name_en
            )
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const cartItems = data?.map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        product: item.wh_products ? {
          ...item.wh_products,
          category: item.wh_products.wh_categories,
        } : undefined,
      })) || [];

      setItems(cartItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [user]);

  const addToCart = async (productId: string, quantity = 1) => {
    if (!user) {
      toast.error('请先登录 / Please login first');
      return;
    }

    try {
      // Check if item already exists
      const existingItem = items.find(item => item.product_id === productId);

      if (existingItem) {
        await updateQuantity(productId, existingItem.quantity + quantity);
      } else {
        const { error } = await supabase
          .from('wh_cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity,
          });

        if (error) throw error;
        await refreshCart();
        toast.success('已添加到购物车 / Added to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('添加失败 / Failed to add');
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wh_cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
      await refreshCart();
      toast.success('已从购物车移除 / Removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('移除失败 / Failed to remove');
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return;

    if (quantity < 1) {
      await removeFromCart(productId);
      return;
    }

    try {
      const { error } = await supabase
        .from('wh_cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
      await refreshCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('更新失败 / Failed to update');
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wh_cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      setItems([]);
      toast.success('购物车已清空 / Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('清空失败 / Failed to clear');
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      isLoading,
      itemCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      refreshCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
