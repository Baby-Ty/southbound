'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
// Using regular img tags for external images to avoid CORS issues
import {
  ArrowLeft,
  Save,
  Loader2,
  CheckCircle,
  MapPin,
  Thermometer,
  Calendar,
  DollarSign,
  Wifi,
  Star,
  Tag,
  Home,
  Coffee,
  Utensils,
  Plus,
  X,
  Sun,
  Cloud,
  Droplets,
  Wind,
  Globe,
  Flag,
  Sparkles,
} from 'lucide-react';
import { ACTIVITIES, ACCOMMODATION_TYPES, RegionKey } from '@/lib/cityPresets';
import { CityData } from '@/lib/cosmos-cities';
import CityImageManager from '@/components/hub/CityImageManager';
import ImageGenerator from '@/components/hub/ImageGenerator';
import { PromptContext } from '@/lib/dallePrompts';

const CLIMATE_OPTIONS = [
  { value: 'tropical', label: 'Tropical', icon: Sun, color: 'text-orange-500' },
  { value: 'mediterranean', label: 'Mediterranean', icon: Sun, color: 'text-yellow-500' },
  { value: 'temperate', label: 'Temperate', icon: Cloud, color: 'text-blue-400' },
  { value: 'dry', label: 'Dry', icon: Wind, color: 'text-amber-500' },
] as const;

const REGION_OPTIONS: { value: RegionKey; label: string }[] = [
  { value: 'europe', label: 'Europe' },
  { value: 'latin-america', label: 'Latin America' },
  { value: 'southeast-asia', label: 'Southeast Asia' },
];

const BUDGET_OPTIONS = [
  { value: 1, label: 'Affordable', coins: '💰', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 2, label: 'Value', coins: '💰💰', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 3, label: 'Premium', coins: '💰💰💰', color: 'bg-purple-100 text-purple-700 border-purple-200' },
] as const;

const COMMON_TAGS = [
  'beach', 'mountain', 'urban', 'coastal', 'culture', 'nightlife', 'food', 
  'surf', 'yoga', 'nature', 'history', 'art', 'temples', 'modern', 
  'chill', 'party', 'wellness', 'adventure', 'coffee', 'wine'
];

export default function CityEditPage() {
  const params = useParams();
  const router = useRouter();
  const cityId = params.city as string;

  const [city, setCity] = useState<CityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // All editable fields
  const [formData, setFormData] = useState({
    city: '',
    country: '',
    flag: '',
    region: 'europe' as RegionKey,
    enabled: true,
    budgetCoins: 2 as 1 | 2 | 3,
    tags: [] as string[],
    imageUrls: [] as string[],
    imageUrl: '', // Legacy support
    highlightImages: [] as string[],
    activityImages: [] as string[],
    accommodationImages: [] as string[],
    highlights: {
      places: [] as string[],
      accommodation: '',
      activities: [] as string[],
      notesHint: '',
    },
    weather: {
      avgTemp: '',
      bestMonths: '',
      climate: 'temperate' as 'tropical' | 'mediterranean' | 'temperate' | 'dry',
    },
    costs: {
      accommodation: '',
      coworking: '',
      meals: '',
      monthlyTotal: '',
    },
    nomadScore: 7,
    internetSpeed: '',
    availableActivities: [] as string[],
    availableAccommodation: [] as string[],
    adminNotes: '',
  });

  // Temp inputs for adding items
  const [newTag, setNewTag] = useState('');
  const [newPlace, setNewPlace] = useState('');
  const [newActivity, setNewActivity] = useState('');

  useEffect(() => {
    loadCity();
  }, [cityId]);

  async function loadCity() {
    try {
      setLoading(true);
      const { apiUrl } = await import('@/lib/api');
      const response = await fetch(apiUrl(`cities/${cityId}`));
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/hub/destinations/cities');
          return;
        }
        throw new Error('Failed to load city');
      }
      
      const data = await response.json();
      const cityData = data.city as CityData;
      setCity(cityData);
      
      // Populate form data
      setFormData({
        city: cityData.city || '',
        country: cityData.country || '',
        flag: cityData.flag || '',
        region: cityData.region || 'europe',
        enabled: cityData.enabled ?? true,
        budgetCoins: cityData.budgetCoins || 2,
        tags: cityData.tags || [],
        imageUrls: cityData.imageUrls || (cityData.imageUrl ? [cityData.imageUrl] : []),
        imageUrl: cityData.imageUrl || '', // Legacy support
        highlightImages: cityData.highlightImages || [],
        activityImages: cityData.activityImages || [],
        accommodationImages: cityData.accommodationImages || [],
        highlights: {
          places: cityData.highlights?.places || [],
          accommodation: cityData.highlights?.accommodation || '',
          activities: cityData.highlights?.activities || [],
          notesHint: cityData.highlights?.notesHint || '',
        },
        weather: {
          avgTemp: cityData.weather?.avgTemp || '',
          bestMonths: cityData.weather?.bestMonths || '',
          climate: cityData.weather?.climate || 'temperate',
        },
        costs: {
          accommodation: cityData.costs?.accommodation || '',
          coworking: cityData.costs?.coworking || '',
          meals: cityData.costs?.meals || '',
          monthlyTotal: cityData.costs?.monthlyTotal || '',
        },
        nomadScore: cityData.nomadScore || 7,
        internetSpeed: cityData.internetSpeed || '',
        availableActivities: cityData.availableActivities || [],
        availableAccommodation: cityData.availableAccommodation || [],
        adminNotes: cityData.adminNotes || '',
      });
    } catch (error) {
      console.error('Error loading city:', error);
      alert('Failed to load city');
      router.push('/hub/destinations/cities');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const { apiUrl } = await import('@/lib/api');
      const response = await fetch(apiUrl(`cities/${cityId}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save city');
      }

      alert('City updated successfully!');
      router.push('/hub/destinations/cities');
    } catch (error) {
      console.error('Error saving city:', error);
      alert('Failed to save city');
    } finally {
      setSaving(false);
    }
  }

  function updateFormData(key: string, value: any) {
    setFormData(prev => ({ ...prev, [key]: value }));
  }

  function updateNestedData(parent: 'highlights' | 'weather' | 'costs', key: string, value: any) {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [key]: value }
    }));
  }

  function toggleArrayItem(key: 'tags' | 'availableActivities' | 'availableAccommodation', item: string) {
    setFormData(prev => ({
      ...prev,
      [key]: prev[key].includes(item)
        ? prev[key].filter(i => i !== item)
        : [...prev[key], item]
    }));
  }

  function toggleHighlightActivity(activity: string) {
    setFormData(prev => ({
      ...prev,
      highlights: {
        ...prev.highlights,
        activities: prev.highlights.activities.includes(activity)
          ? prev.highlights.activities.filter(a => a !== activity)
          : [...prev.highlights.activities, activity]
      }
    }));
  }

  function addTag() {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  }

  function removeTag(tag: string) {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  }

  function addPlace() {
    if (newPlace.trim() && !formData.highlights.places.includes(newPlace.trim())) {
      setFormData(prev => ({
        ...prev,
        highlights: { ...prev.highlights, places: [...prev.highlights.places, newPlace.trim()] }
      }));
      setNewPlace('');
    }
  }

  function removePlace(place: string) {
    setFormData(prev => ({
      ...prev,
      highlights: { ...prev.highlights, places: prev.highlights.places.filter(p => p !== place) }
    }));
  }

  // City image handlers
  function handleCityImagesChange(imageUrls: string[]) {
    updateFormData('imageUrls', imageUrls);
    // Also update legacy imageUrl for backward compatibility
    if (imageUrls.length > 0) {
      updateFormData('imageUrl', imageUrls[0]);
    }
  }

  function handleHighlightImageSaved(imageUrl: string) {
    setFormData(prev => ({
      ...prev,
      highlightImages: [...prev.highlightImages, imageUrl]
    }));
  }

  function handleActivityImageSaved(imageUrl: string) {
    setFormData(prev => ({
      ...prev,
      activityImages: [...prev.activityImages, imageUrl]
    }));
  }

  function handleAccommodationImageSaved(imageUrl: string) {
    setFormData(prev => ({
      ...prev,
      accommodationImages: [...prev.accommodationImages, imageUrl]
    }));
  }

  function removeHighlightImage(imageUrl: string) {
    setFormData(prev => ({
      ...prev,
      highlightImages: prev.highlightImages.filter(url => url !== imageUrl)
    }));
  }

  function removeActivityImage(imageUrl: string) {
    setFormData(prev => ({
      ...prev,
      activityImages: prev.activityImages.filter(url => url !== imageUrl)
    }));
  }

  function removeAccommodationImage(imageUrl: string) {
    setFormData(prev => ({
      ...prev,
      accommodationImages: prev.accommodationImages.filter(url => url !== imageUrl)
    }));
  }

  // Get prompt context for image generation
  function getPromptContext(): PromptContext {
    return {
      cityName: formData.city || '',
      country: formData.country || '',
      region: formData.region,
      vibe: formData.tags.length > 0 ? formData.tags[0] : undefined,
      tags: formData.tags || [],
    };
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-sb-orange-500" />
      </div>
    );
  }

  if (!city && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-600 mb-4">City not found</p>
        <Link
          href="/hub/destinations/cities"
          className="text-sb-orange-500 hover:underline"
        >
          Back to Cities
        </Link>
      </div>
    );
  }

  if (!city) return null;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 bg-stone-50 py-4 z-10 -mx-6 px-6 border-b border-stone-200">
        <div className="flex items-center gap-4">
          <Link
            href="/hub/destinations/cities"
            className="p-2 hover:bg-stone-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 text-stone-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Edit City</h1>
            <p className="text-stone-600 mt-1">{formData.city}, {formData.country}</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-sb-orange-500 text-white rounded-lg font-medium hover:bg-sb-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sb-orange-500/20"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* City Images - Unified Manager */}
          {city && (
            <CityImageManager
              imageUrls={formData.imageUrls || []}
              onImagesChange={handleCityImagesChange}
              cityName={formData.city}
              promptContext={getPromptContext()}
            />
          )}

          {/* Basic Information */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-sb-orange-500" />
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">City Name</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => updateFormData('country', e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Flag Emoji</label>
                <input
                  type="text"
                  value={formData.flag}
                  onChange={(e) => updateFormData('flag', e.target.value)}
                  placeholder="🇵🇹"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent text-2xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Region</label>
                <select
                  value={formData.region}
                  onChange={(e) => updateFormData('region', e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                >
                  {REGION_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Budget Level */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-stone-700 mb-2">Budget Level</label>
              <div className="flex gap-3">
                {BUDGET_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => updateFormData('budgetCoins', opt.value)}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      formData.budgetCoins === opt.value
                        ? opt.color + ' border-current'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="text-lg mb-1">{opt.coins}</div>
                    <div className="text-sm font-medium">{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-stone-700 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-sb-orange-100 text-sb-orange-700 rounded-full text-sm font-medium"
                  >
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-sb-orange-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-200 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {COMMON_TAGS.filter(t => !formData.tags.includes(t)).slice(0, 8).map(tag => (
                  <button
                    key={tag}
                    onClick={() => setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }))}
                    className="px-2 py-1 text-xs bg-stone-100 text-stone-600 rounded hover:bg-stone-200 transition"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Weather & Climate */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-sb-orange-500" />
              Weather & Climate
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Average Temperature</label>
                <input
                  type="text"
                  value={formData.weather.avgTemp}
                  onChange={(e) => updateNestedData('weather', 'avgTemp', e.target.value)}
                  placeholder="e.g., 24°C"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Best Months</label>
                <input
                  type="text"
                  value={formData.weather.bestMonths}
                  onChange={(e) => updateNestedData('weather', 'bestMonths', e.target.value)}
                  placeholder="e.g., Mar-Jun, Sep-Nov"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Climate Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CLIMATE_OPTIONS.map(opt => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => updateNestedData('weather', 'climate', opt.value)}
                      className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                        formData.weather.climate === opt.value
                          ? 'border-sb-orange-500 bg-sb-orange-50'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${opt.color}`} />
                      <span className="text-sm font-medium">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Cost Information */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-sb-orange-500" />
              Cost Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  <Home className="w-4 h-4 inline mr-1" />
                  Accommodation (Monthly)
                </label>
                <input
                  type="text"
                  value={formData.costs.accommodation}
                  onChange={(e) => updateNestedData('costs', 'accommodation', e.target.value)}
                  placeholder="e.g., $1,200 - $1,800"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  <Coffee className="w-4 h-4 inline mr-1" />
                  Coworking (Monthly)
                </label>
                <input
                  type="text"
                  value={formData.costs.coworking}
                  onChange={(e) => updateNestedData('costs', 'coworking', e.target.value)}
                  placeholder="e.g., $150 - $250"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  <Utensils className="w-4 h-4 inline mr-1" />
                  Meals (Monthly)
                </label>
                <input
                  type="text"
                  value={formData.costs.meals}
                  onChange={(e) => updateNestedData('costs', 'meals', e.target.value)}
                  placeholder="e.g., $400 - $600"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Monthly Total
                </label>
                <input
                  type="text"
                  value={formData.costs.monthlyTotal}
                  onChange={(e) => updateNestedData('costs', 'monthlyTotal', e.target.value)}
                  placeholder="e.g., $2,200 - $3,000"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Nomad Info */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-sb-orange-500" />
              Nomad Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Nomad Score (1-10)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.nomadScore}
                    onChange={(e) => updateFormData('nomadScore', parseInt(e.target.value))}
                    className="flex-1 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-sb-orange-500"
                  />
                  <span className="w-12 text-center font-bold text-lg text-sb-orange-600">
                    {formData.nomadScore}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  <Wifi className="w-4 h-4 inline mr-1" />
                  Internet Speed
                </label>
                <input
                  type="text"
                  value={formData.internetSpeed}
                  onChange={(e) => updateFormData('internetSpeed', e.target.value)}
                  placeholder="e.g., 100 Mbps avg"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-sb-orange-500" />
              Highlights & Tips
            </h3>
            
            {/* Places */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-700 mb-2">Key Places / Neighborhoods</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.highlights.places.map(place => (
                  <span
                    key={place}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    <MapPin className="w-3 h-3" />
                    {place}
                    <button onClick={() => removePlace(place)} className="hover:text-blue-900 ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPlace}
                  onChange={(e) => setNewPlace(e.target.value)}
                  placeholder="Add a place..."
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPlace())}
                  className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                />
                <button
                  onClick={addPlace}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-200 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Accommodation Suggestion */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-700 mb-1">Accommodation Suggestion</label>
              <input
                type="text"
                value={formData.highlights.accommodation}
                onChange={(e) => updateNestedData('highlights', 'accommodation', e.target.value)}
                placeholder="e.g., Apartment near cafés and coworking"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
              />
            </div>

            {/* Activities */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-700 mb-2">Recommended Activities</label>
              <div className="flex flex-wrap gap-2">
                {ACTIVITIES.slice(0, 12).map(activity => {
                  const isSelected = formData.highlights.activities.includes(activity);
                  return (
                    <button
                      key={activity}
                      onClick={() => toggleHighlightActivity(activity)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        isSelected
                          ? 'bg-teal-100 border-teal-200 text-teal-700'
                          : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      {activity}
                      {isSelected && <CheckCircle className="w-3 h-3 inline ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes Hint */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Tips / Notes Hint</label>
              <textarea
                value={formData.highlights.notesHint}
                onChange={(e) => updateNestedData('highlights', 'notesHint', e.target.value)}
                placeholder="e.g., Desk and strong Wi‑Fi. Day trips: Cascais, Sintra."
                rows={2}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Available Activities */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-4">
              Available Activities for Users
            </h3>
            <p className="text-sm text-stone-600 mb-4">
              Select which activities users can choose for this city when customizing their route.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ACTIVITIES.map((activity) => {
                const isSelected = formData.availableActivities.includes(activity);
                return (
                  <button
                    key={activity}
                    onClick={() => toggleArrayItem('availableActivities', activity)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? 'border-sb-orange-500 bg-orange-50 text-sb-orange-700'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{activity}</span>
                      {isSelected && (
                        <CheckCircle className="w-4 h-4 text-sb-orange-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Available Accommodation Types */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-4">
              Available Accommodation Types
            </h3>
            <p className="text-sm text-stone-600 mb-4">
              Select which accommodation types users can choose for this city.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ACCOMMODATION_TYPES.map((accType) => {
                const isSelected = formData.availableAccommodation.includes(accType);
                return (
                  <button
                    key={accType}
                    onClick={() => toggleArrayItem('availableAccommodation', accType)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? 'border-sb-orange-500 bg-orange-50 text-sb-orange-700'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{accType}</span>
                      {isSelected && (
                        <CheckCircle className="w-4 h-4 text-sb-orange-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Image Generator - Highlights */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sb-orange-500" />
              AI Image Generator - Highlights & Places
            </h3>
            <ImageGenerator
              category="highlight"
              context={{
                ...getPromptContext(),
                customContext: formData.highlights.places.join(', ') || undefined,
              }}
              onImageSaved={handleHighlightImageSaved}
              maxImages={4}
            />
            
            {/* Saved Highlight Images */}
            {formData.highlightImages.length > 0 && (
              <div className="mt-6 pt-6 border-t border-stone-200">
                <h4 className="text-sm font-bold text-stone-700 mb-3">Saved Highlight Images</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {formData.highlightImages.map((url, idx) => (
                    <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden bg-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Highlight ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeHighlightImage(url)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Image Generator - Activities */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sb-orange-500" />
              AI Image Generator - Activities
            </h3>
            <ImageGenerator
              category="activity"
              context={{
                ...getPromptContext(),
                activityName: formData.highlights.activities[0] || undefined,
              }}
              onImageSaved={handleActivityImageSaved}
              maxImages={4}
            />
            
            {/* Saved Activity Images */}
            {formData.activityImages.length > 0 && (
              <div className="mt-6 pt-6 border-t border-stone-200">
                <h4 className="text-sm font-bold text-stone-700 mb-3">Saved Activity Images</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {formData.activityImages.map((url, idx) => (
                    <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden bg-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Activity ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeActivityImage(url)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Image Generator - Accommodations */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sb-orange-500" />
              AI Image Generator - Accommodations
            </h3>
            <ImageGenerator
              category="accommodation"
              context={{
                ...getPromptContext(),
                accommodationType: formData.highlights.accommodation || undefined,
              }}
              onImageSaved={handleAccommodationImageSaved}
              maxImages={4}
            />
            
            {/* Saved Accommodation Images */}
            {formData.accommodationImages.length > 0 && (
              <div className="mt-6 pt-6 border-t border-stone-200">
                <h4 className="text-sm font-bold text-stone-700 mb-3">Saved Accommodation Images</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {formData.accommodationImages.map((url, idx) => (
                    <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden bg-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Accommodation ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeAccommodationImage(url)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* City Status */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-1">City Status</h3>
                <p className="text-sm text-stone-600">
                  {formData.enabled ? 'Available for users' : 'Hidden from users'}
                </p>
              </div>
              <button
                onClick={() => updateFormData('enabled', !formData.enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.enabled ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Preview Card */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-4">Card Preview</h3>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 mb-3">
              {formData.imageUrls && formData.imageUrls.length > 0 ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={formData.imageUrls[0]}
                  alt={formData.city}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : formData.imageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={formData.imageUrl}
                  alt={formData.city}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                  <MapPin className="w-8 h-8" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{formData.flag}</span>
                  <span className="font-bold">{formData.city || 'City Name'}</span>
                </div>
                <div className="text-xs text-white/80 flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  {formData.country || 'Country'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-stone-50 rounded text-center">
                <div className="text-stone-500">Budget</div>
                <div className="font-medium">
                  {BUDGET_OPTIONS.find(b => b.value === formData.budgetCoins)?.label}
                </div>
              </div>
              <div className="p-2 bg-stone-50 rounded text-center">
                <div className="text-stone-500">Score</div>
                <div className="font-medium">{formData.nomadScore}/10</div>
              </div>
              <div className="p-2 bg-stone-50 rounded text-center">
                <div className="text-stone-500">Climate</div>
                <div className="font-medium capitalize">{formData.weather.climate}</div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-4">Quick Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-600">Tags</span>
                <span className="font-medium">{formData.tags.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Places</span>
                <span className="font-medium">{formData.highlights.places.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Available Activities</span>
                <span className="font-medium">{formData.availableActivities.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Accommodation Types</span>
                <span className="font-medium">{formData.availableAccommodation.length}</span>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-4">Admin Notes</h3>
            <textarea
              value={formData.adminNotes}
              onChange={(e) => updateFormData('adminNotes', e.target.value)}
              rows={6}
              placeholder="Add internal notes about this city..."
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
