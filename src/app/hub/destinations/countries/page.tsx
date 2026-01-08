'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  Edit,
  Loader2,
  MapPin,
  CheckCircle,
  XCircle,
  Globe,
} from 'lucide-react';
import { RegionKey } from '@/lib/cityPresets';
import { CountryData } from '@/lib/cosmos-countries';
import { CityData } from '@/lib/cosmos-cities';
import { apiUrl } from '@/lib/api';

export default function CountriesManagementPage() {
  const router = useRouter();
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [cities, setCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState<RegionKey | 'all'>('all');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const countriesUrl = apiUrl('countries');
      const citiesUrl = apiUrl('cities');
      
      console.log('[Countries] Fetching from:', countriesUrl);
      console.log('[Countries] Fetching cities from:', citiesUrl);
      
      const [countriesRes, citiesRes] = await Promise.all([
        fetch(countriesUrl),
        fetch(citiesUrl),
      ]);

      console.log('[Countries] Response status:', countriesRes.status);
      console.log('[Cities] Response status:', citiesRes.status);

      if (!countriesRes.ok) {
        const errorText = await countriesRes.text();
        let errorMessage = `Failed to load countries (${countriesRes.status})`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        console.error('[Countries] Error response:', errorText);
        throw new Error(errorMessage);
      }
      
      if (!citiesRes.ok) {
        const errorText = await citiesRes.text();
        let errorMessage = `Failed to load cities (${citiesRes.status})`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        console.error('[Cities] Error response:', errorText);
        throw new Error(errorMessage);
      }

      const countriesData = await countriesRes.json();
      const citiesData = await citiesRes.json();

      console.log('[Countries] Received:', countriesData.countries?.length || 0, 'countries');
      console.log('[Cities] Received:', citiesData.cities?.length || 0, 'cities');

      setCountries(countriesData.countries || []);
      setCities(citiesData.cities || []);
      
      // If we got empty arrays, that's okay - might not have countries yet or CosmosDB not configured
      if ((countriesData.countries?.length || 0) === 0 && (citiesData.cities?.length || 0) === 0) {
        console.log('[Countries] No data found - CosmosDB may not be configured or no countries exist yet');
      }
      
      setErrorMessage('');
    } catch (error: any) {
      console.error('Error loading data:', error);
      const { apiUrl: getApiUrl } = await import('@/lib/api');
      const attemptedUrl = getApiUrl('countries');
      
      // Check if it's a CosmosDB not configured error
      if (error.message?.includes('CosmosDB') || error.message?.includes('not configured')) {
        setErrorMessage('CosmosDB is not configured. Please set COSMOSDB_ENDPOINT and COSMOSDB_KEY environment variables.');
      } else {
        setErrorMessage(`${error.message || 'Failed to load countries'}. URL: ${attemptedUrl}`);
      }
      
      setCountries([]);
      setCities([]);
    } finally {
      setLoading(false);
    }
  }

  function getCountryStats(countryName: string) {
    const countryCities = cities.filter(c => c.country === countryName);
    const mainCities = countryCities.filter(c => !c.isDetour).length;
    const detours = countryCities.filter(c => c.isDetour).length;
    return { total: countryCities.length, mainCities, detours };
  }

  const filteredCountries = countries.filter(country => {
    const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         country.flag.includes(searchTerm);
    const matchesRegion = regionFilter === 'all' || country.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  const groupedByRegion = filteredCountries.reduce((acc, country) => {
    if (!acc[country.region]) {
      acc[country.region] = [];
    }
    acc[country.region].push(country);
    return acc;
  }, {} as Record<RegionKey, CountryData[]>);

  const regionNames: Record<RegionKey, string> = {
    'southeast-asia': 'Southeast Asia',
    'latin-america': 'Latin America',
    'europe': 'Europe',
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
          <h1 className="text-3xl font-bold text-stone-900">Countries</h1>
          <p className="text-stone-600 mt-1">Manage countries and view city statistics</p>
        </div>
        <Link
          href="/hub/destinations/countries/new"
          className="flex items-center gap-2 px-4 py-2 bg-sb-orange-500 text-white rounded-lg font-medium hover:bg-sb-orange-600 transition"
        >
          <Plus className="w-4 h-4" />
          Add Country
        </Link>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search countries..."
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
          <option value="southeast-asia">Southeast Asia</option>
          <option value="latin-america">Latin America</option>
          <option value="europe">Europe</option>
        </select>
      </div>

      {/* Countries List */}
      {Object.keys(groupedByRegion).length === 0 && !errorMessage ? (
        <div className="text-center py-12 bg-stone-50 rounded-lg border border-stone-200">
          <Globe className="w-12 h-12 text-stone-400 mx-auto mb-4" />
          <p className="text-stone-600 font-medium">No countries found</p>
          <p className="text-sm text-stone-500 mt-1">
            {searchTerm ? 'Try adjusting your search' : (
              <>
                Create your first country to get started, or run{' '}
                <code className="bg-stone-200 px-2 py-1 rounded text-xs">npx tsx scripts/populate-countries.ts</code>
                {' '}to populate countries from existing cities
              </>
            )}
          </p>
        </div>
      ) : Object.keys(groupedByRegion).length > 0 ? (
        <div className="space-y-8">
          {(Object.keys(groupedByRegion) as RegionKey[]).map((region) => (
            <div key={region}>
              <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-sb-orange-500" />
                {regionNames[region]}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedByRegion[region].map((country) => {
                  const stats = getCountryStats(country.name);
                  return (
                    <div
                      key={country.id}
                      className="bg-white border border-stone-200 rounded-lg p-5 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{country.flag}</span>
                          <div>
                            <h3 className="font-bold text-stone-900 text-lg">{country.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              {country.enabled ? (
                                <span className="flex items-center gap-1 text-xs text-green-600">
                                  <CheckCircle className="w-3 h-3" />
                                  Enabled
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-xs text-red-600">
                                  <XCircle className="w-3 h-3" />
                                  Disabled
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Link
                          href={`/hub/destinations/countries/${country.id}`}
                          className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-stone-600" />
                        </Link>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-100">
                        <div className="text-center">
                          <div className="text-lg font-bold text-stone-900">{stats.total}</div>
                          <div className="text-xs text-stone-500">Total</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-stone-900">{stats.mainCities}</div>
                          <div className="text-xs text-stone-500">Cities</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-sb-teal-600">{stats.detours}</div>
                          <div className="text-xs text-stone-500">Detours</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
