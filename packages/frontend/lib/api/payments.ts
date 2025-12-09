import { apiClient } from './client';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'google_pay' | 'apple_pay';
  isDefault: boolean;
  // Card details
  last4?: string;
  brand?: string; // visa, mastercard, amex
  expiryMonth?: number;
  expiryYear?: number;
  // PayPal details
  email?: string;
  createdAt: string;
}

export interface PaymentIntent {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  clientSecret?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  type: 'charge' | 'refund';
  status: 'pending' | 'completed' | 'failed';
  paymentMethodId: string;
  description: string;
  receiptUrl?: string;
  createdAt: string;
  processedAt?: string;
}

export interface RefundRequest {
  bookingId: string;
  amount?: number; // Optional: partial refund
  reason?: string;
}

export interface Receipt {
  id: string;
  bookingId: string;
  transactionId: string;
  receiptNumber: string;
  issueDate: string;
  // Business details
  businessName: string;
  businessAddress: string;
  businessVAT: string;
  // Customer details
  customerName: string;
  customerEmail: string;
  // Itemization
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  vat: number;
  vatRate: number; // 24% for Greece
  total: number;
  currency: string;
  paymentMethod: string;
  pdfUrl?: string;
}

export const paymentsApi = {
  // Payment Methods Management
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await apiClient.get('/payments/methods');
    return response.data;
  },

  async addPaymentMethod(token: string): Promise<PaymentMethod> {
    const response = await apiClient.post('/payments/methods', { token });
    return response.data;
  },

  async setDefaultPaymentMethod(methodId: string): Promise<void> {
    await apiClient.patch(`/payments/methods/${methodId}/default`);
  },

  async removePaymentMethod(methodId: string): Promise<void> {
    await apiClient.delete(`/payments/methods/${methodId}`);
  },

  // Payment Processing (Uber-style: charge after booking confirmed)
  async createPaymentIntent(bookingId: string): Promise<PaymentIntent> {
    const response = await apiClient.post('/payments/intents', { bookingId });
    return response.data;
  },

  async confirmPaymentIntent(intentId: string, paymentMethodId?: string): Promise<PaymentIntent> {
    const response = await apiClient.post(`/payments/intents/${intentId}/confirm`, {
      paymentMethodId,
    });
    return response.data;
  },

  // Automatic charging after service (called by system, not user)
  async chargeBooking(bookingId: string): Promise<Transaction> {
    const response = await apiClient.post(`/payments/charge`, { bookingId });
    return response.data;
  },

  // Transaction History
  async getTransactions(): Promise<Transaction[]> {
    const response = await apiClient.get('/payments/transactions');
    return response.data;
  },

  async getTransaction(transactionId: string): Promise<Transaction> {
    const response = await apiClient.get(`/payments/transactions/${transactionId}`);
    return response.data;
  },

  // Refunds (automatic for cancellations)
  async requestRefund(data: RefundRequest): Promise<Transaction> {
    const response = await apiClient.post('/payments/refunds', data);
    return response.data;
  },

  // Receipts (Greek tax compliant)
  async getReceipt(bookingId: string): Promise<Receipt> {
    const response = await apiClient.get(`/payments/receipts/${bookingId}`);
    return response.data;
  },

  async downloadReceipt(bookingId: string): Promise<Blob> {
    const response = await apiClient.get(`/payments/receipts/${bookingId}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  async emailReceipt(bookingId: string, email: string): Promise<void> {
    await apiClient.post(`/payments/receipts/${bookingId}/email`, { email });
  },
};
