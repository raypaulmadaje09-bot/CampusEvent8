import React, { useState } from 'react';
import { X, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import { User } from '../types';

interface LoginModalProps {
  onClose: () => void;
  usersList: User[];
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, usersList }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = usersList.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );
    if (foundUser) {
      login(foundUser);
      onClose();
    } else {
      setError('Identity verification failed. Invalid credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center tracking-tighter">Campus Login</h2>
          <p className="text-gray-500 mb-8 text-center text-sm">Welcome back. Please enter your credentials.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Email Address</label>
              <input 
                required
                type="email" 
                placeholder="name@campus.edu"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Password</label>
              <input 
                required
                type="password" 
                placeholder="Enter password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
              />
            </div>
            
            {error && (
              <p className="text-red-500 text-[10px] font-bold uppercase tracking-tighter ml-1 italic">{error}</p>
            )}

            <button 
              type="submit"
              className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-900/20"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">Authorized Demo Nodes</p>
             <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => { setEmail('master@campus.edu'); setPassword('master'); }} 
                  className="px-3 py-2 bg-gray-50 hover:bg-indigo-50 rounded-xl text-[8px] font-black uppercase text-indigo-600 border border-gray-200 hover:border-indigo-200 transition-all"
                >
                  Master
                </button>
                <button 
                  onClick={() => { setEmail('admin@campus.edu'); setPassword('admin'); }} 
                  className="px-3 py-2 bg-gray-50 hover:bg-indigo-50 rounded-xl text-[8px] font-black uppercase text-gray-600 border border-gray-200 hover:border-indigo-200 transition-all"
                >
                  Admin
                </button>
                <button 
                  onClick={() => { setEmail('alex@student.edu'); setPassword('student'); }} 
                  className="px-3 py-2 bg-gray-50 hover:bg-indigo-50 rounded-xl text-[8px] font-black uppercase text-gray-600 border border-gray-200 hover:border-indigo-200 transition-all"
                >
                  Student
                </button>
             </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
