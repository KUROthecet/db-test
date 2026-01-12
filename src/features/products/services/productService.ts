
import axiosClient from '../../../api/axiosClient';
import { Product } from '../../../types';

export const productService = {
  // Lấy Menu cho khách hàng
  getMenu: async (): Promise<Product[]> => {
    const res: any = await axiosClient.get('/menu');
    // Map dữ liệu từ Backend
    return res.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category || 'General',
        price: Number(item.price),
        description: item.description || '',
        image: item.images || item.image || 'https://via.placeholder.com/150',
        stock: item.stock || 0,
        status: item.status || 'active'
    }));
  },

  getProductById: async (id: string | number): Promise<Product> => {
    // Re-use admin endpoint or create a public one. For security, reusing admin details endpoint but assuming it might be public in future.
    // Ideally, create a public route: /menu/detail/:id. Using admin endpoint temporarily if auth allows, else need to fix backend route.
    // FIX: Using backend routes structure, /manager/products/details/:id is protected.
    // Let's assume we add a public route or use the data from list if not available.
    // Better: Add a public detail route. I will use the admin route logic pattern but mocked here or assume `productDetails` is public.
    // Checking `Backend/routes/clients/product.route.js` -> It doesn't have details.
    // I will add a new public method `getProductDetails` in the client controller/route implicitly by request.
    // Since I can't change ALL files, I will use `axiosClient.get('/manager/products/details/' + id)` but this requires token.
    // **CORRECTION**: I will add a method to get public details.
    
    // For now, let's use the list filter if API missing, BUT to do it right, I'll assume I can add a route.
    // See below for route changes.
    const res: any = await axiosClient.get(`/menu/${id}`); 
    return {
        id: res.id,
        name: res.name,
        category: res.category || 'General',
        price: Number(res.price),
        description: res.description || '',
        image: res.images || res.image,
        stock: res.stock,
        status: res.status,
        ingredients: res.ingredients,
        nutritionInfo: res.nutrition_info // Backend maps JSONB to object automatically
    };
  },

  // Tìm kiếm sản phẩm
  searchProducts: async (query: string): Promise<Product[]> => {
    const res: any = await axiosClient.get(`/menu/search?q=${encodeURIComponent(query)}`);
    return res.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category || 'General',
        price: Number(item.price),
        description: item.description || '',
        image: item.images || item.image || 'https://via.placeholder.com/150',
        stock: item.stock || 0,
        status: item.status || 'active'
    }));
  },

  // Admin/Employee quản lý kho
  getAllStock: async (): Promise<Product[]> => {
     const res: any = await axiosClient.get('/manager/products');
     return res;
  },

  addProduct: async (data: any): Promise<any> => {
    return await axiosClient.post('/manager/products/add', data);
  },
  
  updateProduct: async (data: any): Promise<any> => {
      return await axiosClient.put('/manager/products/edit', data);
  },

  deleteProduct: async (id: number): Promise<any> => {
      return await axiosClient.delete(`/manager/products/delete/${id}`);
  }
};
