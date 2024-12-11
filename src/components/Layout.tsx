import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Factory, 
  ClipboardCheck, 
  Settings,
  Shell,
  LogOut,
  Home,
  ArrowLeft
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const navigation = [
  { 
    name: 'Home', 
    href: '/', 
    icon: Home,
    color: 'bg-gray-500 hover:bg-gray-600',
    activeColor: 'bg-gray-600',
    textColor: 'text-gray-500',
    roles: ['admin', 'supervisor', 'operator', 'quality', 'management']
  },
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: LayoutDashboard, 
    color: 'bg-blue-500 hover:bg-blue-600',
    activeColor: 'bg-blue-600',
    textColor: 'text-blue-500',
    roles: ['admin', 'supervisor', 'management']
  },
  { 
    name: 'Production Stream', 
    href: '/raw-material', 
    icon: Factory, 
    color: 'bg-emerald-500 hover:bg-emerald-600',
    activeColor: 'bg-emerald-600',
    textColor: 'text-emerald-500',
    roles: ['operator', 'supervisor', 'admin']
  },
  { 
    name: 'Quality Control Stream', 
    href: '/quality', 
    icon: ClipboardCheck, 
    color: 'bg-amber-500 hover:bg-amber-600',
    activeColor: 'bg-amber-600',
    textColor: 'text-amber-500',
    roles: ['quality', 'admin']
  },
  { 
    name: 'Administration', 
    href: '/admin', 
    icon: Settings, 
    color: 'bg-purple-500 hover:bg-purple-600',
    activeColor: 'bg-purple-600',
    textColor: 'text-purple-500',
    roles: ['admin']
  }
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const filteredNavigation = navigation.filter(item => 
    user && item.roles.includes(user.role)
  );

  const showBackButton = location.pathname !== '/';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div className="flex items-center space-x-2">
              <Shell className="h-8 w-8 text-blue-600" />
              <div className="flex items-baseline">
                <span className="text-xl font-bold text-gray-900">ClamFlow</span>
                <sup className="text-xs font-medium text-gray-500 ml-0.5">TM</sup>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-20">
        <div className="px-4 py-6">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 grid gap-px bg-gray-200"
           style={{ gridTemplateColumns: `repeat(${filteredNavigation.length}, 1fr)` }}>
        {filteredNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center py-2 transition-all duration-200 ${
                isActive ? item.activeColor + ' text-white' : 'bg-white hover:bg-gray-50'
              }`}
            >
              <Icon className={`h-6 w-6 ${isActive ? 'text-white' : item.textColor}`} />
              <span className={`text-xs mt-1 font-medium ${
                isActive ? 'text-white' : 'text-gray-600'
              }`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}