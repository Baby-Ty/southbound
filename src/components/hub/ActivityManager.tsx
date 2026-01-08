'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Search,
  Loader2,
  Star,
  StarOff,
  RefreshCw,
  CheckCircle,
  X,
  Filter,
  ExternalLink,
  MapPin,
  Clock,
  Info,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { TripAdvisorActivity } from '@/lib/tripadvisor';
import { apiUrl } from '@/lib/api';
import ActivityDetailsModal from '@/components/RouteBuilder/ActivityDetailsModal';

interface ActivityManagerProps {
  cityId: string;
  cityName: string;
  countryName: string;
  initialActivities?: TripAdvisorActivity[];
  onActivitiesUpdate?: (activities: TripAdvisorActivity[]) => void;
}

export default function ActivityManager({
  cityId,
  cityName,
  countryName,
  initialActivities = [],
  onActivitiesUpdate,
}: ActivityManagerProps) {
  const [activities, setActivities] = useState<TripAdvisorActivity[]>(initialActivities);
  const [loading, setLoading] = useState(false);
  const [pulling, setPulling] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDefault, setFilterDefault] = useState<'all' | 'default' | 'non-default'>('all');
  const [filterCurated, setFilterCurated] = useState<'all' | 'curated' | 'non-curated'>('all');
  const [lastSynced, setLastSynced] = useState<string | null>(
    activities[0]?.lastSynced || null
  );
  const [selectedActivity, setSelectedActivity] = useState<TripAdvisorActivity | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [fetchedPages, setFetchedPages] = useState<Set<number>>(new Set());
  const [pullingPage, setPullingPage] = useState<number | null>(null);

  useEffect(() => {
    loadActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityId]);

  async function loadActivities() {
    try {
      setLoading(true);
      const response = await fetch(apiUrl(`cities/${cityId}/activities`));
      if (response.ok) {
        const data = await response.json();
        const loadedActivities = data.activities || [];
        setActivities(loadedActivities);
        if (loadedActivities.length > 0 && loadedActivities[0]?.lastSynced) {
          setLastSynced(loadedActivities[0].lastSynced);
        }
        if (onActivitiesUpdate) {
          onActivitiesUpdate(data.activities || []);
        }
      }
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  }

  async function pullActivities(page: number = 1) {
    try {
      setPulling(true);
      setPullingPage(page);
      const response = await fetch(apiUrl(`cities/${cityId}/activities/pull`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          limit: 30, 
          replace: false,
          page: page,
          itemsPerPage: 30
        }),
      });

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      const responseText = await response.text();
      
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Non-JSON response:', {
          contentType,
          status: response.status,
          statusText: response.statusText,
          body: responseText.substring(0, 500),
        });
        throw new Error(`Server returned ${contentType || 'non-JSON'} response. Status: ${response.status}. Check server logs.`);
      }

      if (response.ok) {
        if (!responseText || responseText.trim() === '') {
          throw new Error('Server returned empty response');
        }
        
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError: any) {
          console.error('JSON parse error:', {
            parseError: parseError.message,
            responseText: responseText.substring(0, 500),
          });
          throw new Error(`Failed to parse JSON response: ${parseError.message}`);
        }
        setActivities(data.activities || []);
        setLastSynced(new Date().toISOString());
        setFetchedPages(prev => new Set(prev).add(page));
        if (onActivitiesUpdate) {
          onActivitiesUpdate(data.activities || []);
        }
      } else {
        // Try to parse error JSON from the already-read responseText
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If error response isn't JSON, use the responseText we already have
          errorMessage = responseText || errorMessage;
        }
        alert(errorMessage || 'Failed to pull activities');
      }
    } catch (error: any) {
      console.error('Error pulling activities:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        response: error.response,
      });
      
      // Show more detailed error message
      let errorMessage = 'Failed to pull activities';
      if (error.message) {
        errorMessage += ': ' + error.message;
      } else if (error.toString) {
        errorMessage += ': ' + error.toString();
      }
      
      alert(errorMessage);
    } finally {
      setPulling(false);
      setPullingPage(null);
    }
  }

  async function toggleDefault(activity: TripAdvisorActivity) {
    try {
      const newDefaultStatus = !activity.isDefault;
      
      // Check if we're trying to mark a 3rd activity as default
      if (newDefaultStatus && defaultCount >= 2) {
        const confirmed = confirm(
          `You already have 2 default activities selected. Setting this as default will automatically unmark the oldest default activity. Continue?`
        );
        if (!confirmed) {
          return;
        }
      }
      
      const response = await fetch(
        apiUrl(`cities/${cityId}/activities?locationId=${activity.locationId}`),
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isDefault: newDefaultStatus }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
        if (onActivitiesUpdate) {
          onActivitiesUpdate(data.activities || []);
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update default status');
      }
    } catch (error) {
      console.error('Error toggling default:', error);
      alert('Failed to update default status');
    }
  }

  async function toggleCurated(activity: TripAdvisorActivity) {
    try {
      const newCuratedStatus = !activity.isCurated;
      
      const response = await fetch(
        apiUrl(`cities/${cityId}/activities?locationId=${activity.locationId}`),
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isCurated: newCuratedStatus }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
        if (onActivitiesUpdate) {
          onActivitiesUpdate(data.activities || []);
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update curated status');
      }
    } catch (error) {
      console.error('Error toggling curated:', error);
      alert('Failed to update curated status');
    }
  }

  async function removeActivity(locationId: string) {
    if (!confirm('Are you sure you want to remove this activity?')) {
      return;
    }

    try {
      const response = await fetch(
        apiUrl(`cities/${cityId}/activities?locationId=${locationId}`),
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
        if (onActivitiesUpdate) {
          onActivitiesUpdate(data.activities || []);
        }
      }
    } catch (error) {
      console.error('Error removing activity:', error);
    }
  }

  const filteredActivities = (activities || []).filter((activity) => {
    if (!activity || !activity.name) return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !activity.name.toLowerCase().includes(query) &&
        !activity.description?.toLowerCase().includes(query) &&
        !activity.category?.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    // Filter by default status
    if (filterDefault === 'default' && !activity.isDefault) {
      return false;
    }
    if (filterDefault === 'non-default' && activity.isDefault) {
      return false;
    }

    // Filter by curated status
    if (filterCurated === 'curated' && !activity.isCurated) {
      return false;
    }
    if (filterCurated === 'non-curated' && activity.isCurated) {
      return false;
    }

    return true;
  });

  const defaultCount = (activities || []).filter((a) => a?.isDefault).length;
  const curatedCount = (activities || []).filter((a) => a?.isCurated).length;

  // Pagination logic
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedActivities = filteredActivities.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterDefault, filterCurated]);

  function openActivityDetails(activity: TripAdvisorActivity) {
    setSelectedActivity(activity);
    setShowDetailsModal(true);
  }

  function closeActivityDetails() {
    setShowDetailsModal(false);
    setSelectedActivity(null);
  }

  return (
    <>
      <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-stone-900">TripAdvisor Activities</h3>
          <p className="text-sm text-stone-500">
            {(activities || []).length} activities
            {defaultCount > 0 && (
              <span className={defaultCount >= 2 ? 'font-semibold text-green-600' : ''}>
                {' • '}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sb-orange-50 text-sb-orange-700 border border-sb-orange-200">
                  {defaultCount}/2 defaults
                </span>
              </span>
            )}
            {curatedCount > 0 && (
              <span className="ml-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sb-teal-50 text-sb-teal-700 border border-sb-teal-200">
                  {curatedCount} curated
                </span>
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {lastSynced && (
            <span className="text-xs text-stone-500">
              Last synced: {new Date(lastSynced).toLocaleDateString()}
            </span>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500">Fetch page:</span>
            {[1, 2, 3, 4, 5].map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => pullActivities(pageNum)}
                disabled={pulling || (pullingPage !== null && pullingPage !== pageNum)}
                className={`px-3 py-1.5 text-sm rounded-lg transition ${
                  fetchedPages.has(pageNum)
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-sb-orange-500 text-white hover:bg-sb-orange-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={fetchedPages.has(pageNum) ? `Page ${pageNum} already fetched` : `Fetch page ${pageNum} from TripAdvisor`}
              >
                {pullingPage === pageNum ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : fetchedPages.has(pageNum) ? (
                  `✓ ${pageNum}`
                ) : (
                  pageNum
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
          />
        </div>
        <select
          value={filterDefault}
          onChange={(e) => setFilterDefault(e.target.value as any)}
          className="px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
        >
          <option value="all">All Activities</option>
          <option value="default">Default Only</option>
          <option value="non-default">Non-Default Only</option>
        </select>
        <select
          value={filterCurated}
          onChange={(e) => setFilterCurated(e.target.value as any)}
          className="px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-teal-400 focus:border-transparent"
        >
          <option value="all">All</option>
          <option value="curated">Curated Gallery</option>
          <option value="non-curated">Not Curated</option>
        </select>
      </div>

      {/* Activities Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-sb-orange-500" />
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="text-center py-12 bg-stone-50 rounded-lg border border-stone-200">
          <p className="text-stone-500">
            {(!activities || activities.length === 0)
              ? 'No activities yet. Click "Pull from TripAdvisor" to fetch activities.'
              : 'No activities match your filters.'}
          </p>
        </div>
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedActivities.map((activity) => (
            <div
              key={activity.locationId}
              className={`bg-white rounded-lg border-2 overflow-hidden transition-all ${
                activity.isDefault
                  ? 'border-sb-orange-400 shadow-md'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              {/* Image */}
              <div className="relative h-48 bg-stone-100">
                {activity.images && activity.images.length > 0 ? (
                  <Image
                    src={activity.images[0]}
                    alt={activity.name}
                    fill
                    className="object-cover"
                    unoptimized
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400">
                    <MapPin className="w-12 h-12" />
                  </div>
                )}
                {activity.isDefault && (
                  <div className="absolute top-2 left-2 bg-sb-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Default
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-stone-900 text-sm line-clamp-2 flex-1">
                    {activity.name}
                  </h4>
                  {activity.webUrl && (
                    <a
                      href={activity.webUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sb-orange-500 hover:text-sb-orange-600 shrink-0"
                      title="View on TripAdvisor"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {activity.description && (
                  <p className="text-xs text-stone-600 line-clamp-2">
                    {activity.description}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex items-center gap-3 text-xs text-stone-500">
                  {activity.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{activity.rating.toFixed(1)}</span>
                    </div>
                  )}
                  {activity.reviewCount && (
                    <span>({activity.reviewCount.toLocaleString()} reviews)</span>
                  )}
                  {activity.category && (
                    <span className="px-2 py-0.5 bg-stone-100 rounded">
                      {activity.category}
                    </span>
                  )}
                </div>

                {activity.address && (
                  <div className="flex items-start gap-1 text-xs text-stone-500">
                    <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                    <span className="line-clamp-1">
                      {[
                        activity.address.street,
                        activity.address.city,
                        activity.address.country,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openActivityDetails(activity)}
                      className="px-3 py-1.5 border border-stone-300 rounded text-xs font-medium hover:bg-stone-50 transition flex items-center gap-1"
                    >
                      <Info className="w-3 h-3" />
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => removeActivity(activity.locationId)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded transition"
                      title="Remove activity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleDefault(activity)}
                      className={`flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition ${
                        activity.isDefault
                          ? 'bg-sb-orange-50 text-sb-orange-700 hover:bg-sb-orange-100 border border-sb-orange-200'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {activity.isDefault ? (
                        <>
                          <Star className="w-3 h-3 fill-current" />
                          Default
                        </>
                      ) : (
                        <>
                          <Star className="w-3 h-3" />
                          Set Default
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleCurated(activity)}
                      className={`flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition ${
                        activity.isCurated
                          ? 'bg-sb-teal-50 text-sb-teal-700 hover:bg-sb-teal-100 border border-sb-teal-200'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {activity.isCurated ? (
                        <>
                          <Sparkles className="w-3 h-3" />
                          Curated
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3" />
                          Add to Gallery
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-stone-200">
            <div className="text-sm text-stone-500">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredActivities.length)} of {filteredActivities.length} activities
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 border border-stone-300 rounded-lg text-sm font-medium hover:bg-stone-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        currentPage === pageNum
                          ? 'bg-sb-orange-500 text-white'
                          : 'border border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 border border-stone-300 rounded-lg text-sm font-medium hover:bg-stone-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        </>
      )}
      </div>

      {/* Activity Details Modal */}
      {showDetailsModal && selectedActivity && (
        <ActivityDetailsModal
          activity={selectedActivity}
          cityId={cityId}
          isOpen={showDetailsModal}
          onClose={closeActivityDetails}
          allowAIGeneration={true} // Allow AI generation in admin context
          onActivitySaved={loadActivities} // Refresh activities list after saving
        />
      )}
    </>
  );
}

