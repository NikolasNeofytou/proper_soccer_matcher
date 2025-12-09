import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi, type RefundRequest } from '../api/payments';

export const usePaymentMethods = () => {
  return useQuery({
    queryKey: ['payment-methods'],
    queryFn: () => paymentsApi.getPaymentMethods(),
  });
};

export const useAddPaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => paymentsApi.addPaymentMethod(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
};

export const useSetDefaultPaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (methodId: string) => paymentsApi.setDefaultPaymentMethod(methodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
};

export const useRemovePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (methodId: string) => paymentsApi.removePaymentMethod(methodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
};

export const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: () => paymentsApi.getTransactions(),
  });
};

export const useTransaction = (transactionId: string) => {
  return useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: () => paymentsApi.getTransaction(transactionId),
    enabled: !!transactionId,
  });
};

export const useRequestRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RefundRequest) => paymentsApi.requestRefund(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useReceipt = (bookingId: string) => {
  return useQuery({
    queryKey: ['receipt', bookingId],
    queryFn: () => paymentsApi.getReceipt(bookingId),
    enabled: !!bookingId,
  });
};
