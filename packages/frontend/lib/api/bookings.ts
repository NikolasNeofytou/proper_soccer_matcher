import { apiClient } from './client';
import type { Pitch } from './pitches';

export interface Booking {
  id: string;
  pitchId: string;
  pitchName: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  playerCount?: number;
  notes?: string;
  pitch?: Pitch; // Optional populated pitch data
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  pitchId: string;
  date: string;
  startTime: string;
  endTime: string;
  playerCount?: number;
  notes?: string;
}

export interface BookingConfirmation {
  booking: Booking;
  paymentIntent?: string;
}

export const bookingsApi = {
  // Get user's bookings
  getMyBookings: async (): Promise<Booking[]> => {
    const response = await apiClient.get('/bookings/my-bookings');
    return response.data;
  },

  // Get single booking by ID
  getBookingById: async (id: string): Promise<Booking> => {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data;
  },

  // Create new booking
  createBooking: async (data: CreateBookingRequest): Promise<BookingConfirmation> => {
    const response = await apiClient.post('/bookings', data);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id: string): Promise<void> => {
    await apiClient.patch(`/bookings/${id}/cancel`);
  },

  // Get bookings for a specific pitch (owner only)
  getPitchBookings: async (pitchId: string): Promise<Booking[]> => {
    const response = await apiClient.get(`/bookings/pitch/${pitchId}`);
    return response.data;
  },
};
