// ==================== USER TYPES ====================

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'VOLUNTEER' | 'ORGANIZATION' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
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
  startDate: string;
  endDate: string;
  status: 'DRAFT' | 'OPEN' | 'CLOSED' | 'CANCELLED' | 'COMPLETED';
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  organization?: {
    name: string;
    logoUrl?: string;
    isVerified: boolean;
  };
  _count?: {
    applications: number;
  };
  hasApplied?: boolean;
  applicationStatus?: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  volunteerId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN' | 'COMPLETED';
  message?: string;
  appliedAt: string;
  updatedAt: string;
  respondedAt?: string;
  responseNote?: string;
  opportunity?: {
    id: string;
    title: string;
    location: string;
    category: string;
    startDate: string;
    endDate: string;
    organization: {
      name: string;
      logoUrl?: string;
    };
  };
  volunteer?: {
    id: string;
    user: {
      name: string;
      email: string;
      phone?: string;
    };
  };
}

// ==================== HOURS TYPES ====================

export interface HoursLog {
  id: string;
  applicationId: string;
  checkInTime: string;
  checkOutTime?: string;
  totalHours?: number;
  source: 'QR' | 'MANUAL' | 'AUTO';
  qrToken?: string;
  approvedByOrg: boolean;
  approvedAt?: string;
  approvedById?: string;
  notes?: string;
  application?: {
    opportunity: {
      title: string;
    };
  };
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
  earnedAt: string;
  reason?: string;
  badge?: Badge;
}

// ==================== CERTIFICATE TYPES ====================

export interface Certificate {
  id: string;
  volunteerId: string;
  opportunityId: string;
  issuedAt: string;
  hours: number;
  pdfUrl?: string;
  certificateHash: string;
  isRevoked: boolean;
  opportunity?: {
    title: string;
  };
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
  createdAt: string;
  readAt?: string;
}

// ==================== AUTH TYPES ====================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterVolunteerData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  city?: string;
  skills?: string[];
  interests?: string[];
  bio?: string;
}

export interface RegisterOrganizationData {
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

export interface AuthResponse {
  token: string;
  user: User;
  profile?: Volunteer | Organization;
}

// ==================== DASHBOARD TYPES ====================

export interface VolunteerDashboard {
  profile: Volunteer;
  stats: {
    totalHours: number;
    completedOpportunities: number;
    pendingApplications: number;
  };
  upcomingOpportunities: Application[];
  recentBadges: EarnedBadge[];
  notifications: Notification[];
}

export interface OrganizationDashboard {
  stats: {
    totalOpportunities: number;
    activeOpportunities: number;
    totalVolunteers: number;
    pendingApplications: number;
    totalHours: number;
  };
  recentApplications: Application[];
}

export interface AdminDashboard {
  stats: {
    totalUsers: number;
    totalVolunteers: number;
    totalOrganizations: number;
    pendingVerifications: number;
    totalOpportunities: number;
    totalHours: number;
  };
  recentUsers: User[];
  recentOpportunities: Opportunity[];
}

// ==================== FILTER TYPES ====================

export interface OpportunityFilters {
  location?: string;
  category?: string;
  skills?: string[];
  startDate?: string;
  endDate?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
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
