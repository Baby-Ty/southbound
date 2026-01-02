'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import {
  X,
  Star,
  MapPin,
  Phone,
  Globe,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
  DollarSign,
  CheckCircle,
  Info,
  Sparkles,
  Calendar,
  Users,
  ShieldCheck,
  Ban,
  Accessibility,
  Ticket,
} from 'lucide-react';
import { TripAdvisorActivity } from '@/lib/tripadvisor';
import { apiUrl } from '@/lib/api';

interface EnrichedActivity extends TripAdvisorActivity {
  shortDescription?: string;
  highlights?: string[];
  duration?: string;
  bestTimeToVisit?: string;
  difficulty?: string;
  estimatedCost?: string;
  bookingRequired?: boolean;
  bookingUrl?: string;
  whatToKnow?: string[];
  featured?: boolean;
  adminNotes?: string;
  source?: 'tripadvisor' | 'sanity' | 'merged' | 'ai-generated';
  
  // New detailed fields
  itinerary?: {
    title?: string;
    stops: {
      title: string;
      description?: string;
      duration?: string;
    }[];
  };
  inclusions?: string[];
  exclusions?: string[];
  cancellationPolicy?: string;
  accessibility?: string[];
  meetingPoint?: string;
}

interface ActivityDetailsModalProps {
  activity: TripAdvisorActivity;
  cityId: string;
  isOpen: boolean;
  onClose: () => void;
  allowAIGeneration?: boolean; // Only allow AI generation in admin contexts, default false for user side
  onActivitySaved?: () => void; // Callback to refresh activities list after saving
}

export default function ActivityDetailsModal({
  activity,
  cityId,
  isOpen,
  onClose,
  allowAIGeneration = false, // Default to false - users should only see existing descriptions
  onActivitySaved,
}: ActivityDetailsModalProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [enrichedActivity, setEnrichedActivity] = useState<EnrichedActivity | null>(null);
  const [loadingEnriched, setLoadingEnriched] = useState(false);
  const uploadInitiatedRef = useRef<string | null>(null);

  const uploadPhotosToBlob = useCallback(async () => {
    if (!activity || activity.blobPhotos) return;
    
    // Prevent duplicate uploads for the same activity
    if (uploadInitiatedRef.current === activity.locationId) return;
    uploadInitiatedRef.current = activity.locationId;
    
    try {
      setUploadingPhotos(true);
      const response = await fetch(
        apiUrl(`cities/${cityId}/activities/${activity.locationId}/photos`),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ limit: 5 }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.activity?.blobPhotos) {
          setPhotoUrls(data.activity.blobPhotos);
        }
      }
    } catch (error) {
      console.error('Failed to upload photos to blob:', error);
      // Continue with existing URLs if upload fails
      uploadInitiatedRef.current = null; // Reset on error so retry is possible
    } finally {
      setUploadingPhotos(false);
    }
  }, [activity, cityId]);

  // Save enriched activity to backend
  const saveActivityToBackend = useCallback(async (enriched: EnrichedActivity) => {
    try {
      console.log('[ActivityModal] Saving enriched activity to backend:', enriched.locationId);
      console.log('[ActivityModal] Activity data being saved:', {
        locationId: enriched.locationId,
        name: enriched.name,
        hasDescription: !!enriched.description,
        descriptionLength: enriched.description?.length || 0,
        isDefault: enriched.isDefault,
        isCurated: enriched.isCurated,
      });
      
      const response = await fetch(apiUrl(`cities/${cityId}/activities`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enriched),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('[ActivityModal] Successfully saved activity to backend', result);
    } catch (error) {
      console.error('[ActivityModal] Failed to save activity to backend:', error);
      throw error; // Re-throw so caller knows save failed
    }
  }, [cityId]);

  // Fetch enriched activity data from Sanity + TripAdvisor
  const fetchEnrichedActivity = useCallback(async () => {
    if (!activity?.locationId) return;
    
    // Custom activities (user-created) don't need API fetching, just use the provided data
    if (activity.locationId.startsWith('custom-')) {
      console.log('[ActivityModal] Custom activity detected, using provided data');
      setEnrichedActivity(activity as EnrichedActivity);
      return;
    }
    
    // If activity already has rich details (description, etc.), skip fetch
    // This assumes the passed activity is already "enriched" (e.g. from a previous save)
    if (activity.description && activity.description.length > 100 && 
        (activity as EnrichedActivity).itinerary) {
      console.log('[ActivityModal] Activity already enriched, skipping fetch');
      setEnrichedActivity(activity as EnrichedActivity);
      return;
    }

    try {
      setLoadingEnriched(true);
      
      console.log('[ActivityModal] Starting fetch for activity:', activity.name);
      
      // First, fetch the latest activity data from the city's activities API
      // This ensures we get the most up-to-date version including any saved descriptions
      let activityData = activity;
      try {
        const cityActivitiesResponse = await fetch(apiUrl(`cities/${cityId}/activities`));
        if (cityActivitiesResponse.ok) {
          const cityData = await cityActivitiesResponse.json();
          const savedActivity = (cityData.activities || []).find(
            (a: TripAdvisorActivity) => a.locationId === activity.locationId
          );
          if (savedActivity) {
            console.log('[ActivityModal] Found saved activity with description:', !!savedActivity.description, 'length:', savedActivity.description?.length || 0);
            activityData = savedActivity; // Use the saved version which has the latest data
          }
        }
      } catch (cityError) {
        console.warn('[ActivityModal] Could not fetch from city activities, using prop data:', cityError);
      }
      
      // Check for admin enrichment (this takes priority over saved data)
      try {
        const response = await fetch(apiUrl(`attractions/${activity.locationId}`));
        
        if (response.ok) {
          const data = await response.json();
          if (data.source === 'merged' || data.source === 'sanity') {
            console.log('[ActivityModal] Found admin enrichment, using it...');
            // Use admin data if available
            activityData = { ...activityData, ...data.data };
            setEnrichedActivity(activityData);
            // No need to save back if it came from admin source
            return;
          }
        }
      } catch (adminError) {
        console.error('[ActivityModal] Error checking for admin enrichment:', adminError);
      }
      
      // Check if we already have a description (from saved data)
      if (activityData.description && activityData.description.length >= 100) {
        console.log('[ActivityModal] Using saved activity with description (length:', activityData.description.length, ')');
        setEnrichedActivity(activityData);
        return;
      }
      
      // Only generate AI descriptions in admin contexts
      if (!allowAIGeneration) {
        console.log('[ActivityModal] No description found, but AI generation disabled for user side. Using existing data only.');
        setEnrichedActivity(activityData);
        return;
      }
      
      // No description found, generate one with AI (admin side only)
      console.log('[ActivityModal] No description found, generating AI description (admin context)...');
      
      try {
        const aiResponse = await fetch(apiUrl('attractions/generate-description'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: activity.name,
            category: activity.category,
            subcategories: activity.subcategories,
            rating: activity.rating,
            reviewCount: activity.reviewCount,
            priceLevel: activity.priceLevel,
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          if (aiData.success && aiData.generated) {
            console.log('[ActivityModal] ✅ Generated AI description');
            // Merge AI-generated content with activity, preserving all original fields
            const aiEnriched: EnrichedActivity = {
              ...activityData, // Preserve all original activity fields (locationId, name, rating, photos, etc.)
              description: aiData.generated.fullDescription || activityData.description,
              highlights: aiData.generated.highlights,
              bestTimeToVisit: aiData.generated.bestTimeToVisit,
              whatToKnow: aiData.generated.whatToKnow,
              itinerary: aiData.generated.itinerary,
              inclusions: aiData.generated.inclusions,
              exclusions: aiData.generated.exclusions,
              cancellationPolicy: aiData.generated.cancellationPolicy,
              accessibility: aiData.generated.accessibility,
              meetingPoint: aiData.generated.meetingPoint,
              source: 'ai-generated' as any,
              // Explicitly preserve important flags
              isDefault: activityData.isDefault,
              isCurated: activityData.isCurated,
            };
            setEnrichedActivity(aiEnriched);
            
            // Save AI enriched data to backend
            try {
              await saveActivityToBackend(aiEnriched);
              console.log('[ActivityModal] ✅ AI description saved successfully');
              // Notify parent to refresh activities list
              if (onActivitySaved) {
                onActivitySaved();
              }
            } catch (saveError) {
              console.error('[ActivityModal] Failed to save AI description:', saveError);
              // Don't return - still show the enriched activity even if save fails
            }
            return;
          }
        }
      } catch (aiError) {
        console.error('[ActivityModal] AI generation failed:', aiError);
      }
      
      console.log('[ActivityModal] Finished enrichment process');
    } catch (error) {
      console.error('[ActivityModal] Failed to fetch enriched activity:', error);
    } finally {
      setLoadingEnriched(false);
    }
  }, [activity, cityId, allowAIGeneration, saveActivityToBackend, onActivitySaved]);

  useEffect(() => {
    if (isOpen && activity) {
      // Reset upload tracking when activity changes
      if (uploadInitiatedRef.current !== activity.locationId) {
        uploadInitiatedRef.current = null;
      }
      
      // Fetch enriched data
      fetchEnrichedActivity();
      
      // Determine which photo URLs to use
      // Priority: blobPhotos > images from photos array > images array
      let urls: string[] = [];
      
      if (activity.blobPhotos && activity.blobPhotos.length > 0) {
        urls = activity.blobPhotos;
      } else if (activity.photos && activity.photos.length > 0) {
        urls = activity.photos
          .map((photo) => 
            photo.images?.large?.url || 
            photo.images?.medium?.url || 
            photo.images?.original?.url
          )
          .filter((url): url is string => !!url);
      } else if (activity.images && activity.images.length > 0) {
        urls = activity.images;
      }
      
      setPhotoUrls(urls);
      setCurrentPhotoIndex(0);
      
      // If no blob photos exist, trigger upload
      if (!activity.blobPhotos && urls.length > 0) {
        uploadPhotosToBlob();
      }
    }
  }, [isOpen, activity, uploadPhotosToBlob, fetchEnrichedActivity]);

  function nextPhoto() {
    setCurrentPhotoIndex((prev) => (prev + 1) % photoUrls.length);
  }

  function prevPhoto() {
    setCurrentPhotoIndex((prev) => (prev - 1 + photoUrls.length) % photoUrls.length);
  }

  if (!isOpen || !activity) return null;

  // Use enriched activity data if available, fallback to base activity
  const displayActivity = enrichedActivity || activity;
  const isEnriched = !!enrichedActivity && (enrichedActivity.source === 'merged' || enrichedActivity.source === 'sanity');
  const isAIGenerated = !!enrichedActivity && (enrichedActivity.source as any) === 'ai-generated';

  const description = displayActivity.description || '';
  const shouldTruncateDescription = description.length > 300;
  const displayDescription = expandedDescription || !shouldTruncateDescription
    ? description
    : `${description.substring(0, 300)}...`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/70 overflow-hidden">
      <div className="bg-white h-full sm:h-auto sm:max-h-[90vh] sm:rounded-xl w-full max-w-6xl flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Sticky Header with Close */}
        <div className="flex-shrink-0 bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-lg font-bold text-sb-navy-900 truncate pr-4">{displayActivity.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          
          {/* Hero Section */}
          <div className="bg-white pb-6">
            <div className="relative h-64 md:h-[400px] w-full bg-gray-200">
               {photoUrls.length > 0 ? (
                <>
                  <Image
                    src={photoUrls[currentPhotoIndex]}
                    alt={activity.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {photoUrls.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 hover:opacity-100 transition-opacity">
                      <button onClick={prevPhoto} className="p-2 rounded-full bg-white/90 shadow-lg hover:bg-white transition"><ChevronLeft className="w-5 h-5" /></button>
                      <button onClick={nextPhoto} className="p-2 rounded-full bg-white/90 shadow-lg hover:bg-white transition"><ChevronRight className="w-5 h-5" /></button>
                    </div>
                  )}
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm flex items-center gap-1">
                    <Image className="w-3 h-3 invert opacity-70" alt="" width={12} height={12} src="/camera.svg" />
                    {currentPhotoIndex + 1} / {photoUrls.length}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 flex-col gap-2">
                  <MapPin className="w-12 h-12 opacity-20" />
                  <span className="text-sm">No photos available</span>
                </div>
              )}
            </div>
            
            <div className="container mx-auto px-4 sm:px-8 mt-6">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2 items-center mb-1">
                  {displayActivity.category && (
                    <span className="px-2.5 py-0.5 rounded-full bg-sb-teal-50 text-sb-teal-700 text-xs font-bold uppercase tracking-wide border border-sb-teal-100">
                      {displayActivity.category}
                    </span>
                  )}
                  {isEnriched && <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-medium flex items-center gap-1"><Sparkles className="w-3 h-3" /> Curated</span>}
                  {isAIGenerated && <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI Enhanced</span>}
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold text-sb-navy-900 leading-tight">{displayActivity.name}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-1">
                   {displayActivity.rating && (
                    <div className="flex items-center gap-1">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                           <Star 
                             key={i} 
                             className={`w-4 h-4 ${i < Math.round(displayActivity.rating || 0) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} 
                           />
                        ))}
                      </div>
                      <span className="font-bold text-gray-900 ml-1">{displayActivity.rating.toFixed(1)}</span>
                      {displayActivity.reviewCount && <span className="text-gray-500 underline decoration-dotted ml-1">({displayActivity.reviewCount.toLocaleString()} reviews)</span>}
                    </div>
                  )}
                  {displayActivity.address?.city && (
                    <div className="flex items-center gap-1 text-gray-500">
                      <MapPin className="w-4 h-4" />
                      {displayActivity.address.city}, {displayActivity.address.country}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-10">
                
                {/* About Section */}
                <section>
                  <h3 className="text-xl font-bold text-sb-navy-900 mb-4">About</h3>
                  <div className="prose prose-stone max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                    {displayDescription || "No description available."}
                  </div>
                  {shouldTruncateDescription && (
                    <button
                      onClick={() => setExpandedDescription(!expandedDescription)}
                      className="mt-2 text-sb-orange-600 font-bold text-sm hover:underline"
                    >
                      {expandedDescription ? "Read less" : "Read more"}
                    </button>
                  )}
                </section>
                
                {/* Highlights Section */}
                {displayActivity.highlights && displayActivity.highlights.length > 0 && (
                  <section>
                     <h3 className="text-xl font-bold text-sb-navy-900 mb-4">Highlights</h3>
                     <ul className="grid sm:grid-cols-2 gap-3">
                        {displayActivity.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white border border-gray-100 shadow-sm">
                            <CheckCircle className="w-5 h-5 text-sb-teal-500 shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-sm font-medium">{highlight}</span>
                          </li>
                        ))}
                     </ul>
                  </section>
                )}

                {/* Itinerary Section (New) */}
                {displayActivity.itinerary && (
                  <section>
                    <h3 className="text-xl font-bold text-sb-navy-900 mb-4">Itinerary</h3>
                    <div className="relative pl-6 border-l-2 border-gray-200 space-y-8">
                      {displayActivity.itinerary.stops.map((stop: any, i: number) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-sb-navy-900 ring-4 ring-white" />
                          <h4 className="font-bold text-gray-900 text-lg mb-1">{stop.title}</h4>
                          {stop.duration && <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded mb-2 inline-block">{stop.duration}</span>}
                          {stop.description && <p className="text-gray-600 text-sm">{stop.description}</p>}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Inclusions / Exclusions (New) */}
                {(displayActivity.amenities?.length || displayActivity.inclusions?.length) && (
                  <section>
                    <h3 className="text-xl font-bold text-sb-navy-900 mb-4">What&apos;s Included</h3>
                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
                      {(displayActivity.inclusions || displayActivity.amenities || []).map((item: any, i: number) => (
                        <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                          <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-1" />
                          <span className="text-gray-700 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                    {displayActivity.exclusions && displayActivity.exclusions.length > 0 && (
                       <div className="mt-6">
                          <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Not Included</h4>
                          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
                            {displayActivity.exclusions.map((item: any, i: number) => (
                              <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0 opacity-75">
                                <X className="w-4 h-4 text-red-400 shrink-0 mt-1" />
                                <span className="text-gray-600 text-sm">{item}</span>
                              </div>
                            ))}
                          </div>
                       </div>
                    )}
                  </section>
                )}

                {/* Additional Info / Policies */}
                <section className="space-y-6">
                   <h3 className="text-xl font-bold text-sb-navy-900 mb-4">Additional Info</h3>
                   
                   <div className="grid sm:grid-cols-2 gap-6">
                      {displayActivity.accessibility && (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                           <div className="flex items-center gap-2 font-bold text-gray-900 mb-2">
                             <Accessibility className="w-4 h-4 text-sb-navy-700" />
                             Accessibility
                           </div>
                           <ul className="text-sm text-gray-600 space-y-1">
                              {displayActivity.accessibility.map((item: any, i: number) => (
                                <li key={i}>• {item}</li>
                              ))}
                           </ul>
                        </div>
                      )}
                      
                      {displayActivity.cancellationPolicy && (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                           <div className="flex items-center gap-2 font-bold text-gray-900 mb-2">
                             <Ban className="w-4 h-4 text-sb-navy-700" />
                             Cancellation Policy
                           </div>
                           <p className="text-sm text-gray-600">{displayActivity.cancellationPolicy}</p>
                        </div>
                      )}

                      {displayActivity.whatToKnow && (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 sm:col-span-2">
                           <div className="flex items-center gap-2 font-bold text-gray-900 mb-2">
                             <Info className="w-4 h-4 text-sb-navy-700" />
                             Know Before You Go
                           </div>
                           <ul className="text-sm text-gray-600 grid sm:grid-cols-2 gap-2">
                              {displayActivity.whatToKnow.map((item: any, i: number) => (
                                <li key={i} className="flex gap-2">
                                  <span className="text-sb-teal-500">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                           </ul>
                        </div>
                      )}
                   </div>
                </section>
                
                 {/* Map Section (Placeholder mainly as we link to GMaps) */}
                 {(displayActivity.address || displayActivity.meetingPoint) && (
                  <section>
                    <h3 className="text-xl font-bold text-sb-navy-900 mb-4">Location</h3>
                    <div className="bg-gray-100 rounded-xl p-6 border border-gray-200 text-center">
                       <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                       <h4 className="font-bold text-gray-900">{displayActivity.address?.city || displayActivity.name}</h4>
                       <p className="text-gray-600 text-sm mb-4">
                        {[displayActivity.address?.street, displayActivity.address?.city, displayActivity.address?.country].filter(Boolean).join(', ')}
                       </p>
                       {displayActivity.meetingPoint && (
                         <div className="bg-white p-3 rounded-lg border border-gray-200 inline-block mb-4 text-left">
                            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Meeting Point</span>
                            <p className="text-sm font-medium">{displayActivity.meetingPoint}</p>
                         </div>
                       )}
                       <br />
                       {displayActivity.coordinates ? (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${displayActivity.coordinates.latitude},${displayActivity.coordinates.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sb-orange-600 font-bold hover:underline"
                          >
                            <ExternalLink className="w-4 h-4" /> View on Google Maps
                          </a>
                       ) : (
                          <span className="text-sm text-gray-500">Coordinates not available</span>
                       )}
                    </div>
                  </section>
                 )}

              </div>

              {/* Right Column - Sticky Booking Card */}
              <div className="lg:col-span-1">
                 <div className="sticky top-20 space-y-6">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                       <div className="p-6 border-b border-gray-100">
                          <div className="text-sm text-gray-500 mb-1">From</div>
                          <div className="flex items-baseline gap-1">
                            {displayActivity.estimatedCost || displayActivity.priceLevel ? (
                               <span className="text-3xl font-bold text-sb-navy-900">
                                  {displayActivity.estimatedCost || displayActivity.priceLevel}
                               </span>
                            ) : (
                               <span className="text-xl font-bold text-gray-400 italic">Price varies</span>
                            )}
                          </div>
                       </div>
                       
                       <div className="p-6 space-y-4">
                          {/* Key Details Grid */}
                          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                             <div className="flex flex-col gap-1">
                                <span className="text-gray-500 text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> Duration</span>
                                <span className="font-medium text-gray-900">{displayActivity.duration || "Flexible"}</span>
                             </div>
                             <div className="flex flex-col gap-1">
                                <span className="text-gray-500 text-xs flex items-center gap-1"><Ticket className="w-3 h-3" /> Ticket Type</span>
                                <span className="font-medium text-gray-900">Mobile Ticket</span>
                             </div>
                             <div className="flex flex-col gap-1">
                                <span className="text-gray-500 text-xs flex items-center gap-1"><Globe className="w-3 h-3" /> Language</span>
                                <span className="font-medium text-gray-900">English</span>
                             </div>
                             {displayActivity.bestTimeToVisit && (
                                <div className="flex flex-col gap-1">
                                   <span className="text-gray-500 text-xs flex items-center gap-1"><Calendar className="w-3 h-3" /> Best Time</span>
                                   <span className="font-medium text-gray-900 truncate" title={displayActivity.bestTimeToVisit}>{displayActivity.bestTimeToVisit}</span>
                                </div>
                             )}
                          </div>

                          {displayActivity.bookingUrl ? (
                            <a
                              href={displayActivity.bookingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-3 bg-sb-orange-500 hover:bg-sb-orange-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                            >
                              Check Availability
                            </a>
                          ) : (
                             <button disabled className="w-full py-3 bg-gray-100 text-gray-400 font-bold rounded-xl cursor-not-allowed">
                               Booking not available
                             </button>
                          )}
                          
                          <div className="text-center">
                             <p className="text-xs text-gray-500 mt-2">
                               <ShieldCheck className="w-3 h-3 inline mr-1 text-green-600" />
                               Free cancellation up to 24h before
                             </p>
                          </div>
                       </div>
                    </div>
                    
                    {/* Contact Card */}
                    {(displayActivity.phone || displayActivity.website) && (
                      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                         <h4 className="font-bold text-sb-navy-900 mb-3 text-sm">Operator Contact</h4>
                         <div className="space-y-3 text-sm">
                            {displayActivity.phone && (
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                                  <Phone className="w-4 h-4 text-gray-600" />
                                </div>
                                <a href={`tel:${displayActivity.phone}`} className="font-medium hover:text-sb-orange-500 transition">{displayActivity.phone}</a>
                              </div>
                            )}
                            {displayActivity.website && (
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                                  <Globe className="w-4 h-4 text-gray-600" />
                                </div>
                                <a href={displayActivity.website} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-sb-orange-500 transition truncate block max-w-[200px]">Official Website</a>
                              </div>
                            )}
                         </div>
                      </div>
                    )}
                 </div>
              </div>

            </div>
          </div>
        </div>

        {/* Mobile Sticky Action Bar */}
        <div className="lg:hidden p-4 bg-white border-t border-gray-200 sticky bottom-0 flex items-center justify-between gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20">
          <div>
            <div className="text-xs text-gray-500">From</div>
            <div className="font-bold text-sb-navy-900 text-lg">
              {displayActivity.estimatedCost || displayActivity.priceLevel || <span className="text-gray-400 italic font-normal text-sm">Varies</span>}
            </div>
          </div>
          {displayActivity.bookingUrl ? (
            <a
              href={displayActivity.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 bg-sb-orange-500 text-white text-center font-bold rounded-xl shadow-md"
            >
              Check Availability
            </a>
          ) : (
            <button
               onClick={onClose}
               className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl"
            >
              Close
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
