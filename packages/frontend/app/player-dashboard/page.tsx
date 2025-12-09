'use client';

import { useAuthStore } from '@/lib/stores/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMyBookings } from '@/lib/hooks/use-bookings';
import { useCancelBooking } from '@/lib/hooks/use-bookings';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  TrendingUp, 
  Users, 
  Heart,
  Search,
  UserCircle,
  CreditCard,
  X,
  Download,
  MoreVertical
} from 'lucide-react';
import Image from 'next/image';

export default function PlayerDashboard() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const { data: bookings, isLoading } = useMyBookings();
  const cancelBooking = useCancelBooking();
  
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role === 'pitch_owner') {
      router.push('/business-dashboard');
    }
  }, [isAuthenticated, user, router]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking? You will receive a refund according to our cancellation policy.')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      await cancelBooking.mutateAsync(bookingId);
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  // Mock data for stats
  const stats = {
    upcomingBookings: bookings?.filter(b => b.status === 'confirmed' || b.status === 'pending').length || 0,
    totalBookings: bookings?.length || 0,
    favoritePitches: 3,
  };

  const upcomingBookings = bookings?.filter(b => {
    const bookingDate = new Date(b.date);
    return bookingDate >= new Date() && (b.status === 'confirmed' || b.status === 'pending');
  }) || [];

  const pastBookings = bookings?.filter(b => {
    const bookingDate = new Date(b.date);
    return bookingDate < new Date() || b.status === 'completed' || b.status === 'cancelled';
  }) || [];

  const displayedBookings = selectedTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {user?.firstName}! ⚽
              </h1>
              <p className="text-gray-400">
                Manage your bookings and discover new pitches
              </p>
            </div>
            <Button
              onClick={() => router.push('/discover')}
              className="bg-primary-600 hover:bg-primary-700"
            >
              <Search className="w-4 h-4 mr-2" />
              Find Pitches
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 bg-gray-900/50 border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Upcoming Bookings</p>
                  <p className="text-3xl font-bold text-white">{stats.upcomingBookings}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary-400" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gray-900/50 border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Bookings</p>
                  <p className="text-3xl font-bold text-white">{stats.totalBookings}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gray-900/50 border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Favorite Pitches</p>
                  <p className="text-3xl font-bold text-white">{stats.favoritePitches}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-400" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-6 bg-gray-900/50 border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/discover')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-primary-500/50 transition-all text-left"
                >
                  <Search className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-white">Find Pitches</span>
                </button>
                <button
                  onClick={() => router.push('/matches')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-primary-500/50 transition-all text-left"
                >
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-white">Find Players</span>
                </button>
                <button
                  onClick={() => router.push('/profile')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-primary-500/50 transition-all text-left"
                >
                  <UserCircle className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-white">My Profile</span>
                </button>
                <button
                  onClick={() => router.push('/payment-methods')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-primary-500/50 transition-all text-left"
                >
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-white">Payment Methods</span>
                </button>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setSelectedTab('upcoming')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedTab === 'upcoming'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                Upcoming ({upcomingBookings.length})
              </button>
              <button
                onClick={() => setSelectedTab('past')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedTab === 'past'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                Past ({pastBookings.length})
              </button>
            </div>

            {/* Bookings List */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="text-white">Loading bookings...</div>
              </div>
            ) : displayedBookings.length === 0 ? (
              <Card className="p-12 bg-gray-900/50 border-gray-800 text-center">
                <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  No {selectedTab} bookings
                </h3>
                <p className="text-gray-400 mb-6">
                  {selectedTab === 'upcoming'
                    ? 'Book a pitch to start playing!'
                    : 'Your past bookings will appear here'}
                </p>
                {selectedTab === 'upcoming' && (
                  <Button
                    onClick={() => router.push('/discover')}
                    className="bg-primary-600 hover:bg-primary-700"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Find Pitches
                  </Button>
                )}
              </Card>
            ) : (
              <div className="space-y-4">
                {displayedBookings.map((booking) => (
                  <Card key={booking.id} className="p-6 bg-gray-900/50 border-gray-800">
                    <div className="flex gap-6">
                      {/* Pitch Image */}
                      {booking.pitch?.images && booking.pitch.images.length > 0 ? (
                        <div className="relative w-32 h-32 rounded-xl overflow-hidden shrink-0">
                          <Image
                            src={booking.pitch.images[0]}
                            alt={booking.pitchName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-32 h-32 rounded-xl bg-gray-800 flex items-center justify-center shrink-0">
                          <MapPin className="w-8 h-8 text-gray-600" />
                        </div>
                      )}

                      {/* Booking Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">
                              {booking.pitchName}
                            </h3>
                            {booking.pitch && (
                              <p className="text-sm text-gray-400">
                                {booking.pitch.address}, {booking.pitch.city}
                              </p>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-lg text-xs font-medium capitalize ${
                            booking.status === 'confirmed'
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                              : booking.status === 'pending'
                              ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                              : booking.status === 'cancelled'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                          }`}>
                            {booking.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              {new Date(booking.date).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">
                              {booking.startTime} - {booking.endTime}
                            </span>
                          </div>
                          {booking.playerCount && (
                            <div className="flex items-center gap-2 text-gray-400">
                              <Users className="w-4 h-4" />
                              <span className="text-sm">{booking.playerCount} players</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-primary-400">
                            <CreditCard className="w-4 h-4" />
                            <span className="text-sm font-semibold">
                              £{booking.totalAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          {selectedTab === 'upcoming' && booking.status === 'confirmed' && (
                            <>
                              <Button
                                onClick={() => router.push(`/pitches/${booking.pitchId}`)}
                                variant="secondary"
                                size="sm"
                                className="bg-gray-800 hover:bg-gray-700"
                              >
                                View Pitch
                              </Button>
                              <Button
                                onClick={() => handleCancelBooking(booking.id)}
                                variant="secondary"
                                size="sm"
                                disabled={cancellingId === booking.id}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20"
                              >
                                <X className="w-4 h-4 mr-1" />
                                {cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}
                              </Button>
                            </>
                          )}
                          {selectedTab === 'past' && booking.paymentStatus === 'paid' && (
                            <Button
                              onClick={() => router.push(`/booking/confirmation/${booking.id}`)}
                              variant="secondary"
                              size="sm"
                              className="bg-gray-800 hover:bg-gray-700"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              View Receipt
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
