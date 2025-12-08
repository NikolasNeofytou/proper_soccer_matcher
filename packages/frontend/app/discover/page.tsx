'use client';

import { useState } from 'react';
import { Search, MapPin, Sliders, Heart, Star, Navigation, Sparkles, Calendar, Clock } from 'lucide-react';
import { usePitches } from '@/lib/hooks/use-pitches';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import type { PitchFilters } from '@/lib/api/pitches';
import { mockPitches } from '@/lib/mock-data';
import Image from 'next/image';

export default function DiscoverPage() {
  const [filters, setFilters] = useState<PitchFilters>({
    page: 1,
    limit: 12,
    sortBy: 'rating',
    sortOrder: 'desc',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  // Filter mock data based on search and filters
  const filteredPitches = mockPitches.filter((pitch) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        pitch.name.toLowerCase().includes(searchLower) ||
        pitch.city.toLowerCase().includes(searchLower) ||
        pitch.address.toLowerCase().includes(searchLower) ||
        pitch.facilities.some(f => f.toLowerCase().includes(searchLower)) ||
        pitch.description.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Surface filter
    if (filters.surface && pitch.surface !== filters.surface) {
      return false;
    }

    // Size filter
    if (filters.size && pitch.size !== filters.size) {
      return false;
    }

    // Price filter
    if (filters.maxPrice && pitch.pricePerHour > filters.maxPrice) {
      return false;
    }

    // Min rating filter
    if (filters.minRating && pitch.rating < filters.minRating) {
      return false;
    }

    return true;
  });

  // Sort filtered pitches
  const sortedPitches = [...filteredPitches].sort((a, b) => {
    if (filters.sortBy === 'price') {
      return filters.sortOrder === 'asc' 
        ? a.pricePerHour - b.pricePerHour 
        : b.pricePerHour - a.pricePerHour;
    } else if (filters.sortBy === 'rating') {
      return filters.sortOrder === 'asc'
        ? a.rating - b.rating
        : b.rating - a.rating;
    }
    return 0; // distance sorting would require location
  });

  const pitches = sortedPitches;
  const isLoading = false;

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleFilterChange = (key: keyof PitchFilters, value: string | number | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      sortBy: 'rating',
      sortOrder: 'desc',
    });
  };

  // Count active filters
  const activeFiltersCount = [
    filters.search,
    filters.surface,
    filters.size,
    filters.maxPrice,
  ].filter(Boolean).length;

  const surfaces = ['grass', 'artificial', 'indoor', 'hybrid'];
  const sizes = ['5-a-side', '7-a-side', '11-a-side'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Hero Search Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900/20 via-gray-900 to-secondary-900/20 border-b border-gray-800">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 -top-48 -left-48 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-secondary-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container relative mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium text-primary-400">Find Your Perfect Pitch</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Discover Amazing
              <br />
              Football Pitches
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Book premium pitches across the UK. From 5-a-side to full stadiums.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-4 border border-gray-800">
              {/* Main Search Row */}
              <div className="flex flex-col md:flex-row gap-3 mb-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    placeholder="Search by name, location, or facilities..."
                    className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    value={filters.search || ''}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 bg-gray-800/50 border-gray-700 hover:bg-gray-700 hover:border-primary-500 transition-all relative"
                  >
                    <Sliders className="w-4 h-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 bg-gray-800/50 border-gray-700 hover:bg-gray-700 hover:border-primary-500 transition-all"
                  >
                    <Navigation className="w-4 h-4" />
                    Near Me
                  </Button>
                </div>
              </div>

              {/* Date and Time Slot Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all [color-scheme:dark]"
                  />
                </div>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <select
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Any time slot</option>
                    <option value="morning">Morning (6AM - 12PM)</option>
                    <option value="afternoon">Afternoon (12PM - 6PM)</option>
                    <option value="evening">Evening (6PM - 10PM)</option>
                    <option value="late">Late Night (10PM - 12AM)</option>
                  </select>
                </div>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Surface Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Surface Type
                      </label>
                      <select
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        value={filters.surface || ''}
                        onChange={(e) =>
                          handleFilterChange('surface', e.target.value || undefined)
                        }
                      >
                        <option value="">All Surfaces</option>
                        {surfaces.map((surface) => (
                          <option key={surface} value={surface}>
                            {surface.charAt(0).toUpperCase() + surface.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Pitch Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Pitch Size
                      </label>
                      <select
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        value={filters.size || ''}
                        onChange={(e) =>
                          handleFilterChange('size', e.target.value || undefined)
                        }
                      >
                        <option value="">All Sizes</option>
                        {sizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Max Price (per hour)
                      </label>
                      <input
                        type="number"
                        placeholder="Any price"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        value={filters.maxPrice || ''}
                        onChange={(e) =>
                          handleFilterChange(
                            'maxPrice',
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <Button 
                      variant="ghost" 
                      onClick={handleClearFilters}
                      className="hover:bg-gray-800"
                    >
                      Clear All
                    </Button>
                    <Button 
                      onClick={() => setShowFilters(false)}
                      className="bg-primary-600 hover:bg-primary-700"
                    >
                      Show {filteredPitches.length} Result{filteredPitches.length !== 1 ? 's' : ''}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Results Summary */}
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Found <span className="text-primary-400 font-semibold">{pitches.length}</span> premium pitch{pitches.length !== 1 ? 'es' : ''}
                {filters.search && ` matching "${filters.search}"`}
                {filters.surface && ` · ${filters.surface} surface`}
                {filters.size && ` · ${filters.size}`}
                {filters.maxPrice && ` · under £${filters.maxPrice}/hr`}
              </p>
              {(selectedDate || selectedTimeSlot) && (
                <p className="text-sm text-gray-500 mt-2">
                  {selectedDate && (
                    <span>
                      📅 {new Date(selectedDate).toLocaleDateString('en-GB', { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  )}
                  {selectedDate && selectedTimeSlot && ' · '}
                  {selectedTimeSlot && (
                    <span className="capitalize">
                      🕐 {selectedTimeSlot === 'morning' ? 'Morning (6AM-12PM)' : 
                          selectedTimeSlot === 'afternoon' ? 'Afternoon (12PM-6PM)' : 
                          selectedTimeSlot === 'evening' ? 'Evening (6PM-10PM)' : 
                          'Late Night (10PM-12AM)'}
                    </span>
                  )}
                </p>
              )}
              
              {/* Active Filters */}
              {(filters.search || filters.surface || filters.size || filters.maxPrice || selectedDate || selectedTimeSlot) && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                  <span className="text-sm text-gray-500">Active filters:</span>
                  {filters.search && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-500/20 border border-primary-500/30 text-primary-400 text-sm rounded-full">
                      Search: &quot;{filters.search}&quot;
                      <button
                        onClick={() => handleFilterChange('search', undefined)}
                        className="hover:text-primary-300"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {selectedDate && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-500/20 border border-secondary-500/30 text-secondary-400 text-sm rounded-full">
                      📅 {new Date(selectedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      <button
                        onClick={() => setSelectedDate('')}
                        className="hover:text-secondary-300"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {selectedTimeSlot && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-500/20 border border-secondary-500/30 text-secondary-400 text-sm rounded-full capitalize">
                      🕐 {selectedTimeSlot}
                      <button
                        onClick={() => setSelectedTimeSlot('')}
                        className="hover:text-secondary-300"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.surface && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-full capitalize">
                      {filters.surface}
                      <button
                        onClick={() => handleFilterChange('surface', undefined)}
                        className="hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.size && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-full">
                      {filters.size}
                      <button
                        onClick={() => handleFilterChange('size', undefined)}
                        className="hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.maxPrice && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-full">
                      Under £{filters.maxPrice}/hr
                      <button
                        onClick={() => handleFilterChange('maxPrice', undefined)}
                        className="hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      handleClearFilters();
                      setSelectedDate('');
                      setSelectedTimeSlot('');
                    }}
                    className="text-sm text-gray-500 hover:text-primary-400 underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="container mx-auto px-4 py-16">
        {/* Sort Options */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">
            Available Pitches
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Sort by:</span>
            <select
              className="px-4 py-2 bg-gray-800/80 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                setFilters((prev) => ({
                  ...prev,
                  sortBy: sortBy as 'price' | 'rating' | 'distance',
                  sortOrder: sortOrder as 'asc' | 'desc',
                }));
              }}
            >
              <option value="rating-desc">Highest Rated</option>
              <option value="price-asc">Lowest Price</option>
              <option value="price-desc">Highest Price</option>
              <option value="distance-asc">Nearest First</option>
            </select>
          </div>
        </div>

        {/* Pitch Cards */}
        {pitches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pitches.map((pitch) => (
              <Card
                key={pitch.id}
                className="group overflow-hidden hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-300 cursor-pointer bg-gray-900/50 backdrop-blur border-gray-800 hover:border-primary-500/50 hover:-translate-y-1"
                onClick={() => window.location.href = `/pitches/${pitch.id}`}
              >
                {/* Pitch Image */}
                <div className="relative h-56 bg-gray-800 overflow-hidden">
                  {pitch.images && pitch.images.length > 0 ? (
                    <Image
                      src={pitch.images[0]}
                      alt={pitch.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                      <MapPin className="w-16 h-16 text-gray-700" />
                    </div>
                  )}
                  <button className="absolute top-3 right-3 p-2.5 bg-gray-900/80 backdrop-blur rounded-full shadow-lg hover:bg-gray-800 transition-colors z-10">
                    <Heart className="w-5 h-5 text-gray-300 hover:text-red-500 transition-colors" />
                  </button>
                  {!pitch.isAvailable && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="px-5 py-2.5 bg-red-500/90 text-white font-semibold rounded-xl shadow-lg">
                        Unavailable
                      </span>
                    </div>
                  )}
                  {/* Rating Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-gray-900/80 backdrop-blur px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-white text-sm">{pitch.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Pitch Info */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-primary-400 transition-colors">
                    {pitch.name}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">{pitch.address}, {pitch.city}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1.5 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-medium rounded-lg">
                      {pitch.size}
                    </span>
                    <span className="px-3 py-1.5 bg-gray-800 border border-gray-700 text-gray-300 text-xs font-medium rounded-lg capitalize">
                      {pitch.surface}
                    </span>
                  </div>

                  {pitch.facilities && pitch.facilities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {pitch.facilities.slice(0, 3).map((facility, index) => (
                        <span
                          key={index}
                          className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-md"
                        >
                          {facility}
                        </span>
                      ))}
                      {pitch.facilities.length > 3 && (
                        <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-md">
                          +{pitch.facilities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <div>
                      <span className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                        £{pitch.pricePerHour}
                      </span>
                      <span className="text-gray-500 text-sm ml-1">/hour</span>
                    </div>
                    <Button 
                      size="sm"
                      className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/pitches/${pitch.id}`;
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {pitches.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-6">
              <MapPin className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">
              No pitches found
            </h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your filters or search terms
            </p>
            <Button onClick={handleClearFilters}>Clear Filters</Button>
          </div>
        )}
      </section>
    </div>
  );
}
