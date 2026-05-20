import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAdmin: boolean;
  isMasterAdmin: boolean;
  refreshUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('session_node');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('session_node', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('session_node');
  };

  const isAdmin = user?.role === 'Admin' || user?.role === 'MasterAdmin';
  const isMasterAdmin = user?.role === 'MasterAdmin';

  const refreshUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('session_node', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isMasterAdmin, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
