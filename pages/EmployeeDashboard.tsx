import React, { useState } from 'react';
import { useApp } from '../context';
import { OrderStatus } from '../types';
import { Check, Truck, Package, X, Search, AlertCircle } from 'lucide-react';

const OrderManagement = () => {
  const { orders, updateOrderStatus } = useApp();
  // Sort by date desc
  const sortedOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getNextAction = (order: any) => {
    switch (order.status) {
      case OrderStatus.PENDING:
        return (
          <button 
            onClick={() => updateOrderStatus(order.id, OrderStatus.CONFIRMED)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs flex items-center gap-1"
          >
            <Check size={14} /> Confirm
          </button>
        );
      case OrderStatus.CONFIRMED:
        return (
          <button 
            onClick={() => updateOrderStatus(order.id, OrderStatus.DELIVERING)}
            className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-xs flex items-center gap-1"
          >
            <Truck size={14} /> Ship
          </button>
        );
      case OrderStatus.DELIVERING:
        return (
          <button 
            onClick={() => updateOrderStatus(order.id, OrderStatus.COMPLETED)}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs flex items-center gap-1"
          >
            <Package size={14} /> Complete
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{order.customerName}</div>
                    <div className="text-xs text-gray-400">{order.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <ul className="list-disc list-inside">
                      {order.items.map((item, i) => (
                        <li key={i} className="truncate max-w-xs">{item.quantity}x {item.productName}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.status === OrderStatus.COMPLETED ? 'bg-green-100 text-green-800' : 
                        order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                        order.status === OrderStatus.CANCELLED ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      {getNextAction(order)}
                      {order.status === OrderStatus.PENDING && (
                         <button 
                            onClick={() => updateOrderStatus(order.id, OrderStatus.CANCELLED)}
                            className="px-2 py-1 text-red-600 hover:bg-red-50 rounded border border-red-200"
                            title="Cancel Order"
                          >
                            <X size={16} />
                          </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  )
}

const StockManagement = () => {
    const { products } = useApp();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <Search className="text-gray-400" size={20} />
                <input 
                type="text" 
                placeholder="Search products by SKU, name..." 
                className="flex-1 outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Level</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">#{p.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <img src={p.image} className="w-10 h-10 rounded object-cover bg-gray-100" alt="" />
                                        <span className="font-medium text-gray-900">{p.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-tlj-green">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full w-12 justify-center
                                            ${p.stock < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                            {p.stock}
                                        </span>
                                        {p.stock < 10 && <AlertCircle size={16} className="text-red-500" />}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'stock'>('orders');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-serif font-bold text-tlj-charcoal">Employee Workspace</h1>
        
        <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
            <button 
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-tlj-green text-white shadow-sm' : 'text-gray-500 hover:text-tlj-green'}`}
            >
                Order Management
            </button>
            <button 
                onClick={() => setActiveTab('stock')}
                className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'stock' ? 'bg-tlj-green text-white shadow-sm' : 'text-gray-500 hover:text-tlj-green'}`}
            >
                Stock Management
            </button>
        </div>
      </div>
      
      {activeTab === 'orders' ? <OrderManagement /> : <StockManagement />}
    </div>
  );
};

export default EmployeeDashboard;