'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Loader2,
  MapPin,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { RegionKey } from '@/lib/cityPresets';
import { CountryData } from '@/lib/cosmos-countries';
import { CityData } from '@/lib/cosmos-cities';
import { apiUrl } from '@/lib/api';

interface CountryFormClientProps {
  mode: 'new' | 'edit';
}

export default function CountryFormClient({ mode }: CountryFormClientProps) {
  const router = useRouter();
  const params = useParams();
  const countryId = mode === 'edit' ? (params?.id as string) : null;

  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<CityData[]>([]);

  // Form state
  const [formData, setFormData] = useState<Partial<CountryData>>({
    name: '',
    flag: '',
    region: 'southeast-asia' as RegionKey,
    enabled: true,
    description: '',
    visaInfo: '',
    currency: '',
  });

  // Load country data for edit mode
  useEffect(() => {
    if (mode === 'edit' && countryId) {
      loadCountry();
    }
    loadCities();
  }, [mode, countryId]);

  async function loadCountry() {
    try {
      setLoading(true);
      const response = await fetch(apiUrl(`countries/${countryId}`));
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Country not found');
        } else {
          throw new Error('Failed to load country');
        }
        return;
      }

      const data = await response.json();
      setFormData(data.country);
    } catch (err: any) {
      console.error('Error loading country:', err);
      setError(err.message || 'Failed to load country');
    } finally {
      setLoading(false);
    }
  }

  async function loadCities() {
    try {
      const response = await fetch(apiUrl('cities'));
      if (response.ok) {
        const data = await response.json();
        setCities(data.cities || []);
      }
    } catch (err) {
      console.error('Error loading cities:', err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);

      const url = mode === 'edit' 
        ? apiUrl(`countries/${countryId}`)
        : apiUrl('countries');
      
      const method = mode === 'edit' ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save country');
      }

      router.push('/hub/destinations/countries/');
    } catch (err: any) {
      console.error('Error saving country:', err);
      setError(err.message || 'Failed to save country');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this country? This action cannot be undone.')) {
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(apiUrl(`countries/${countryId}`), {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete country');
      }

      router.push('/hub/destinations/countries/');
    } catch (err: any) {
      console.error('Error deleting country:', err);
      setError(err.message || 'Failed to delete country');
      setSaving(false);
    }
  }

  // Get cities and detours for this country
  const countryCities = cities.filter(c => c.country === formData.name);
  const mainCities = countryCities.filter(c => !c.isDetour);
  const detours = countryCities.filter(c => c.isDetour);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-sb-orange-500" />
      </div>
    );
  }

  if (error && mode === 'edit' && !formData.name) {
    return (
      <div className="space-y-4">
        <Link
          href="/hub/destinations/countries/"
          className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Countries
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-lg font-medium text-red-900 mb-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/hub/destinations/countries/"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Countries
          </Link>
          <h1 className="text-3xl font-bold text-stone-900">
            {mode === 'edit' ? `Edit ${formData.name}` : 'Add New Country'}
          </h1>
        </div>
        {mode === 'edit' && (
          <button
            onClick={handleDelete}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-stone-900">Basic Information</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Country Name *</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Flag Emoji</label>
              <input
                type="text"
                value={formData.flag || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, flag: e.target.value }))}
                placeholder="🇹🇭"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent text-2xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Region *</label>
              <select
                required
                value={formData.region || 'southeast-asia'}
                onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value as RegionKey }))}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
              >
                <option value="southeast-asia">Southeast Asia</option>
                <option value="europe">Europe</option>
                <option value="latin-america">Latin America</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Currency</label>
              <input
                type="text"
                value={formData.currency || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                placeholder="USD, EUR, THB..."
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="enabled"
                checked={formData.enabled ?? true}
                onChange={(e) => setFormData(prev => ({ ...prev, enabled: e.target.checked }))}
                className="w-4 h-4 text-sb-orange-500 rounded"
              />
              <label htmlFor="enabled" className="text-sm font-medium text-stone-700">Enabled</label>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-stone-900">Description</h2>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter a description of the country..."
            rows={6}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
          />
          <p className="text-xs text-stone-500">
            Provide a compelling description of the country that will help travelers understand what makes it special.
          </p>
        </div>

        {/* Visa Info */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-stone-900">Visa Information</h2>
          <textarea
            value={formData.visaInfo || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, visaInfo: e.target.value }))}
            placeholder="Enter visa requirements and information..."
            rows={4}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
          />
        </div>

        {/* Cities & Detours */}
        {mode === 'edit' && formData.name && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
            <h2 className="text-lg font-bold text-stone-900">Cities & Detours</h2>
            
            {/* Main Cities */}
            <div>
              <h3 className="text-sm font-bold text-stone-700 mb-2">Main Cities ({mainCities.length})</h3>
              {mainCities.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-2">
                  {mainCities.map((city) => (
                    <Link
                      key={city.id}
                      href={`/hub/destinations/cities/${city.id}`}
                      className="flex items-center justify-between p-3 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{city.flag}</span>
                        <span className="font-medium text-stone-700">{city.city}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-sb-orange-600 transition-colors" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-500">No cities added yet</p>
              )}
            </div>

            {/* Detours */}
            <div>
              <h3 className="text-sm font-bold text-stone-700 mb-2">Detours ({detours.length})</h3>
              {detours.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-2">
                  {detours.map((city) => (
                    <Link
                      key={city.id}
                      href={`/hub/destinations/cities/${city.id}`}
                      className="flex items-center justify-between p-3 bg-sb-teal-50 rounded-lg hover:bg-sb-teal-100 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{city.flag}</span>
                        <span className="font-medium text-stone-700">{city.city}</span>
                        {city.nearbyCity && (
                          <span className="text-xs text-stone-500">(near {city.nearbyCity})</span>
                        )}
                      </div>
                      <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-sb-teal-600 transition-colors" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-500">No detours added yet</p>
              )}
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-sb-orange-500 text-white rounded-lg font-medium hover:bg-sb-orange-600 transition disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Saving...' : 'Save Country'}
          </button>
          <Link
            href="/hub/destinations/countries/"
            className="px-6 py-3 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
