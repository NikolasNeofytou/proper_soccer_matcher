import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pitchesApi, type PitchFilters, type Pitch } from '../api/pitches';

export const usePitches = (filters?: PitchFilters) => {
  return useQuery({
    queryKey: ['pitches', filters],
    queryFn: () => pitchesApi.getPitches(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const usePitch = (id: string) => {
  return useQuery({
    queryKey: ['pitch', id],
    queryFn: () => pitchesApi.getPitchById(id),
    enabled: !!id,
  });
};

export const usePitchAvailability = (
  id: string,
  startDate: string,
  endDate: string
) => {
  return useQuery({
    queryKey: ['pitch-availability', id, startDate, endDate],
    queryFn: () => pitchesApi.getPitchAvailability(id, startDate, endDate),
    enabled: !!id && !!startDate && !!endDate,
  });
};

export const useFavoritePitches = () => {
  return useQuery({
    queryKey: ['favorite-pitches'],
    queryFn: () => pitchesApi.getFavoritePitches(),
  });
};

export const useAddToFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pitchId: string) => pitchesApi.addToFavorites(pitchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite-pitches'] });
      queryClient.invalidateQueries({ queryKey: ['pitches'] });
    },
  });
};

export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pitchId: string) => pitchesApi.removeFromFavorites(pitchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite-pitches'] });
      queryClient.invalidateQueries({ queryKey: ['pitches'] });
    },
  });
};

export const useCreatePitch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Pitch>) => pitchesApi.createPitch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pitches'] });
    },
  });
};

export const useUpdatePitch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Pitch> }) =>
      pitchesApi.updatePitch(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['pitch', id] });
      queryClient.invalidateQueries({ queryKey: ['pitches'] });
    },
  });
};

export const useDeletePitch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => pitchesApi.deletePitch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pitches'] });
    },
  });
};
