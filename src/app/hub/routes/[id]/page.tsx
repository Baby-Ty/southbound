'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  Edit,
  Trash2,
  Save,
  X,
} from 'lucide-react';
import { SavedRoute } from '@/lib/cosmos';
import { apiUrl } from '@/lib/api';

const STATUS_COLORS: Record<SavedRoute['status'], string> = {
  draft: 'bg-gray-100 text-gray-700',
  submitted: 'bg-blue-100 text-blue-700',
  'in-review': 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
};

const STATUS_ICONS: Record<SavedRoute['status'], typeof CheckCircle> = {
  draft: Clock,
  submitted: AlertCircle,
  'in-review': Clock,
  confirmed: CheckCircle,
};

export default function RouteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const routeId = params?.id as string;

  const [route, setRoute] = useState<SavedRoute | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<SavedRoute['status']>('draft');
  const [isSaving, setIsSaving] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  useEffect(() => {
    if (routeId) {
      loadRoute();
    }
  }, [routeId]);

  async function loadRoute() {
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
      setNewStatus(data.route.status);
      setAdminNotes(data.route.adminNotes || '');
    } catch (err: any) {
      console.error('Error loading route:', err);
      setError(err.message || 'Failed to load route');
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus() {
    if (!route) return;
    
    try {
      setIsSaving(true);
      const response = await fetch(apiUrl(`routes/${routeId}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: adminNotes,
        }),
      });

      if (!response.ok) throw new Error('Failed to update route');

      const data = await response.json();
      setRoute(data.route);
      setIsEditingStatus(false);
    } catch (err: any) {
      console.error('Error updating route:', err);
      alert('Failed to update route: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this route?')) return;

    try {
      const response = await fetch(apiUrl(`routes/${routeId}`), {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete route');

      router.push('/hub/routes');
    } catch (err: any) {
      console.error('Error deleting route:', err);
      alert('Failed to delete route: ' + err.message);
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
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-sb-orange-500" />
      </div>
    );
  }

  if (error || !route) {
    return (
      <div className="space-y-4">
        <Link
          href="/hub/routes"
          className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Routes
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-lg font-medium text-red-900 mb-2">
            {error || 'Route not found'}
          </p>
          <p className="text-sm text-red-700">
            The route you're looking for doesn't exist or has been deleted.
          </p>
        </div>
      </div>
    );
  }

  const StatusIcon = STATUS_ICONS[route.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <Link
            href="/hub/routes"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Routes
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${STATUS_COLORS[route.status]}`}
            >
              <StatusIcon className="w-4 h-4" />
              {route.status.replace('-', ' ')}
            </span>
            <span className="text-sm font-medium text-stone-600">
              {getRegionName(route.region)}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">
            {route.name || 'Untitled Route'}
          </h1>
          <p className="text-stone-600">
            Created {new Date(route.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isEditingStatus ? (
            <>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as SavedRoute['status'])}
                className="px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="in-review">In Review</option>
                <option value="confirmed">Confirmed</option>
              </select>
              <button
                onClick={updateStatus}
                disabled={isSaving}
                className="px-4 py-2 bg-sb-orange-500 text-white rounded-lg hover:bg-sb-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditingStatus(false);
                  setNewStatus(route.status);
                }}
                className="px-4 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditingStatus(true)}
                className="px-4 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Status
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Route Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="text-lg font-semibold text-stone-900 mb-4">Contact Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-stone-400" />
              <span className="text-stone-700">{route.email}</span>
            </div>
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
      <div className="bg-white rounded-xl border border-stone-200 p-6">
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
              className="border border-stone-200 rounded-lg p-4 hover:bg-stone-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
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
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-stone-900">Notes</h2>
          {!isEditingNotes && (
            <button
              onClick={() => setIsEditingNotes(true)}
              className="px-3 py-1.5 text-sm bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>
        
        {isEditingNotes ? (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                User Notes
              </label>
              <textarea
                value={route.notes || ''}
                readOnly
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent bg-stone-50"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Admin Notes
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                rows={4}
                placeholder="Add admin notes here..."
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  await updateStatus();
                  setIsEditingNotes(false);
                }}
                disabled={isSaving}
                className="px-4 py-2 bg-sb-orange-500 text-white rounded-lg hover:bg-sb-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Notes
              </button>
              <button
                onClick={() => {
                  setIsEditingNotes(false);
                  setAdminNotes(route.adminNotes || '');
                }}
                className="px-4 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {route.notes && (
              <div>
                <h3 className="text-sm font-medium text-stone-700 mb-2">User Notes</h3>
                <p className="text-sm text-stone-600 whitespace-pre-wrap">{route.notes}</p>
              </div>
            )}
            {route.adminNotes && (
              <div>
                <h3 className="text-sm font-medium text-stone-700 mb-2">Admin Notes</h3>
                <p className="text-sm text-stone-600 whitespace-pre-wrap">{route.adminNotes}</p>
              </div>
            )}
            {!route.notes && !route.adminNotes && (
              <p className="text-sm text-stone-500 italic">No notes added yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
