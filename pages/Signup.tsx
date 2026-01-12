import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context';
import { Role } from '../types';
import { ChefHat, User, Mail, Lock } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signup } = useApp();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
    }

    if (password.length < 3) {
        setError('Password must be at least 3 characters');
        return;
    }
    
    // Default to Customer role for public signup
    if (signup(name, email, Role.CUSTOMER)) {
      navigate('/');
    } else {
      setError('Email already exists. Please use a different email or sign in.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-tlj-cream px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="bg-tlj-green w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
            <ChefHat size={32} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-tlj-charcoal">Create Account</h2>
          <p className="text-gray-500 mt-2">Join the Pane e Amore family</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Full Name"
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tlj-green/20 focus:border-tlj-green outline-none transition-all"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="email" 
              placeholder="Email Address"
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tlj-green/20 focus:border-tlj-green outline-none transition-all"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="password" 
              placeholder="Password"
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tlj-green/20 focus:border-tlj-green outline-none transition-all"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="password" 
              placeholder="Confirm Password"
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tlj-green/20 focus:border-tlj-green outline-none transition-all"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-tlj-green text-white rounded-xl font-bold hover:bg-tlj-charcoal transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-tlj-green font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;