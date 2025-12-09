'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { pitchesApi, type Pitch } from '@/lib/api/pitches';
import { bookingsApi, type Booking } from '@/lib/api/bookings';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function BusinessDashboardView() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayRevenue: 0,
    todayBookings: 0,
    activePitches: 0,
    totalCustomers: 0,
    monthRevenue: 0,
    monthBookings: 0
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role === 'player') {
      router.push('/player-dashboard');
      return;
    }
    loadDashboardData();
  }, [isAuthenticated, user, router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load owner's pitches
      const myPitches = await pitchesApi.getMyPitches();
      setPitches(myPitches);

      // Load bookings for owner's pitches
      const ownerBookings = await bookingsApi.getOwnerBookings();
      setBookings(ownerBookings);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayBookings = ownerBookings.filter(b => b.date === today);
      const todayRevenue = todayBookings.reduce((sum, b) => sum + b.totalAmount, 0);

      const thisMonth = new Date().toISOString().substring(0, 7);
      const monthBookings = ownerBookings.filter(b => b.date.startsWith(thisMonth));
      const monthRevenue = monthBookings.reduce((sum, b) => sum + b.totalAmount, 0);

      const uniqueCustomers = new Set(ownerBookings.map(b => b.userId)).size;

      setStats({
        todayRevenue,
        todayBookings: todayBookings.length,
        activePitches: myPitches.filter(p => p.status === 'active').length,
        totalCustomers: uniqueCustomers,
        monthRevenue,
        monthBookings: monthBookings.length
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPitch = () => {
    router.push('/pitches/create');
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Business Dashboard</h1>
        <p className="text-muted-foreground">Manage your pitches and track your business performance</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pitches">My Pitches</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab stats={stats} pitches={pitches} bookings={bookings} onAddPitch={handleAddPitch} />
        </TabsContent>

        <TabsContent value="pitches">
          <PitchesTab pitches={pitches} onRefresh={loadDashboardData} />
        </TabsContent>

        <TabsContent value="bookings">
          <BookingsTab bookings={bookings} pitches={pitches} onRefresh={loadDashboardData} />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsTab bookings={bookings} pitches={pitches} stats={stats} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ stats, pitches, bookings, onAddPitch }: any) {
  const todayBookings = bookings.filter((b: Booking) => b.date === new Date().toISOString().split('T')[0]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Today&apos;s Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">£{stats.todayRevenue.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground mt-1">{stats.todayBookings} bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">£{stats.monthRevenue.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground mt-1">{stats.monthBookings} bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Pitches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activePitches}</div>
            <p className="text-sm text-muted-foreground mt-1">{pitches.length} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalCustomers}</div>
            <p className="text-sm text-muted-foreground mt-1">Unique users</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline" onClick={onAddPitch}>
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Pitch
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Manage Availability
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Full Analytics
            </Button>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            {todayBookings.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No bookings scheduled today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayBookings.slice(0, 5).map((booking: Booking) => (
                  <div key={booking.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium">{booking.pitchName}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.startTime} - {booking.endTime}
                      </p>
                    </div>
                    <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                      {booking.status}
                    </Badge>
                  </div>
                ))}
                {todayBookings.length > 5 && (
                  <p className="text-sm text-center text-muted-foreground pt-2">
                    +{todayBookings.length - 5} more bookings
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Pitches Tab Component
function PitchesTab({ pitches, onRefresh }: any) {
  const router = useRouter();

  const handleEditPitch = (pitchId: string) => {
    router.push(`/pitches/${pitchId}/edit`);
  };

  const handleDeletePitch = async (pitchId: string) => {
    if (!confirm('Are you sure you want to delete this pitch?')) return;
    
    try {
      await pitchesApi.deletePitch(pitchId);
      onRefresh();
    } catch (error) {
      console.error('Failed to delete pitch:', error);
      alert('Failed to delete pitch');
    }
  };

  const handleToggleStatus = async (pitchId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await pitchesApi.updatePitch(pitchId, { status: newStatus });
      onRefresh();
    } catch (error) {
      console.error('Failed to update pitch status:', error);
    }
  };

  if (pitches.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-4 text-lg font-medium">No pitches yet</h3>
            <p className="mt-2 text-muted-foreground">Get started by adding your first pitch</p>
            <Button className="mt-6" onClick={() => router.push('/pitches/create')}>
              Add Your First Pitch
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Pitches ({pitches.length})</h2>
        <Button onClick={() => router.push('/pitches/create')}>
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Pitch
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pitches.map((pitch: Pitch) => (
          <Card key={pitch.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{pitch.name}</CardTitle>
                  <CardDescription>{pitch.address}, {pitch.city}</CardDescription>
                </div>
                <Badge variant={pitch.status === 'active' ? 'default' : 'secondary'}>
                  {pitch.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Surface</p>
                    <p className="font-medium capitalize">{pitch.surface}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Size</p>
                    <p className="font-medium">{pitch.size}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Price</p>
                    <p className="font-medium">£{pitch.pricePerHour}/hr</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rating</p>
                    <p className="font-medium">⭐ {pitch.rating.toFixed(1)} ({pitch.totalReviews})</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditPitch(pitch.id)}>
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleToggleStatus(pitch.id, pitch.status)}
                  >
                    {pitch.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeletePitch(pitch.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Bookings Tab Component
function BookingsTab({ bookings, pitches, onRefresh }: any) {
  const [filter, setFilter] = useState('all');
  const [selectedPitch, setSelectedPitch] = useState('all');

  const filteredBookings = bookings.filter((booking: Booking) => {
    if (filter !== 'all' && booking.status !== filter) return false;
    if (selectedPitch !== 'all' && booking.pitchId !== selectedPitch) return false;
    return true;
  });

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingsApi.cancelBooking(bookingId);
      onRefresh();
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      alert('Failed to cancel booking');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bookings ({filteredBookings.length})</h2>
        <div className="flex gap-2">
          <Select value={selectedPitch} onValueChange={setSelectedPitch}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Pitches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pitches</SelectItem>
              {pitches.map((pitch: Pitch) => (
                <SelectItem key={pitch.id} value={pitch.id}>{pitch.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-muted-foreground">
              <p>No bookings found</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking: Booking) => (
            <Card key={booking.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{booking.pitchName}</h3>
                      <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                        {booking.status}
                      </Badge>
                      <Badge variant={booking.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                        {booking.paymentStatus}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-medium">{new Date(booking.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Time</p>
                        <p className="font-medium">{booking.startTime} - {booking.endTime}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Players</p>
                        <p className="font-medium">{booking.playerCount || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Amount</p>
                        <p className="font-medium">£{booking.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>

                    {booking.notes && (
                      <div>
                        <p className="text-sm text-muted-foreground">Notes</p>
                        <p className="text-sm">{booking.notes}</p>
                      </div>
                    )}
                  </div>

                  {booking.status === 'confirmed' && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Analytics Tab Component
function AnalyticsTab({ bookings, pitches, stats }: any) {
  // Calculate revenue by pitch
  const revenueByPitch = pitches.map((pitch: Pitch) => {
    const pitchBookings = bookings.filter((b: Booking) => b.pitchId === pitch.id && b.paymentStatus === 'paid');
    const revenue = pitchBookings.reduce((sum: number, b: Booking) => sum + b.totalAmount, 0);
    return { name: pitch.name, revenue, bookings: pitchBookings.length };
  }).sort((a, b) => b.revenue - a.revenue);

  // Calculate monthly trend
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthStr = date.toISOString().substring(0, 7);
    const monthBookings = bookings.filter((b: Booking) => b.date.startsWith(monthStr) && b.paymentStatus === 'paid');
    const revenue = monthBookings.reduce((sum: number, b: Booking) => sum + b.totalAmount, 0);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      revenue,
      bookings: monthBookings.length
    };
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Business Analytics</h2>

      {/* Revenue by Pitch */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Pitch</CardTitle>
          <CardDescription>Top performing pitches</CardDescription>
        </CardHeader>
        <CardContent>
          {revenueByPitch.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No revenue data yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {revenueByPitch.map((item: any) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.bookings} bookings</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">£{item.revenue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>6-Month Revenue Trend</CardTitle>
          <CardDescription>Revenue and bookings over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyData.map((data: any) => (
              <div key={data.month} className="flex items-center gap-4">
                <div className="w-16 text-sm font-medium">{data.month}</div>
                <div className="flex-1">
                  <div className="h-8 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary"
                      style={{ width: `${Math.min(100, (data.revenue / Math.max(...monthlyData.map((d: any) => d.revenue))) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-32 text-right">
                  <p className="font-bold">£{data.revenue.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">{data.bookings} bookings</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Booking Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              £{bookings.length > 0 ? (stats.monthRevenue / stats.monthBookings).toFixed(2) : '0.00'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Booking Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {pitches.length > 0 ? ((stats.monthBookings / (pitches.length * 30)) * 100).toFixed(1) : '0'}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">Utilization rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Cancellation Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {bookings.length > 0 ? ((bookings.filter((b: Booking) => b.status === 'cancelled').length / bookings.length) * 100).toFixed(1) : '0'}%
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
