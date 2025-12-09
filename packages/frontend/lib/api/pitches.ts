import { apiClient } from './client';

export interface Pitch {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  postcode?: string;
  country: string;
  latitude: number;
  longitude: number;
  pricePerHour: number;
  surface: 'grass' | 'artificial' | 'indoor' | 'hybrid';
  size: '5-a-side' | '7-a-side' | '11-a-side';
  facilities: string[];
  images: string[];
  rating: number;
  totalReviews: number;
  isAvailable: boolean;
  status: 'active' | 'inactive';
  ownerId: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface PitchFilters {
  search?: string;
  city?: string;
  surface?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  facilities?: string[];
  date?: string;
  startTime?: string;
  endTime?: string;
  minRating?: number;
  sortBy?: 'price' | 'rating' | 'distance';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PitchesResponse {
  pitches: Pitch[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PitchAvailability {
  date: string;
  slots: {
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    price: number;
  }[];
}

export const pitchesApi = {
  // Get all pitches with filters
  getPitches: async (filters?: PitchFilters): Promise<PitchesResponse> => {
    const response = await apiClient.get('/pitches', { params: filters });
    return response.data;
  },

  // Get single pitch by ID
  getPitchById: async (id: string): Promise<Pitch> => {
    const response = await apiClient.get(`/pitches/${id}`);
    return response.data;
  },

  // Get pitch availability
  getPitchAvailability: async (
    id: string,
    startDate: string,
    endDate: string
  ): Promise<PitchAvailability[]> => {
    const response = await apiClient.get(`/pitches/${id}/availability`, {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // Create pitch (business owner only)
  createPitch: async (data: Partial<Pitch>): Promise<Pitch> => {
    const response = await apiClient.post('/pitches', data);
    return response.data;
  },

  // Update pitch (business owner only)
  updatePitch: async (id: string, data: Partial<Pitch>): Promise<Pitch> => {
    const response = await apiClient.patch(`/pitches/${id}`, data);
    return response.data;
  },

  // Delete pitch (business owner only)
  deletePitch: async (id: string): Promise<void> => {
    await apiClient.delete(`/pitches/${id}`);
  },

  // Get my pitches (business owner only)
  getMyPitches: async (): Promise<Pitch[]> => {
    const response = await apiClient.get('/pitches/my-pitches');
    return response.data.data || response.data;
  },

  // Get user's favorite pitches
  getFavoritePitches: async (): Promise<Pitch[]> => {
    const response = await apiClient.get('/pitches/favorites');
    return response.data;
  },

  // Add pitch to favorites
  addToFavorites: async (pitchId: string): Promise<void> => {
    await apiClient.post(`/pitches/${pitchId}/favorite`);
  },

  // Remove pitch from favorites
  removeFromFavorites: async (pitchId: string): Promise<void> => {
    await apiClient.delete(`/pitches/${pitchId}/favorite`);
  },
};
