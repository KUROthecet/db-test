
import axiosClient from '../../../api/axiosClient';
import { Order, Product } from '../../../types';

export const employeeService = {
  // --- Orders ---
  getAllOrders: async (date: string, filterType: 'order_date' | 'receive_date' = 'order_date'): Promise<Order[]> => {
    const res: any = await axiosClient.post('/employee/order', { date, filterType });
    
    // Transform backend snake_case to frontend camelCase
    return res.map((o: any) => ({
      id: o.id,
      customerName: o.fullname || o.receiver || 'Guest',
      phone: o.phone || o.receive_phone,
      date: o.ordertime || o.orderdate, // Use the date returned by query
      totalAmount: Number(o.total_amount),
      status: o.status,
      shippingAddress: o.receive_address,
      // Fix: Map the items array from JSON_AGG
      items: o.items ? o.items.map((i: any) => ({
          productName: i.productName,
          quantity: i.quantity,
          price: Number(i.price)
      })) : [],
      note: o.note
    }));
  },

  getOrderDetail: async (orderId: string): Promise<any[]> => {
    return await axiosClient.post('/employee/order/detail', { orderId });
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<void> => {
    return await axiosClient.post('/employee/order/update-status', { orderId, status });
  },

  // --- Stock ---
  getStock: async (): Promise<Product[]> => {
    return await axiosClient.get('/employee/stock');
  }
};
