'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Plus, Trash2, Check, ArrowLeft } from 'lucide-react';
import {
  usePaymentMethods,
  useSetDefaultPaymentMethod,
  useRemovePaymentMethod,
} from '@/lib/hooks/use-payments';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const cardBrandLogos: Record<string, string> = {
  visa: '💳',
  mastercard: '💳',
  amex: '💳',
  discover: '💳',
};

export default function PaymentMethodsPage() {
  const router = useRouter();
  const { data: paymentMethods, isLoading } = usePaymentMethods();
  const setDefaultMethod = useSetDefaultPaymentMethod();
  const removeMethod = useRemovePaymentMethod();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSetDefault = async (methodId: string) => {
    try {
      await setDefaultMethod.mutateAsync(methodId);
    } catch (error) {
      console.error('Failed to set default payment method:', error);
      alert('Failed to set default payment method');
    }
  };

  const handleRemove = async (methodId: string) => {
    if (!confirm('Are you sure you want to remove this payment method?')) {
      return;
    }

    setDeletingId(methodId);
    try {
      await removeMethod.mutateAsync(methodId);
    } catch (error) {
      console.error('Failed to remove payment method:', error);
      alert('Failed to remove payment method');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-white">Payment Methods</h1>
          <p className="text-gray-400 mt-2">
            Manage your payment methods for seamless bookings
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Info Banner */}
        <Card className="p-6 bg-blue-500/5 border-blue-500/20 mb-8">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-400" />
            How Payment Works
          </h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <span>Save your payment method once, use for all bookings</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <span>You&apos;re charged automatically after your booking is completed</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <span>Get instant digital receipts via email</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <span>Free cancellations up to 24 hours before - automatic refund</span>
            </li>
          </ul>
        </Card>

        {/* Payment Methods List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Your Payment Methods</h2>
            <Button
              onClick={() => router.push('/payment-methods/add')}
              className="bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </div>

          {!paymentMethods || paymentMethods.length === 0 ? (
            <Card className="p-12 bg-gray-900/50 border-gray-800 text-center">
              <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Payment Methods</h3>
              <p className="text-gray-400 mb-6">
                Add a payment method to book pitches instantly
              </p>
              <Button
                onClick={() => router.push('/payment-methods/add')}
                className="bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Payment Method
              </Button>
            </Card>
          ) : (
            paymentMethods.map((method) => (
              <Card
                key={method.id}
                className={`p-6 bg-gray-900/50 border-2 transition-all ${
                  method.isDefault
                    ? 'border-primary-500 bg-primary-500/5'
                    : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-2xl">
                      {method.type === 'card' && method.brand
                        ? cardBrandLogos[method.brand] || '💳'
                        : method.type === 'paypal'
                        ? '🅿️'
                        : method.type === 'google_pay'
                        ? 'G'
                        : '🍎'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-white capitalize">
                          {method.type === 'card' && method.brand
                            ? `${method.brand} Card`
                            : method.type.replace('_', ' ')}
                        </h3>
                        {method.isDefault && (
                          <span className="px-2 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-medium rounded-lg">
                            Default
                          </span>
                        )}
                      </div>
                      {method.type === 'card' && (
                        <p className="text-gray-400 text-sm">
                          •••• {method.last4} | Expires {method.expiryMonth}/{method.expiryYear}
                        </p>
                      )}
                      {method.type === 'paypal' && (
                        <p className="text-gray-400 text-sm">{method.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <Button
                        onClick={() => handleSetDefault(method.id)}
                        variant="secondary"
                        className="bg-gray-800 hover:bg-gray-700"
                        disabled={setDefaultMethod.isPending}
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button
                      onClick={() => handleRemove(method.id)}
                      variant="secondary"
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20"
                      disabled={deletingId === method.id}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Security Notice */}
        <Card className="p-6 bg-gray-900/50 border-gray-800 mt-8">
          <h3 className="text-sm font-bold text-white mb-2">🔒 Secure Payments</h3>
          <p className="text-gray-400 text-sm">
            Your payment information is encrypted and stored securely. We never store your
            full card details. All transactions are processed through PCI-compliant payment
            processors.
          </p>
        </Card>
      </div>
    </div>
  );
}
