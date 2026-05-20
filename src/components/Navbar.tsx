import React from 'react';
import { User, LogOut, Shield, MessageSquare, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

interface NavbarProps {
  onLoginClick: () => void;
  onOpenDashboard?: () => void;
  onOpenSupport?: () => void;
  homeConfig?: any;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onLoginClick,
  onOpenDashboard,
  onOpenSupport,
  homeConfig,
  theme,
  toggleTheme
}) => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className={cn(
      "sticky top-0 z-50 border-b transition-colors duration-300",
      theme === 'dark' ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            {homeConfig?.logoImage ? (
              <div className="h-12 w-auto flex items-center justify-center py-1">
                <img 
                  src={homeConfig.logoImage} 
                  alt="Logo" 
                  className="h-full w-auto object-contain cursor-pointer"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                />
              </div>
            ) : (
              <span 
                className={cn(
                  "text-2xl font-black tracking-tighter cursor-pointer",
                  theme === 'dark' ? "text-white" : "text-gray-900"
                )}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                {homeConfig?.campusName?.split('Pulse')[0] || 'Campus'}<span className="text-indigo-600">{homeConfig?.campusName?.includes('Pulse') ? 'Pulse' : 'Pulse'}</span>
              </span>
            )}
          </div>

          <div className="flex-1"></div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-full transition-colors",
                theme === 'dark' ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              )}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <>
                {!isAdmin && (
                  <button 
                    onClick={onOpenSupport}
                    className={cn(
                      "flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-full transition-colors",
                      theme === 'dark' ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                    )}
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-sm font-semibold hidden lg:inline">Support</span>
                  </button>
                )}
                
                <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                  <div className="hidden lg:block text-right">
                    <p className={cn(
                      "text-xs font-bold",
                      theme === 'dark' ? "text-gray-100" : "text-gray-900"
                    )}>{user.name}</p>
                    <p className="text-[10px] text-gray-500 flex items-center justify-end gap-1">
                      {isAdmin && <Shield className="w-2.5 h-2.5 text-red-500" />}
                      {user.role}
                    </p>
                  </div>
                  {isAdmin && (
                    <button 
                      onClick={onOpenDashboard}
                      className="p-1.5 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"
                      title="Admin Dashboard"
                    >
                      <Shield className="w-5 h-5" />
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      logout();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all font-bold text-xs uppercase tracking-widest",
                      theme === 'dark' 
                        ? "border-red-900/30 bg-red-900/10 text-red-400 hover:bg-red-600 hover:text-white" 
                        : "border-red-100 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                    )}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <button 
                onClick={onLoginClick}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
              >
                <User className="w-4 h-4" />
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
