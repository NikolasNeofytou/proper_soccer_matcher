'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, Clock, MapPin, Users, FileText, CreditCard, ArrowLeft, Check } from 'lucide-react';
import { usePitch } from '@/lib/hooks/use-pitches';
import { useCreateBooking } from '@/lib/hooks/use-bookings';
import { usePaymentMethods } from '@/lib/hooks/use-payments';
import { useAuthStore } from '@/lib/stores/auth.store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  
  const pitchId = searchParams.get('pitchId') || '';
  const preselectedDate = searchParams.get('date') || '';

  const { data: pitch, isLoading } = usePitch(pitchId);
  const { data: paymentMethods } = usePaymentMethods();
  const createBooking = useCreateBooking();

  const [selectedDate, setSelectedDate] = useState(preselectedDate);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [playerCount, setPlayerCount] = useState(10);
  const [notes, setNotes] = useState('');
  const [agreed, setAgreed] = useState(false);

  // Get default payment method
  const defaultPaymentMethodId = useMemo(() => {
    if (!paymentMethods || paymentMethods.length === 0) return '';
    const defaultMethod = paymentMethods.find(m => m.isDefault);
    return defaultMethod?.id || paymentMethods[0].id;
  }, [paymentMethods]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/booking?pitchId=${pitchId}`);
    }
  }, [isAuthenticated, pitchId, router]);

  // Mock time slots
  const timeSlots = [
    { time: '08:00 - 09:00', available: true, price: 50 },
    { time: '09:00 - 10:00', available: true, price: 50 },
    { time: '10:00 - 11:00', available: false, price: 50 },
    { time: '11:00 - 12:00', available: true, price: 60 },
    { time: '12:00 - 13:00', available: true, price: 60 },
    { time: '14:00 - 15:00', available: true, price: 60 },
    { time: '15:00 - 16:00', available: true, price: 70 },
    { time: '16:00 - 17:00', available: true, price: 70 },
    { time: '17:00 - 18:00', available: false, price: 70 },
    { time: '18:00 - 19:00', available: true, price: 80 },
    { time: '19:00 - 20:00', available: true, price: 80 },
    { time: '20:00 - 21:00', available: true, price: 80 },
  ];

  const selectedSlot = timeSlots.find(slot => slot.time === selectedTimeSlot);
  const serviceFee = 5;
  const totalAmount = (selectedSlot?.price || 0) + serviceFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTimeSlot || !agreed) {
      alert('Please complete all required fields and agree to the terms');
      return;
    }

    if (!paymentMethods || paymentMethods.length === 0) {
      router.push('/payment-methods');
      return;
    }

    const [startTime] = selectedTimeSlot.split(' - ');

    try {
      await createBooking.mutateAsync({
        pitchId,
        date: selectedDate,
        startTime,
        endTime: selectedTimeSlot.split(' - ')[1],
        playerCount,
        notes,
      });
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!pitch) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Pitch Not Found</h2>
          <Button onClick={() => router.push('/discover')}>Back to Discovery</Button>
        </div>
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
          <h1 className="text-3xl font-bold text-white">Complete Your Booking</h1>
          <p className="text-gray-400 mt-2">Review your details and confirm your reservation</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pitch Info Card */}
            <Card className="p-6 bg-gray-900/50 border-gray-800">
              <h2 className="text-xl font-bold text-white mb-4">Selected Pitch</h2>
              <div className="flex gap-4">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden shrink-0">
                  {pitch.images && pitch.images.length > 0 ? (
                    <Image
                      src={pitch.images[0]}
                      alt={pitch.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{pitch.name}</h3>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{pitch.address}, {pitch.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-medium rounded-lg">
                      {pitch.size}
                    </span>
                    <span className="px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 text-xs font-medium rounded-lg capitalize">
                      {pitch.surface}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Date Selection */}
            <Card className="p-6 bg-gray-900/50 border-gray-800">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-500" />
                Select Date
              </h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent scheme-dark"
              />
            </Card>

            {/* Time Slot Selection */}
            {selectedDate && (
              <Card className="p-6 bg-gray-900/50 border-gray-800">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary-500" />
                  Select Time Slot
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {timeSlots.map((slot, index) => (
                    <button
                      key={index}
                      disabled={!slot.available}
                      onClick={() => setSelectedTimeSlot(slot.time)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedTimeSlot === slot.time
                          ? 'border-primary-500 bg-primary-500/10'
                          : slot.available
                          ? 'border-gray-700 bg-gray-800/50 hover:border-primary-500/50'
                          : 'border-gray-800 bg-gray-800/30 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <div className="font-semibold text-white text-sm mb-1">
                        {slot.time}
                      </div>
                      <div className="text-primary-400 font-bold">£{slot.price}</div>
                      {!slot.available && (
                        <div className="text-xs text-red-400 mt-1">Booked</div>
                      )}
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {/* Additional Details */}
            {selectedTimeSlot && (
              <Card className="p-6 bg-gray-900/50 border-gray-800">
                <h2 className="text-xl font-bold text-white mb-4">Additional Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="flex text-sm font-medium text-gray-300 mb-2 items-center gap-2">
                      <Users className="w-4 h-4" />
                      Expected Number of Players
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="22"
                      value={playerCount}
                      onChange={(e) => setPlayerCount(parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="flex text-sm font-medium text-gray-300 mb-2 items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Special Requests (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      placeholder="Any special requirements or notes..."
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <Card className="p-6 bg-gray-900/50 border-gray-800">
                <h2 className="text-xl font-bold text-white mb-6">Booking Summary</h2>

                <div className="space-y-4 mb-6">
                  {selectedDate && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary-500 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-400">Date</div>
                        <div className="text-white font-medium">
                          {new Date(selectedDate).toLocaleDateString('en-GB', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedTimeSlot && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary-500 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-400">Time</div>
                        <div className="text-white font-medium">{selectedTimeSlot}</div>
                      </div>
                    </div>
                  )}

                  {playerCount > 0 && (
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-primary-500 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-400">Players</div>
                        <div className="text-white font-medium">{playerCount}</div>
                      </div>
                    </div>
                  )}
                </div>

                {selectedTimeSlot && (
                  <>
                    <div className="border-t border-gray-800 pt-4 mb-4 space-y-2">
                      <div className="flex justify-between text-gray-400">
                        <span>Pitch rental (1 hour)</span>
                        <span>£{selectedSlot?.price}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Service fee</span>
                        <span>£{serviceFee}</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-800 pt-4 mb-6">
                      <div className="flex justify-between text-xl font-bold">
                        <span className="text-white">Total</span>
                        <span className="text-primary-400">£{totalAmount}</span>
                      </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Payment Method
                      </label>
                      {!paymentMethods || paymentMethods.length === 0 ? (
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                          <p className="text-sm text-yellow-400 mb-3">
                            Add a payment method to complete your booking
                          </p>
                          <Button
                            onClick={() => router.push('/payment-methods')}
                            variant="secondary"
                            size="sm"
                            className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border-yellow-500/20"
                          >
                            Add Payment Method
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {paymentMethods.map((method) => (
                            <div
                              key={method.id}
                              className={`p-3 rounded-xl border-2 transition-all cursor-default ${
                                method.id === defaultPaymentMethodId
                                  ? 'border-primary-500 bg-primary-500/5'
                                  : 'border-gray-700 bg-gray-800/50'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <CreditCard className="w-5 h-5 text-gray-400" />
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-white capitalize">
                                    {method.type === 'card' && method.brand
                                      ? `${method.brand} Card`
                                      : method.type.replace('_', ' ')}
                                  </div>
                                  {method.type === 'card' && (
                                    <div className="text-xs text-gray-400">
                                      •••• {method.last4}
                                    </div>
                                  )}
                                </div>
                                {method.isDefault && (
                                  <span className="px-2 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-medium rounded">
                                    Default
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={() => router.push('/payment-methods')}
                            className="w-full p-3 rounded-xl border-2 border-dashed border-gray-700 hover:border-primary-500/50 bg-gray-800/30 hover:bg-gray-800/50 transition-all text-sm text-gray-400 hover:text-primary-400"
                          >
                            + Manage Payment Methods
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="mb-6">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                          className="mt-1 w-4 h-4 rounded border-gray-700 bg-gray-800 text-primary-500 focus:ring-primary-500 focus:ring-offset-gray-900"
                        />
                        <span className="text-sm text-gray-400">
                          I agree to the{' '}
                          <a href="/terms" className="text-primary-400 hover:underline">
                            terms and conditions
                          </a>{' '}
                          and{' '}
                          <a href="/cancellation" className="text-primary-400 hover:underline">
                            cancellation policy
                          </a>
                        </span>
                      </label>
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={!agreed || createBooking.isPending || !paymentMethods || paymentMethods.length === 0}
                      className="w-full py-6 text-lg font-semibold bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {createBooking.isPending ? (
                        'Processing...'
                      ) : (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          Confirm Booking
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-gray-500 mt-4">
                      You&apos;ll be charged £{totalAmount} after your booking is completed
                    </p>
                  </>
                )}
              </Card>

              {/* Safety Badge */}
              <Card className="p-4 bg-gray-900/50 border-gray-800 mt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Secure Booking</div>
                    <div className="text-xs text-gray-400">Your payment is protected</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
