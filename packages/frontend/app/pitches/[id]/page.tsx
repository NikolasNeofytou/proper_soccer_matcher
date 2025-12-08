'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  MapPin,
  Star,
  Heart,
  Share2,
  Calendar,
  Clock,
  Users,
  Wifi,
  Car,
  ShowerHead,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';
import { usePitch, useAddToFavorites, useRemoveFromFavorites } from '@/lib/hooks/use-pitches';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/lib/stores/auth.store';

const facilityIcons: Record<string, any> = {
  parking: Car,
  wifi: Wifi,
  showers: ShowerHead,
  changing_rooms: Users,
  equipment: Trophy,
};

export default function PitchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pitchId = params.id as string;
  const { isAuthenticated } = useAuthStore();
  
  const { data: pitch, isLoading } = usePitch(pitchId);
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  const handlePreviousImage = () => {
    if (pitch?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? pitch.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (pitch?.images) {
      setCurrentImageIndex((prev) =>
        prev === pitch.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      if (isFavorite) {
        await removeFromFavorites.mutateAsync(pitchId);
      } else {
        await addToFavorites.mutateAsync(pitchId);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: pitch?.name,
          text: `Check out ${pitch?.name} on Proper Soccer Matcher`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (selectedDate && selectedTimeSlot) {
      router.push(`/booking?pitchId=${pitchId}&date=${selectedDate}&time=${selectedTimeSlot}`);
    } else {
      alert('Please select a date and time slot');
    }
  };

  // Mock time slots - will be replaced with API data
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 animate-pulse">
        <div className="h-96 bg-gray-200" />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-gray-200 h-8 w-2/3 mb-4 rounded" />
          <div className="bg-gray-200 h-4 w-1/3 rounded" />
        </div>
      </div>
    );
  }

  if (!pitch) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pitch Not Found</h2>
          <p className="text-gray-600 mb-4">The pitch you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/discover')}>Back to Discovery</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <section className="relative bg-black">
        <div className="relative h-[500px] overflow-hidden">
          {pitch.images && pitch.images.length > 0 ? (
            <>
              <img
                src={pitch.images[currentImageIndex]}
                alt={`${pitch.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              {pitch.images.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-900" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-900" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {pitch.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? 'bg-white w-8'
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-700">
              <MapPin className="w-32 h-32 text-white/20" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleShare}
              className="p-3 bg-white rounded-full hover:bg-gray-50 transition-colors shadow-lg"
            >
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={handleToggleFavorite}
              className="p-3 bg-white rounded-full hover:bg-gray-50 transition-colors shadow-lg"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {pitch.name}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span>{pitch.address}, {pitch.city}, {pitch.country}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {pitch.rating.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {pitch.totalReviews} reviews
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-4 py-2 bg-primary-100 text-primary-700 font-medium rounded-lg">
                  {pitch.size}
                </span>
                <span className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg capitalize">
                  {pitch.surface} Surface
                </span>
                <span className="px-4 py-2 bg-green-100 text-green-700 font-medium rounded-lg">
                  {pitch.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>

            {/* Description */}
            <Card className="p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Pitch
              </h2>
              <p className="text-gray-700 leading-relaxed">{pitch.description}</p>
            </Card>

            {/* Facilities */}
            {pitch.facilities && pitch.facilities.length > 0 && (
              <Card className="p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Facilities & Amenities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {pitch.facilities.map((facility, index) => {
                    const Icon = facilityIcons[facility.toLowerCase().replace(/\s+/g, '_')] || Check;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <Icon className="w-5 h-5 text-primary-600" />
                        <span className="text-gray-700 font-medium capitalize">
                          {facility}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Owner Info */}
            <Card className="p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Hosted By
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-600">
                    {pitch.ownerName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {pitch.ownerName}
                  </h3>
                  <p className="text-gray-600">Member since 2024</p>
                </div>
              </div>
            </Card>

            {/* Reviews Section (Placeholder) */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Reviews
              </h2>
              <div className="text-center py-8 text-gray-500">
                <Star className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No reviews yet. Be the first to review this pitch!</p>
              </div>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <Card className="p-6">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-primary-600">
                      ${pitch.pricePerHour}
                    </span>
                    <span className="text-gray-600">/hour</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Prices may vary by time slot
                  </p>
                </div>

                {/* Date Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Available Time Slots
                    </label>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {timeSlots.map((slot, index) => (
                        <button
                          key={index}
                          disabled={!slot.available}
                          onClick={() => setSelectedTimeSlot(slot.time)}
                          className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                            selectedTimeSlot === slot.time
                              ? 'border-primary-600 bg-primary-50'
                              : slot.available
                              ? 'border-gray-200 hover:border-primary-300'
                              : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">
                              {slot.time}
                            </span>
                            <span className="text-primary-600 font-bold">
                              ${slot.price}
                            </span>
                          </div>
                          {!slot.available && (
                            <span className="text-xs text-red-500">Booked</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleBookNow}
                  className="w-full"
                  size="lg"
                  disabled={!selectedDate || !selectedTimeSlot}
                >
                  Book Now
                </Button>

                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Price per hour</span>
                    <span className="font-medium text-gray-900">
                      ${pitch.pricePerHour}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span className="font-medium text-gray-900">$5</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 text-base font-bold text-gray-900">
                    <span>Total</span>
                    <span>${pitch.pricePerHour + 5}</span>
                  </div>
                </div>

                <p className="mt-4 text-xs text-gray-500 text-center">
                  You won't be charged yet
                </p>
              </Card>

              {/* Quick Info */}
              <Card className="p-6 mt-4">
                <h3 className="font-bold text-gray-900 mb-3">Quick Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Users className="w-5 h-5 text-primary-600" />
                    <span>Capacity: {pitch.size}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    <span>{pitch.city}, {pitch.country}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock className="w-5 h-5 text-primary-600" />
                    <span>Open 7 days a week</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
