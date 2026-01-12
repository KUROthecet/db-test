// ADAPTER FILE: Bridges old monolithic context imports to new modular stores.
// This allows existing components to work without refactoring everything at once.

import { useAuth } from './store/AuthContext';
import { useCart } from './store/CartContext';
import { productService } from './features/products/services/productService';
import { useState, useEffect } from 'react';
import { Product, User } from './types';

export const useApp = () => {
  const auth = useAuth();
  const cart = useCart();
  
  // State sản phẩm toàn cục (để Home/Menu dùng chung nếu chưa refactor)
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
      productService.getMenu().then(setProducts).catch(console.error);
  }, []);

  return {
    ...auth, // login, signup, currentUser...
    ...cart, // cart, addToCart...
    products,
    
    // Các hàm mock cũ (giữ lại để tránh crash, nhưng in ra log cảnh báo)
    users: [], 
    updateOrderStatus: async () => console.warn("Use orderService directly"),
    addEmployee: () => console.warn("Use authService/adminService"),
    updateEmployee: () => {},
    deleteEmployee: () => {},
    addProduct: () => console.warn("Use productService"),
    updateProduct: () => {},
    deleteProduct: () => {},
  };
};

// Dummy Provider wrapper (vì App.tsx đã bọc AuthProvider và CartProvider thật)
export const AppProvider = ({children}: any) => {
    return <>{children}</>;
}