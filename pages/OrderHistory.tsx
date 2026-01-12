import React from 'react';
import { useApp } from '../context';
import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { OrderStatus } from '../types';

const OrderHistory = () => {
  const { orders, currentUser } = useApp();
  
  if (!currentUser) return null;
  
  const myOrders = orders.filter(o => o.customerId === currentUser.id);

  const getStatusIcon = (status: OrderStatus) => {
    switch(status) {
      case OrderStatus.PENDING: return <Clock size={20} className="text-yellow-500" />;
      case OrderStatus.CONFIRMED: return <CheckCircle size={20} className="text-blue-500" />;
      case OrderStatus.DELIVERING: return <Truck size={20} className="text-purple-500" />;
      case OrderStatus.COMPLETED: return <Package size={20} className="text-green-500" />;
      case OrderStatus.CANCELLED: return <XCircle size={20} className="text-red-500" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch(status) {
      case OrderStatus.PENDING: return 'bg-yellow-100 text-yellow-700';
      case OrderStatus.CONFIRMED: return 'bg-blue-100 text-blue-700';
      case OrderStatus.DELIVERING: return 'bg-purple-100 text-purple-700';
      case OrderStatus.COMPLETED: return 'bg-green-100 text-green-700';
      case OrderStatus.CANCELLED: return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>
      
      {myOrders.length === 0 ? (
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {myOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4 bg-gray-50/50">
                <div>
                  <span className="text-sm text-gray-500 block">Order ID</span>
                  <span className="font-mono font-semibold text-gray-900">#{order.id}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Date</span>
                  <span className="text-sm text-gray-900">{new Date(order.date).toLocaleDateString()}</span>
                </div>
                 <div>
                  <span className="text-sm text-gray-500 block">Total</span>
                  <span className="font-bold text-primary">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}</span>
                </div>
                <div className={`px-3 py-1 rounded-full flex items-center gap-2 text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status}</span>
                </div>
              </div>
              
              <div className="p-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-dashed border-gray-100 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-cream rounded-full flex items-center justify-center text-primary font-bold text-xs">
                        {item.quantity}x
                      </div>
                      <span className="text-gray-800">{item.productName}</span>
                    </div>
                    <span className="text-gray-600 text-sm">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Progress Bar for Tracking */}
              {order.status !== OrderStatus.CANCELLED && (
                <div className="px-4 pb-6 pt-2">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between text-xs text-gray-400">
                      <span>Pending</span>
                      <span>Confirmed</span>
                      <span>Delivering</span>
                      <span>Completed</span>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                      <div style={{ width: 
                        order.status === OrderStatus.PENDING ? '25%' :
                        order.status === OrderStatus.CONFIRMED ? '50%' :
                        order.status === OrderStatus.DELIVERING ? '75%' : '100%'
                      }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
