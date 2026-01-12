import axiosClient from '../../../api/axiosClient';
import { User, Product, RevenueReport, WeeklyRevenue } from '../../../types';

export const adminService = {
  // --- Revenue ---
  getDailyReport: async (date: string): Promise<RevenueReport> => {
    return await axiosClient.get(`/manager/revenue?date=${date}`);
  },

  getWeeklyReport: async (startOfWeek: string, date: string): Promise<WeeklyRevenue[]> => {
    return await axiosClient.get(`/manager/revenue/weekly?startOfWeek=${startOfWeek}&date=${date}`);
  },

  // --- Employees ---
  getEmployees: async (): Promise<User[]> => {
    const res: any = await axiosClient.get('/manager/employees');
    // Map backend snake_case or specific fields to frontend User interface if needed
    // Backend returns { fullname, id, email, phone, department } from employee.model.js getEmployees
    return res.map((e: any) => ({
      ...e,
      fullName: e.fullname, // Backend uses fullname
      // email and phone are at root
    }));
  },

  addEmployee: async (data: any): Promise<void> => {
    // Backend employee.controller.js expects: loginEmail, phoneNumber, password, fullName, gender, avatar, address, department, empId, dob
    return await axiosClient.post('/manager/employees/add', {
      loginEmail: data.loginEmail,
      phoneNumber: data.phoneNumber,
      password: data.password,
      fullName: data.fullName,
      gender: data.gender,
      avatar: data.avatar,
      address: data.address,
      department: data.department,
      empId: data.empId,
      dob: data.dob || ''
    });
  },

  updateEmployee: async (data: any): Promise<void> => {
    return await axiosClient.put('/manager/employees/edit', {
      department: data.department,
      avatar: data.avatar,
      empId: data.empId // Backend uses empId as identifier for update
    });
  },

  deleteEmployee: async (id: number): Promise<void> => {
    return await axiosClient.delete(`/manager/employees/delete/${id}`);
  },

  // --- Products ---
  getProducts: async (): Promise<Product[]> => {
    const res: any = await axiosClient.get('/manager/products');
    return res;
  },

  addProduct: async (data: any): Promise<void> => {
    // Backend product.controller.js -> addProduct -> Product.model.js
    // Expects: productName, category, price, image, sku (mapped to id), count (stock), description, status, slug
    return await axiosClient.post('/manager/products/add', {
      productName: data.productName,
      category: data.category,
      price: data.price,
      image: data.image,
      sku: data.sku, // Backend uses 'sku' to insert into 'id' column
      count: data.count, // Backend uses 'count' to insert into 'stock' column
      description: data.description,
      status: data.status,
      slug: data.slug || data.productName.toLowerCase().replace(/ /g, '-')
    });
  },

  updateProduct: async (data: any): Promise<void> => {
    // Backend product.model.js updateProduct expects: productName, price, description, count, status, image, sku (as id)
    return await axiosClient.put('/manager/products/edit', {
      productName: data.productName,
      price: data.price,
      description: data.description,
      count: data.count, // Backend expects count for stock
      status: data.status,
      image: data.image,
      sku: data.sku // identifier
    });
  },

  deleteProduct: async (id: number): Promise<void> => {
    return await axiosClient.delete(`/manager/products/delete/${id}`);
  },
  
  // --- Upload ---
  uploadAvatar: async (file: File): Promise<{url: string}> => {
    const formData = new FormData();
    formData.append('image', file);
    return await axiosClient.post('/manager/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};