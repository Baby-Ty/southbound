'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  Edit,
  Eye,
  Loader2,
  MapPin,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { RegionKey } from '@/lib/cityPresets';
import { CityData } from '@/lib/cosmos-cities';

export default function CitiesManagementPage() {
  const router = useRouter();
  const [cities, setCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState<RegionKey | 'all'>('all');

  useEffect(() => {
    loadCities();
  }, []);

  async function loadCities() {
    try {
      setLoading(true);
      const { apiUrl } = await import('@/lib/api');
      const response = await fetch(apiUrl('cities'));
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', response.status, errorData);
        throw new Error(errorData.error || `Failed to load cities: ${response.status}`);
      }
      
      const data = await response.json();
      setCities(data.cities || []);
    } catch (error: any) {
      console.error('Error loading cities:', error);
      console.error('Error details:', error.message);
      // Fallback to empty array - this is okay, means CosmosDB isn't configured yet
      setCities([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredCities = cities.filter((city) => {
    const matchesSearch =
      city.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === 'all' || city.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  const toggleCityEnabled = async (cityId: string, currentEnabled: boolean) => {
    try {
      const response = await fetch(`/api/cities/${cityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !currentEnabled }),
      });
      
      if (response.ok) {
        await loadCities(); // Reload list
      }
    } catch (error) {
      console.error('Error toggling city:', error);
      alert('Failed to update city');
    }
  };

  const getRegionName = (region: RegionKey) => {
    const names: Record<RegionKey, string> = {
      europe: 'Europe',
      'latin-america': 'Latin America',
      'southeast-asia': 'Southeast Asia',
    };
    return names[region];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-sb-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">City Management</h1>
          <p className="text-stone-600">
            Control which cities, activities, and accommodation types are available for each destination
          </p>
        </div>
        <Link
          href="/hub/destinations/cities/new"
          className="flex items-center gap-2 px-4 py-2 bg-sb-orange-500 text-white rounded-lg font-medium hover:bg-sb-orange-600 transition"
        >
          <Plus className="w-4 h-4" />
          Add City
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
          />
        </div>
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value as RegionKey | 'all')}
          className="px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
        >
          <option value="all">All Regions</option>
          <option value="europe">Europe</option>
          <option value="latin-america">Latin America</option>
          <option value="southeast-asia">Southeast Asia</option>
        </select>
      </div>

      {/* Cities List */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {filteredCities.length === 0 ? (
          <div className="p-12 text-center text-stone-500">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-stone-300" />
            <p className="text-lg font-medium mb-2">No cities found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-200">
            {filteredCities.map((city, idx) => (
              <div
                key={`${city.city}-${city.region}-${idx}`}
                className="p-6 hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-stone-900">
                        {city.city}
                      </h3>
                      <span className="text-sm text-stone-600">{city.country}</span>
                      <span className="px-2 py-1 bg-stone-100 text-stone-700 rounded-md text-xs font-medium">
                        {getRegionName(city.region)}
                      </span>
                      {city.enabled ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>

                    <div className="space-y-2 mt-3">
                      <div>
                        <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                          Available Activities ({city.availableActivities?.length || 0}):
                        </span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {(city.availableActivities || []).slice(0, 5).map((activity, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-md"
                            >
                              {activity}
                            </span>
                          ))}
                          {(city.availableActivities || []).length > 5 && (
                            <span className="text-xs px-2 py-1 bg-stone-100 text-stone-600 rounded-md">
                              +{(city.availableActivities || []).length - 5} more
                            </span>
                          )}
                          {(city.availableActivities || []).length === 0 && (
                            <span className="text-xs text-stone-400 italic">None selected</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                          Available Accommodation:
                        </span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {(city.availableAccommodation || []).map((acc, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-md"
                            >
                              {acc}
                            </span>
                          ))}
                          {(city.availableAccommodation || []).length === 0 && (
                            <span className="text-xs text-stone-400 italic">None selected</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCityEnabled(city.id, city.enabled)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                          city.enabled
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {city.enabled ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => router.push(`/hub/destinations/cities/${city.id}`)}
                        className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="text-2xl font-bold text-stone-900">{cities.length}</div>
          <div className="text-sm text-stone-600">Total Cities</div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="text-2xl font-bold text-green-600">
            {cities.filter((c) => c.enabled).length}
          </div>
          <div className="text-sm text-stone-600">Enabled</div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="text-2xl font-bold text-stone-900">
            {new Set(cities.flatMap((c) => c.availableActivities || [])).size}
          </div>
          <div className="text-sm text-stone-600">Unique Activities</div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="text-2xl font-bold text-stone-900">
            {new Set(cities.flatMap((c) => c.availableAccommodation || [])).size}
          </div>
          <div className="text-sm text-stone-600">Accommodation Types</div>
        </div>
      </div>
    </div>
  );
}

