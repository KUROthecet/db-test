import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Product, Order, CartItem, Role, OrderStatus } from './types';
import { MOCK_USERS, MOCK_PRODUCTS, MOCK_ORDERS } from './mockData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string, role: Role) => boolean;
  signup: (name: string, email: string, role: Role) => boolean;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (shippingDetails: any) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  addEmployee: (user: Omit<User, 'id'>) => void;
  updateEmployee: (id: number, user: Partial<User>) => void;
  deleteEmployee: (id: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Simulate persistent login for demo
  useEffect(() => {
    const savedUser = localStorage.getItem('bms_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, role: Role): boolean => {
    const user = users.find(u => u.email === email && u.role === role);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('bms_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, role: Role): boolean => {
    const exists = users.some(u => u.email === email);
    if (exists) return false;

    const newUser: User = {
      id: Math.floor(Math.random() * 10000),
      email,
      fullName: name,
      role,
      avatar: `https://ui-avatars.com/api/?name=${name}&background=random`
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    localStorage.setItem('bms_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bms_user');
    setCart([]);
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...data };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    localStorage.setItem('bms_user', JSON.stringify(updatedUser));
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true); // Auto open cart when adding
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (orderDetails: any) => {
    if (!currentUser) return;
    
    // Handle both simple string format (legacy) and detailed object format (new checkout)
    const isSimple = typeof orderDetails.address === 'string';
    
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      customerId: currentUser.id,
      customerName: isSimple ? currentUser.fullName : orderDetails.customer.name,
      date: new Date().toISOString(),
      totalAmount: isSimple 
        ? cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        : orderDetails.prices.total,
      status: OrderStatus.PENDING,
      shippingAddress: isSimple ? orderDetails.address : orderDetails.address,
      phone: isSimple ? orderDetails.phone : orderDetails.customer.phone,
      note: isSimple ? orderDetails.note : orderDetails.customer.note,
      items: cart.map(item => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    
    // Simulate stock reduction
    setProducts(prev => prev.map(p => {
      const cartItem = cart.find(c => c.id === p.id);
      if (cartItem) {
        return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
      }
      return p;
    }));
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct = { ...productData, id: Math.floor(Math.random() * 10000) };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: number, data: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addEmployee = (userData: Omit<User, 'id'>) => {
    const newUser = { ...userData, id: Math.floor(Math.random() * 10000) };
    setUsers(prev => [...prev, newUser]);
  };

  const updateEmployee = (id: number, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
  };

  const deleteEmployee = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <AppContext.Provider value={{
      currentUser, users, login, signup, logout, updateUserProfile, products, orders, cart, isCartOpen, setIsCartOpen,
      addToCart, removeFromCart, updateCartQuantity, clearCart, placeOrder,
      updateOrderStatus, addProduct, updateProduct, deleteProduct, addEmployee, updateEmployee, deleteEmployee
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};