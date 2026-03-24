import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Volunteer, Organization, AuthResponse } from '@/types';
import { authApi } from '@/services/api';

interface AuthContextType {
  user: User | null;
  profile: Volunteer | Organization | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  registerVolunteer: (data: any) => Promise<void>;
  registerOrganization: (data: any) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Volunteer | Organization) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Volunteer | Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on mount
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedProfile = localStorage.getItem('profile');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
      // Verify token validity
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authApi.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        if (response.data.volunteer) {
          setProfile(response.data.volunteer);
          localStorage.setItem('profile', JSON.stringify(response.data.volunteer));
        } else if (response.data.organization) {
          setProfile(response.data.organization);
          localStorage.setItem('profile', JSON.stringify(response.data.organization));
        }
      }
    } catch (error) {
      // Token invalid, clear storage
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(email, password);
      if (response.success && response.data) {
        const { token, user, profile } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        if (profile) {
          localStorage.setItem('profile', JSON.stringify(profile));
        }
        setUser(user);
        setProfile(profile);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const registerVolunteer = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await authApi.registerVolunteer(data);
      if (response.success && response.data) {
        const { token, user, volunteer } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('profile', JSON.stringify(volunteer));
        setUser(user);
        setProfile(volunteer);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const registerOrganization = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await authApi.registerOrganization(data);
      if (response.success && response.data) {
        const { token, user, organization } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('profile', JSON.stringify(organization));
        setUser(user);
        setProfile(organization);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('profile');
    setUser(null);
    setProfile(null);
  };

  const updateProfile = (newProfile: Volunteer | Organization) => {
    setProfile(newProfile);
    localStorage.setItem('profile', JSON.stringify(newProfile));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        isLoading,
        login,
        registerVolunteer,
        registerOrganization,
        logout,
        updateProfile,
      }}
    >
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

export default AuthContext;
