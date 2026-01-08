/**
 * TripAdvisor Content API Client
 * 
 * Documentation: https://developer.tripadvisor.com/content-api/
 */

export interface TripAdvisorLocation {
  location_id: string;
  name: string;
  address_obj?: {
    street1?: string;
    street2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalcode?: string;
  };
  latitude?: string;
  longitude?: string;
  timezone?: string;
  phone?: string;
  website?: string;
  rating?: string;
  rating_image_url?: string;
  num_reviews?: string;
  review_rating_count?: Record<string, string>;
  photo_count?: string;
  price_level?: string;
  amenities?: string[];
  category?: {
    key: string;
    name: string;
  };
  subcategory?: Array<{
    key: string;
    name: string;
  }>;
  web_url?: string;
  write_review?: string;
  ancestors?: Array<{
    level: string;
    name: string;
    location_id: string;
  }>;
  description?: string;
  hours?: {
    week_ranges: Array<Array<{ open_time: string; close_time: string }>>;
    timezone: string;
  };
}

export interface TripAdvisorPhoto {
  images: {
    small?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    large?: { url: string; width: number; height: number };
    original?: { url: string; width: number; height: number };
  };
  is_blessed: boolean;
  uploaded_date: string;
  caption: string;
  id: string;
  helpful_votes: string;
  published_date: string;
  user: {
    username: string;
  };
}

export interface TripAdvisorSearchResponse {
  data: TripAdvisorLocation[];
  paging?: {
    results: string;
    total_results: string;
  };
}

export interface TripAdvisorPhotosResponse {
  data: TripAdvisorPhoto[];
  paging?: {
    results: string;
    total_results: string;
  };
}

export interface TripAdvisorActivity {
  locationId: string;
  name: string;
  description?: string;
  // Optional richer itinerary content (admin/enrichment workflows may attach this)
  itinerary?: any;
  inclusions?: string[];
  exclusions?: string[];
  category?: string;
  subcategories?: string[];
  rating?: number;
  reviewCount?: number;
  images: string[]; // Legacy: URLs for backward compatibility
  photos?: TripAdvisorPhoto[]; // Full photo objects with metadata
  blobPhotos?: string[]; // URLs stored in Azure Blob Storage
  webUrl?: string;
  priceInfo?: string; // Pricing information: "Free", "Included", or price range
  priceRange?: string; // Legacy: price range
  highlights?: string[]; // What you'll see/experience at this location
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalcode?: string;
  };
  coordinates?: {
    latitude?: number;
    longitude?: number;
  };
  priceLevel?: string;
  phone?: string;
  website?: string;
  hours?: {
    weekRanges: Array<Array<{ openTime: string; closeTime: string }>>;
    timezone?: string;
  };
  amenities?: string[]; // Added: amenities like wheelchair accessible, etc.
  reviewRatingCount?: Record<string, number>; // Added: breakdown of ratings
  isDefault?: boolean;
  isCurated?: boolean; // Added: whether this activity is in the curated gallery for users
  lastSynced?: string;
  // Allow additional enrichment/admin fields without constantly expanding the type.
  [key: string]: any;
}

class TripAdvisorClient {
  private apiKey: string;
  private baseUrl = 'https://api.content.tripadvisor.com/api/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.TRIPADVISOR_API_KEY || '';
    if (!this.apiKey) {
      console.warn('TripAdvisor API key not configured');
    }
  }

  /**
   * Search for locations by query string
   */
  async searchLocations(
    query: string,
    options?: {
      language?: string;
      currency?: string;
      limit?: number;
    }
  ): Promise<TripAdvisorLocation[]> {
    if (!this.apiKey) {
      throw new Error('TripAdvisor API key not configured');
    }

    const params = new URLSearchParams({
      key: this.apiKey,
      searchQuery: query,
      language: options?.language || 'en',
      ...(options?.currency && { currency: options.currency }),
      ...(options?.limit && { limit: options.limit.toString() }),
    });

    const url = `${this.baseUrl}/location/search?${params}`;
    console.log('[TripAdvisor] Searching locations for query:', query);
    console.log('[TripAdvisor] API Key length:', this.apiKey.length);
    console.log('[TripAdvisor] Full URL (without key):', url.replace(this.apiKey, 'REDACTED'));

    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `TripAdvisor API error: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch {
          errorMessage += ` - ${errorText.substring(0, 200)}`;
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON but got ${contentType}. Response: ${text.substring(0, 200)}`);
      }

      const data: TripAdvisorSearchResponse = await response.json();
      return data.data || [];
    } catch (error: any) {
      console.error('TripAdvisor search error:', error);
      throw error;
    }
  }

  /**
   * Search for attractions in a specific location
   */
  async searchAttractions(
    locationId: string,
    options?: {
      language?: string;
      currency?: string;
      limit?: number;
      category?: string; // e.g., 'attractions'
    }
  ): Promise<TripAdvisorLocation[]> {
    if (!this.apiKey) {
      throw new Error('TripAdvisor API key not configured');
    }

    const params = new URLSearchParams({
      key: this.apiKey,
      language: options?.language || 'en',
      ...(options?.currency && { currency: options.currency }),
      ...(options?.limit && { limit: options.limit.toString() }),
      ...(options?.category && { category: options.category }),
    });

    const url = `${this.baseUrl}/location/${locationId}/attractions?${params}`;
    console.log('[TripAdvisor] Searching attractions for location:', locationId);
    console.log('[TripAdvisor] API Key length:', this.apiKey.length);
    console.log('[TripAdvisor] Full URL (without key):', url.replace(this.apiKey, 'REDACTED'));

    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[TripAdvisor Attractions] Error details:', {
          status: response.status,
          statusText: response.statusText,
          url: url.replace(this.apiKey, 'REDACTED'),
          responseBody: errorText.substring(0, 500),
        });
        let errorMessage = `TripAdvisor API error: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch {
          errorMessage += ` - ${errorText.substring(0, 200)}`;
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON but got ${contentType}. Response: ${text.substring(0, 200)}`);
      }

      const data: TripAdvisorSearchResponse = await response.json();
      return data.data || [];
    } catch (error: any) {
      console.error('TripAdvisor attractions search error:', error);
      throw error;
    }
  }

  /**
   * Get location details by ID
   */
  async getLocationDetails(
    locationId: string,
    options?: {
      language?: string;
      currency?: string;
    }
  ): Promise<TripAdvisorLocation | null> {
    if (!this.apiKey) {
      throw new Error('TripAdvisor API key not configured');
    }

    const params = new URLSearchParams({
      key: this.apiKey,
      language: options?.language || 'en',
      ...(options?.currency && { currency: options.currency }),
    });

    try {
      const response = await fetch(
        `${this.baseUrl}/location/${locationId}/details?${params}`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        const errorText = await response.text();
        throw new Error(`TripAdvisor API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`[TripAdvisor Client] Got details for ${locationId}. Description present: ${!!(data as any).description}`);
      if (!(data as any).description) {
        console.log('[TripAdvisor Client] Keys:', Object.keys(data));
      }
      return data as TripAdvisorLocation;
    } catch (error: any) {
      console.error('TripAdvisor location details error:', error);
      throw error;
    }
  }

  /**
   * Get photos for a location
   */
  async getLocationPhotos(
    locationId: string,
    options?: {
      language?: string;
      limit?: number;
    }
  ): Promise<TripAdvisorPhoto[]> {
    if (!this.apiKey) {
      throw new Error('TripAdvisor API key not configured');
    }

    const params = new URLSearchParams({
      key: this.apiKey,
      language: options?.language || 'en',
      ...(options?.limit && { limit: options.limit.toString() }),
    });

    try {
      const response = await fetch(
        `${this.baseUrl}/location/${locationId}/photos?${params}`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`TripAdvisor API error: ${response.status} - ${errorText}`);
      }

      const data: TripAdvisorPhotosResponse = await response.json();
      return data.data || [];
    } catch (error: any) {
      console.error('TripAdvisor photos error:', error);
      throw error;
    }
  }

  /**
   * Convert TripAdvisor location to our Activity format
   */
  async locationToActivity(
    location: TripAdvisorLocation,
    includePhotos: boolean = true
  ): Promise<TripAdvisorActivity> {
    // Get photos if requested - fetch up to 5 photos with full metadata
    let images: string[] = [];
    let photos: TripAdvisorPhoto[] = [];
    
    if (includePhotos && location.location_id) {
      try {
        const fetchedPhotos = await this.getLocationPhotos(location.location_id, { limit: 5 });
        photos = fetchedPhotos;
        
        // Extract URLs for backward compatibility (images array)
        images = photos
          .map((photo) => photo.images?.large?.url || photo.images?.medium?.url || photo.images?.original?.url)
          .filter((url): url is string => !!url);
      } catch (error) {
        console.warn('Failed to fetch photos for location:', location.location_id, error);
      }
    }

    // Use category image if available and no photos found
    if (location.rating_image_url && images.length === 0) {
      images = [location.rating_image_url];
    }

    return {
      locationId: location.location_id,
      name: location.name,
      // Don't include TripAdvisor description - we'll generate descriptions with AI instead
      description: undefined,
      category: location.category?.name,
      subcategories: location.subcategory?.map((s) => s.name),
      rating: location.rating ? parseFloat(location.rating) : undefined,
      reviewCount: location.num_reviews ? parseInt(location.num_reviews) : undefined,
      images, // Legacy URLs for backward compatibility
      photos: photos.length > 0 ? photos : undefined, // Full photo objects with metadata
      webUrl: location.web_url,
      address: location.address_obj
        ? {
            street: location.address_obj.street1,
            city: location.address_obj.city,
            state: location.address_obj.state,
            country: location.address_obj.country,
            postalcode: location.address_obj.postalcode,
          }
        : undefined,
      coordinates: location.latitude && location.longitude
        ? {
            latitude: parseFloat(location.latitude),
            longitude: parseFloat(location.longitude),
          }
        : undefined,
      priceLevel: location.price_level,
      phone: location.phone,
      website: location.website,
      hours: location.hours
        ? {
            weekRanges: location.hours.week_ranges.map((day) =>
              day.map((range) => ({
                openTime: range.open_time,
                closeTime: range.close_time,
              }))
            ),
            timezone: location.hours.timezone,
          }
        : undefined,
      amenities: location.amenities,
      reviewRatingCount: location.review_rating_count
        ? Object.entries(location.review_rating_count).reduce((acc, [key, value]) => {
            acc[key] = parseInt(value);
            return acc;
          }, {} as Record<string, number>)
        : undefined,
      isDefault: false,
      isCurated: false,
      lastSynced: new Date().toISOString(),
    };
  }

  /**
   * Search for top attractions in a city
   * Note: The /location/{id}/attractions endpoint requires special permissions
   * So we search for attractions directly using location search instead
   */
  async searchCityAttractions(
    cityName: string,
    countryName?: string,
    options?: {
      limit?: number;
      includePhotos?: boolean;
    }
  ): Promise<TripAdvisorActivity[]> {
    // Search directly for attractions in the city
    const searchQuery = countryName 
      ? `things to do ${cityName} ${countryName}` 
      : `things to do ${cityName}`;
    
    console.log('[TripAdvisor] Searching for attractions using query:', searchQuery);
    
    const locations = await this.searchLocations(searchQuery, {
      limit: options?.limit || 30,
      language: 'en',
    });

    if (locations.length === 0) {
      console.log('[TripAdvisor] No attractions found for:', searchQuery);
      return [];
    }

    console.log(`[TripAdvisor] Found ${locations.length} potential attractions`);

    // Convert to activities
    const activities: TripAdvisorActivity[] = [];
    for (const location of locations) {
      try {
        const activity = await this.locationToActivity(
          location,
          options?.includePhotos !== false
        );
        activities.push(activity);
      } catch (error) {
        console.warn('Failed to convert location to activity:', location.location_id, error);
      }
    }

    return activities;
  }
}

// Export singleton instance
export const tripAdvisorClient = new TripAdvisorClient();

// Export class for custom instances
export default TripAdvisorClient;

