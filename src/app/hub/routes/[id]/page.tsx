'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  MessageCircle,
  Calendar,
  MapPin,
  Loader2,
  Save,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Eye,
  User,
} from 'lucide-react';
import { SavedRoute } from '@/lib/cosmos';
import EnhancedCityCard, { StopPlan } from '@/components/RouteBuilder/EnhancedCityCard';
import { CITY_PRESETS, RegionKey, CityPreset } from '@/lib/cityPresets';

const STATUS_OPTIONS: SavedRoute['status'][] = ['draft', 'submitted', 'in-review', 'confirmed'];

const STATUS_COLORS: Record<SavedRoute['status'], string> = {
  draft: 'bg-gray-100 text-gray-700 border-gray-300',
  submitted: 'bg-blue-100 text-blue-700 border-blue-300',
  'in-review': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  confirmed: 'bg-green-100 text-green-700 border-green-300',
};

export default function RouteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const routeId = params.id as string;

  const [route, setRoute] = useState<SavedRoute | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [status, setStatus] = useState<SavedRoute['status']>('draft');

  useEffect(() => {
    loadRoute();
  }, [routeId]);

  async function loadRoute() {
    try {
      setLoading(true);
      const { apiUrl } = await import('@/lib/api');
      const response = await fetch(apiUrl(`routes/${routeId}`));
      if (!response.ok) throw new Error('Failed to load route');
      
      const data = await response.json();
      setRoute(data.route);
      setStatus(data.route.status);
      setAdminNotes(data.route.adminNotes || '');
    } catch (error) {
      console.error('Error loading route:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateRoute() {
    try {
      setSaving(true);
      const { apiUrl } = await import('@/lib/api');
      const response = await fetch(apiUrl(`routes/${routeId}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          adminNotes,
        }),
      });

      if (!response.ok) throw new Error('Failed to update route');
      
      const data = await response.json();
      setRoute(data.route);
      alert('Route updated successfully!');
    } catch (error) {
      console.error('Error updating route:', error);
      alert('Failed to update route');
    } finally {
      setSaving(false);
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

  const getWhatsAppLink = (email: string) => {
    // Extract phone number if email format is phone@whatsapp
    if (email.includes('@whatsapp')) {
      const phone = email.replace('@whatsapp', '');
      return `https://wa.me/${phone.replace(/\D/g, '')}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-sb-orange-500" />
      </div>
    );
  }

  if (!route) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-600 mb-4">Route not found</p>
        <Link
          href="/hub/routes"
          className="text-sb-orange-500 hover:underline"
        >
          Back to Routes
        </Link>
      </div>
    );
  }

  const region = route.region as RegionKey;
  const whatsappLink = getWhatsAppLink(route.email);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/hub/routes"
            className="p-2 hover:bg-stone-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 text-stone-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Route Details</h1>
            <p className="text-stone-600 mt-1">Review and manage this route</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Route Info Card */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold border ${STATUS_COLORS[status]}`}
                  >
                    {status.replace('-', ' ')}
                  </span>
                  <span className="text-lg font-semibold text-stone-900">
                    {getRegionName(route.region)}
                  </span>
                </div>
                <p className="text-sm text-stone-600">
                  Created {new Date(route.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200">
              <div>
                <div className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-1">
                  Destinations
                </div>
                <div className="text-2xl font-bold text-stone-900">{route.stops.length}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-1">
                  Duration
                </div>
                <div className="text-2xl font-bold text-stone-900">
                  {getTotalWeeks(route.stops)} weeks
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-1">
                  Travel Style
                </div>
                <div className="text-lg font-bold text-stone-900 capitalize">
                  {route.preferences.travelStyle.replace('-', ' ')}
                </div>
              </div>
            </div>
          </div>

          {/* Route Stops */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h2 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sb-orange-500" />
              Itinerary
            </h2>
            <div className="space-y-4">
              {route.stops.map((stop, index) => {
                const cityPreset = (CITY_PRESETS[region] || []).find(
                  (c) => c.city === stop.city
                ) as CityPreset | undefined;

                return (
                  <div key={stop.id}>
                    {index > 0 && (
                      <div className="py-4 flex items-center justify-center">
                        <div className="h-px w-full bg-stone-200"></div>
                      </div>
                    )}
                    <EnhancedCityCard
                      stop={{
                        ...stop,
                        highlights: {
                          ...stop.highlights,
                          places: Array.isArray(stop.highlights.places) && stop.highlights.places.length > 0 && typeof stop.highlights.places[0] === 'string'
                            ? stop.highlights.places.map((p: string) => ({ title: p }))
                            : stop.highlights.places
                        }
                      } as any}
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
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-4">Contact</h3>
            <div className="space-y-3">
              {route.name && (
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-stone-400" />
                  <div>
                    <div className="text-xs text-stone-500 mb-1">Name</div>
                    <div className="text-sm font-medium text-stone-900">
                      {route.name}
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-stone-400" />
                <div>
                  <div className="text-xs text-stone-500 mb-1">Email</div>
                  <a
                    href={`mailto:${route.email}`}
                    className="text-sm font-medium text-sb-orange-500 hover:underline"
                  >
                    {route.email.replace('@whatsapp', '')}
                  </a>
                </div>
              </div>
              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition"
                >
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-xs text-stone-500 mb-1">WhatsApp</div>
                    <div className="text-sm font-medium text-green-700">Send Message</div>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-4">Preferences</h3>
            <div className="space-y-4">
              {route.preferences.lifestyle.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">
                    Lifestyle
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {route.preferences.lifestyle.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-stone-100 text-stone-700 rounded-md text-xs font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {route.preferences.workSetup.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">
                    Work Setup
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {route.preferences.workSetup.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-stone-100 text-stone-700 rounded-md text-xs font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Admin Actions */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-4">Manage Route</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as SavedRoute['status'])}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Admin Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  placeholder="Add internal notes about this route..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                />
              </div>

              <button
                onClick={updateRoute}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-sb-orange-500 text-white rounded-lg font-medium hover:bg-sb-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
          </div>

          {/* View Public Route */}
          <div className="bg-stone-50 rounded-xl border border-stone-200 p-4">
            <Link
              href={`/route/${routeId}`}
              target="_blank"
              className="flex items-center gap-2 text-sm font-medium text-sb-orange-500 hover:underline"
            >
              <Eye className="w-4 h-4" />
              View Public Route Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

