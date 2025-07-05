/**
 * Reviews module types
 */

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED';
export type ReviewSource = 'WEBSITE' | 'GOOGLE' | 'FACEBOOK' | 'YELP' | 'TRUSTPILOT' | 'MANUAL';
export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export interface Review {
  id: string;
  title?: string;
  content: string;
  rating: ReviewRating;
  status: ReviewStatus;
  source: ReviewSource;
  externalId?: string;
  externalUrl?: string;
  authorName: string;
  authorEmail?: string;
  authorAvatar?: string;
  response?: ReviewResponse;
  serviceId?: string;
  service?: ReviewService;
  locationId?: string;
  location?: ReviewLocation;
  tags: ReviewTag[];
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewResponse {
  id: string;
  content: string;
  respondentName: string;
  respondentRole?: string;
  reviewId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewService {
  id: string;
  name: string;
  description?: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewLocation {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  googlePlaceId?: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewTag {
  id: string;
  name: string;
  color?: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewWidget {
  id: string;
  name: string;
  type: 'SLIDER' | 'GRID' | 'TESTIMONIAL';
  config: {
    theme?: 'LIGHT' | 'DARK' | 'CUSTOM';
    showRating?: boolean;
    showDate?: boolean;
    showSource?: boolean;
    customCss?: string;
    filters?: {
      minRating?: ReviewRating;
      sources?: ReviewSource[];
      serviceIds?: string[];
      locationIds?: string[];
      tagIds?: string[];
    };
  };
  isActive: boolean;
  domains: string[];
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStatistics {
  totalReviews: number;
  averageRating: number;
  ratingCounts: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
  sourceDistribution: Record<ReviewSource, number>;
  responseRate: number;
  trendsData: {
    period: string;
    count: number;
    averageRating: number;
  }[];
} 