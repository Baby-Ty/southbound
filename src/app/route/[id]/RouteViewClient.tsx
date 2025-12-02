'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  MapPin,
  Calendar,
  Loader2,
  XCircle,
} from 'lucide-react';
import { SavedRoute } from '@/lib/cosmos';
import { apiUrl } from '@/lib/api';

export default function RouteViewClient() {
  const params = useParams();
  const routeId = params?.id as string;
  
  const [route, setRoute] = useState<SavedRoute | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (routeId) {
      loadRoute(routeId);
    }
  }, [routeId]);

  async function loadRoute(routeId: string) {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(apiUrl(`routes/${routeId}`));
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Route not found');
        } else {
          throw new Error('Failed to load route');
        }
        return;
      }
      
      const data = await response.json();
      setRoute(data.route);
    } catch (err: any) {
      console.error('Error loading route:', err);
      setError(err.message || 'Failed to load route');
    } finally {
      setLoading(false);
    }
  }

  const getRegionName = (region: string) => {
    const names: Record<string, string> = {
      europe: 'Europe',
      'latin-america': 'Latin America',
      'southeast-asia': 'Southeast Asia',
    };
    return names[region] || region;
  };

  const getTotalWeeks = (stops: SavedRoute['stops']) => {
    return stops.reduce((acc, stop) => acc + (stop.weeks || 0), 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-sb-orange-500" />
      </div>
    );
  }

  if (error || !route) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl border border-red-200 p-6 text-center">
          <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-lg font-medium text-red-900 mb-2">
            {error || 'Route not found'}
          </p>
          <p className="text-sm text-red-700 mb-4">
            The route you're looking for doesn't exist or has been deleted.
          </p>
          <Link
            href="/route-builder"
            className="inline-flex items-center gap-2 text-sb-orange-600 hover:text-sb-orange-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Create a new route
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-2">
            {route.name || 'My Travel Route'}
          </h1>
          <p className="text-stone-600">
            {getRegionName(route.region)} • {getTotalWeeks(route.stops)} weeks • {route.stops.length} stops
          </p>
        </div>

        {/* Route Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">Contact Information</h2>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-stone-400" />
              <span className="text-stone-700">{route.email}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">Route Summary</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-stone-400" />
                <span className="text-stone-700">{route.stops.length} stops</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-stone-400" />
                <span className="text-stone-700">{getTotalWeeks(route.stops)} weeks total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-stone-900 mb-4">Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-stone-600 mb-2">Lifestyle</h3>
              <div className="flex flex-wrap gap-2">
                {route.preferences.lifestyle?.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-stone-100 text-stone-700 rounded-md text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-stone-600 mb-2">Work Setup</h3>
              <div className="flex flex-wrap gap-2">
                {route.preferences.workSetup?.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-stone-100 text-stone-700 rounded-md text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-stone-600 mb-2">Travel Style</h3>
              <span className="px-2 py-1 bg-stone-100 text-stone-700 rounded-md text-sm">
                {route.preferences.travelStyle}
              </span>
            </div>
          </div>
        </div>

        {/* Stops */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="text-lg font-semibold text-stone-900 mb-4">Route Stops</h2>
          <div className="space-y-4">
            {route.stops.map((stop, index) => (
              <div
                key={stop.id}
                className="border border-stone-200 rounded-lg p-4"
              >
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-stone-900">
                    {index + 1}. {stop.city}, {stop.country}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-stone-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {stop.weeks} {stop.weeks === 1 ? 'week' : 'weeks'}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg">
                        {stop.budgetCoins === 1 ? '💰' : stop.budgetCoins === 2 ? '💰💰' : '💰💰💰'}
                      </span>
                      Budget
                    </div>
                  </div>
                </div>

                {stop.tags && stop.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {stop.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {stop.highlights && (
                  <div className="space-y-3 mt-4 pt-4 border-t border-stone-200">
                    {stop.highlights.accommodation && (
                      <div>
                        <h4 className="text-sm font-medium text-stone-700 mb-1">Accommodation</h4>
                        <p className="text-sm text-stone-600">{stop.highlights.accommodation}</p>
                      </div>
                    )}
                    
                    {stop.highlights.activities && stop.highlights.activities.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-stone-700 mb-1">Activities</h4>
                        <ul className="list-disc list-inside text-sm text-stone-600 space-y-1">
                          {stop.highlights.activities.map((activity, idx) => (
                            <li key={idx}>{activity}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {stop.highlights.places && Array.isArray(stop.highlights.places) && stop.highlights.places.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-stone-700 mb-1">Places to Visit</h4>
                        <ul className="list-disc list-inside text-sm text-stone-600 space-y-1">
                          {stop.highlights.places.map((place, idx) => {
                            const placeName = typeof place === 'string' ? place : place.title;
                            return <li key={idx}>{placeName}</li>;
                          })}
                        </ul>
                      </div>
                    )}

                    {stop.highlights.notes && (
                      <div>
                        <h4 className="text-sm font-medium text-stone-700 mb-1">Notes</h4>
                        <p className="text-sm text-stone-600">{stop.highlights.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {route.notes && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 mt-6">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">Notes</h2>
            <p className="text-sm text-stone-600 whitespace-pre-wrap">{route.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

