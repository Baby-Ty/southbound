'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Loader2,
  MapPin,
  Plus,
  X,
  Trash2,
} from 'lucide-react';
import { RegionKey } from '@/lib/cityPresets';
import { CityData } from '@/lib/cosmos-cities';
import { CountryData } from '@/lib/cosmos-countries';
import { apiUrl } from '@/lib/api';
import ActivityManager from '@/components/hub/ActivityManager';
import AccommodationTypesManager from '@/components/hub/AccommodationTypesManager';
import ExperienceGalleryManager from '@/components/hub/ExperienceGalleryManager';
import CityImageManager from '@/components/hub/CityImageManager';

// Default activities and accommodation types
const DEFAULT_ACTIVITIES = [
  'Beach & Water Sports',
  'Hiking & Nature',
  'City Tours',
  'Food Tours',
  'Nightlife',
  'Cultural Sites',
  'Yoga & Wellness',
  'Surfing',
  'Diving & Snorkeling',
  'Shopping',
  'Photography',
  'Cooking Classes',
  'Language Classes',
  'Volunteer Work',
  'Digital Nomad Meetups',
];

const DEFAULT_ACCOMMODATION = [
  'Hostel',
  'Budget Hotel',
  'Mid-range Hotel',
  'Boutique Hotel',
  'Airbnb Apartment',
  'Coliving Space',
  'Villa',
  'Guesthouse',
];

// Used on region cards as quick "what to expect" icons
const DEFAULT_WORK_VIBE = [
  'Fast internet',
  'Quiet workspaces',
  'Great coworking',
  'Cafe-friendly',
  'Lots of nomads',
  'Easy calls (time overlap)',
  'Backup power common',
];

interface CityFormClientProps {
  mode: 'new' | 'edit';
}

export default function CityFormClient({ mode }: CityFormClientProps) {
  const router = useRouter();
  const params = useParams();
  const cityId = mode === 'edit' ? (params?.id as string) : null;

  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<CityData>>({
    city: '',
    country: '',
    flag: '',
    region: 'southeast-asia' as RegionKey,
    enabled: true,
    budgetCoins: 2 as 1 | 2 | 3,
    tags: [],
    imageUrls: [],
    availableActivities: [],
    availableAccommodation: [],
    highlights: {
      places: [],
      accommodation: '',
      activities: [],
      notesHint: '',
    },
    weather: {
      avgTemp: '',
      bestMonths: '',
      climate: 'tropical' as const,
    },
    costs: {
      accommodation: '',
      coworking: '',
      meals: '',
      monthlyTotal: '',
    },
    nomadScore: 7,
    internetSpeed: '',
    description: '',
    adminNotes: '',
    tripAdvisorActivities: [],
    accommodationTypes: {},
    commonItemPrices: {
      coke500ml: '',
      mcdBurger: '',
      localBeer: '',
      coffee: '',
      streetFood: '',
      transport: '',
    },
    experienceGallery: [],
    regionCard: {
      sleep: {
        summary: '',
        details: '',
        icons: [],
      },
      work: {
        summary: '',
        details: '',
        icons: [],
      },
    },
  });

  const [newTag, setNewTag] = useState('');
  const [newPlace, setNewPlace] = useState('');
  const [newActivity, setNewActivity] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [descriptionLoading, setDescriptionLoading] = useState(false);
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [allCities, setAllCities] = useState<CityData[]>([]);

  // Load city data for edit mode
  useEffect(() => {
    if (mode === 'edit' && cityId) {
      loadCity();
    }
    loadCountries();
    loadAllCities();
  }, [mode, cityId]);

  async function loadCountries() {
    try {
      const response = await fetch(apiUrl('countries'));
      if (response.ok) {
        const data = await response.json();
        setCountries(data.countries || []);
      }
    } catch (err) {
      console.error('Error loading countries:', err);
    }
  }

  async function loadAllCities() {
    try {
      const response = await fetch(apiUrl('cities'));
      if (response.ok) {
        const data = await response.json();
        setAllCities(data.cities || []);
      }
    } catch (err) {
      console.error('Error loading cities:', err);
    }
  }

  async function loadCity() {
    try {
      setLoading(true);
      const response = await fetch(apiUrl(`cities/${cityId}`));
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('City not found');
        } else {
          throw new Error('Failed to load city');
        }
        return;
      }

      const data = await response.json();
      setFormData(data.city);
    } catch (err: any) {
      console.error('Error loading city:', err);
      setError(err.message || 'Failed to load city');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);

      const url = mode === 'edit' 
        ? apiUrl(`cities/${cityId}`)
        : apiUrl('cities');
      
      const method = mode === 'edit' ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save city');
      }

      router.push('/hub/destinations/cities/');
    } catch (err: any) {
      console.error('Error saving city:', err);
      setError(err.message || 'Failed to save city');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this city? This action cannot be undone.')) {
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(apiUrl(`cities/${cityId}`), {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete city');
      }

      router.push('/hub/destinations/cities/');
    } catch (err: any) {
      console.error('Error deleting city:', err);
      setError(err.message || 'Failed to delete city');
      setSaving(false);
    }
  }

  // Helper functions for array fields
  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tag),
    }));
  };

  const addPlace = () => {
    if (newPlace.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: {
          ...prev.highlights!,
          places: [...(prev.highlights?.places || []), newPlace.trim()],
        },
      }));
      setNewPlace('');
    }
  };

  const removePlace = (place: string) => {
    setFormData(prev => ({
      ...prev,
      highlights: {
        ...prev.highlights!,
        places: (prev.highlights?.places || []).filter(p => 
          typeof p === 'string' ? p !== place : p.title !== place
        ),
      },
    }));
  };

  const addHighlightActivity = () => {
    if (newActivity.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: {
          ...prev.highlights!,
          activities: [...(prev.highlights?.activities || []), newActivity.trim()],
        },
      }));
      setNewActivity('');
    }
  };

  const removeHighlightActivity = (activity: string) => {
    setFormData(prev => ({
      ...prev,
      highlights: {
        ...prev.highlights!,
        activities: (prev.highlights?.activities || []).filter(a => a !== activity),
      },
    }));
  };

  const addImageUrl = () => {
    if (newImageUrl.trim() && !formData.imageUrls?.includes(newImageUrl.trim())) {
      setFormData(prev => ({
        ...prev,
        imageUrls: [...(prev.imageUrls || []), newImageUrl.trim()],
      }));
      setNewImageUrl('');
    }
  };

  const removeImageUrl = (url: string) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: (prev.imageUrls || []).filter(u => u !== url),
    }));
  };

  const handleImagesChange = (imageUrls: string[]) => {
    setFormData(prev => ({
      ...prev,
      imageUrls,
    }));
  };

  const fetchCityDescription = async (source: 'tripadvisor' | 'ai') => {
    if (!formData.city || !formData.country) {
      setError('Please enter city and country first');
      return;
    }

    setDescriptionLoading(true);
    setError(null);

    try {
      const url = apiUrl('cities/description');
      console.log('[fetchCityDescription] Calling URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: formData.city,
          country: formData.country,
          source,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        // If 404 and on localhost, suggest checking DISABLE_STATIC_EXPORT
        if (response.status === 404 && typeof window !== 'undefined' && 
            (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
          errorMessage += '. Make sure DISABLE_STATIC_EXPORT=true is set in .env.local and restart the dev server.';
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        description: data.description || '',
      }));
    } catch (err: any) {
      console.error('Error fetching description:', err);
      setError(err.message || 'Failed to fetch description');
    } finally {
      setDescriptionLoading(false);
    }
  };

  const toggleActivity = (activity: string) => {
    setFormData(prev => {
      const current = prev.availableActivities || [];
      return {
        ...prev,
        availableActivities: current.includes(activity)
          ? current.filter(a => a !== activity)
          : [...current, activity],
      };
    });
  };

  const toggleAccommodation = (acc: string) => {
    setFormData(prev => {
      const current = prev.availableAccommodation || [];
      return {
        ...prev,
        availableAccommodation: current.includes(acc)
          ? current.filter(a => a !== acc)
          : [...current, acc],
      };
    });
  };

  const toggleRegionCardSleepIcon = (label: string) => {
    setFormData((prev) => {
      const current = prev.regionCard?.sleep?.icons || [];
      const next = current.includes(label) ? current.filter((x) => x !== label) : [...current, label];
      return {
        ...prev,
        regionCard: {
          ...prev.regionCard,
          sleep: {
            ...prev.regionCard?.sleep,
            icons: next,
          },
        },
      };
    });
  };

  const toggleRegionCardWorkIcon = (label: string) => {
    setFormData((prev) => {
      const current = prev.regionCard?.work?.icons || [];
      const next = current.includes(label) ? current.filter((x) => x !== label) : [...current, label];
      return {
        ...prev,
        regionCard: {
          ...prev.regionCard,
          work: {
            ...prev.regionCard?.work,
            icons: next,
          },
        },
      };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-sb-orange-500" />
      </div>
    );
  }

  if (error && mode === 'edit' && !formData.city) {
    return (
      <div className="space-y-4">
        <Link
          href="/hub/destinations/cities/"
          className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cities
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
            href="/hub/destinations/cities/"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cities
          </Link>
          <h1 className="text-3xl font-bold text-stone-900">
            {mode === 'edit' ? `Edit ${formData.city}` : 'Add New City'}
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
              <label className="block text-sm font-medium text-stone-700 mb-1">City Name *</label>
              <input
                type="text"
                required
                value={formData.city || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Country *</label>
              <select
                required
                value={formData.country || ''}
                onChange={(e) => {
                  const selectedCountry = countries.find(c => c.name === e.target.value);
                  setFormData(prev => ({ 
                    ...prev, 
                    country: e.target.value,
                    flag: selectedCountry?.flag || prev.flag,
                    region: selectedCountry?.region || prev.region,
                  }));
                }}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
              >
                <option value="">Select a country...</option>
                {countries
                  .filter(c => !formData.region || c.region === formData.region)
                  .map((country) => (
                    <option key={country.id} value={country.name}>
                      {country.flag} {country.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Flag Emoji</label>
              <input
                type="text"
                value={formData.flag || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, flag: e.target.value }))}
                placeholder="🇹🇭"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
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
              <label className="block text-sm font-medium text-stone-700 mb-1">Budget Level</label>
              <select
                value={formData.budgetCoins || 2}
                onChange={(e) => setFormData(prev => ({ ...prev, budgetCoins: parseInt(e.target.value) as 1 | 2 | 3 }))}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
              >
                <option value={1}>💰 Budget</option>
                <option value={2}>💰💰 Mid-range</option>
                <option value={3}>💰💰💰 Premium</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Nomad Score (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.nomadScore || 7}
                onChange={(e) => setFormData(prev => ({ ...prev, nomadScore: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Internet Speed</label>
              <input
                type="text"
                value={formData.internetSpeed || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, internetSpeed: e.target.value }))}
                placeholder="50-100 Mbps"
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

          {/* Detour Fields */}
          <div className="pt-4 border-t border-stone-200 space-y-4">
            <h3 className="text-md font-bold text-stone-900">Detour Settings</h3>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isDetour"
                checked={formData.isDetour || false}
                onChange={(e) => {
                  const isDetour = e.target.checked;
                  setFormData(prev => ({ 
                    ...prev, 
                    isDetour,
                    suggestedDuration: isDetour ? 1.5 : (prev.suggestedDuration || 4),
                    nearbyCity: isDetour ? prev.nearbyCity : undefined,
                  }));
                }}
                className="w-4 h-4 text-sb-teal-500 rounded"
              />
              <label htmlFor="isDetour" className="text-sm font-medium text-stone-700">Is Detour</label>
            </div>

            {formData.isDetour && (
              <>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Nearby City</label>
                  <select
                    value={formData.nearbyCity || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, nearbyCity: e.target.value }))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-teal-400 focus:border-transparent"
                  >
                    <option value="">Select nearby city...</option>
                    {allCities
                      .filter(c => c.country === formData.country && !c.isDetour && c.city !== formData.city)
                      .map((city) => (
                        <option key={city.id} value={city.city}>
                          {city.city}
                        </option>
                      ))}
                  </select>
                  <p className="text-xs text-stone-500 mt-1">Main city this detour is near (e.g., "Bali (Canggu)" for Ubud)</p>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Suggested Duration (weeks)</label>
              <input
                type="number"
                min="0.5"
                max="12"
                step="0.5"
                value={formData.suggestedDuration || (formData.isDetour ? 1.5 : 4)}
                onChange={(e) => setFormData(prev => ({ ...prev, suggestedDuration: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
              />
              <p className="text-xs text-stone-500 mt-1">
                {formData.isDetour ? 'Detours typically 1-2 weeks' : 'Main cities typically 4 weeks'}
              </p>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-stone-900">Tags</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {(formData.tags || []).map((tag) => (
              <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Add a tag..."
              className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
            />
            <button type="button" onClick={addTag} className="px-4 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* City Images */}
        <CityImageManager
          imageUrls={formData.imageUrls || []}
          onImagesChange={handleImagesChange}
          cityName={formData.city}
          promptContext={{
            cityName: formData.city || '',
            country: formData.country || '',
            region: formData.region,
            tags: formData.tags || [],
          }}
        />

        {/* City Description */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900">City Description</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fetchCityDescription('tripadvisor')}
                disabled={descriptionLoading || !formData.city || !formData.country}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {descriptionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Get from TripAdvisor'
                )}
              </button>
              <button
                type="button"
                onClick={() => fetchCityDescription('ai')}
                disabled={descriptionLoading || !formData.city || !formData.country}
                className="px-4 py-2 text-sm bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {descriptionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate with AI'
                )}
              </button>
            </div>
          </div>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter a description of the city, or use the buttons above to fetch from TripAdvisor or generate with AI..."
            rows={6}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
          />
          <p className="text-xs text-stone-500">
            Provide a compelling description of the city that will help travelers understand what makes it special.
          </p>
        </div>

        {/* Available Activities */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-stone-900">Available Activities</h2>
          <p className="text-sm text-stone-500">Select which activities are available in this city</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {DEFAULT_ACTIVITIES.map((activity) => (
              <label key={activity} className="flex items-center gap-2 p-2 rounded-lg hover:bg-stone-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(formData.availableActivities || []).includes(activity)}
                  onChange={() => toggleActivity(activity)}
                  className="w-4 h-4 text-sb-orange-500 rounded"
                />
                <span className="text-sm text-stone-700">{activity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Available Accommodation */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-stone-900">Available Accommodation</h2>
          <p className="text-sm text-stone-500">Select which accommodation types are available in this city</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {DEFAULT_ACCOMMODATION.map((acc) => (
              <label key={acc} className="flex items-center gap-2 p-2 rounded-lg hover:bg-stone-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(formData.availableAccommodation || []).includes(acc)}
                  onChange={() => toggleAccommodation(acc)}
                  className="w-4 h-4 text-sb-orange-500 rounded"
                />
                <span className="text-sm text-stone-700">{acc}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-stone-900">Highlights</h2>
          
          {/* Places */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Top Places to Visit</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(formData.highlights?.places || []).map((place) => {
                const placeName = typeof place === 'string' ? place : place.title;
                return (
                  <span key={placeName} className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    {placeName}
                    <button type="button" onClick={() => removePlace(placeName)} className="hover:text-green-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPlace}
                onChange={(e) => setNewPlace(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPlace())}
                placeholder="Add a place..."
                className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
              />
              <button type="button" onClick={addPlace} className="px-4 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Accommodation Description */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Accommodation Description</label>
            <input
              type="text"
              value={formData.highlights?.accommodation || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                highlights: { ...prev.highlights!, accommodation: e.target.value },
              }))}
              placeholder="Describe typical accommodation..."
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
            />
          </div>

          {/* Activities */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Highlight Activities</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(formData.highlights?.activities || []).map((activity) => (
                <span key={activity} className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {activity}
                  <button type="button" onClick={() => removeHighlightActivity(activity)} className="hover:text-purple-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlightActivity())}
                placeholder="Add an activity..."
                className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
              />
              <button type="button" onClick={addHighlightActivity} className="px-4 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notes Hint */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Notes Hint</label>
            <textarea
              value={formData.highlights?.notesHint || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                highlights: { ...prev.highlights!, notesHint: e.target.value },
              }))}
              placeholder="Hints and tips for visitors..."
              rows={2}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Region Cards: Sleep + Work Vibe (Hub City) */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Region Card: Sleep & Work Vibe</h2>
            <p className="text-sm text-stone-500">
              These show up on the user-facing <span className="font-medium">Region cards</span>. Edit them here on the hub city.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Sleep */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900">Where you&apos;ll sleep</h3>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Summary (1 line)</label>
                <input
                  type="text"
                  value={formData.regionCard?.sleep?.summary || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      regionCard: {
                        ...prev.regionCard,
                        sleep: {
                          ...prev.regionCard?.sleep,
                          summary: e.target.value,
                        },
                      },
                    }))
                  }
                  placeholder="e.g. Private apartments & coliving, walkable to cafés"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Details (expandable)</label>
                <textarea
                  value={formData.regionCard?.sleep?.details || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      regionCard: {
                        ...prev.regionCard,
                        sleep: {
                          ...prev.regionCard?.sleep,
                          details: e.target.value,
                        },
                      },
                    }))
                  }
                  placeholder="Give a realistic picture: typical neighborhoods, noise, AC, laundry, desk setup, etc."
                  rows={4}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Quick icons</label>
                <div className="grid grid-cols-2 gap-2">
                  {DEFAULT_ACCOMMODATION.map((label) => (
                    <label key={label} className="flex items-center gap-2 p-2 rounded-lg hover:bg-stone-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.regionCard?.sleep?.icons || []).includes(label)}
                        onChange={() => toggleRegionCardSleepIcon(label)}
                        className="w-4 h-4 text-sb-orange-500 rounded"
                      />
                      <span className="text-sm text-stone-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Work */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900">Where you&apos;ll work</h3>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Summary (1 line)</label>
                <input
                  type="text"
                  value={formData.regionCard?.work?.summary || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      regionCard: {
                        ...prev.regionCard,
                        work: {
                          ...prev.regionCard?.work,
                          summary: e.target.value,
                        },
                      },
                    }))
                  }
                  placeholder="e.g. Strong coworking culture + reliable WiFi in cafés"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Details (expandable)</label>
                <textarea
                  value={formData.regionCard?.work?.details || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      regionCard: {
                        ...prev.regionCard,
                        work: {
                          ...prev.regionCard?.work,
                          details: e.target.value,
                        },
                      },
                    }))
                  }
                  placeholder="Share specifics: coworking vibe, noise, power cuts, call booths, cafe etiquette, etc."
                  rows={4}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Quick icons</label>
                <div className="grid grid-cols-2 gap-2">
                  {DEFAULT_WORK_VIBE.map((label) => (
                    <label key={label} className="flex items-center gap-2 p-2 rounded-lg hover:bg-stone-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.regionCard?.work?.icons || []).includes(label)}
                        onChange={() => toggleRegionCardWorkIcon(label)}
                        className="w-4 h-4 text-sb-orange-500 rounded"
                      />
                      <span className="text-sm text-stone-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weather */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-stone-900">Weather</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Average Temperature</label>
              <input
                type="text"
                value={formData.weather?.avgTemp || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  weather: { ...prev.weather!, avgTemp: e.target.value },
                }))}
                placeholder="28°C"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Best Months</label>
              <input
                type="text"
                value={formData.weather?.bestMonths || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  weather: { ...prev.weather!, bestMonths: e.target.value },
                }))}
                placeholder="Nov-Mar"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Climate</label>
              <select
                value={formData.weather?.climate || 'tropical'}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  weather: { ...prev.weather!, climate: e.target.value as any },
                }))}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
              >
                <option value="tropical">Tropical</option>
                <option value="mediterranean">Mediterranean</option>
                <option value="temperate">Temperate</option>
                <option value="dry">Dry</option>
              </select>
            </div>
          </div>
        </div>

        {/* Costs */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-stone-900">Cost of Living</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Accommodation</label>
              <input
                type="text"
                value={formData.costs?.accommodation || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  costs: { ...prev.costs!, accommodation: e.target.value },
                }))}
                placeholder="R8,000 - R12,000/month"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Coworking</label>
              <input
                type="text"
                value={formData.costs?.coworking || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  costs: { ...prev.costs!, coworking: e.target.value },
                }))}
                placeholder="R1,800 - R2,700/month"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Meals</label>
              <input
                type="text"
                value={formData.costs?.meals || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  costs: { ...prev.costs!, meals: e.target.value },
                }))}
                placeholder="R3,600 - R7,200/month"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Monthly Total</label>
              <input
                type="text"
                value={formData.costs?.monthlyTotal || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  costs: { ...prev.costs!, monthlyTotal: e.target.value },
                }))}
                placeholder="R14,400 - R21,600"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Common Item Prices */}
          <div className="mt-6 pt-6 border-t border-stone-200">
            <h3 className="text-sm font-bold text-stone-900 mb-3">Common Item Prices (in local currency)</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">500ml Coke</label>
                <input
                  type="text"
                  value={formData.commonItemPrices?.coke500ml || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    commonItemPrices: { ...prev.commonItemPrices!, coke500ml: e.target.value },
                  }))}
                  placeholder="R15"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">McDonald's Burger</label>
                <input
                  type="text"
                  value={formData.commonItemPrices?.mcdBurger || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    commonItemPrices: { ...prev.commonItemPrices!, mcdBurger: e.target.value },
                  }))}
                  placeholder="R45"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Local Beer</label>
                <input
                  type="text"
                  value={formData.commonItemPrices?.localBeer || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    commonItemPrices: { ...prev.commonItemPrices!, localBeer: e.target.value },
                  }))}
                  placeholder="R25"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Coffee (Cafe)</label>
                <input
                  type="text"
                  value={formData.commonItemPrices?.coffee || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    commonItemPrices: { ...prev.commonItemPrices!, coffee: e.target.value },
                  }))}
                  placeholder="R30"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Street Food Meal</label>
                <input
                  type="text"
                  value={formData.commonItemPrices?.streetFood || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    commonItemPrices: { ...prev.commonItemPrices!, streetFood: e.target.value },
                  }))}
                  placeholder="R50"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Transport Ticket</label>
                <input
                  type="text"
                  value={formData.commonItemPrices?.transport || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    commonItemPrices: { ...prev.commonItemPrices!, transport: e.target.value },
                  }))}
                  placeholder="R10"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Accommodation Types */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <AccommodationTypesManager
            accommodationTypes={formData.accommodationTypes || {}}
            onChange={(types) => setFormData(prev => ({ ...prev, accommodationTypes: types }))}
          />
        </div>

        {/* Experience Gallery */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <ExperienceGalleryManager
            gallery={formData.experienceGallery || []}
            onChange={(gallery) => setFormData(prev => ({ ...prev, experienceGallery: gallery }))}
            cityName={formData.city || ''}
          />
        </div>

        {/* TripAdvisor Activities */}
        {mode === 'edit' && cityId && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
            <ActivityManager
              cityId={cityId}
              cityName={formData.city || ''}
              countryName={formData.country || ''}
              initialActivities={formData.tripAdvisorActivities || []}
              onActivitiesUpdate={(activities) => {
                setFormData((prev) => ({
                  ...prev,
                  tripAdvisorActivities: activities,
                }));
              }}
            />
          </div>
        )}

        {/* Admin Notes */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-stone-900">Admin Notes</h2>
          <textarea
            value={formData.adminNotes || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, adminNotes: e.target.value }))}
            placeholder="Internal notes about this city..."
            rows={3}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
          />
        </div>

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
            {saving ? 'Saving...' : 'Save City'}
          </button>
          <Link
            href="/hub/destinations/cities/"
            className="px-6 py-3 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

