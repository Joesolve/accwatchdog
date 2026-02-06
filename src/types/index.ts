import type {
  Property,
  PropertyImage,
  PropertyDocument,
  ExpressionOfInterest,
  RecoveryStatistic,
  CaseHighlight,
  NewsUpdate,
  EducationalResource,
  CorruptionReport,
  User,
} from "@prisma/client";

// Re-export Prisma types
export type {
  Property,
  PropertyImage,
  PropertyDocument,
  ExpressionOfInterest,
  RecoveryStatistic,
  CaseHighlight,
  NewsUpdate,
  EducationalResource,
  CorruptionReport,
  User,
};

// Property with relations
export type PropertyWithImages = Property & {
  images: PropertyImage[];
};

export type PropertyWithDetails = Property & {
  images: PropertyImage[];
  documents: PropertyDocument[];
  _count?: {
    expressionsOfInterest: number;
  };
};

// Dashboard Types
export interface DashboardStats {
  totalRecovered: number;
  fundsToTreasury: number;
  propertiesSeized: number;
  propertiesSold: number;
  convictionRate: number;
  casesResolved: number;
}

export interface RecoveryTrendData {
  period: string;
  recovered: number;
  treasury: number;
}

export interface SectorBreakdown {
  sector: string;
  amount: number;
  percentage: number;
}

export interface RegionData {
  region: string;
  recovered: number;
  cases: number;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Filter Types
export interface PropertyFilters {
  type?: string;
  status?: string;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface CaseFilters {
  sector?: string;
  region?: string;
  year?: string;
  search?: string;
}

export interface NewsFilters {
  category?: string;
  search?: string;
}

export interface ResourceFilters {
  category?: string;
  type?: string;
  search?: string;
}

// Form Types
export interface ExpressionOfInterestInput {
  propertyId: string;
  fullName: string;
  email: string;
  phone: string;
  organization?: string;
  address?: string;
  intendedUse?: string;
  proposedAmount?: number;
  message?: string;
}

export interface CorruptionReportInput {
  reporterName?: string;
  reporterEmail?: string;
  reporterPhone?: string;
  isAnonymous: boolean;
  incidentDate?: Date;
  incidentLocation?: string;
  region?: string;
  accusedName?: string;
  accusedPosition?: string;
  accusedOrganization?: string;
  category?: string;
  description: string;
  estimatedAmount?: number;
  hasEvidence: boolean;
  evidenceDescription?: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Admin Types
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
  isActive: boolean;
  lastLoginAt?: Date;
}

export interface PropertyFormData {
  title: string;
  description: string;
  type: string;
  status: string;
  region: string;
  district?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  estimatedValue: number;
  minimumBid?: number;
  auctionDate?: Date;
  auctionVenue?: string;
  size?: string;
  bedrooms?: number;
  bathrooms?: number;
  yearBuilt?: number;
  features: string[];
  caseReference?: string;
  formerOwner?: string;
  isFeatured: boolean;
}

// Statistics Input Types
export interface StatisticsInput {
  period: string;
  periodType: "monthly" | "quarterly" | "yearly";
  totalRecovered: number;
  cashRecovered?: number;
  assetsRecovered?: number;
  fundsToTreasury?: number;
  casesOpened?: number;
  casesClosed?: number;
  prosecutions?: number;
  convictions?: number;
  acquittals?: number;
  propertiesSeized?: number;
  propertiesAuctioned?: number;
  sectorBreakdown?: Record<string, number>;
  regionBreakdown?: Record<string, number>;
}
