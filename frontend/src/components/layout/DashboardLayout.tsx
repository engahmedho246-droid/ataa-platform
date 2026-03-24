import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  HandHeart,
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  Award,
  Building2,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Bell,
  Shield,
  BarChart3,
  BadgeCheck,
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Navigation items based on role
  const getNavItems = () => {
    switch (user?.role) {
      case 'VOLUNTEER':
        return [
          { path: '/volunteer/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
          { path: '/volunteer/opportunities', label: 'الفرص التطوعية', icon: Briefcase },
          { path: '/volunteer/applications', label: 'طلباتي', icon: FileText },
          { path: '/volunteer/portfolio', label: 'محفظتي', icon: Award },
          { path: '/volunteer/profile', label: 'الملف الشخصي', icon: User },
        ];
      case 'ORGANIZATION':
        return [
          { path: '/organization/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
          { path: '/organization/opportunities', label: 'الفرص', icon: Briefcase },
          { path: '/organization/profile', label: 'الملف الشخصي', icon: Building2 },
        ];
      case 'ADMIN':
        return [
          { path: '/admin/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
          { path: '/admin/users', label: 'المستخدمين', icon: Users },
          { path: '/admin/organizations', label: 'الجهات', icon: Building2 },
          { path: '/admin/badges', label: 'الأوسمة', icon: BadgeCheck },
          { path: '/admin/statistics', label: 'الإحصائيات', icon: BarChart3 },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 right-0 h-screen w-72 bg-white border-l border-gray-200 z-50 transform transition-transform duration-300 lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center">
                <HandHeart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">عطاء</span>
            </Link>
            <button
              className="lg:hidden p-2"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{user?.name}</p>
                <p className="text-sm text-gray-500">
                  {user?.role === 'VOLUNTEER' && 'متطوع'}
                  {user?.role === 'ORGANIZATION' && 'جهة منظمة'}
                  {user?.role === 'ADMIN' && 'مدير النظام'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-emerald-50 text-emerald-600 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-emerald-600' : ''}`} />
                    <span>{item.label}</span>
                    {isActive(item.path) && (
                      <ChevronLeft className="w-4 h-4 mr-auto" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-100">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              <span>تسجيل الخروج</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-semibold text-gray-800 hidden sm:block">
                {navItems.find((item) => isActive(item.path))?.label || 'لوحة التحكم'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
