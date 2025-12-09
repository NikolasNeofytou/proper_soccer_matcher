'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, ArrowLeft, Lock, AlertCircle } from 'lucide-react';
import { useAddPaymentMethod } from '@/lib/hooks/use-payments';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function AddPaymentMethodPage() {
  const router = useRouter();
  const addPaymentMethod = useAddPaymentMethod();

  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setCardNumber(formatCardNumber(value));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setExpiryDate(formatExpiryDate(value));
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCvc(value);
    }
  };

  const detectCardBrand = (number: string): string => {
    const cleaned = number.replace(/\s/g, '');
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    return 'unknown';
  };

  const validateCard = (): boolean => {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (cleaned.length < 13 || cleaned.length > 19) {
      setError('Invalid card number');
      return false;
    }

    if (!expiryDate.match(/^\d{2}\/\d{2}$/)) {
      setError('Invalid expiry date (MM/YY)');
      return false;
    }

    const [month, year] = expiryDate.split('/').map(Number);
    if (month < 1 || month > 12) {
      setError('Invalid expiry month');
      return false;
    }

    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      setError('Card has expired');
      return false;
    }

    if (cvc.length < 3 || cvc.length > 4) {
      setError('Invalid CVC/CVV');
      return false;
    }

    if (!cardholderName.trim()) {
      setError('Cardholder name is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateCard()) {
      return;
    }

    setIsProcessing(true);

    try {
      // In production, this would:
      // 1. Create Stripe token from card details
      // 2. Send token to backend
      // 3. Backend saves to Stripe and creates payment_method record
      
      // Simulated Stripe token creation
      const mockToken = `tok_${Math.random().toString(36).substring(7)}`;
      
      await addPaymentMethod.mutateAsync(mockToken);
      
      // Success - redirect back to payment methods
      router.push('/payment-methods');
    } catch (err) {
      setError('Failed to add payment method. Please try again.');
      console.error('Add payment method error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const cardBrand = detectCardBrand(cardNumber);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-white">Add Payment Method</h1>
          <p className="text-gray-400 mt-2">
            Securely save your payment details for seamless bookings
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Security Banner */}
        <Card className="p-4 bg-green-500/5 border-green-500/20 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Secure Payment</h3>
              <p className="text-xs text-gray-400">
                Your card details are encrypted and never stored on our servers
              </p>
            </div>
          </div>
        </Card>

        {/* Payment Form */}
        <Card className="p-8 bg-gray-900/50 border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                {cardBrand !== 'unknown' && cardNumber.length > 0 && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <span className="text-2xl">
                      {cardBrand === 'visa' && '💳'}
                      {cardBrand === 'mastercard' && '💳'}
                      {cardBrand === 'amex' && '💳'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Expiry & CVC */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CVC/CVV
                </label>
                <input
                  type="text"
                  value={cvc}
                  onChange={handleCvcChange}
                  placeholder="123"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="JOHN DOE"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent uppercase"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full py-6 text-lg font-semibold bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              {isProcessing ? (
                'Processing...'
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Add Payment Method
                </>
              )}
            </Button>

            {/* Info Text */}
            <p className="text-xs text-center text-gray-500">
              By adding a payment method, you agree to our{' '}
              <a href="/terms" className="text-primary-400 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary-400 hover:underline">
                Privacy Policy
              </a>
            </p>
          </form>
        </Card>

        {/* Security Features */}
        <Card className="p-6 bg-gray-900/50 border-gray-800 mt-6">
          <h3 className="text-lg font-bold text-white mb-4">Your Security Matters</h3>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-start gap-3">
              <Lock className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
              <span>256-bit SSL encryption protects your data</span>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
              <span>PCI DSS Level 1 compliant payment processing</span>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
              <span>Your card details are never stored on our servers</span>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
              <span>Tokenized payment processing via Stripe</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
