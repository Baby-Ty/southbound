'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  Upload,
  Search,
  Sparkles,
  Loader2,
  ImageIcon,
  Wand2,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  Star,
  ExternalLink,
  MapPin,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { apiUrl } from '@/lib/api';
import { uploadImageBuffer } from '@/lib/azureBlob';
import { getActivityPrompt } from '@/lib/dallePrompts';
import { TripAdvisorActivity } from '@/lib/tripadvisor';

interface CustomActivity {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  isCustom: true;
  createdAt: string;
}

interface CustomActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  cityName: string;
  countryName?: string;
  cityId?: string;
  editingActivity?: CustomActivity | null;
  onSave: (activity: CustomActivity) => void;
}

type ImageTab = 'upload' | 'stock' | 'generate';

interface UnsplashImage {
  id: string;
  url: string;
  thumb: string;
  alt: string;
  user: string;
}

type ModalMode = 'tripadvisor' | 'custom';

export default function CustomActivityModal({
  isOpen,
  onClose,
  cityName,
  countryName,
  cityId,
  editingActivity,
  onSave,
}: CustomActivityModalProps) {
  const [mode, setMode] = useState<ModalMode>(editingActivity ? 'custom' : 'tripadvisor');
  const [activeTab, setActiveTab] = useState<ImageTab>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(editingActivity?.imageUrl || null);
  const [title, setTitle] = useState(editingActivity?.title || '');
  const [description, setDescription] = useState(editingActivity?.description || '');
  const [category, setCategory] = useState('');
  
  // TripAdvisor activities state
  const [tripAdvisorActivities, setTripAdvisorActivities] = useState<TripAdvisorActivity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  
  // Upload state
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Stock photos state
  const [stockQuery, setStockQuery] = useState(`${cityName} ${countryName || ''}`);
  const [stockImages, setStockImages] = useState<UnsplashImage[]>([]);
  const [searchingStock, setSearchingStock] = useState(false);
  
  // AI generation state
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  
  // AI polish state
  const [polishingDescription, setPolishingDescription] = useState(false);
  
  // Validation
  const [error, setError] = useState<string | null>(null);

  // Load TripAdvisor activities when modal opens and mode is tripadvisor
  useEffect(() => {
    if (isOpen && mode === 'tripadvisor' && cityId) {
      loadTripAdvisorActivities();
    }
  }, [isOpen, mode, cityId]);

  async function loadTripAdvisorActivities() {
    if (!cityId) return;
    
    setLoadingActivities(true);
    try {
      const response = await fetch(apiUrl(`cities/${cityId}/activities`));
      if (response.ok) {
        const data = await response.json();
        // Show curated activities first, then defaults, then others
        const activities = data.activities || [];
        const curatedActivities = activities.filter((a: TripAdvisorActivity) => a.isCurated);
        const defaultActivities = activities.filter((a: TripAdvisorActivity) => a.isDefault && !a.isCurated);
        const otherActivities = activities.filter((a: TripAdvisorActivity) => !a.isCurated && !a.isDefault);
        
        // Prioritize: curated > defaults > others
        const sortedActivities = [...curatedActivities, ...defaultActivities, ...otherActivities].sort((a, b) => {
          // Within each group, sort by rating if available
          if (a.rating && b.rating) {
            return b.rating - a.rating;
          }
          return 0;
        });
        
        setTripAdvisorActivities(sortedActivities);
      }
    } catch (error) {
      console.error('Error loading TripAdvisor activities:', error);
    } finally {
      setLoadingActivities(false);
    }
  }

  function handleSelectTripAdvisorActivity(activity: TripAdvisorActivity) {
    const customActivity = {
      id: `tripadvisor-${activity.locationId}`,
      title: activity.name,
      description: activity.description || `Experience ${activity.name}${cityName ? ` in ${cityName}` : ''}.`,
      imageUrl: activity.images && activity.images.length > 0 ? activity.images[0] : '',
      isCustom: true as const,
      createdAt: new Date().toISOString(),
    };
    
    onSave(customActivity);
    handleClose();
  }

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const imageUrl = await uploadImageBuffer(buffer, 'activities');
      setSelectedImage(imageUrl);
      setActiveTab('upload');
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleStockSearch = useCallback(async () => {
    if (!stockQuery.trim()) {
      setStockImages([]);
      return;
    }

    setSearchingStock(true);
    setError(null);

    try {
      const response = await fetch(apiUrl(`images-search?query=${encodeURIComponent(stockQuery)}`));
      
      if (!response.ok) {
        throw new Error('Failed to search stock photos');
      }

      const data = await response.json();
      setStockImages(data || []);
    } catch (err: any) {
      console.error('Stock search error:', err);
      setError(err.message || 'Failed to search stock photos');
      setStockImages([]);
    } finally {
      setSearchingStock(false);
    }
  }, [stockQuery]);

  const handleGenerateImage = async () => {
    if (!title.trim()) {
      setError('Please enter an activity title first');
      return;
    }

    setGeneratingImage(true);
    setError(null);

    try {
      const prompt = getActivityPrompt({
        activityName: title,
        cityName,
        country: countryName,
      });

      const response = await fetch(apiUrl('images-generate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'activity',
          context: {
            activityName: title,
            cityName,
            country: countryName,
          },
          customPrompt: prompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();
      setGeneratedImageUrl(data.imageUrl);
      setSelectedImage(data.imageUrl);
    } catch (err: any) {
      console.error('Image generation error:', err);
      setError(err.message || 'Failed to generate image');
    } finally {
      setGeneratingImage(false);
    }
  };

  const handlePolishDescription = async () => {
    if (!description.trim() || description.length < 50) {
      setError('Please enter at least 50 characters of description before polishing');
      return;
    }

    setPolishingDescription(true);
    setError(null);

    try {
      const response = await fetch(apiUrl('activities/polish-description'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: cityName,
          country: countryName,
          title,
          description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to polish description');
      }

      const data = await response.json();
      setDescription(data.polishedDescription || description);
    } catch (err: any) {
      console.error('Polish error:', err);
      setError(err.message || 'Failed to polish description');
    } finally {
      setPolishingDescription(false);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      setError('Please enter an activity title');
      return;
    }

    if (!description.trim() || description.length < 50) {
      setError('Please enter at least 50 characters of description');
      return;
    }

    if (!selectedImage) {
      setError('Please select or upload an image');
      return;
    }

    const activity: CustomActivity = {
      id: editingActivity?.id || `custom-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      imageUrl: selectedImage,
      isCustom: true as const,
      createdAt: editingActivity?.createdAt || new Date().toISOString(),
    };

    onSave(activity);
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setSelectedImage(null);
    setStockImages([]);
    setGeneratedImageUrl(null);
    setError(null);
    setActiveTab('upload');
    setMode('tripadvisor');
    setTripAdvisorActivities([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">
              {editingActivity ? 'Edit Activity' : 'Add Activity'}
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              {editingActivity ? 'Update your custom activity' : 'Choose from curated activities or create your own'}
            </p>
          </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-stone-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Mode Selector - hide if editing */}
          {!editingActivity && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setMode('tripadvisor');
                  if (cityId) loadTripAdvisorActivities();
                }}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
                  mode === 'tripadvisor'
                    ? 'bg-sb-orange-500 text-white shadow-md'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Star className="w-4 h-4 inline mr-2" />
                Choose from TripAdvisor
              </button>
              <button
                onClick={() => setMode('custom')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
                  mode === 'custom'
                    ? 'bg-sb-orange-500 text-white shadow-md'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Sparkles className="w-4 h-4 inline mr-2" />
                Create Custom Activity
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* TripAdvisor Activities Mode */}
          {mode === 'tripadvisor' && (
            <div>
              {loadingActivities ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-sb-orange-500" />
                </div>
              ) : tripAdvisorActivities.length === 0 ? (
                <div className="text-center py-12 bg-stone-50 rounded-lg border border-stone-200">
                  <p className="text-stone-500 mb-4">
                    {cityId ? 'No activities available for this city yet. Admins can curate activities from TripAdvisor.' : 'City ID not available. Please create a custom activity instead.'}
                  </p>
                  <button
                    onClick={() => setMode('custom')}
                    className="px-4 py-2 bg-sb-orange-500 text-white rounded-lg hover:bg-sb-orange-600 transition"
                  >
                    Create Custom Activity Instead
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-stone-900">
                        Activities for {cityName}
                      </h3>
                      <p className="text-xs text-stone-500 mt-1">
                        {tripAdvisorActivities.filter((a) => a.isCurated).length} curated • {tripAdvisorActivities.filter((a) => a.isDefault).length} defaults
                      </p>
                    </div>
                    <span className="text-sm text-stone-500">
                      {tripAdvisorActivities.length} total
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                    {tripAdvisorActivities.map((activity) => (
                      <div
                        key={activity.locationId}
                        className="bg-white rounded-lg border-2 border-stone-200 hover:border-sb-orange-400 transition-all cursor-pointer overflow-hidden"
                        onClick={() => handleSelectTripAdvisorActivity(activity)}
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
                          <div className="absolute top-2 left-2 flex flex-col gap-1">
                            {activity.isCurated && (
                              <div className="bg-sb-teal-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                <Sparkles className="w-3 h-3 fill-current" />
                                Curated
                              </div>
                            )}
                            {activity.isDefault && (
                              <div className="bg-sb-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current" />
                                Top Pick
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-3 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-stone-900 text-sm line-clamp-2 flex-1">
                              {activity.name}
                            </h4>
                            {activity.webUrl && (
                              <a
                                href={activity.webUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
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
                          <div className="flex items-center gap-2 text-xs text-stone-500">
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

                          {/* Add Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectTripAdvisorActivity(activity);
                            }}
                            className="w-full mt-2 px-3 py-2 bg-sb-orange-500 text-white rounded-lg hover:bg-sb-orange-600 transition flex items-center justify-center gap-2 text-sm font-medium"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Add to Trip
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Custom Activity Mode */}
          {mode === 'custom' && (
            <>

          {/* Image Selection Section */}
          <div>
            <label className="text-sm font-bold text-stone-700 uppercase tracking-wide mb-3 block">
              Activity Image
            </label>
            
            {/* Image Preview */}
            <div className="mb-4">
              {selectedImage ? (
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden border-2 border-stone-200 bg-stone-50">
                  <Image
                    src={selectedImage}
                    alt="Selected activity image"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="aspect-[16/9] rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 text-stone-400 mx-auto mb-2" />
                    <p className="text-sm text-stone-500">No image selected</p>
                  </div>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-stone-200">
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-4 py-2 text-sm font-medium transition ${
                  activeTab === 'upload'
                    ? 'border-b-2 border-sb-orange-500 text-sb-orange-600'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Upload File
              </button>
              <button
                onClick={() => setActiveTab('stock')}
                className={`px-4 py-2 text-sm font-medium transition ${
                  activeTab === 'stock'
                    ? 'border-b-2 border-sb-orange-500 text-sb-orange-600'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                <Search className="w-4 h-4 inline mr-2" />
                Stock Photos
              </button>
              <button
                onClick={() => setActiveTab('generate')}
                className={`px-4 py-2 text-sm font-medium transition ${
                  activeTab === 'generate'
                    ? 'border-b-2 border-sb-orange-500 text-sb-orange-600'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                <Sparkles className="w-4 h-4 inline mr-2" />
                Generate AI
              </button>
            </div>

            {/* Tab Content */}
            <div className="mt-4">
              {activeTab === 'upload' && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full px-4 py-3 border-2 border-dashed border-stone-300 rounded-lg hover:border-sb-orange-400 hover:bg-sb-orange-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-sb-orange-500" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <ArrowUp className="w-5 h-5 text-stone-400" />
                        <span className="text-stone-700 font-medium">Choose file to upload</span>
                      </>
                    )}
                  </button>
                  <p className="text-xs text-stone-500 mt-2 text-center">
                    JPG, PNG, or WebP (max 5MB)
                  </p>
                </div>
              )}

              {activeTab === 'stock' && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={stockQuery}
                      onChange={(e) => setStockQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleStockSearch();
                      }}
                      placeholder="Search for images..."
                      className="flex-1 px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                    />
                    <button
                      onClick={handleStockSearch}
                      disabled={searchingStock}
                      className="px-4 py-2 bg-sb-orange-500 text-white rounded-lg hover:bg-sb-orange-600 transition disabled:opacity-50"
                    >
                      {searchingStock ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  
                  {stockImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                      {stockImages.map((img) => (
                        <button
                          key={img.id}
                          onClick={() => setSelectedImage(img.url)}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                            selectedImage === img.url
                              ? 'border-sb-orange-500 ring-2 ring-sb-orange-200'
                              : 'border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <Image
                            src={img.thumb}
                            alt={img.alt}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          {selectedImage === img.url && (
                            <div className="absolute inset-0 bg-sb-orange-500/20 flex items-center justify-center">
                              <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'generate' && (
                <div className="space-y-3">
                  <p className="text-sm text-stone-600">
                    Generate an AI image based on your activity title and location.
                  </p>
                  <button
                    onClick={handleGenerateImage}
                    disabled={generatingImage || !title.trim()}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
                  >
                    {generatingImage ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate Image
                      </>
                    )}
                  </button>
                  {generatedImageUrl && (
                    <p className="text-xs text-green-600 text-center">
                      ✓ Image generated successfully
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Activity Details */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-stone-700 uppercase tracking-wide mb-2 block">
                Activity Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Activity title..."
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-stone-700 uppercase tracking-wide mb-2 block">
                Category (Optional)
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Adventure, Culture, Food..."
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-stone-700 uppercase tracking-wide">
                  Description
                </label>
                <button
                  onClick={handlePolishDescription}
                  disabled={polishingDescription || !description.trim() || description.length < 50}
                  className="text-xs text-sb-teal-600 hover:text-sb-teal-700 font-medium flex items-center gap-1 px-2 py-1 rounded-full hover:bg-sb-teal-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {polishingDescription ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Polishing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3 h-3" />
                      Polish with AI
                    </>
                  )}
                </button>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your activity in detail..."
                rows={6}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent resize-none"
              />
              <p className="text-xs text-stone-500 mt-1">
                {description.length} / 1000 characters (minimum 50)
              </p>
            </div>
          </div>
          </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex items-center justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-6 py-2 border border-stone-300 rounded-lg font-medium hover:bg-stone-50 transition text-stone-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || !description.trim() || !selectedImage || description.length < 50}
            className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}
