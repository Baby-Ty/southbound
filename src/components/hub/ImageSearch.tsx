'use client';

import { useState, useCallback } from 'react';
import { Search, X, Loader2, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UnsplashImage {
  id: string;
  urls: {
    small: string;
    regular: string;
    raw: string;
  };
  alt_description: string;
  user: {
    name: string;
    links: {
      html: string;
    };
  };
}

interface TripAdvisorImage {
  id: string;
  url: string;
  caption: string;
  locationId?: string;
}

interface ImageSearchProps {
  currentImage?: string;
  onSelect: (imageUrl: string) => void;
  cityName?: string;
  countryName?: string;
}

type ImageSource = 'unsplash' | 'tripadvisor';

export default function ImageSearch({ currentImage, onSelect, cityName, countryName }: ImageSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(cityName || '');
  const [imageSource, setImageSource] = useState<ImageSource>('unsplash');
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [tripadvisorImages, setTripadvisorImages] = useState<TripAdvisorImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState('');
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set());

  const searchTripAdvisorImages = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setTripadvisorImages([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setImageLoadErrors(new Set());
    setTripadvisorImages([]);

    try {
      // Search for city location first
      const searchResponse = await fetch('/api/tripadvisor/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityName: searchQuery,
          countryName: countryName,
          limit: 5, // Get top 5 locations
        }),
      });

      if (!searchResponse.ok) {
        throw new Error('Failed to search TripAdvisor');
      }

      const searchData = await searchResponse.json();
      const locations = searchData.results || searchData.activities || [];

      if (locations.length === 0) {
        setError(`No locations found for "${searchQuery}"`);
        return;
      }

      // Get photos from the first location (usually the city itself)
      const cityLocation = locations[0];
      if (!cityLocation.locationId) {
        setError('No location ID found');
        return;
      }

      // Fetch photos for the city location
      const photosResponse = await fetch(`/api/tripadvisor/location/${cityLocation.locationId}/photos`, {
        method: 'GET',
      });

      if (!photosResponse.ok) {
        throw new Error('Failed to fetch TripAdvisor photos');
      }

      const photosData = await photosResponse.json();
      const photos = photosData.photos || [];

      if (photos.length === 0) {
        setError('No photos found for this location');
        return;
      }

      // Convert to TripAdvisorImage format
      const tripadvisorImages: TripAdvisorImage[] = photos.slice(0, 20).map((photo: any, index: number) => ({
        id: photo.id || `ta-${index}`,
        url: photo.images?.large?.url || photo.images?.medium?.url || photo.images?.original?.url || '',
        caption: photo.caption || '',
        locationId: cityLocation.locationId,
      }));

      setTripadvisorImages(tripadvisorImages.filter(img => img.url));
    } catch (err: any) {
      console.error('TripAdvisor image search error:', err);
      setError(err.message || 'Failed to search TripAdvisor images');
      setTripadvisorImages([]);
    } finally {
      setLoading(false);
    }
  }, [countryName]);

  const searchImages = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setImages([]);
      setError(null);
      return;
    }
    
    setLoading(true);
    setError(null);
    setImageLoadErrors(new Set());
    // Clear previous images when starting a new search
    setImages([]);
    
    try {
      // Enhance search query for better results
      let enhancedQuery = searchQuery.toLowerCase().trim();
      
      // Add location context for better accuracy
      const cityEnhancements: Record<string, string> = {
        'chiang mai': 'chiang mai thailand temple old city',
        'chiangmai': 'chiang mai thailand temple old city',
        'chiang': 'chiang mai thailand',
        'bangkok': 'bangkok thailand city',
        'bali': 'bali indonesia beach temple',
        'canggu': 'canggu bali indonesia beach',
        'lisbon': 'lisbon portugal city',
        'barcelona': 'barcelona spain city',
        'amsterdam': 'amsterdam netherlands city canals',
        'medellin': 'medellin colombia city',
        'mexico city': 'mexico city cdmx',
        'buenos aires': 'buenos aires argentina city',
        'rio': 'rio de janeiro brazil',
        'lima': 'lima peru city',
        'valencia': 'valencia spain city',
        'porto': 'porto portugal city',
        'split': 'split croatia city',
        'budapest': 'budapest hungary city',
        'prague': 'prague czech republic city',
        'berlin': 'berlin germany city',
        'athens': 'athens greece city',
        'phuket': 'phuket thailand beach',
        'ubud': 'ubud bali indonesia',
      };
      
      // Use enhanced query if available, otherwise use original
      enhancedQuery = cityEnhancements[enhancedQuery] || enhancedQuery;
      
      // Use server-side API route (same as HighlightManager)
      const { apiUrl } = await import('@/lib/api');
      const response = await fetch(apiUrl(`images-search?query=${encodeURIComponent(enhancedQuery)}`));
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Failed to fetch images: ${response.status}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        // Check for rate limiting
        if (response.status === 403 || response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again in a few moments.');
        }
        
        // Check for invalid API key
        if (response.status === 401) {
          throw new Error('Invalid Unsplash API key. Please check your configuration.');
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      // Check if we got results
      if (!data || data.length === 0) {
        setError(`No images found for "${searchQuery}". Try a different search term.`);
        setImages([]);
        return;
      }
      
      // Transform API response to UnsplashImage format
      const unsplashImages: UnsplashImage[] = data.map((img: any) => ({
        id: img.id,
        urls: {
          small: img.thumb || img.url,
          regular: img.url,
          raw: img.url,
        },
        alt_description: img.alt || '',
        user: {
          name: img.user || 'Unsplash',
          links: {
            html: 'https://unsplash.com',
          },
        },
      }));
      
      setImages(unsplashImages);
      setError(null); // Clear any previous errors
    } catch (err: any) {
      console.error('Image search error:', err);
      setError(err.message || 'Failed to search images. Please try again.');
      
      // Only fallback to default images if it's not a rate limit or API key error
      if (!err.message?.includes('Rate limit') && !err.message?.includes('API key')) {
        const defaultImages = getDefaultCityImages(searchQuery);
        if (defaultImages.length > 0) {
          setImages(defaultImages);
          setError(`Using default images. ${err.message}`);
        } else {
          setImages([]);
        }
      } else {
        setImages([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }
    if (imageSource === 'tripadvisor') {
      searchTripAdvisorImages(query.trim());
    } else {
      searchImages(query.trim());
    }
  };
  
  // Handle query changes - clear error when user types
  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleSelect = async (image: UnsplashImage) => {
    setUploading(true);
    setError(null);
    
    // Use the regular size with auto format and good quality
    // Check if URL already has query parameters
    const separator = image.urls.raw.includes('?') ? '&' : '?';
    const imageUrl = `${image.urls.raw}${separator}w=1200&fit=crop&auto=format&q=80`;
    
    // Automatically upload to blob storage
    try {
      const { apiUrl } = await import('@/lib/api');
      const response = await fetch(apiUrl('images/upload'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          category: 'cities',
          filename: `city-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.jpg`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Use blob URL instead of original URL
        onSelect(data.blobUrl);
        setIsOpen(false);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to upload image');
      }
    } catch (error: any) {
      // Fallback to original URL if upload fails
      console.error('Error uploading to blob storage:', error);
      setError(error.message || 'Failed to upload to blob storage. Using original URL.');
      // Still allow selection with original URL as fallback
      onSelect(imageUrl);
      setIsOpen(false);
    } finally {
      setUploading(false);
    }
  };

  const handleTripAdvisorSelect = async (image: TripAdvisorImage) => {
    setUploading(true);
    setError(null);
    
    // Automatically upload to blob storage
    try {
      const { apiUrl } = await import('@/lib/api');
      const response = await fetch(apiUrl('images/upload'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: image.url,
          category: 'cities',
          filename: `city-ta-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.jpg`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Use blob URL instead of original URL
        onSelect(data.blobUrl);
        setIsOpen(false);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to upload image');
      }
    } catch (error: any) {
      // Fallback to original URL if upload fails
      console.error('Error uploading to blob storage:', error);
      setError(error.message || 'Failed to upload to blob storage. Using original URL.');
      // Still allow selection with original URL as fallback
      onSelect(image.url);
      setIsOpen(false);
    } finally {
      setUploading(false);
    }
  };

  const handleManualUrl = async () => {
    if (!manualUrl.trim()) return;
    
    setUploading(true);
    setError(null);
    const url = manualUrl.trim();
    
    // Check if it's already a blob URL
    if (url.includes('.blob.core.windows.net')) {
      onSelect(url);
      setManualUrl('');
      setIsOpen(false);
      setUploading(false);
      return;
    }

    // Upload to blob storage
    try {
      const { apiUrl } = await import('@/lib/api');
      const response = await fetch(apiUrl('images/upload'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: url,
          category: 'cities',
          filename: `city-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.jpg`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onSelect(data.blobUrl);
        setManualUrl('');
        setIsOpen(false);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to upload image');
      }
    } catch (error: any) {
      // Fallback to original URL if upload fails
      console.error('Error uploading to blob storage:', error);
      setError(error.message || 'Failed to upload to blob storage. Using original URL.');
      onSelect(url);
      setManualUrl('');
      setIsOpen(false);
    } finally {
      setUploading(false);
    }
  };

  const handleImageError = (imageId: string) => {
    setImageLoadErrors(prev => new Set(prev).add(imageId));
  };

  return (
    <div className="space-y-4">
      {/* Current Image Preview */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-100 border-2 border-dashed border-stone-300 group">
        {currentImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImage}
              alt="City preview"
              className="absolute inset-0 w-full h-full object-cover"
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-white rounded-lg font-medium text-stone-900 hover:bg-stone-100 transition flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                Change Image
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => {
              setQuery(cityName || '');
              setIsOpen(true);
            }}
            className="absolute inset-0 flex flex-col items-center justify-center text-stone-500 hover:text-stone-700 hover:bg-stone-50 transition"
          >
            <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
            <span className="font-medium">Click to add an image</span>
            <span className="text-sm text-stone-400">Search Unsplash or paste URL</span>
          </button>
        )}
      </div>

      {/* Image Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-stone-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-stone-900">Choose City Image</h3>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-stone-100 transition"
                  >
                    <X className="w-5 h-5 text-stone-500" />
                  </button>
                </div>

                {/* Source Selection */}
                <div className="flex gap-2 mb-4 border-b border-stone-200">
                  <button
                    type="button"
                    onClick={() => {
                      setImageSource('unsplash');
                      setImages([]);
                      setTripadvisorImages([]);
                      setError(null);
                    }}
                    className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                      imageSource === 'unsplash'
                        ? 'border-sb-orange-500 text-sb-orange-600'
                        : 'border-transparent text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Unsplash
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImageSource('tripadvisor');
                      setImages([]);
                      setTripadvisorImages([]);
                      setError(null);
                      if (query.trim()) {
                        searchTripAdvisorImages(query.trim());
                      }
                    }}
                    className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                      imageSource === 'tripadvisor'
                        ? 'border-sb-orange-500 text-sb-orange-600'
                        : 'border-transparent text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    TripAdvisor
                  </button>
                </div>

                {/* Search Form */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => handleQueryChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSearch();
                        }
                      }}
                      placeholder="Search for city photos..."
                      className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSearch();
                    }}
                    disabled={loading || uploading}
                    className="px-6 py-3 bg-sb-orange-500 text-white rounded-lg font-medium hover:bg-sb-orange-600 transition disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
                  </button>
                </div>

                {/* Upload Status */}
                {uploading && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-sm text-blue-700">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading image to blob storage...
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center justify-between">
                    <span>{error}</span>
                    {query.trim() && !loading && (
                      <button
                        type="button"
                        onClick={() => {
                          setError(null);
                          searchImages(query.trim());
                        }}
                        className="ml-2 px-2 py-1 text-xs font-medium text-red-700 hover:text-red-900 underline"
                      >
                        Retry
                      </button>
                    )}
                  </div>
                )}

                {/* Manual URL Input */}
                <div className="mt-3 flex gap-2">
                  <input
                    type="url"
                    value={manualUrl}
                    onChange={(e) => setManualUrl(e.target.value)}
                    placeholder="Or paste an image URL directly..."
                    className="flex-1 px-4 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleManualUrl}
                    disabled={!manualUrl.trim() || uploading}
                    className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-200 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      'Use URL'
                    )}
                  </button>
                </div>

                {/* Upload Status */}
                {uploading && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-sm text-blue-700">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading image to blob storage...
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                  </div>
                )}
              </div>

              {/* Image Grid */}
              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-sb-orange-500" />
                  </div>
                ) : error ? (
                  <div className="text-center py-12 text-stone-500">
                    <p>{error}</p>
                  </div>
                ) : imageSource === 'unsplash' && images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image) => (
                      <button
                        key={image.id}
                        type="button"
                        onClick={() => handleSelect(image)}
                        className="group relative aspect-video rounded-lg overflow-hidden bg-stone-100 hover:ring-2 hover:ring-sb-orange-500 transition focus:outline-none focus:ring-2 focus:ring-sb-orange-500"
                      >
                        {!imageLoadErrors.has(image.id) ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={image.urls.small}
                            alt={image.alt_description || 'City photo'}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            loading="lazy"
                            onError={() => handleImageError(image.id)}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-stone-200">
                            <ImageIcon className="w-8 h-8 text-stone-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition">
                          <div className="absolute bottom-2 left-2 right-2 text-white text-xs">
                            <span className="font-medium">Photo by {image.user.name}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : imageSource === 'tripadvisor' && tripadvisorImages.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {tripadvisorImages.map((image) => (
                      <button
                        key={image.id}
                        type="button"
                        onClick={() => handleTripAdvisorSelect(image)}
                        className="group relative aspect-video rounded-lg overflow-hidden bg-stone-100 hover:ring-2 hover:ring-sb-orange-500 transition focus:outline-none focus:ring-2 focus:ring-sb-orange-500"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image.url}
                          alt={image.caption || 'City photo'}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          loading="lazy"
                        />
                        {image.caption && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition">
                            <div className="absolute bottom-2 left-2 right-2 text-white text-xs">
                              <span className="font-medium">{image.caption}</span>
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-stone-500">
                    <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">Search for photos</p>
                    <p className="text-sm">Try searching for &quot;{cityName || 'city name'}&quot;</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-stone-200 bg-stone-50 text-center text-xs text-stone-500">
                {imageSource === 'unsplash' ? (
                  <>
                    Photos by{' '}
                    <a
                      href="https://unsplash.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-stone-700"
                    >
                      Unsplash
                    </a>
                  </>
                ) : (
                  <>
                    Photos from{' '}
                    <a
                      href="https://tripadvisor.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-stone-700"
                    >
                      TripAdvisor
                    </a>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Fallback images for common cities when Unsplash API is not available
function getDefaultCityImages(query: string): UnsplashImage[] {
  const cityImages: Record<string, string[]> = {
    lisbon: [
      'https://images.unsplash.com/photo-1585208798174-6cedd86e019a',
      'https://images.unsplash.com/photo-1536697246787-1f7ae568d89a',
      'https://images.unsplash.com/photo-1558369981-f9ca78462e61',
    ],
    barcelona: [
      'https://images.unsplash.com/photo-1583422409516-2895a77efded',
      'https://images.unsplash.com/photo-1539037116277-4db20889f2d4',
      'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216',
    ],
    amsterdam: [
      'https://images.unsplash.com/photo-1512470876302-687d6e3e6fbb',
      'https://images.unsplash.com/photo-1534351590666-13e3e96b5017',
      'https://images.unsplash.com/photo-1576924542622-772281b13aa8',
    ],
    bali: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2',
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47',
    ],
    canggu: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2',
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47',
    ],
    chiang: [
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a', // Wat Phra That Doi Suthep - golden temple
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96', // Chiang Mai old city with temples
      'https://images.unsplash.com/photo-1598965675045-13e5a5c5bf1f', // Traditional Thai temple architecture
    ],
    'chiang mai': [
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a', // Wat Phra That Doi Suthep - golden temple
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96', // Chiang Mai old city with temples
      'https://images.unsplash.com/photo-1598965675045-13e5a5c5bf1f', // Traditional Thai temple architecture
    ],
    chiangmai: [
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a', // Wat Phra That Doi Suthep - golden temple
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96', // Chiang Mai old city with temples
      'https://images.unsplash.com/photo-1598965675045-13e5a5c5bf1f', // Traditional Thai temple architecture
    ],
    thailand: [
      'https://images.unsplash.com/photo-1598965675045-13e5a5c5bf1f',
      'https://images.unsplash.com/photo-1548013146-72479768bada',
      'https://images.unsplash.com/photo-1528181304800-259b08848526',
    ],
    'mexico city': [
      'https://images.unsplash.com/photo-1518638150340-f706e86654de',
      'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396',
      'https://images.unsplash.com/photo-1574493264149-87eb2d220c4b',
    ],
    medellin: [
      'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d',
      'https://images.unsplash.com/photo-1599938288650-90c22cbb5d30',
      'https://images.unsplash.com/photo-1567607673553-2f2cad3cf38d',
    ],
    bangkok: [
      'https://images.unsplash.com/photo-1548013146-72479768bada',
      'https://images.unsplash.com/photo-1563492065599-3520f775eeed',
      'https://images.unsplash.com/photo-1508009603885-50cf7c579365',
    ],
    porto: [
      'https://images.unsplash.com/photo-1555881400-74d7acaacd81',
      'https://images.unsplash.com/photo-1569959220744-ff553533f492',
      'https://images.unsplash.com/photo-1558102822-da570e4ad00d',
    ],
    split: [
      'https://images.unsplash.com/photo-1555990538-c3c52b21c548',
      'https://images.unsplash.com/photo-1565030468871-c1e6dc1d48bb',
      'https://images.unsplash.com/photo-1565365236856-43bea4ec5c8a',
    ],
    valencia: [
      'https://images.unsplash.com/photo-1562135036-e455172d52c5',
      'https://images.unsplash.com/photo-1583318867613-2c04d0a47c6a',
      'https://images.unsplash.com/photo-1599211005005-c70f7c2406af',
    ],
    budapest: [
      'https://images.unsplash.com/photo-1565426873118-a17ed65d74e9',
      'https://images.unsplash.com/photo-1541343672885-9be56236302a',
      'https://images.unsplash.com/photo-1549923746-c502d488b3ea',
    ],
    prague: [
      'https://images.unsplash.com/photo-1541849546-2165492d1373',
      'https://images.unsplash.com/photo-1519677100203-a0e668c92439',
      'https://images.unsplash.com/photo-1562624475-96c2bc08fab9',
    ],
    berlin: [
      'https://images.unsplash.com/photo-1560969184-10fe8719e047',
      'https://images.unsplash.com/photo-1587330979470-3595ac045ab0',
      'https://images.unsplash.com/photo-1528728329032-2972f65dfb3f',
    ],
    rio: [
      'https://images.unsplash.com/photo-1483729558449-99ef09a8c325',
      'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f',
      'https://images.unsplash.com/photo-1544989164-31dc3c645987',
    ],
    'buenos aires': [
      'https://images.unsplash.com/photo-1589909202802-8f4aadce1849',
      'https://images.unsplash.com/photo-1612294037637-ec328d0e075e',
      'https://images.unsplash.com/photo-1588005820380-b7a2b9e6d98c',
    ],
    lima: [
      'https://images.unsplash.com/photo-1531968455001-5c5272a41129',
      'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4',
      'https://images.unsplash.com/photo-1613483047522-54f76893d8ed',
    ],
    'da nang': [
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482',
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b',
      'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb',
    ],
    'ho chi minh': [
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b',
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482',
      'https://images.unsplash.com/photo-1557750255-c76072a7aad1',
    ],
    singapore: [
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd',
      'https://images.unsplash.com/photo-1508964942454-1a56651d54ac',
      'https://images.unsplash.com/photo-1565967511849-76a60a516170',
    ],
    'kuala lumpur': [
      'https://images.unsplash.com/photo-1535202468039-117770371865',
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f07',
      'https://images.unsplash.com/photo-1508062878650-88b52897f298',
    ],
    ubud: [
      'https://images.unsplash.com/photo-1536693789243-d72b7b1e4d8f',
      'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f',
      'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b',
    ],
    phuket: [
      'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5',
      'https://images.unsplash.com/photo-1554481923-a6918bd997bc',
      'https://images.unsplash.com/photo-1589822661005-c75e9f48ee8f',
    ],
  };

  const normalizedQuery = query.toLowerCase().trim();
  // Also check without spaces and individual words
  const queryNoSpaces = normalizedQuery.replace(/\s+/g, '');
  const queryWords = normalizedQuery.split(/\s+/);
  
  const matchingUrls = Object.entries(cityImages).find(([key]) => {
    const keyNoSpaces = key.replace(/\s+/g, '');
    return (
      normalizedQuery.includes(key) || 
      key.includes(normalizedQuery) ||
      queryNoSpaces.includes(keyNoSpaces) ||
      keyNoSpaces.includes(queryNoSpaces) ||
      queryWords.some(word => word.length > 3 && key.includes(word))
    );
  })?.[1] || [];

  // Add some generic city images as fallback
  const genericUrls = [
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000',
    'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b',
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df',
    'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb',
    'https://images.unsplash.com/photo-1444723121867-7a241cacace9',
    'https://images.unsplash.com/photo-1534430480872-3498386e7856',
  ];

  const urls = matchingUrls.length > 0 ? matchingUrls : genericUrls;

  return urls.map((url, index) => ({
    id: `fallback-${index}`,
    urls: {
      small: `${url}?w=400&auto=format&fit=crop`,
      regular: `${url}?w=1080&auto=format&fit=crop`,
      raw: url,
    },
    alt_description: `${query} city photo`,
    user: {
      name: 'Unsplash',
      links: { html: 'https://unsplash.com' },
    },
  }));
}
