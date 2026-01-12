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
  department?: string; // Added for Employee Management
  dob?: string;
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
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderLine {
  productId: number;
  productName: string; // Denormalized for display ease
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: number;
  customerName: string;
  date: string; // ISO String
  totalAmount: number;
  status: OrderStatus;
  items: OrderLine[];
  shippingAddress: string;
  phone: string;
  note?: string;
}