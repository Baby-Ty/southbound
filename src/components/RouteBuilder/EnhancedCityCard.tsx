import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Wifi, 
  Sun, 
  Cloud, 
  GripVertical,
  Bed,
  Coffee,
  Edit3,
  Replace,
  Trash2,
  Check,
  AlertTriangle,
  Sparkles,
  Image as ImageIcon2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Smile,
  Waves,
  Wand2,
  Star,
  Settings,
  ExternalLink,
  X,
  Home,
  Plus
} from 'lucide-react';
import { CityPreset } from '@/lib/cityPresets';
import ActivityPickerModal from './ActivityPickerModal';
import AccommodationModal from './AccommodationModal';
import CustomActivityModal from './CustomActivityModal';
import ActivityDetailsModal from './ActivityDetailsModal';
import { TripAdvisorActivity } from '@/lib/tripadvisor';
import { apiUrl } from '@/lib/api';
import { CityData } from '@/lib/cosmos-cities';
import { usdToZar } from '@/lib/currency';

export interface HighlightItem {
  title: string;
  imageUrl?: string;
  isCustom?: boolean;
}

export interface CustomActivity {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  isCustom: true;
  createdAt: string;
}

export interface StopPlan {
  id: string;
  city: string;
  country: string;
  weeks: number;
  weeksEdited?: boolean;
  budgetCoins: 1 | 2 | 3;
  tags: string[];
  isDetour?: boolean;
  nearbyCity?: string;
  highlights: {
    places: HighlightItem[];
    accommodation: string;
    activities: string[];
    tripAdvisorActivities?: string[]; // locationIds of selected TripAdvisor activities
    customActivities?: CustomActivity[];
    hiddenDefaultActivities?: string[]; // locationIds of default activities user has removed
    notes: string;
    notesHint?: string;
    overview?: string;
  };
}

interface EnhancedCityCardProps {
  stop: StopPlan;
  cityPreset?: CityPreset;
  cityData?: CityData; // Full city data with accommodation types, common prices, etc.
  cityId?: string; // Optional cityId for TripAdvisor activities
  index: number;
  isEditing: boolean;
  onEdit: () => void;
  onStopEdit: () => void;
  onRemove: () => void;
  onSwap: () => void;
  onUpdate: (patch: Partial<StopPlan>) => void;
  dragHandleProps?: any;
}

const EnhancedCityCard = ({
  stop,
  cityPreset,
  cityData,
  cityId,
  index,
  isEditing,
  onEdit,
  onStopEdit,
  onRemove,
  onSwap,
  onUpdate,
  dragHandleProps
}: EnhancedCityCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showActivityPicker, setShowActivityPicker] = useState(false);
  const [showCustomActivityModal, setShowCustomActivityModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<CustomActivity | null>(null);
  const [showAccommodationModal, setShowAccommodationModal] = useState(false);
  const [tripAdvisorActivities, setTripAdvisorActivities] = useState<TripAdvisorActivity[]>([]);
  const [selectedActivityIds, setSelectedActivityIds] = useState<string[]>([]);
  const [viewingActivity, setViewingActivity] = useState<TripAdvisorActivity | null>(null);
  const [activitiesLoaded, setActivitiesLoaded] = useState(false);
  
  const toShortDescription = (activity: any): string => {
    const raw =
      (typeof activity?.shortDescription === 'string' && activity.shortDescription) ||
      (typeof activity?.description === 'string' && activity.description) ||
      '';
    const cleaned = raw.replace(/\s+/g, ' ').trim();
    return cleaned;
  };

  // Reset to primary image (index 0) when cityPreset changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setImageError(false);
  }, [cityPreset?.city, cityPreset?.imageUrl]);


  // Load TripAdvisor activities for this city
  useEffect(() => {
    if (cityId) {
      loadTripAdvisorActivities();
    } else {
      // No cityId means no TripAdvisor data expected, mark as loaded immediately
      setActivitiesLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityId]);

  async function loadTripAdvisorActivities() {
    if (!cityId) {
      console.log('[DEBUG] No cityId provided for', stop.city);
      return;
    }
    console.log('[DEBUG] Loading activities for cityId:', cityId, 'city:', stop.city);
    try {
      const url = apiUrl(`cities/${cityId}/activities`);
      console.log('[DEBUG] Fetching from:', url);
      const response = await fetch(url);
      console.log('[DEBUG] Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('[DEBUG] Raw data for', stop.city, ':', data);
        const activities = data.activities || [];
        console.log('[DEBUG]', stop.city, 'activities count:', activities.length);
        
        if (activities.length > 0) {
          console.log('[DEBUG]', stop.city, 'first activity:', activities[0]);
        }
        
        setTripAdvisorActivities(activities);
        // Initialize selected activities from stop data if available
        // Auto-select first 2 default activities
        const defaultActivities = activities
          .filter((a: TripAdvisorActivity) => a && a.isDefault)
          .slice(0, 2);
        const defaultIds = defaultActivities.map((a: TripAdvisorActivity) => a.locationId);
        console.log('[DEBUG]', stop.city, 'default IDs:', defaultIds);
        setSelectedActivityIds(defaultIds);
        
        // Update stop with default activity names if not already set
        if (defaultIds.length > 0 && (!stop.highlights.tripAdvisorActivities || stop.highlights.tripAdvisorActivities.length === 0)) {
          const activityNames = defaultActivities.map((a: TripAdvisorActivity) => a.name);
          onUpdate({
            highlights: {
              ...stop.highlights,
              activities: activityNames,
              tripAdvisorActivities: defaultIds,
            },
          });
        }
      } else {
        const errorText = await response.text();
        console.error('[DEBUG] Failed for', stop.city, 'with status:', response.status, 'error:', errorText);
      }
    } catch (error) {
      console.error('[DEBUG] Error loading TripAdvisor activities for', stop.city, ':', error);
    } finally {
      // Mark as loaded regardless of success/failure
      setActivitiesLoaded(true);
    }
  }

  function handleActivitiesChange(activityIds: string[]) {
    setSelectedActivityIds(activityIds);
    // Update stop with selected activity names
    const selectedActivities = tripAdvisorActivities.filter((a) =>
      activityIds.includes(a.locationId)
    );
    const activityNames = selectedActivities.map((a) => a.name);
    onUpdate({
      highlights: {
        ...stop.highlights,
        activities: activityNames,
      },
    });
  }

  function handleSaveCustomActivity(customActivity: CustomActivity) {
    const existingCustomActivities = stop.highlights.customActivities || [];
    
    if (editingActivity) {
      // Update existing activity
      const updatedActivities = existingCustomActivities.map(a => 
        a.id === editingActivity.id ? customActivity : a
      );
      const updatedActivityNames = (stop.highlights.activities || []).map(name => 
        name === editingActivity.title ? customActivity.title : name
      );
      
      onUpdate({
        highlights: {
          ...stop.highlights,
          customActivities: updatedActivities,
          activities: updatedActivityNames,
        },
      });
      setEditingActivity(null);
    } else {
      // Add new activity
      onUpdate({
        highlights: {
          ...stop.highlights,
          customActivities: [...existingCustomActivities, customActivity],
          activities: [...(stop.highlights.activities || []), customActivity.title],
        },
      });
    }
  }

  function handleDeleteCustomActivity(activityId: string) {
    if (!confirm('Are you sure you want to remove this activity?')) {
      return;
    }
    
    const existingCustomActivities = stop.highlights.customActivities || [];
    const activityToDelete = existingCustomActivities.find(a => a.id === activityId);
    
    if (activityToDelete) {
      const updatedActivities = existingCustomActivities.filter(a => a.id !== activityId);
      const updatedActivityNames = (stop.highlights.activities || []).filter(
        name => name !== activityToDelete.title
      );
      
      onUpdate({
        highlights: {
          ...stop.highlights,
          customActivities: updatedActivities,
          activities: updatedActivityNames,
        },
      });
    }
  }

  function handleRemoveDefaultActivity(locationId: string) {
    if (!confirm('Remove this default activity from your trip?')) {
      return;
    }
    
    const hiddenDefaults = stop.highlights.hiddenDefaultActivities || [];
    const activityToRemove = tripAdvisorActivities.find(a => a.locationId === locationId);
    
    if (activityToRemove && !hiddenDefaults.includes(locationId)) {
      const updatedHiddenDefaults = [...hiddenDefaults, locationId];
      const updatedActivityNames = (stop.highlights.activities || []).filter(
        name => name !== activityToRemove.name
      );
      
      onUpdate({
        highlights: {
          ...stop.highlights,
          hiddenDefaultActivities: updatedHiddenDefaults,
          activities: updatedActivityNames,
        },
      });
    }
  }

  function handleEditCustomActivity(activity: CustomActivity) {
    setEditingActivity(activity);
    setShowCustomActivityModal(true);
  }

  // Get current image from rotation - always starts with primary (index 0)
  const getCurrentImage = () => {
    if (!cityPreset) return '';
    // If we have multiple images, use the rotation
    if (cityPreset.imageUrls && cityPreset.imageUrls.length > 0) {
      // Ensure we're using a valid index (always start at 0 = primary)
      const safeIndex = currentImageIndex % cityPreset.imageUrls.length;
      return cityPreset.imageUrls[safeIndex];
    }
    // Fallback to primary imageUrl (which is always the first image)
    return cityPreset.imageUrl;
  };

  // Rotate to next image on click - cycles through all images
  const rotateImage = () => {
    if (cityPreset && cityPreset.imageUrls && cityPreset.imageUrls.length > 1) {
      setCurrentImageIndex((prev) => {
        const nextIndex = (prev + 1) % cityPreset.imageUrls!.length;
        return nextIndex;
      });
    }
  };

  if (!cityPreset) return null;

  const getWeatherIcon = (climate: string) => {
    switch (climate) {
      case 'tropical': return <Sun className="w-4 h-4 text-orange-500" />;
      case 'mediterranean': return <Sun className="w-4 h-4 text-yellow-500" />;
      case 'temperate': return <Cloud className="w-4 h-4 text-blue-400" />;
      case 'dry': return <Sun className="w-4 h-4 text-orange-400" />;
      default: return <Sun className="w-4 h-4" />;
    }
  };

  const preventDrag = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Ensure places is an array (handle migration/bad data)
  const currentHighlights = Array.isArray(stop.highlights.places) 
    ? stop.highlights.places.map(p => typeof p === 'string' ? { title: p, isCustom: false } as HighlightItem : p)
    : [];

  // Helper to generate default overview if empty
  const getDefaultOverview = () => {
    const vibe = stop?.tags?.[0] || "Balanced";
    return `You chose ${vibe} and Calm. ${stop.city} gives you incredible street food, lots of cafés, and a laid-back city that is perfect for focused work.`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative bg-white rounded-[2px] shadow-card transition-all duration-300 texture-paper overflow-visible ${
        isEditing ? 'ring-4 ring-sb-orange-200 z-10 rotate-0' : 'hover:shadow-card-hover hover:rotate-0'
      }`}
      style={{
        transform: isEditing ? 'none' : `rotate(${index % 2 === 0 ? '-1deg' : '1deg'})`,
      }}
    >
      {/* Tape Effect */}
      {!isEditing && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/40 backdrop-blur-sm rotate-2 shadow-sm z-20 border-l border-r border-white/60"></div>
      )}

      {/* Hero Section - Taller & Premium */}
      <div 
        className="relative h-80 overflow-hidden rounded-t-[2px] bg-gray-200 group-hover:h-[21rem] transition-all duration-500 cursor-pointer border-b border-gray-200 shadow-inner"
        onClick={rotateImage}
        title={cityPreset.imageUrls && cityPreset.imageUrls.length > 1 ? `Click to rotate images (${currentImageIndex + 1}/${cityPreset.imageUrls.length})` : undefined}
      >
        <div className="absolute inset-0">
          {!imageError ? (
            <Image
              key={getCurrentImage()} // Force re-render on image change
              src={getCurrentImage()}
              alt={`${stop.city}, ${stop.country}`}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-105 saturate-[.95] group-hover:saturate-100"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={index < 2}
              unoptimized
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-sb-navy-100 text-sb-navy-300">
               <MapPin className="w-12 h-12 opacity-20" />
            </div>
          )}
        </div>
        
        {/* Image rotation indicator */}
        {cityPreset.imageUrls && cityPreset.imageUrls.length > 1 && (
          <div className="absolute bottom-24 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <ImageIcon2 className="w-3 h-3" />
            <span>
              {currentImageIndex === 0 ? '⭐ ' : ''}
              {currentImageIndex + 1}/{cityPreset.imageUrls.length}
            </span>
          </div>
        )}

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-sb-navy-900/90 via-sb-navy-900/20 to-transparent" />
        
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-start z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg border-2 border-dashed border-gray-300 transform -rotate-6">
              <span className="font-handwritten font-bold text-sb-navy-700 text-lg">#{index + 1}</span>
            </div>
            {stop.isDetour && (
              <div className="bg-sb-teal-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-md z-10">
                <MapPin className="w-3 h-3" />
                Detour
              </div>
            )}
            <div 
              {...dragHandleProps}
              className="p-2 rounded-lg bg-white/20 backdrop-blur-md text-white/80 cursor-grab active:cursor-grabbing hover:bg-white/30 transition-colors border border-white/10 hover:border-white/20 hover:text-white"
            >
              <GripVertical className="w-4 h-4" />
            </div>
          </div>
          
          <div className="flex gap-2">
             <button 
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="px-2 py-1.5 rounded-sm bg-white/90 backdrop-blur-sm shadow-sm flex items-center gap-1 text-xs text-sb-navy-500 font-bold border border-white/50 hover:text-sb-orange-600 transition-colors"
              title="Edit Card"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main Title Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-24 text-white z-10">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-5xl font-bold mb-2 flex items-center gap-3 shadow-black/50 drop-shadow-md tracking-tighter font-serif">
                <span className="text-4xl filter drop-shadow-md">{cityPreset.flag}</span>
                {stop.city}
              </h3>
              <div className="flex items-center gap-3 text-white/90 text-sm font-medium">
                <span className="flex items-center gap-1.5 font-handwritten text-lg"><MapPin className="w-4 h-4 text-sb-orange-400" /> {stop.country}</span>
                <span className="w-1 h-1 rounded-full bg-white/50"></span>
                 <div className="flex items-center gap-2">
                    {getWeatherIcon(cityPreset.weather.climate)}
                    <span className="font-handwritten text-sm">{cityPreset.weather.avgTemp}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay Stats Grid */}
        <div className="absolute bottom-0 left-0 right-0 grid grid-cols-3 border-t border-white/10 bg-black/20 backdrop-blur-md divide-x divide-white/10">
            <div className="p-4 text-center group/stat hover:bg-white/10 transition-colors cursor-default">
              <div className="text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1 group-hover/stat:text-sb-orange-300 transition-colors">Budget</div>
              <div className="text-white font-bold text-sm">
                {usdToZar(cityPreset.costs.monthlyTotal)}
              </div>
            </div>
            <div className="p-4 text-center group/stat hover:bg-white/10 transition-colors cursor-default">
              <div className="text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1 group-hover/stat:text-sb-teal-300 transition-colors">Best Time</div>
              <div className="text-white font-bold text-sm">{cityPreset.weather.bestMonths}</div>
            </div>
            <div className="p-4 text-center group/stat hover:bg-white/10 transition-colors cursor-default">
              <div className="text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1 group-hover/stat:text-sb-orange-300 transition-colors">Vibe</div>
              <div className="text-white font-bold text-sm truncate px-2">
                {stop?.tags?.[0] || "Balanced"}
              </div>
            </div>
        </div>
      </div>

      {/* Overview Section - New Layout */}
      <div className="px-6 py-5 bg-white border-b border-sb-beige-200 relative z-10">
          <div className="flex flex-col md:flex-row gap-6">
             {/* Left: Overview Text */}
             <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                   <h4 className="text-xs font-bold text-sb-navy-500 uppercase tracking-wide flex items-center gap-2">
                     <Sparkles className="w-3.5 h-3.5 text-sb-orange-500" /> Overview
                   </h4>
                   <button 
                     className="text-xs text-sb-teal-600 hover:text-sb-teal-700 font-medium flex items-center gap-1 px-2 py-1 rounded-full hover:bg-sb-teal-50 transition-colors"
                     onClick={(e) => { e.stopPropagation(); /* TODO: Implement AI Polish */ }}
                    >
                     <Wand2 className="w-3 h-3" /> Polish with AI
                   </button>
                </div>
                <div className="relative group/overview">
                    <textarea
                      value={stop.highlights.overview !== undefined ? stop.highlights.overview : getDefaultOverview()}
                      onChange={(e) => onUpdate({ highlights: { ...stop.highlights, overview: e.target.value } })}
                      className="w-full text-sm text-sb-navy-700 leading-relaxed bg-transparent border border-transparent hover:border-sb-beige-200 focus:border-sb-orange-300 rounded-lg p-2 -ml-2 focus:ring-0 resize-none transition-all"
                      rows={4}
                      placeholder="Describe why this stop fits the trip..."
                    />
                    <Edit3 className="absolute top-2 right-2 w-3 h-3 text-sb-navy-300 opacity-0 group-hover/overview:opacity-100 transition-opacity pointer-events-none" />
                </div>
             </div>

             {/* Right: Action Buttons */}
             <div className="flex flex-col gap-2 md:w-[200px] shrink-0">
                {/* Accommodation */}
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowAccommodationModal(true); }}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-sb-orange-50/30 border border-sb-orange-100/50 hover:bg-sb-orange-50 hover:border-sb-orange-200 transition-all text-left group w-full"
                >
                   <div className="w-8 h-8 rounded-lg bg-white text-sb-orange-600 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                     <Bed className="w-4 h-4" />
                   </div>
                   <div className="min-w-0">
                     <div className="text-[10px] font-bold text-sb-navy-500 uppercase tracking-wide mb-0.5">Accommodation</div>
                     <div className="text-xs font-bold text-sb-navy-700 truncate">{stop.highlights.accommodation || 'Select type'}</div>
                   </div>
                </button>

                {/* Coworking */}
                <button 
                  onClick={(e) => { e.stopPropagation(); /* Trigger Modal */ }}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-sb-teal-50/30 border border-sb-teal-100/50 hover:bg-sb-teal-50 hover:border-sb-teal-200 transition-all text-left group w-full"
                >
                   <div className="w-8 h-8 rounded-lg bg-white text-sb-teal-600 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                     <Coffee className="w-4 h-4" />
                   </div>
                   <div className="min-w-0">
                     <div className="text-[10px] font-bold text-sb-navy-500 uppercase tracking-wide mb-0.5">Working Vibe</div>
                     <div className="text-xs font-bold text-sb-navy-700 truncate">{cityPreset.highlights.notesHint || 'Select vibe'}</div>
                   </div>
                </button>
             </div>
          </div>
      </div>

      {/* Trip Highlights - View Mode */}
      <div className="px-5 py-5 border-b border-sb-beige-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-sb-navy-700 uppercase tracking-wide">
                {cityId && tripAdvisorActivities.length > 0 ? 'TripAdvisor Top Activities' : 'Trip Highlights'}
              </h4>
              {cityId && tripAdvisorActivities.length > 0 && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-sb-teal-50 rounded-full border border-sb-teal-100">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-[10px] font-bold text-sb-navy-600">Verified</span>
                </div>
              )}
            </div>
            {cityId && tripAdvisorActivities.length > 0 && (
               <button 
                 onClick={(e) => { e.stopPropagation(); setShowActivityPicker(true); }}
                 className="text-[10px] font-bold text-sb-teal-600 hover:text-sb-teal-700 flex items-center gap-1.5 bg-white hover:bg-sb-teal-50 px-3 py-1.5 rounded-full transition-all border border-sb-teal-100 hover:border-sb-teal-200 shadow-sm hover:shadow uppercase tracking-wide"
               >
                 <Edit3 className="w-3 h-3" /> Customize
               </button>
            )}
          </div>
          <div className="text-xs text-stone-500 leading-snug -mt-2 mb-4">
            {cityId && tripAdvisorActivities.length > 0
              ? 'Pick a few activities you’d actually do here. Click “Customize” to search + add more, tap an activity card to view details, or remove it with the ×.'
              : 'Add a couple highlights to shape this month. Use “Add Activity” to create your own activity entry.'}
          </div>
          
          <div className="relative">
            {/* Horizontal Scrollable Container */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-stone-300 scrollbar-track-stone-100" style={{ scrollbarWidth: 'thin' }}>
            {/* Show loading state only if cityId exists but activities haven't loaded yet */}
            {cityId && !activitiesLoaded ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse flex-shrink-0 w-[280px]">
                  <div className="aspect-[4/3] rounded-xl bg-stone-200 mb-2"></div>
                  <div className="h-3 bg-stone-200 rounded w-3/4 mb-1.5"></div>
                  <div className="h-2.5 bg-stone-200 rounded w-1/2"></div>
                </div>
              ))
            ) : tripAdvisorActivities?.length > 0 ? (
              <>
              {/* Show selected activities (default, curated, or any selected) */}
              {tripAdvisorActivities
                .filter(a => {
                  if (!a) return false;
                  // Show if it's selected (in selectedActivityIds) OR if it's default (for backward compatibility)
                  const isSelected = selectedActivityIds.includes(a.locationId);
                  const isDefault = a.isDefault;
                  const hiddenDefaults = stop.highlights.hiddenDefaultActivities || [];
                  const isHidden = hiddenDefaults.includes(a.locationId);
                  
                  // Show if: (selected OR default) AND not hidden
                  return (isSelected || isDefault) && !isHidden;
                })
                .map((activity) => {
                  const priceInfo = activity.priceInfo || activity.priceRange || '';
                  const isFree = priceInfo?.toLowerCase().includes('free') || priceInfo === 'Free';
                  const isIncluded = priceInfo?.toLowerCase().includes('included');
                  
                  return (
                    <div 
                      key={activity.locationId} 
                      className="group/activity cursor-pointer relative flex-shrink-0 w-[280px]"
                      onClick={(e) => { e.stopPropagation(); setViewingActivity(activity); }}
                    >
                      <div className={`aspect-[4/3] rounded-xl bg-stone-100 mb-2 relative overflow-hidden border border-sb-orange-100/50 shadow-md group-hover/activity:shadow-xl transition-all duration-300 group-hover/activity:-translate-y-1`}>
                        {activity.images && activity.images.length > 0 ? (
                          <Image 
                            src={activity.images[0]} 
                            alt={activity.name} 
                            fill 
                            className="object-cover transition-transform duration-700 group-hover/activity:scale-110" 
                            unoptimized
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sb-teal-50 to-sb-orange-50">
                            <MapPin className="w-8 h-8 text-stone-300" />
                          </div>
                        )}
                        
                        {/* Gradient overlay for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover/activity:opacity-100 transition-opacity duration-300" />
                        
                        {/* Rating badge - more prominent */}
                        {activity.rating && (
                          <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg shadow-lg flex items-center gap-1 border border-white/50">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs font-bold text-sb-navy-700">
                              {typeof activity.rating === 'number' ? activity.rating.toFixed(1) : activity.rating}
                            </span>
                            {activity.reviewCount && (
                              <span className="text-[10px] text-stone-500 ml-0.5">
                                ({activity.reviewCount > 1000 ? `${(activity.reviewCount / 1000).toFixed(1)}k` : activity.reviewCount})
                              </span>
                            )}
                          </div>
                        )}
                        
                        {/* Price badge */}
                        {priceInfo && (
                          <div className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-[10px] font-bold shadow-lg backdrop-blur-md border ${
                            isFree ? 'bg-green-500/95 text-white border-green-400/50' :
                            isIncluded ? 'bg-blue-500/95 text-white border-blue-400/50' :
                            'bg-white/95 text-sb-navy-700 border-white/50'
                          }`}>
                            {isFree ? 'Free' : isIncluded ? 'Included' : priceInfo}
                          </div>
                        )}
                        
                        {/* Category badge */}
                        {activity.category && (
                          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover/activity:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-medium text-sb-navy-600 border border-white/50 shadow-lg">
                              {typeof activity.category === 'string' ? activity.category : (activity.category as any)?.name || ''}
                            </div>
                          </div>
                        )}
                        
                        {/* Hover overlay with view details */}
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/activity:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                          <div className="bg-white/95 backdrop-blur-sm rounded-full px-3.5 py-1.5 flex items-center gap-2 transform scale-95 group-hover/activity:scale-100 transition-all duration-300 shadow-sm border border-stone-200/50">
                            <span className="text-[10px] font-bold text-sb-navy-700 uppercase tracking-wide">View</span>
                            <ExternalLink className="w-3 h-3 text-sb-teal-600" />
                          </div>
                        </div>
                        
                        {/* Remove button - show on hover */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover/activity:opacity-100 transition-opacity z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveDefaultActivity(activity.locationId);
                            }}
                            className="p-1.5 bg-white/80 hover:bg-white text-stone-400 hover:text-red-500 rounded-full shadow-sm backdrop-blur-sm transition-all hover:shadow-md border border-white/50"
                            title="Remove from trip"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Title - improved typography */}
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-sb-navy-700 group-hover/activity:text-sb-orange-600 transition-colors leading-tight line-clamp-2 min-h-[2.5rem]">
                          {activity.name}
                        </div>
                        {toShortDescription(activity) ? (
                          <div className="text-[11px] text-stone-600 leading-snug line-clamp-2">
                            {toShortDescription(activity)}
                          </div>
                        ) : null}
                        {activity.category && (
                          <div className="text-[10px] text-stone-500 font-medium truncate">
                            {typeof activity.category === 'string' ? activity.category : (activity.category as any)?.name || ''}
                          </div>
                        )}
                        {/* Additional info row */}
                        <div className="flex items-center gap-2 text-[9px] text-stone-400">
                          {activity.rating && (
                            <div className="flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                              <span>{typeof activity.rating === 'number' ? activity.rating.toFixed(1) : activity.rating}</span>
                            </div>
                          )}
                          {activity.reviewCount && activity.rating && (
                            <span>•</span>
                          )}
                          {activity.reviewCount && (
                            <span>{activity.reviewCount.toLocaleString()} reviews</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              
              {/* Show all custom activities */}
              {stop.highlights.customActivities && stop.highlights.customActivities.length > 0 && (
                <>
                  {stop.highlights.customActivities.map((customActivity) => {
                    // Convert CustomActivity to TripAdvisorActivity format for the modal
                    const activityForModal: TripAdvisorActivity = {
                      locationId: `custom-${customActivity.id}`,
                      name: customActivity.title,
                      description: customActivity.description,
                      images: customActivity.imageUrl ? [customActivity.imageUrl] : [],
                      isDefault: false,
                      isCurated: false,
                    };
                    
                    return (
                    <div 
                      key={customActivity.id} 
                      className="group/activity cursor-pointer relative flex-shrink-0 w-[280px]"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setViewingActivity(activityForModal); 
                      }}
                    >
                      <div className="aspect-[4/3] rounded-xl bg-stone-100 mb-2 relative overflow-hidden border border-sb-teal-100/50 shadow-md group-hover/activity:shadow-xl transition-all duration-300 group-hover/activity:-translate-y-1">
                        {customActivity.imageUrl ? (
                          <Image 
                            src={customActivity.imageUrl} 
                            alt={customActivity.title} 
                            fill 
                            className="object-cover transition-transform duration-700 group-hover/activity:scale-110" 
                            unoptimized
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sb-teal-50 to-sb-orange-50">
                            <MapPin className="w-8 h-8 text-stone-300" />
                          </div>
                        )}
                        <div className="absolute top-2 left-2 bg-sb-teal-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Custom
                        </div>
                        
                        {/* Gradient overlay for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover/activity:opacity-100 transition-opacity duration-300" />
                        
                        {/* Hover overlay with view details */}
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/activity:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                          <div className="bg-white/95 backdrop-blur-sm rounded-full px-3.5 py-1.5 flex items-center gap-2 transform scale-95 group-hover/activity:scale-100 transition-all duration-300 shadow-sm border border-stone-200/50">
                            <span className="text-[10px] font-bold text-sb-navy-700 uppercase tracking-wide">View</span>
                            <ExternalLink className="w-3 h-3 text-sb-teal-600" />
                          </div>
                        </div>
                        
                        {/* Edit/Delete buttons - show on hover */}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/activity:opacity-100 transition-opacity z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCustomActivity(customActivity);
                            }}
                            className="p-1.5 bg-white/80 hover:bg-white text-stone-500 hover:text-sb-teal-600 rounded-full shadow-sm backdrop-blur-sm transition-all hover:shadow-md border border-white/50"
                            title="Edit activity"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCustomActivity(customActivity.id);
                            }}
                            className="p-1.5 bg-white/80 hover:bg-white text-stone-500 hover:text-red-500 rounded-full shadow-sm backdrop-blur-sm transition-all hover:shadow-md border border-white/50"
                            title="Delete activity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-sb-navy-700 group-hover/activity:text-sb-orange-600 transition-colors leading-tight line-clamp-2 min-h-[2.5rem]">
                          {customActivity.title}
                        </div>
                        {customActivity.description ? (
                          <div className="text-[11px] text-stone-600 leading-snug line-clamp-2">
                            {customActivity.description}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    );
                  })}
                </>
              )}
              
              {/* Add Activity Card Button - always show */}
              <div 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setEditingActivity(null);
                  setShowCustomActivityModal(true); 
                }}
                className="group/activity cursor-pointer relative flex-shrink-0 w-[280px]"
              >
                <div className="aspect-[4/3] rounded-xl bg-white border-2 border-dashed border-sb-orange-200 mb-2 relative overflow-hidden hover:border-sb-orange-400 hover:bg-sb-orange-50/30 transition-all duration-300 group-hover/activity:shadow-lg flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-sb-orange-100 group-hover/activity:bg-sb-orange-200 flex items-center justify-center mb-2 transition-colors">
                    <Plus className="w-6 h-6 text-sb-orange-600" />
                  </div>
                  <div className="text-xs font-bold text-sb-orange-600 group-hover/activity:text-sb-orange-700 transition-colors">
                    Add Activity
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">
                    Create a new activity entry
                  </div>
                </div>
              </div>
              </>
            ) : (
              /* Fallback to legacy highlights only if loaded and no TripAdvisor data */
              <>
                {currentHighlights.map((place, i) => (
                  <div key={i} className="group/activity cursor-pointer relative flex-shrink-0 w-[280px]">
                    <div className={`aspect-[4/3] rounded-lg bg-gradient-to-br from-sb-beige-100 via-sb-orange-50/50 to-sb-teal-50 mb-1.5 relative overflow-hidden border border-sb-orange-100/50 pattern-dots`}>
                      {place.imageUrl ? (
                        <Image 
                          src={place.imageUrl} 
                          alt={place.title} 
                          fill 
                          className="object-cover" 
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <MapPin className="w-6 h-6 text-sb-orange-400/60 mx-auto mb-1" />
                            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-sb-orange-300 to-transparent mx-auto"></div>
                          </div>
                        </div>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); onEdit(); }}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm opacity-0 group-hover/activity:opacity-100 transition-all hover:bg-white text-sb-navy-600 hover:text-sb-orange-600 z-10 hover:scale-110"
                        title="Edit Highlight"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-[10px] font-medium text-sb-navy-600 group-hover/activity:text-sb-orange-600 truncate transition-colors">
                      {place.title}
                    </div>
                  </div>
                ))}
                {/* Add Activity button for legacy mode */}
                <div 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setEditingActivity(null);
                    setShowCustomActivityModal(true); 
                  }}
                  className="group/activity cursor-pointer relative flex-shrink-0 w-[280px]"
                >
                  <div className="aspect-[4/3] rounded-xl bg-white border-2 border-dashed border-sb-orange-200 mb-2 relative overflow-hidden hover:border-sb-orange-400 hover:bg-sb-orange-50/30 transition-all duration-300 group-hover/activity:shadow-lg flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-sb-orange-100 group-hover/activity:bg-sb-orange-200 flex items-center justify-center mb-2 transition-colors">
                      <Plus className="w-6 h-6 text-sb-orange-600" />
                    </div>
                    <div className="text-xs font-bold text-sb-orange-600 group-hover/activity:text-sb-orange-700 transition-colors">
                      Add Activity
                    </div>
                    <div className="text-[10px] text-stone-500 mt-0.5">
                      Create a new activity entry
                    </div>
                  </div>
                </div>
              </>
            )}
            </div>
          </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5">
        {/* Expandable Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pb-2">
                {/* Cost Breakdown - Compact with Common Items */}
                <div className="bg-sb-beige-50 rounded-xl p-4 border border-sb-beige-200">
                  <h4 className="text-xs font-bold text-sb-navy-500 uppercase tracking-wide mb-3">Costs</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Left: Monthly Breakdown (Compact) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-sb-navy-600 flex items-center gap-1.5">
                          <Home className="w-3 h-3 text-sb-orange-500" />
                          Accommodation
                        </span>
                        <span className="font-medium text-sb-navy-700">
                          {usdToZar(cityPreset.costs.accommodation)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-sb-navy-600 flex items-center gap-1.5">
                          <Coffee className="w-3 h-3 text-sb-teal-500" />
                          Coworking
                        </span>
                        <span className="font-medium text-sb-navy-700">
                          {usdToZar(cityPreset.costs.coworking)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-sb-navy-600 flex items-center gap-1.5">
                          <Utensils className="w-3 h-3 text-sb-orange-400" />
                          Meals
                        </span>
                        <span className="font-medium text-sb-navy-700">
                          {usdToZar(cityPreset.costs.meals)}
                        </span>
                      </div>
                    </div>

                    {/* Right: Common Items */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-bold text-sb-navy-500 uppercase tracking-wide mb-2">Common Items</div>
                      {cityData?.commonItemPrices ? (
                        <>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-sb-navy-600">500ml Coke</span>
                            <span className="font-medium text-sb-navy-700">{cityData.commonItemPrices.coke500ml || 'N/A'}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-sb-navy-600">McDonald's Burger</span>
                            <span className="font-medium text-sb-navy-700">{cityData.commonItemPrices.mcdBurger || 'N/A'}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-sb-navy-600">Local Beer</span>
                            <span className="font-medium text-sb-navy-700">{cityData.commonItemPrices.localBeer || 'N/A'}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-sb-navy-600">Coffee</span>
                            <span className="font-medium text-sb-navy-700">{cityData.commonItemPrices.coffee || 'N/A'}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-sb-navy-600">Street Food</span>
                            <span className="font-medium text-sb-navy-700">{cityData.commonItemPrices.streetFood || 'N/A'}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-sb-navy-600">Transport</span>
                            <span className="font-medium text-sb-navy-700">{cityData.commonItemPrices.transport || 'N/A'}</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-xs text-stone-400 italic">Common item prices not available</div>
                      )}
                    </div>
                    </div>
                </div>

                {/* City Experience Gallery - Replaces Top Activities section */}
                {cityData?.experienceGallery && cityData.experienceGallery.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-sb-navy-500 uppercase tracking-wide mb-3">City Experience Gallery</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {cityData.experienceGallery.map((photo, i) => (
                        <div key={i} className="group relative">
                          <div className="aspect-[4/3] rounded-lg bg-stone-100 relative overflow-hidden border border-sb-orange-100/50 shadow-sm group-hover:shadow-md transition-all">
                            {photo.url ? (
                              <Image 
                                src={photo.url} 
                                alt={photo.caption || `${stop.city} experience ${i + 1}`} 
                                fill 
                                className="object-cover transition-transform duration-500 group-hover:scale-110" 
                                unoptimized
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-stone-300" />
                              </div>
                            )}
                          </div>
                          {photo.caption && (
                            <div className="text-[10px] text-stone-500 truncate mt-1.5 text-center">
                              {photo.caption}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Notes */}
                <div className="mt-4 pt-4 border-t border-sb-beige-200">
                  <label className="text-xs font-bold text-sb-navy-500 uppercase tracking-wide block mb-2">Your notes for this stop</label>
                  <div className="relative group/notes texture-paper">
                    <textarea
                      value={stop.highlights.notes}
                      onChange={(e) => onUpdate({ highlights: { ...stop.highlights, notes: e.target.value } })}
                      placeholder="Add a note..."
                      rows={2}
                      className="w-full bg-sb-beige-50/80 hover:bg-sb-beige-100 border border-sb-orange-100/50 rounded-lg px-3 py-2 text-sm text-sb-navy-700 placeholder:text-sb-navy-400/60 focus:ring-2 focus:ring-sb-orange-300/50 focus:bg-sb-beige-100 transition-all resize-none relative z-10"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="absolute right-2 bottom-2 pointer-events-none z-20">
                      <Edit3 className="w-3 h-3 text-sb-orange-500/60 opacity-50 group-hover/notes:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions Bar */}
        <div className="flex items-center justify-between pt-2 mt-2">
          <div className="flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onSwap(); }}
              className="p-2 rounded-lg hover:bg-sb-beige-100 text-sb-navy-500 hover:text-sb-navy-700 transition-colors"
              title="Change City"
              onDragStart={preventDrag}
            >
              <Replace className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="p-2 rounded-lg hover:bg-red-50 text-sb-navy-400 hover:text-red-500 transition-colors"
              title="Remove Stop"
              onDragStart={preventDrag}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="flex items-center gap-1 text-sm font-medium text-sb-orange-600 hover:text-sb-orange-700 hover:bg-sb-orange-50/50 px-2 py-1 rounded-md transition-all"
            onDragStart={preventDrag}
          >
            {isExpanded ? 'Less Details' : 'More Details'}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Activity Details Modal - Use the full ActivityDetailsModal component */}
      {viewingActivity && cityId && (
        <ActivityDetailsModal
          activity={viewingActivity}
          cityId={cityId}
          isOpen={!!viewingActivity}
          onClose={() => setViewingActivity(null)}
        />
      )}

      {/* Accommodation Modal */}
      <AccommodationModal
        isOpen={showAccommodationModal}
        onClose={() => setShowAccommodationModal(false)}
        cityName={stop.city}
        currentAccommodation={stop.highlights.accommodation}
        accommodationTypes={cityData?.accommodationTypes}
        onSelectAccommodation={(type) => {
          const accType = cityData?.accommodationTypes?.[type] || { name: type, description: '', images: [], amenities: [] };
          onUpdate({
            highlights: {
              ...stop.highlights,
              accommodation: accType.name,
            },
          });
        }}
      />

      {/* Activity Picker Modal */}
      {cityId && (
        <ActivityPickerModal
          isOpen={showActivityPicker}
          onClose={() => setShowActivityPicker(false)}
          cityId={cityId}
          cityName={stop.city}
          countryName={stop.country}
          selectedActivityIds={selectedActivityIds}
          onActivitiesChange={handleActivitiesChange}
        />
      )}

      {/* Custom Activity Modal */}
      <CustomActivityModal
        isOpen={showCustomActivityModal}
        onClose={() => {
          setShowCustomActivityModal(false);
          setEditingActivity(null);
        }}
        cityName={stop.city}
        countryName={stop.country}
        cityId={cityId}
        editingActivity={editingActivity}
        onSave={handleSaveCustomActivity}
      />
    </motion.div>
  );
};

export default EnhancedCityCard;
