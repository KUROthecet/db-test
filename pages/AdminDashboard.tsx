import React, { useState } from 'react';
import { useApp } from '../context';
import { Role } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { 
  Users, TrendingUp, Plus, Trash, Edit2,
  FileText, Cake, User, LogOut, Menu as MenuIcon, Search, Mail, Phone, Briefcase, X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- COMPONENTS ---

// 1. SIDEBAR
const ManagerSidebar = ({ activeTab, setActiveTab, mobileOpen, setMobileOpen }: any) => {
  const { logout, currentUser } = useApp();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', icon: FileText, label: "Revenue Report" },
    { id: 'employees', icon: Users, label: "Human Resource" },
    { id: 'products', icon: Cake, label: "Products Details" },
    { id: 'profile', icon: User, label: "Profile" },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out
      ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block shadow-xl md:shadow-none
    `}>
      <div className="h-full flex flex-col">
        {/* Logo Area */}
        <div className="p-8 border-b border-gray-50 flex flex-col items-center">
          <div className="w-16 h-16 bg-tlj-cream rounded-full flex items-center justify-center border-2 border-tlj-green mb-4">
             <span className="font-script text-tlj-green text-2xl">PeA</span>
          </div>
          <h2 className="font-serif font-bold text-tlj-green tracking-widest text-sm">ADMIN PORTAL</h2>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-sm font-medium
                ${activeTab === item.id 
                  ? 'bg-tlj-green text-white shadow-md shadow-tlj-green/20' 
                  : 'text-gray-500 hover:bg-tlj-cream hover:text-tlj-green'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-gray-50 bg-gray-50/50">
           <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                <img src={currentUser?.avatar || "https://ui-avatars.com/api/?name=Admin"} alt="Admin" className="w-full h-full object-cover" />
              </div>
              <div>
                 <p className="text-sm font-bold text-gray-800">{currentUser?.fullName.split(' ')[0]}</p>
                 <p className="text-xs text-gray-500 capitalize">Manager</p>
              </div>
           </div>
           <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-100 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-sm font-bold"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </div>
    </aside>
  );
};

// 2. REVENUE DASHBOARD
const RevenueReport = () => {
  const { orders } = useApp();
  
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = orders.length;
  const soldItems = orders.flatMap(o => o.items).reduce((acc, item) => acc + item.quantity, 0);
  const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Mock Weekly Data
  const weeklyData = [
    { day: 'Mon', revenue: 4.2 },
    { day: 'Tue', revenue: 3.5 },
    { day: 'Wed', revenue: 5.1 },
    { day: 'Thu', revenue: 4.8 },
    { day: 'Fri', revenue: 6.9 },
    { day: 'Sat', revenue: 8.5 },
    { day: 'Sun', revenue: 7.2 },
  ];

  // Calculate Top Products based on Order History
  const productSales: Record<string, number> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      productSales[item.productName] = (productSales[item.productName] || 0) + item.quantity;
    });
  });
  
  const topProducts = Object.entries(productSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count], index) => ({ name, count, rank: index + 1 }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-serif font-bold text-tlj-charcoal mb-2">Revenue Report</h1>
        <div className="h-1 w-20 bg-tlj-green rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info Cards */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
             <h3 className="text-lg font-bold text-tlj-green mb-6 flex items-center gap-2">
               <TrendingUp size={20} /> Today's Overview
             </h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "Total Revenue", value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumSignificantDigits: 3 }).format(totalRevenue) },
                  { label: "Orders", value: totalOrders },
                  { label: "Items Sold", value: soldItems },
                  { label: "Avg. Order", value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumSignificantDigits: 3 }).format(averageOrder) },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4 bg-tlj-cream/30 rounded-xl hover:bg-tlj-cream transition-colors">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
                    <p className="text-lg md:text-xl font-bold text-tlj-charcoal">{stat.value}</p>
                  </div>
                ))}
             </div>
          </div>

          {/* Weekly Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-tlj-green mb-6">Weekly Performance (Million VND)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                    cursor={{stroke: '#395441', strokeWidth: 1, strokeDasharray: '4 4'}}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#395441" 
                    strokeWidth={3} 
                    dot={{fill: '#395441', strokeWidth: 2, r: 4, stroke: '#fff'}}
                    activeDot={{r: 6}}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Col: Top Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
           <h3 className="text-lg font-bold text-tlj-green mb-6 flex items-center gap-2">
             <Cake size={20} /> Top Sellers
           </h3>
           <div className="space-y-4">
             {topProducts.length > 0 ? topProducts.map((p) => (
               <div key={p.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-tlj-cream/50 transition-colors">
                  <div className="flex items-center gap-3">
                     <span className={`
                       w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold text-white
                       ${p.rank === 1 ? 'bg-yellow-400' : p.rank === 2 ? 'bg-gray-400' : p.rank === 3 ? 'bg-orange-400' : 'bg-tlj-green/50'}
                     `}>
                       {p.rank}
                     </span>
                     <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]" title={p.name}>{p.name}</span>
                  </div>
                  <span className="text-sm font-bold text-tlj-green">{p.count} sold</span>
               </div>
             )) : (
               <p className="text-gray-400 text-sm text-center">No sales data yet.</p>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

// 3. HR MANAGEMENT
const EmployeeManagement = () => {
  const { users, addEmployee, updateEmployee, deleteEmployee } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const initialEmpState = { fullName: '', email: '', phone: '', department: 'Kitchen', role: Role.EMPLOYEE };
  const [formData, setFormData] = useState(initialEmpState);

  const employees = users.filter(u => u.role === Role.EMPLOYEE || u.role === Role.MANAGER);
  
  const filteredEmployees = employees.filter(emp => 
    emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(initialEmpState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp: any) => {
    setEditingId(emp.id);
    setFormData({
      fullName: emp.fullName,
      email: emp.email,
      phone: emp.phone || '',
      department: emp.department || 'Kitchen',
      role: emp.role
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateEmployee(editingId, formData);
    } else {
      addEmployee({ 
        ...formData, 
        avatar: `https://ui-avatars.com/api/?name=${formData.fullName}&background=random` 
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-tlj-charcoal mb-2">Human Resources</h1>
          <p className="text-gray-500">Manage your bakery staff</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-tlj-green text-white px-6 py-2.5 rounded-lg font-bold shadow-lg hover:bg-tlj-charcoal hover:-translate-y-0.5 transition-all"
        >
          ADD EMPLOYEE <Plus size={18} />
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
         <Search className="text-gray-400" size={20} />
         <input 
           type="text" 
           placeholder="Search employees by name, email..." 
           className="flex-1 outline-none text-sm"
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
         />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredEmployees.map(emp => (
              <tr key={emp.id} className="hover:bg-tlj-cream/20 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={emp.avatar} alt="" className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
                    <div>
                      <p className="font-bold text-gray-900">{emp.fullName}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${emp.role === Role.MANAGER ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {emp.role === Role.MANAGER ? 'Manager' : 'Staff'}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <div className="text-sm text-gray-600 flex flex-col gap-1">
                      <span className="flex items-center gap-2"><Mail size={12}/> {emp.email}</span>
                      {emp.phone && <span className="flex items-center gap-2"><Phone size={12}/> {emp.phone}</span>}
                   </div>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-2 text-sm text-gray-700">
                    <Briefcase size={14} className="text-tlj-green"/> {emp.department || 'General'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleOpenEdit(emp)} className="text-gray-400 hover:text-tlj-green p-2 transition-colors">
                      <Edit2 size={18} />
                    </button>
                    {emp.role !== Role.MANAGER && (
                      <button 
                        onClick={() => deleteEmployee(emp.id)}
                        className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                      >
                        <Trash size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredEmployees.length === 0 && (
          <div className="p-8 text-center text-gray-400">No employees found.</div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24}/></button>
              <h2 className="text-2xl font-serif font-bold text-tlj-green mb-6">{editingId ? 'Edit Employee' : 'Add New Employee'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input required placeholder="Full Name" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-tlj-green" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                <input required type="email" placeholder="Email" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-tlj-green" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                <input required placeholder="Phone" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-tlj-green" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                <select className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-tlj-green bg-white" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                   <option value="Kitchen">Kitchen</option>
                   <option value="Service">Service</option>
                   <option value="Logistics">Logistics</option>
                   <option value="Executive">Executive</option>
                </select>
                <div className="flex gap-3 pt-4">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-lg">Cancel</button>
                   <button type="submit" className="flex-1 py-3 bg-tlj-green text-white font-bold rounded-lg hover:bg-tlj-charcoal transition-colors">{editingId ? 'Update' : 'Save'}</button>
                </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

// 4. PRODUCT MANAGEMENT
const ProductManagement = () => {
  const { products, deleteProduct, addProduct, updateProduct } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const initialProdState = {
    name: '', category: 'Cakes', price: 0, stock: 0, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=200', description: '', status: 'active' as const
  };
  const [formData, setFormData] = useState(initialProdState);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(initialProdState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditingId(p.id);
    setFormData({
      name: p.name,
      category: p.category,
      price: p.price,
      stock: p.stock,
      image: p.image,
      description: p.description,
      status: p.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProduct(editingId, formData);
    } else {
      addProduct(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-tlj-charcoal mb-2">Product Management</h1>
          <p className="text-gray-500">Inventory & Catalog</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-tlj-green text-white px-6 py-2.5 rounded-lg font-bold shadow-lg hover:bg-tlj-charcoal hover:-translate-y-0.5 transition-all"
        >
          ADD PRODUCT <Plus size={18} />
        </button>
      </div>

       {/* Toolbar */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
         <Search className="text-gray-400" size={20} />
         <input 
           type="text" 
           placeholder="Search products by SKU, name..." 
           className="flex-1 outline-none text-sm"
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
         />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product SKU</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredProducts.map(p => (
              <tr key={p.id} className="hover:bg-tlj-cream/20 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-gray-500">#{p.id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={p.image} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                    <span className="font-bold text-gray-800 text-sm">{p.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{p.category}</td>
                <td className="px-6 py-4 text-sm font-bold text-tlj-green">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}
                </td>
                <td className="px-6 py-4">
                   <span className={`px-2 py-0.5 rounded text-xs font-bold ${p.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                     {p.stock}
                   </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleOpenEdit(p)} className="text-gray-400 hover:text-tlj-green p-1">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => deleteProduct(p.id)} className="text-gray-400 hover:text-red-500 p-1">
                      <Trash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

       {/* Add/Edit Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-fade-in max-h-[90vh] overflow-y-auto relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24}/></button>
              <h2 className="text-2xl font-serif font-bold text-tlj-green mb-6">{editingId ? 'Edit Product' : 'New Product'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input required placeholder="Product Name" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-tlj-green" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                   <input required type="number" placeholder="Price" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-tlj-green" value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                   <input required type="number" placeholder="Stock" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-tlj-green" value={formData.stock || ''} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
                </div>
                <input required placeholder="Category" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-tlj-green" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                <textarea required placeholder="Description" rows={3} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-tlj-green" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                
                <div className="flex gap-3 pt-4">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-lg">Cancel</button>
                   <button type="submit" className="flex-1 py-3 bg-tlj-green text-white font-bold rounded-lg hover:bg-tlj-charcoal transition-colors">{editingId ? 'Update' : 'Add Product'}</button>
                </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

// 5. PROFILE
const Profile = () => {
  const { currentUser } = useApp();
  return (
    <div className="max-w-2xl mx-auto py-12 animate-fade-in">
       <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-tlj-green h-32 relative">
             <div className="absolute -bottom-16 left-8 p-1 bg-white rounded-full">
               <img src={currentUser?.avatar || "https://ui-avatars.com/api/?name=Admin"} alt="Profile" className="w-32 h-32 rounded-full object-cover bg-gray-200" />
             </div>
          </div>
          <div className="pt-20 px-8 pb-8">
             <h1 className="text-3xl font-serif font-bold text-gray-900">{currentUser?.fullName}</h1>
             <p className="text-gray-500 mb-6 flex items-center gap-2">
               <span className="px-2 py-0.5 bg-tlj-cream text-tlj-green font-bold text-xs rounded uppercase">Manager</span>
               {currentUser?.department && <span>• {currentUser.department}</span>}
             </p>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                <div>
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Email</label>
                   <p className="font-medium text-gray-800">{currentUser?.email}</p>
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Phone</label>
                   <p className="font-medium text-gray-800">{currentUser?.phone || 'N/A'}</p>
                </div>
                 <div>
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Employee ID</label>
                   <p className="font-medium text-gray-800">#{currentUser?.id}</p>
                </div>
             </div>
             
             <div className="mt-8 flex gap-4">
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50">Change Password</button>
                <button className="px-4 py-2 bg-tlj-green text-white rounded-lg text-sm font-bold hover:bg-tlj-charcoal">Edit Profile</button>
             </div>
          </div>
       </div>
    </div>
  );
};

// --- MAIN PAGE ---

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFBF0] flex">
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-20 left-4 z-30">
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 bg-tlj-green text-white rounded shadow-lg"
        >
          <MenuIcon size={24} />
        </button>
      </div>

      <ManagerSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="flex-1 p-6 md:p-10 ml-0 overflow-x-hidden">
        {activeTab === 'dashboard' && <RevenueReport />}
        {activeTab === 'employees' && <EmployeeManagement />}
        {activeTab === 'products' && <ProductManagement />}
        {activeTab === 'profile' && <Profile />}
      </main>
    </div>
  );
};

export default AdminDashboard;