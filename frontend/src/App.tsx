import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';

// Layouts
import MainLayout from '@/components/layout/MainLayout';
import AuthLayout from '@/components/layout/AuthLayout';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Public Pages
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterVolunteerPage from '@/pages/auth/RegisterVolunteerPage';
import RegisterOrganizationPage from '@/pages/auth/RegisterOrganizationPage';

// Volunteer Pages
import VolunteerDashboard from '@/pages/volunteer/Dashboard';
import VolunteerProfile from '@/pages/volunteer/Profile';
import VolunteerPortfolio from '@/pages/volunteer/Portfolio';
import OpportunitiesList from '@/pages/volunteer/OpportunitiesList';
import OpportunityDetails from '@/pages/volunteer/OpportunityDetails';
import MyApplications from '@/pages/volunteer/MyApplications';

// Organization Pages
import OrganizationDashboard from '@/pages/organization/Dashboard';
import OrganizationProfile from '@/pages/organization/Profile';
import ManageOpportunities from '@/pages/organization/ManageOpportunities';
import CreateOpportunity from '@/pages/organization/CreateOpportunity';
import OpportunityApplications from '@/pages/organization/OpportunityApplications';

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard';
import UsersManagement from '@/pages/admin/UsersManagement';
import OrganizationsVerification from '@/pages/admin/OrganizationsVerification';
import BadgesManagement from '@/pages/admin/BadgesManagement';
import SystemStatistics from '@/pages/admin/SystemStatistics';

// Protected Route Component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: string[];
}> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role || '')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Role-based redirect
const RoleBasedRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'VOLUNTEER':
      return <Navigate to="/volunteer/dashboard" replace />;
    case 'ORGANIZATION':
      return <Navigate to="/organization/dashboard" replace />;
    case 'ADMIN':
      return <Navigate to="/admin/dashboard" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/volunteer" element={<RegisterVolunteerPage />} />
        <Route path="/register/organization" element={<RegisterOrganizationPage />} />
      </Route>

      {/* Volunteer Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['VOLUNTEER']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
        <Route path="/volunteer/profile" element={<VolunteerProfile />} />
        <Route path="/volunteer/portfolio" element={<VolunteerPortfolio />} />
        <Route path="/volunteer/opportunities" element={<OpportunitiesList />} />
        <Route path="/volunteer/opportunities/:id" element={<OpportunityDetails />} />
        <Route path="/volunteer/applications" element={<MyApplications />} />
      </Route>

      {/* Organization Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['ORGANIZATION']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/organization/dashboard" element={<OrganizationDashboard />} />
        <Route path="/organization/profile" element={<OrganizationProfile />} />
        <Route path="/organization/opportunities" element={<ManageOpportunities />} />
        <Route path="/organization/opportunities/create" element={<CreateOpportunity />} />
        <Route path="/organization/opportunities/:id/applications" element={<OpportunityApplications />} />
      </Route>

      {/* Admin Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UsersManagement />} />
        <Route path="/admin/organizations" element={<OrganizationsVerification />} />
        <Route path="/admin/badges" element={<BadgesManagement />} />
        <Route path="/admin/statistics" element={<SystemStatistics />} />
      </Route>

      {/* Dashboard Redirect */}
      <Route path="/dashboard" element={<RoleBasedRedirect />} />

      {/* Catch All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster position="top-center" richColors />
      </Router>
    </AuthProvider>
  );
}

export default App;
