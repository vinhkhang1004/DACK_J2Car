import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, type CartItem } from "./api";
import { useAuth } from "./AuthContext";

type CartContextType = {
  cart: CartItem[];
  itemCount: number;
  totalAmount: number;
  total: number;
  loading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function refreshCart() {
    if (!user) {
      setCart([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get<CartItem[]>("/cart");
      setCart(data);
    } catch (e) {
      console.error("Lỗi khi tải giỏ hàng", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshCart();
  }, [user]);

  async function addToCart(productId: number, quantity = 1) {
    if (!user) {
      window.location.href = "/dang-nhap";
      return;
    }
    try {
      await api.post("/cart", null, { params: { productId, quantity } });
      await refreshCart();
    } catch (e: any) {
      alert(e.response?.data?.message || "Lỗi khi thêm vào giỏ hàng");
    }
  }

  async function updateQuantity(itemId: number, quantity: number) {
    try {
      await api.put(`/cart/${itemId}`, null, { params: { quantity } });
      await refreshCart();
    } catch (e: any) {
      alert(e.response?.data?.message || "Lỗi khi cập nhật số lượng");
    }
  }

  async function removeItem(itemId: number) {
    try {
      await api.delete(`/cart/${itemId}`);
      await refreshCart();
    } catch (e) {
      alert("Lỗi khi xóa khỏi giỏ hàng");
    }
  }

  async function clearCart() {
    try {
      await api.delete("/cart");
      setCart([]);
    } catch (e) {
      alert("Lỗi khi xóa giỏ hàng");
    }
  }

  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cart.reduce((acc, item) => {
    const price = item.discountPrice && item.discountPrice > 0 ? item.discountPrice : item.unitPrice;
    return acc + price * item.quantity;
  }, 0);
  const total = cart.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        totalAmount,
        total,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
