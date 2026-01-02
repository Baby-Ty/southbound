'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  Search,
  Star,
  Plus,
  Check,
  Loader2,
  ExternalLink,
  MapPin,
  Filter,
  Info,
} from 'lucide-react';
import { TripAdvisorActivity } from '@/lib/tripadvisor';
import { apiUrl } from '@/lib/api';
import ActivityDetailsModal from './ActivityDetailsModal';

interface ActivityPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  cityId: string;
  cityName: string;
  countryName: string;
  selectedActivityIds: string[]; // locationIds of selected activities
  onActivitiesChange: (activityIds: string[]) => void;
}

export default function ActivityPickerModal({
  isOpen,
  onClose,
  cityId,
  cityName,
  countryName,
  selectedActivityIds,
  onActivitiesChange,
}: ActivityPickerModalProps) {
  const [activities, setActivities] = useState<TripAdvisorActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchingTripAdvisor, setSearchingTripAdvisor] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<TripAdvisorActivity[]>([]);
  const [filterDefault, setFilterDefault] = useState<'all' | 'default' | 'non-default'>('all');
  const [selectedActivity, setSelectedActivity] = useState<TripAdvisorActivity | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    if (isOpen && cityId) {
      loadActivities();
    }
  }, [isOpen, cityId]);

  async function loadActivities() {
    try {
      setLoading(true);
      const response = await fetch(apiUrl(`cities/${cityId}/activities`));
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  }

  async function searchTripAdvisor() {
    if (!searchQuery.trim()) return;

    try {
      setSearchingTripAdvisor(true);
      const response = await fetch(apiUrl('tripadvisor/search'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityName,
          countryName,
          limit: 20,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Filter results by search query
        const filtered = (data.activities || []).filter((activity: TripAdvisorActivity) =>
          activity.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('Error searching TripAdvisor:', error);
    } finally {
      setSearchingTripAdvisor(false);
    }
  }

  function toggleActivity(locationId: string) {
    const isSelected = selectedActivityIds.includes(locationId);
    if (isSelected) {
      onActivitiesChange(selectedActivityIds.filter((id) => id !== locationId));
    } else {
      onActivitiesChange([...selectedActivityIds, locationId]);
    }
  }

  function addActivityFromSearch(activity: TripAdvisorActivity) {
    // Add to selected activities
    if (!selectedActivityIds.includes(activity.locationId)) {
      onActivitiesChange([...selectedActivityIds, activity.locationId]);
    }
    // Also add to local activities list if not already there
    if (!activities.find((a) => a.locationId === activity.locationId)) {
      setActivities([...activities, activity]);
    }
    setShowSearchResults(false);
    setSearchQuery('');
  }

  function openActivityDetails(activity: TripAdvisorActivity) {
    setSelectedActivity(activity);
    setShowDetailsModal(true);
  }

  function closeActivityDetails() {
    setShowDetailsModal(false);
    setSelectedActivity(null);
  }

  const defaultActivities = activities.filter((a) => a.isDefault);
  const availableActivities = filterDefault === 'default' 
    ? defaultActivities 
    : filterDefault === 'non-default'
    ? activities.filter((a) => !a.isDefault)
    : activities;

  const filteredActivities = availableActivities.filter((activity) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      activity.name.toLowerCase().includes(query) ||
      activity.description?.toLowerCase().includes(query) ||
      activity.category?.toLowerCase().includes(query)
    );
  });

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">Things to Do in {cityName}</h2>
            <p className="text-sm text-stone-500 mt-1">
              {selectedActivityIds.length} selected • {activities.length} available
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-4 border-b space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    searchTripAdvisor();
                  }
                }}
                className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
              />
            </div>
            <button
              onClick={searchTripAdvisor}
              disabled={!searchQuery.trim() || searchingTripAdvisor}
              className="px-4 py-2 bg-sb-orange-500 text-white rounded-lg hover:bg-sb-orange-600 transition disabled:opacity-50 flex items-center gap-2"
            >
              {searchingTripAdvisor ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Search TripAdvisor
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-400" />
            <select
              value={filterDefault}
              onChange={(e) => setFilterDefault(e.target.value as any)}
              className="px-3 py-1.5 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
            >
              <option value="all">All Activities</option>
              <option value="default">Top Attractions</option>
              <option value="non-default">Other Activities</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-sb-orange-500" />
            </div>
          ) : showSearchResults ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-stone-900">Search Results</h3>
                <button
                  onClick={() => {
                    setShowSearchResults(false);
                    setSearchQuery('');
                  }}
                  className="text-sm text-stone-500 hover:text-stone-700"
                >
                  Show Saved Activities
                </button>
              </div>
              {searchResults.length === 0 ? (
                <p className="text-center py-8 text-stone-500">
                  No results found. Try a different search term.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map((activity) => (
                    <ActivityCard
                      key={activity.locationId}
                      activity={activity}
                      isSelected={selectedActivityIds.includes(activity.locationId)}
                      onToggle={() => toggleActivity(activity.locationId)}
                      onAdd={() => addActivityFromSearch(activity)}
                      onViewDetails={() => openActivityDetails(activity)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-stone-500 mb-4">
                {activities.length === 0
                  ? 'No activities available for this city yet.'
                  : 'No activities match your filters.'}
              </p>
              {activities.length === 0 && (
                <button
                  onClick={searchTripAdvisor}
                  className="px-4 py-2 bg-sb-orange-500 text-white rounded-lg hover:bg-sb-orange-600 transition"
                >
                  Search TripAdvisor
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredActivities.map((activity) => (
                <ActivityCard
                  key={activity.locationId}
                  activity={activity}
                  isSelected={selectedActivityIds.includes(activity.locationId)}
                  onToggle={() => toggleActivity(activity.locationId)}
                  onViewDetails={() => openActivityDetails(activity)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex items-center justify-between">
          <span className="text-sm text-stone-500">
            {selectedActivityIds.length} activity{selectedActivityIds.length !== 1 ? 'ies' : ''} selected
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-sb-orange-500 text-white rounded-lg hover:bg-sb-orange-600 transition"
          >
            Done
          </button>
        </div>
      </div>
      </div>

      {/* Activity Details Modal */}
      {showDetailsModal && selectedActivity && (
        <ActivityDetailsModal
          activity={selectedActivity}
          cityId={cityId}
          isOpen={showDetailsModal}
          onClose={closeActivityDetails}
        />
      )}
    </>
  );
}

interface ActivityCardProps {
  activity: TripAdvisorActivity;
  isSelected: boolean;
  onToggle: () => void;
  onAdd?: () => void;
  onViewDetails?: () => void;
}

function ActivityCard({ activity, isSelected, onToggle, onAdd, onViewDetails }: ActivityCardProps) {
  return (
    <div
      className={`bg-white rounded-lg border-2 overflow-hidden transition-all ${
        isSelected
          ? 'border-sb-orange-400 shadow-md'
          : 'border-stone-200 hover:border-stone-300'
      }`}
    >
      {/* Image */}
      <div className="relative h-40 bg-stone-100">
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
        {isSelected && (
          <div className="absolute top-2 right-2 bg-sb-orange-500 text-white rounded-full p-1.5">
            <Check className="w-4 h-4" />
          </div>
        )}
        {activity.isDefault && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Top
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 
            className="font-bold text-stone-900 text-sm line-clamp-2 flex-1 cursor-pointer hover:text-sb-orange-500 transition"
            onClick={onToggle}
          >
            {activity.name}
          </h4>
          <div className="flex items-center gap-1 shrink-0">
            {onViewDetails && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails();
                }}
                className="p-1 text-stone-400 hover:text-sb-orange-500 transition"
                title="View details"
              >
                <Info className="w-4 h-4" />
              </button>
            )}
            {activity.webUrl && (
              <a
                href={activity.webUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-sb-orange-500 hover:text-sb-orange-600"
                title="View on TripAdvisor"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {activity.description && (
          <p 
            className="text-xs text-stone-600 line-clamp-2 cursor-pointer"
            onClick={onToggle}
          >
            {activity.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-2 text-xs text-stone-500">
          {activity.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{activity.rating.toFixed(1)}</span>
            </div>
          )}
          {activity.reviewCount && (
            <span>({activity.reviewCount.toLocaleString()})</span>
          )}
          {activity.category && (
            <span className="px-2 py-0.5 bg-stone-100 rounded">{activity.category}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-2">
          {onAdd && !isSelected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-sb-orange-500 text-white rounded text-xs font-medium hover:bg-sb-orange-600 transition"
            >
              <Plus className="w-3 h-3" />
              Add to Trip
            </button>
          )}
          {onViewDetails && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
              className="px-3 py-1.5 border border-stone-300 rounded text-xs font-medium hover:bg-stone-50 transition flex items-center gap-1"
            >
              <Info className="w-3 h-3" />
              Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

