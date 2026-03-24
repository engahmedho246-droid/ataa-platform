import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { HandHeart } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container-mobile">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center">
                <HandHeart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">عطاء</span>
            </Link>
            <Link to="/" className="text-gray-600 hover:text-emerald-600 transition-colors">
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-4">
        <div className="container-mobile text-center">
          <p className="text-gray-400 text-sm">
            © 2024 عطاء. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
