// ==================== USER TYPES ====================

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'VOLUNTEER' | 'ORGANIZATION' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: Date;
  updatedAt: Date;
}

export interface Volunteer {
  id: string;
  userId: string;
  city?: string;
  skills: string[];
  interests: string[];
  bio?: string;
  avatarUrl?: string;
  totalHours: number;
  completedOpportunities: number;
  user?: User;
}

export interface Organization {
  id: string;
  userId: string;
  name: string;
  type: 'NON_PROFIT' | 'GOVERNMENT' | 'PRIVATE' | 'EDUCATIONAL' | 'HEALTHCARE' | 'OTHER';
  licenseNumber?: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  address?: string;
  city?: string;
  isVerified: boolean;
  verificationStatus: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  user?: User;
}

// ==================== OPPORTUNITY TYPES ====================

export interface Opportunity {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  location: string;
  category: string;
  requiredSkills: string[];
  requiredVolunteers: number;
  startDate: Date;
  endDate: Date;
  status: 'DRAFT' | 'OPEN' | 'CLOSED' | 'CANCELLED' | 'COMPLETED';
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  organization?: Organization;
  _count?: {
    applications: number;
  };
}

export interface Application {
  id: string;
  opportunityId: string;
  volunteerId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN' | 'COMPLETED';
  message?: string;
  appliedAt: Date;
  updatedAt: Date;
  respondedAt?: Date;
  responseNote?: string;
  opportunity?: Opportunity;
  volunteer?: Volunteer;
}

// ==================== HOURS TYPES ====================

export interface HoursLog {
  id: string;
  applicationId: string;
  checkInTime: Date;
  checkOutTime?: Date;
  totalHours?: number;
  source: 'QR' | 'MANUAL' | 'AUTO';
  qrToken?: string;
  approvedByOrg: boolean;
  approvedAt?: Date;
  approvedById?: string;
  notes?: string;
  application?: Application;
}

// ==================== GAMIFICATION TYPES ====================

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteriaType: 'TOTAL_HOURS' | 'COMPLETED_OPPORTUNITIES' | 'SPECIFIC_CATEGORY' | 'STREAK_DAYS' | 'SPECIAL_ACHIEVEMENT';
  threshold: number;
  color: string;
}

export interface EarnedBadge {
  id: string;
  badgeId: string;
  volunteerId: string;
  earnedAt: Date;
  reason?: string;
  badge?: Badge;
}

// ==================== CERTIFICATE TYPES ====================

export interface Certificate {
  id: string;
  volunteerId: string;
  opportunityId: string;
  issuedAt: Date;
  hours: number;
  pdfUrl?: string;
  certificateHash: string;
  isRevoked: boolean;
  revokedAt?: Date;
  revokeReason?: string;
  opportunity?: Opportunity;
}

// ==================== NOTIFICATION TYPES ====================

export interface Notification {
  id: string;
  userId: string;
  type: 'APPLICATION_STATUS' | 'OPPORTUNITY_REMINDER' | 'HOURS_APPROVED' | 'BADGE_EARNED' | 'CERTIFICATE_ISSUED' | 'OPPORTUNITY_CREATED' | 'SYSTEM_ANNOUNCEMENT';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}

// ==================== AUTH TYPES ====================

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterVolunteerRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  city?: string;
  skills?: string[];
  interests?: string[];
  bio?: string;
}

export interface RegisterOrganizationRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  orgName: string;
  orgType: string;
  licenseNumber?: string;
  description?: string;
  website?: string;
  address?: string;
  city?: string;
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: any[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// ==================== DASHBOARD TYPES ====================

export interface VolunteerDashboard {
  totalHours: number;
  completedOpportunities: number;
  pendingApplications: number;
  upcomingOpportunities: Opportunity[];
  recentBadges: EarnedBadge[];
  notifications: Notification[];
}

export interface OrganizationDashboard {
  totalOpportunities: number;
  activeOpportunities: number;
  totalVolunteers: number;
  pendingApplications: number;
  totalHoursLogged: number;
  recentApplications: Application[];
}

export interface AdminDashboard {
  totalUsers: number;
  totalVolunteers: number;
  totalOrganizations: number;
  pendingVerifications: number;
  totalOpportunities: number;
  totalHours: number;
  recentUsers: User[];
  recentOpportunities: Opportunity[];
}

// ==================== FILTER TYPES ====================

export interface OpportunityFilters {
  location?: string;
  category?: string;
  skills?: string[];
  startDate?: Date;
  endDate?: Date;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}
