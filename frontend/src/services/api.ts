import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiResponse } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic API methods
export const api = {
  get: <T>(url: string, params?: any) =>
    apiClient.get<ApiResponse<T>>(url, { params }).then((res) => res.data),

  post: <T>(url: string, data?: any) =>
    apiClient.post<ApiResponse<T>>(url, data).then((res) => res.data),

  patch: <T>(url: string, data?: any) =>
    apiClient.patch<ApiResponse<T>>(url, data).then((res) => res.data),

  put: <T>(url: string, data?: any) =>
    apiClient.put<ApiResponse<T>>(url, data).then((res) => res.data),

  delete: <T>(url: string) =>
    apiClient.delete<ApiResponse<T>>(url).then((res) => res.data),
};

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post<{
      token: string;
      user: any;
      profile: any;
    }>('/auth/login', { email, password }),

  registerVolunteer: (data: any) =>
    api.post<{
      token: string;
      user: any;
      volunteer: any;
    }>('/auth/register/volunteer', data),

  registerOrganization: (data: any) =>
    api.post<{
      token: string;
      user: any;
      organization: any;
    }>('/auth/register/organization', data),

  getCurrentUser: () =>
    api.get<any>('/auth/me'),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),
};

// Volunteer API
export const volunteerApi = {
  getDashboard: () =>
    api.get<any>('/volunteer/dashboard'),

  getProfile: () =>
    api.get<any>('/volunteer/profile'),

  updateProfile: (data: any) =>
    api.patch<any>('/volunteer/profile', data),

  getPortfolio: () =>
    api.get<any>('/volunteer/portfolio'),

  getOpportunities: (filters?: any) =>
    api.get<any[]>('/volunteer/opportunities', filters),

  getOpportunityById: (id: string) =>
    api.get<any>(`/volunteer/opportunities/${id}`),

  applyForOpportunity: (id: string, message?: string) =>
    api.post(`/volunteer/opportunities/${id}/apply`, { message }),

  getMyApplications: (params?: any) =>
    api.get<any[]>('/volunteer/applications', params),

  withdrawApplication: (id: string) =>
    api.patch(`/volunteer/applications/${id}/withdraw`),

  checkIn: (opportunityId: string, qrToken?: string) =>
    api.post(`/volunteer/opportunities/${opportunityId}/check-in`, { qrToken }),

  checkOut: (opportunityId: string) =>
    api.post(`/volunteer/opportunities/${opportunityId}/check-out`),
};

// Organization API
export const organizationApi = {
  getDashboard: () =>
    api.get<any>('/organization/dashboard'),

  getProfile: () =>
    api.get<any>('/organization/profile'),

  updateProfile: (data: any) =>
    api.patch<any>('/organization/profile', data),

  createOpportunity: (data: any) =>
    api.post<any>('/organization/opportunities', data),

  getOpportunities: (params?: any) =>
    api.get<any[]>('/organization/opportunities', params),

  getOpportunityById: (id: string) =>
    api.get<any>(`/organization/opportunities/${id}`),

  updateOpportunity: (id: string, data: any) =>
    api.patch<any>(`/organization/opportunities/${id}`, data),

  changeOpportunityStatus: (id: string, status: string) =>
    api.patch(`/organization/opportunities/${id}/status`, { status }),

  getApplications: (opportunityId: string, params?: any) =>
    api.get<any[]>(`/organization/opportunities/${opportunityId}/applications`, params),

  respondToApplication: (opportunityId: string, applicationId: string, status: string, note?: string) =>
    api.patch(`/organization/opportunities/${opportunityId}/applications/${applicationId}`, { status, note }),

  getHoursLogs: (opportunityId: string) =>
    api.get<any[]>(`/organization/opportunities/${opportunityId}/hours`),

  approveHours: (opportunityId: string, logId: string) =>
    api.patch(`/organization/opportunities/${opportunityId}/hours/${logId}/approve`),

  issueCertificate: (opportunityId: string, volunteerId: string) =>
    api.post(`/organization/opportunities/${opportunityId}/certificates/${volunteerId}`),
};

// Admin API
export const adminApi = {
  getDashboard: () =>
    api.get<any>('/admin/dashboard'),

  getUsers: (params?: any) =>
    api.get<any[]>('/admin/users', params),

  getUserById: (id: string) =>
    api.get<any>(`/admin/users/${id}`),

  updateUserStatus: (id: string, status: string) =>
    api.patch(`/admin/users/${id}/status`, { status }),

  deleteUser: (id: string) =>
    api.delete(`/admin/users/${id}`),

  getPendingOrganizations: (params?: any) =>
    api.get<any[]>('/admin/organizations/pending', params),

  verifyOrganization: (id: string, status: string, reason?: string) =>
    api.patch(`/admin/organizations/${id}/verify`, { status, reason }),

  getBadges: () =>
    api.get<any[]>('/admin/badges'),

  createBadge: (data: any) =>
    api.post<any>('/admin/badges', data),

  updateBadge: (id: string, data: any) =>
    api.patch<any>(`/admin/badges/${id}`, data),

  deleteBadge: (id: string) =>
    api.delete(`/admin/badges/${id}`),

  getAllOpportunities: (params?: any) =>
    api.get<any[]>('/admin/opportunities', params),

  getStatistics: (params?: any) =>
    api.get<any>('/admin/statistics', params),
};

export default apiClient;
