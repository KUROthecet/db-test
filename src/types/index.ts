
export enum Role {
  CUSTOMER = 1,
  EMPLOYEE = 2,
  MANAGER = 3,
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  DELIVERING = 'delivering',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: Role;
  avatar?: string;
  phone?: string;
  address?: string;
  department?: string;
  dob?: string;
  hire_date?: string;
}

export interface AuthResponse {
  message: string;
  user?: User;
}

export interface NutritionInfo {
  calories: string | number;
  totalFat: string;
  saturatedFat: string;
  transFat: string;
  totalCarbs: string;
  totalSugar: string;
  protein: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  status: 'active' | 'inactive';
  ingredients?: string;
  nutritionInfo?: NutritionInfo;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderItem {
  productName: string; // Mapped from backend join
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string; // Coalesce from backend
  phone: string;
  date: string; // ordertime or orderdate
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: string;
  note?: string;
  payment?: string;
}

export interface RevenueReport {
  total_revenue: string; // Postgres returns bigint/numeric as string often
  total_orders: string;
  total_items: string;
  top: { name: string; sold_quantity: string }[];
}

export interface WeeklyRevenue {
  day: string;
  revenue: string;
}
