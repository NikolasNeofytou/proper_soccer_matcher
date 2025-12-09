'use client';

import { useParams, useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, Users, Check, Download, Share2, ArrowLeft } from 'lucide-react';
import { useBooking } from '@/lib/hooks/use-bookings';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { useEffect } from 'react';

export default function BookingConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const { data: booking, isLoading } = useBooking(bookingId);

  useEffect(() => {
    // Confetti or success animation could be triggered here
    console.log('Booking confirmed!', bookingId);
  }, [bookingId]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Pitch Booking',
        text: `I've booked a pitch at ${booking?.pitch?.name || 'a venue'}!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    alert('Download functionality will be implemented with PDF generation');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Loading booking details...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Booking Not Found</h2>
          <Button onClick={() => router.push('/player-dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Success Header */}
      <div className="bg-linear-to-r from-green-500/10 via-primary-500/10 to-green-500/10 border-b border-green-500/20">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Booking Confirmed!</h1>
          <p className="text-xl text-gray-300 mb-2">
            Your pitch has been successfully reserved
          </p>
          <p className="text-gray-400">
            Booking Reference: <span className="font-mono text-primary-400">#{booking.id.slice(0, 8).toUpperCase()}</span>
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={() => router.push('/player-dashboard')}
              variant="secondary"
              className="bg-gray-800 hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              View All Bookings
            </Button>
            <Button
              onClick={handleDownload}
              variant="secondary"
              className="bg-gray-800 hover:bg-gray-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
            <Button
              onClick={handleShare}
              variant="secondary"
              className="bg-gray-800 hover:bg-gray-700"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Booking Details Card */}
          <Card className="p-8 bg-gray-900/50 border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6">Booking Details</h2>

            {/* Pitch Info */}
            {booking.pitch && (
              <div className="flex gap-6 mb-8 pb-8 border-b border-gray-800">
                <div className="relative w-32 h-32 rounded-xl overflow-hidden shrink-0">
                  {booking.pitch.images && booking.pitch.images.length > 0 ? (
                    <Image
                      src={booking.pitch.images[0]}
                      alt={booking.pitch.name}
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
                  <h3 className="text-2xl font-bold text-white mb-2">{booking.pitch.name}</h3>
                  <div className="flex items-center gap-2 text-gray-400 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{booking.pitch.address}, {booking.pitch.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium rounded-lg">
                      {booking.pitch.size}
                    </span>
                    <span className="px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 text-sm font-medium rounded-lg capitalize">
                      {booking.pitch.surface}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Date & Time Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Date</div>
                  <div className="text-lg font-semibold text-white">
                    {new Date(booking.date).toLocaleDateString('en-GB', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Time</div>
                  <div className="text-lg font-semibold text-white">
                    {booking.startTime} - {booking.endTime}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Players</div>
                  <div className="text-lg font-semibold text-white">{booking.playerCount}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Status</div>
                  <div className="inline-flex px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium rounded-lg capitalize">
                    {booking.status}
                  </div>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {booking.notes && (
              <div className="mb-8 p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
                <div className="text-sm text-gray-400 mb-1">Special Requests</div>
                <div className="text-white">{booking.notes}</div>
              </div>
            )}

            {/* Payment Summary */}
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Payment Summary</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-400">
                  <span>Pitch rental (1 hour)</span>
                  <span>£{(booking.totalAmount - 5).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Service fee</span>
                  <span>£5.00</span>
                </div>
              </div>
              <div className="border-t border-gray-700 pt-4 flex justify-between">
                <span className="text-lg font-bold text-white">Total Paid</span>
                <span className="text-2xl font-bold text-primary-400">
                  £{booking.totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Payment Status</span>
                  <span className={`font-semibold capitalize ${
                    booking.paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {booking.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Important Information */}
          <Card className="p-6 bg-blue-500/5 border-blue-500/20">
            <h3 className="text-lg font-bold text-white mb-3">Important Information</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Please arrive 10 minutes before your booking time</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Bring appropriate footwear for the surface type</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Cancellations are free up to 24 hours before the booking</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span>You will receive a confirmation email shortly</span>
              </li>
            </ul>
          </Card>

          {/* Next Steps */}
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-white">What&apos;s Next?</h3>
            <p className="text-gray-400">
              Ready to find players for your match?
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => router.push('/discover')}
                variant="secondary"
                className="bg-gray-800 hover:bg-gray-700"
              >
                Book Another Pitch
              </Button>
              <Button
                onClick={() => router.push('/matches')}
                className="bg-primary-600 hover:bg-primary-700"
              >
                Find Players
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
