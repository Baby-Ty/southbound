'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Loader2,
  MapPin,
  Calendar,
  Plane,
  ArrowLeft,
  Check,
  Edit,
  Share2,
} from 'lucide-react';
import { SavedRoute } from '@/lib/cosmos';
import EnhancedCityCard, { StopPlan, HighlightItem } from '@/components/RouteBuilder/EnhancedCityCard';
import { CITY_PRESETS, RegionKey, CityPreset } from '@/lib/cityPresets';

export default function RouteViewPage() {
  const params = useParams();
  const router = useRouter();
  const routeId = params.id as string;

  const [route, setRoute] = useState<SavedRoute | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadRoute() {
      try {
        const { apiUrl } = await import('@/lib/api');
        const response = await fetch(apiUrl(`routes/${routeId}`));
        if (!response.ok) {
          if (response.status === 404) {
            setError('Route not found');
          } else {
            setError('Failed to load route');
          }
          return;
        }

        const data = await response.json();
        setRoute(data.route);
      } catch (err) {
        setError('Failed to load route');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (routeId) {
      loadRoute();
    }
  }, [routeId]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sb-beige-50 to-sb-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-sb-teal-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your route...</p>
        </div>
      </div>
    );
  }

  if (error || !route) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sb-beige-50 to-sb-teal-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">🗺️</div>
          <h1 className="text-2xl font-bold text-sb-navy-700 mb-2">Route Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'This route does not exist or has been deleted.'}</p>
          <Link
            href="/route-builder"
            className="inline-flex items-center gap-2 px-6 py-3 bg-sb-teal-500 text-white rounded-xl font-medium hover:bg-sb-teal-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Create New Route
          </Link>
        </div>
      </div>
    );
  }

  const region = route.region as RegionKey;
  const totalWeeks = route.stops.reduce((acc, stop) => acc + (stop.weeks || 0), 0);

  return (
    <div className="min-h-screen bg-sb-beige-100 pb-20 relative pattern-map-lines">
      {/* Immersive Hero Header */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-sb-navy-900 via-sb-navy-800 to-sb-navy-900">
        <div className="absolute inset-0 -z-10 opacity-80 mix-blend-screen"
          style={{
            backgroundImage: 'radial-gradient(68% 58% at 80% 18%, rgba(74, 189, 198, 0.32) 0%, rgba(74, 189, 198, 0) 70%), radial-gradient(74% 60% at 22% 82%, rgba(255, 160, 105, 0.28) 0%, rgba(255, 160, 105, 0) 78%)',
            backgroundPosition: '80% 20%, 18% 82%',
            backgroundRepeat: 'no-repeat, no-repeat'
          }}
        />
        <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/route-builder"
                className="flex items-center gap-2 text-white/80 hover:text-white transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Builder</span>
              </Link>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg text-sm font-medium text-white/90 hover:bg-white/10 transition backdrop-blur-sm"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                {route.status === 'draft' && (
                  <Link
                    href={`/trip-options?region=${route.region}`}
                    className="flex items-center gap-2 px-4 py-2 bg-sb-orange-500 text-white rounded-lg text-sm font-medium hover:bg-sb-orange-600 transition shadow-lg"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Route
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-sb-orange-500/20 backdrop-blur-sm border border-sb-orange-400/30 text-sb-orange-100 rounded-full text-xs font-bold uppercase">
                {route.status}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
              Your {route.region === 'europe' ? 'Europe' : route.region === 'southeast-asia' ? 'Southeast Asia' : 'Latin America'} Adventure
            </h1>
            <p className="text-white/80 text-lg">
              Created {new Date(route.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        {/* Passport-Style Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-adventure rounded-3xl shadow-xl border-2 border-sb-orange-200/50 p-8 mb-8 relative overflow-hidden texture-paper"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-sb-orange-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-sb-teal-500/5 rounded-full blur-2xl"></div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
            <div className="group">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-sb-orange-600" />
                <div className="text-xs font-bold text-sb-navy-600 uppercase tracking-wide">
                  Destinations
                </div>
              </div>
              <div className="text-3xl font-bold text-sb-navy-700 group-hover:text-sb-orange-600 transition-colors">{route.stops.length}</div>
            </div>
            <div className="group">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-sb-teal-600" />
                <div className="text-xs font-bold text-sb-navy-600 uppercase tracking-wide">
                  Duration
                </div>
              </div>
              <div className="text-3xl font-bold text-sb-navy-700 group-hover:text-sb-teal-600 transition-colors">{totalWeeks} weeks</div>
            </div>
            <div className="group">
              <div className="flex items-center gap-2 mb-2">
                <Plane className="w-4 h-4 text-sb-orange-600" />
                <div className="text-xs font-bold text-sb-navy-600 uppercase tracking-wide">
                  Travel Style
                </div>
              </div>
              <div className="text-xl font-bold text-sb-navy-700 capitalize group-hover:text-sb-orange-600 transition-colors">
                {route.preferences.travelStyle.replace('-', ' ')}
              </div>
            </div>
            <div className="group">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-sb-teal-600" />
                <div className="text-xs font-bold text-sb-navy-600 uppercase tracking-wide">
                  Status
                </div>
              </div>
              <div className="text-xl font-bold text-sb-navy-700 capitalize group-hover:text-sb-teal-600 transition-colors">
                {route.status.replace('-', ' ')}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Route Stops */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-sb-navy-700 flex items-center gap-3">
            <MapPin className="w-6 h-6 text-sb-orange-500" />
            Your Itinerary
          </h2>

          {route.stops.map((stop, index) => {
            const cityPreset = (CITY_PRESETS[region] || []).find(
              (c) => c.city === stop.city
            ) as CityPreset | undefined;

            return (
              <div key={stop.id}>
                {index > 0 && (
                  <div className="py-6 flex flex-col items-center justify-center text-center relative">
                    <div className="h-12 w-0.5 bg-gradient-to-b from-transparent via-sb-orange-400/40 to-transparent mb-3 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-sb-orange-500 border-2 border-sb-beige-100"></div>
                    </div>
                    <div className="bg-gradient-to-r from-sb-orange-500 to-sb-teal-500 px-5 py-2.5 rounded-full text-xs font-bold text-white uppercase tracking-wide flex items-center gap-2 shadow-lg backdrop-blur-sm border border-white/20">
                      <Plane className="w-3.5 h-3.5" />
                      Flight to {stop.city}
                    </div>
                    <div className="h-12 w-0.5 bg-gradient-to-b from-transparent via-sb-teal-400/40 to-transparent mt-3 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-sb-teal-500 border-2 border-sb-beige-100"></div>
                    </div>
                  </div>
                )}
                <EnhancedCityCard
                  stop={{
                    ...stop,
                    highlights: {
                      ...stop.highlights,
                      places: (() => {
                        const places = stop.highlights.places;
                        if (Array.isArray(places) && places.length > 0 && typeof places[0] === 'string') {
                          return (places as string[]).map((p): HighlightItem => ({ title: p }));
                        }
                        return places as HighlightItem[];
                      })()
                    }
                  }}
                  cityPreset={cityPreset}
                  index={index}
                  isEditing={false}
                  onEdit={() => {}}
                  onStopEdit={() => {}}
                  onRemove={() => {}}
                  onSwap={() => {}}
                  onUpdate={() => {}}
                />
              </div>
            );
          })}
        </div>

        {/* Submit for Review CTA */}
        {route.status === 'draft' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-sb-orange-500 to-sb-teal-500 rounded-3xl p-8 text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-2">Ready to Make This Real?</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Submit your route for review and our team will help arrange everything - accommodation, coworking spaces, SIM cards, and more!
            </p>
            <a
              href={`https://wa.me/27872500972?text=Hi%2C%20I%27d%20like%20to%20submit%20my%20route%20for%20review.%20Route%20ID%3A%20${routeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-sb-navy-700 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg"
            >
              <Check className="w-5 h-5" />
              Submit for Review
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}

