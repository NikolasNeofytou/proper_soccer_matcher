import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingsApi, type CreateBookingRequest } from '../api/bookings';
import { useRouter } from 'next/navigation';

export const useMyBookings = () => {
  return useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => bookingsApi.getMyBookings(),
  });
};

export const useBooking = (id: string) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingsApi.getBookingById(id),
    enabled: !!id,
  });
};

export const useCreateBooking = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingRequest) => bookingsApi.createBooking(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      // Redirect to booking confirmation or payment
      router.push(`/booking/confirmation/${data.booking.id}`);
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookingsApi.cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking'] });
    },
  });
};

export const usePitchBookings = (pitchId: string) => {
  return useQuery({
    queryKey: ['pitch-bookings', pitchId],
    queryFn: () => bookingsApi.getPitchBookings(pitchId),
    enabled: !!pitchId,
  });
};
