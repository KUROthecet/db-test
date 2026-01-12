import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context';
import { Role } from '../types';
import { ChefHat } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(Role.CUSTOMER);
  const { login } = useApp();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== '123') { // Simple mock password check
       setError('Invalid credentials');
       return;
    }
    
    if (login(email, role)) {
      if (role === Role.MANAGER) navigate('/admin');
      else if (role === Role.EMPLOYEE) navigate('/employee');
      else navigate('/');
    } else {
      setError('User not found. Try admin@bakery.com (Manager), staff@bakery.com (Employee), or client@bakery.com');
    }
  };

  // Helper to pre-fill for demo
  const fillDemo = (demoEmail: string, demoRole: Role) => {
    setEmail(demoEmail);
    setRole(demoRole);
    setPassword('123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
            <ChefHat size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500">Sign in to Pane e Amore</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Client', val: Role.CUSTOMER },
                { label: 'Staff', val: Role.EMPLOYEE },
                { label: 'Admin', val: Role.MANAGER },
              ].map(opt => (
                <button
                  type="button"
                  key={opt.val}
                  onClick={() => setRole(opt.val)}
                  className={`py-2 text-sm rounded-lg transition-colors border ${
                    role === opt.val 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-dark transition-colors shadow-lg shadow-primary/30"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center mb-3">Quick Login (Demo Mode)</p>
          <div className="flex gap-2 justify-center">
             <button onClick={() => fillDemo('admin@bakery.com', Role.MANAGER)} className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">Admin</button>
             <button onClick={() => fillDemo('staff@bakery.com', Role.EMPLOYEE)} className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">Staff</button>
             <button onClick={() => fillDemo('client@bakery.com', Role.CUSTOMER)} className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">Client</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;