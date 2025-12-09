'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { pitchesApi, type Pitch } from '@/lib/api/pitches';
import { useAuthStore } from '@/lib/stores/auth.store';

export default function EditPitchPage() {
  const router = useRouter();
  const params = useParams();
  const pitchId = params.id as string;
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [pitch, setPitch] = useState<Pitch | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    postcode: '',
    surface: 'artificial',
    size: '5-a-side',
    pricePerHour: '',
    facilities: [] as string[],
    status: 'active',
  });

  useEffect(() => {
    loadPitch();
  }, [pitchId]);

  const loadPitch = async () => {
    try {
      setLoading(true);
      const data = await pitchesApi.getPitchById(pitchId);
      setPitch(data);
      setFormData({
        name: data.name,
        description: data.description,
        address: data.address,
        city: data.city,
        postcode: data.postcode || '',
        surface: data.surface,
        size: data.size,
        pricePerHour: data.pricePerHour.toString(),
        facilities: data.facilities || [],
        status: data.status || 'active',
      });
    } catch (err) {
      setError('Failed to load pitch');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const updateData = {
        ...formData,
        pricePerHour: parseFloat(formData.pricePerHour),
      };

      await pitchesApi.updatePitch(pitchId, updateData);
      router.push('/business-dashboard?tab=pitches');
    } catch (err) {
      setError('Failed to update pitch');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleFacility = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const facilityOptions = [
    'parking', 'showers', 'changing_rooms', 'wifi', 
    'refreshments', 'equipment_rental', 'lockers', 'first_aid'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!pitch || pitch.ownerId !== user?.id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">You can only edit your own pitches.</p>
              <Button className="mt-4" onClick={() => router.push('/business-dashboard')}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          ← Back
        </Button>
        <h1 className="text-4xl font-bold mb-2">Edit Pitch</h1>
        <p className="text-muted-foreground">Update your pitch details</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Essential details about your pitch</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Pitch Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="surface">Surface Type *</Label>
                <Select value={formData.surface} onValueChange={(value) => handleChange('surface', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grass">Natural Grass</SelectItem>
                    <SelectItem value="artificial">Artificial Turf</SelectItem>
                    <SelectItem value="indoor">Indoor</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Pitch Size *</Label>
                <Select value={formData.size} onValueChange={(value) => handleChange('size', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5-a-side">5-a-side</SelectItem>
                    <SelectItem value="7-a-side">7-a-side</SelectItem>
                    <SelectItem value="11-a-side">11-a-side (Full Size)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricePerHour">Price Per Hour (£) *</Label>
              <Input
                id="pricePerHour"
                type="number"
                step="0.01"
                min="0"
                value={formData.pricePerHour}
                onChange={(e) => handleChange('pricePerHour', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active (Accepting Bookings)</SelectItem>
                  <SelectItem value="inactive">Inactive (Not Accepting Bookings)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Location</CardTitle>
            <CardDescription>Where is your pitch located?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postcode">Postcode *</Label>
                <Input
                  id="postcode"
                  value={formData.postcode}
                  onChange={(e) => handleChange('postcode', e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Facilities</CardTitle>
            <CardDescription>What amenities does your pitch offer?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {facilityOptions.map((facility) => (
                <label key={facility} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.facilities.includes(facility)}
                    onChange={() => toggleFacility(facility)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm capitalize">{facility.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={saving} className="flex-1">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
