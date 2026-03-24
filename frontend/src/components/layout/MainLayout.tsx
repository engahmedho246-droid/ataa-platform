import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { HandHeart, Menu, X, User, LogOut } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="container-mobile">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center">
                <HandHeart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">عطاء</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="nav-link">الرئيسية</Link>
              <Link to="/register/volunteer" className="nav-link">تطوع معنا</Link>
              <Link to="/register/organization" className="nav-link">شريك معنا</Link>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link to="/dashboard">
                    <Button variant="outline" className="gap-2">
                      <User className="w-4 h-4" />
                      لوحة التحكم
                    </Button>
                  </Link>
                  <Button variant="ghost" onClick={logout} className="gap-2">
                    <LogOut className="w-4 h-4" />
                    خروج
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login">
                    <Button variant="outline">تسجيل الدخول</Button>
                  </Link>
                  <Link to="/register/volunteer">
                    <Button className="btn-primary">انضم إلينا</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
              <div className="flex flex-col gap-4">
                <Link to="/" className="nav-link py-2">الرئيسية</Link>
                <Link to="/register/volunteer" className="nav-link py-2">تطوع معنا</Link>
                <Link to="/register/organization" className="nav-link py-2">شريك معنا</Link>
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="nav-link py-2">لوحة التحكم</Link>
                    <button onClick={logout} className="nav-link py-2 text-right">خروج</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="nav-link py-2">تسجيل الدخول</Link>
                    <Link to="/register/volunteer" className="btn-primary text-center">انضم إلينا</Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
        <div className="container-mobile">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-lg flex items-center justify-center">
                <HandHeart className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-800">عطاء</span>
            </div>
            <p className="text-gray-500 text-sm text-center">
              منصة عطاء - لأتمتة إدارة العمل التطوعي وتعزيز المسؤولية المجتمعية
            </p>
            <p className="text-gray-400 text-sm">
              © 2024 عطاء. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
