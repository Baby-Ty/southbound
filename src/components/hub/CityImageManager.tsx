'use client';

import { useState } from 'react';
import { 
  MapPin, 
  Sparkles, 
  Upload, 
  X, 
  ImageIcon,
  Loader2,
  CheckCircle,
  Image as ImageIcon2,
  Star,
  GripVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageSearch from './ImageSearch';
import ImageGenerator from './ImageGenerator';
import { ImageCategory, PromptContext } from '@/lib/dallePrompts';

type ImageSource = 'stock' | 'generate' | 'upload';

interface CityImageManagerProps {
  imageUrls: string[];
  onImagesChange: (imageUrls: string[]) => void;
  cityName?: string;
  promptContext?: PromptContext;
}

export default function CityImageManager({
  imageUrls = [],
  onImagesChange,
  cityName,
  promptContext,
}: CityImageManagerProps) {
  const [activeSource, setActiveSource] = useState<ImageSource>('stock');
  const [uploading, setUploading] = useState<Set<string>>(new Set());
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Ensure imageUrls is always an array
  const safeImageUrls = Array.isArray(imageUrls) ? imageUrls : [];

  const handleStockImageSelected = (url: string) => {
    if (!safeImageUrls.includes(url)) {
      onImagesChange([...safeImageUrls, url]);
    }
  };

  const handleGeneratedImageSaved = (url: string, category?: ImageCategory) => {
    // category parameter is provided by ImageGenerator but we don't need it here
    if (url && !safeImageUrls.includes(url)) {
      onImagesChange([...safeImageUrls, url]);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size must be less than 10MB');
      return;
    }

    setUploadError(null);
    const tempId = `upload-${Date.now()}`;
    setUploading(prev => new Set(prev).add(tempId));

    try {
      // Convert file to base64 or upload to Azure
      // For now, we'll create a data URL (in production, upload to Azure Blob Storage)
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUrl = reader.result as string;
        
        // If you have Azure Blob Storage configured, upload there instead
        // For now, we'll use the data URL directly (not recommended for production)
        try {
          // Try to upload to Azure if available
          const { apiUrl } = await import('@/lib/api');
          const response = await fetch(apiUrl('upload-image'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageData: dataUrl,
              category: 'cities',
              filename: `city-${Date.now()}.${file.name.split('.').pop()}`,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.blobUrl && !safeImageUrls.includes(data.blobUrl)) {
              onImagesChange([...safeImageUrls, data.blobUrl]);
            }
          } else {
            // Fallback to data URL (not ideal, but works)
            if (!safeImageUrls.includes(dataUrl)) {
              onImagesChange([...safeImageUrls, dataUrl]);
            }
          }
        } catch (err) {
          console.error('Upload error:', err);
          // Fallback to data URL
          if (!safeImageUrls.includes(dataUrl)) {
            onImagesChange([...safeImageUrls, dataUrl]);
          }
        } finally {
          setUploading(prev => {
            const updated = new Set(prev);
            updated.delete(tempId);
            return updated;
          });
        }
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error('File upload error:', error);
      setUploadError(error.message || 'Failed to upload image');
      setUploading(prev => {
        const updated = new Set(prev);
        updated.delete(tempId);
        return updated;
      });
    }

    // Reset input
    event.target.value = '';
  };

  const removeImage = (url: string) => {
    onImagesChange(safeImageUrls.filter(u => u !== url));
  };

  const setAsPrimary = (url: string) => {
    const newUrls = [...safeImageUrls];
    const index = newUrls.indexOf(url);
    if (index > 0) {
      // Move the selected image to the front
      newUrls.splice(index, 1);
      newUrls.unshift(url);
      onImagesChange(newUrls);
    }
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newUrls = [...safeImageUrls];
    const [moved] = newUrls.splice(fromIndex, 1);
    newUrls.splice(toIndex, 0, moved);
    onImagesChange(newUrls);
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-sb-orange-500" />
        <h3 className="text-lg font-bold text-stone-900">City Images</h3>
        <span className="text-sm text-stone-500 ml-auto">
          {safeImageUrls.length} {safeImageUrls.length === 1 ? 'image' : 'images'}
        </span>
      </div>

      <p className="text-xs text-stone-500 -mt-4">
        Multiple images will rotate in the route builder. Choose from stock photos, AI generation, or upload your own.
      </p>

      {/* Source Selection Tabs */}
      <div className="flex gap-2 border-b border-stone-200">
        <button
          onClick={() => setActiveSource('stock')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeSource === 'stock'
              ? 'border-sb-orange-500 text-sb-orange-600'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Stock Photos
          </div>
        </button>
        <button
          onClick={() => setActiveSource('generate')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeSource === 'generate'
              ? 'border-sb-orange-500 text-sb-orange-600'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Generate
          </div>
        </button>
        <button
          onClick={() => setActiveSource('upload')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeSource === 'upload'
              ? 'border-sb-orange-500 text-sb-orange-600'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload File
          </div>
        </button>
      </div>

      {/* Content based on active source */}
      <div className="min-h-[200px]">
        {activeSource === 'stock' && (
          <div className="space-y-4">
            <ImageSearch
              currentImage={safeImageUrls[0] || undefined}
              onSelect={handleStockImageSelected}
              cityName={cityName}
            />
            <p className="text-xs text-stone-500">
              Selected images will be added to your collection. Search Unsplash or paste an image URL. Click "Change Image" to add more.
            </p>
          </div>
        )}

        {activeSource === 'generate' && (
          <div className="space-y-4">
            <ImageGenerator
              category="city"
              context={promptContext || {
                cityName: cityName || '',
                country: '',
                region: undefined,
                tags: [],
              }}
              onImageSaved={handleGeneratedImageSaved}
              maxImages={10}
            />
            <p className="text-xs text-stone-500">
              Generated images will be saved to Azure and added to your collection.
            </p>
          </div>
        )}

        {activeSource === 'upload' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-stone-300 rounded-xl p-8 text-center hover:border-sb-orange-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                disabled={uploading.size > 0}
              />
              <label
                htmlFor="file-upload"
                className={`cursor-pointer flex flex-col items-center gap-3 ${
                  uploading.size > 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {uploading.size > 0 ? (
                  <>
                    <Loader2 className="w-12 h-12 text-sb-orange-500 animate-spin" />
                    <div className="text-sm font-medium text-stone-700">
                      Uploading {uploading.size} {uploading.size === 1 ? 'image' : 'images'}...
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-sb-orange-100 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-sb-orange-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-stone-700 mb-1">
                        Click to upload or drag and drop
                      </div>
                      <div className="text-xs text-stone-500">
                        PNG, JPG, GIF up to 10MB
                      </div>
                    </div>
                  </>
                )}
              </label>
            </div>

            {uploadError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {uploadError}
              </div>
            )}

            <p className="text-xs text-stone-500">
              Uploaded images will be saved to Azure Blob Storage and added to your collection.
            </p>
          </div>
        )}
      </div>

      {/* Saved Images Grid */}
      {safeImageUrls.length > 0 && (
        <div className="pt-6 border-t border-stone-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-stone-700">
              Saved Images ({safeImageUrls.length})
            </h4>
            <p className="text-xs text-stone-500">
              Drag to reorder or click star to set as primary
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <AnimatePresence>
              {safeImageUrls.map((url, idx) => (
                <motion.div
                  key={url}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  layout
                  className="group relative aspect-video rounded-lg overflow-hidden bg-stone-100 border-2 transition-all"
                  style={{
                    borderColor: idx === 0 ? 'rgb(249 115 22)' : 'rgb(231 229 228)',
                    boxShadow: idx === 0 ? '0 0 0 2px rgba(249, 115, 22, 0.1)' : 'none',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`City image ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Primary Badge */}
                  {idx === 0 && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-sb-orange-500 text-white text-xs font-bold rounded flex items-center gap-1 shadow-lg">
                      <Star className="w-3 h-3 fill-current" />
                      Primary
                    </div>
                  )}

                  {/* Image Number */}
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded">
                    #{idx + 1}
                  </div>

                  {/* Hover Overlay with Actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {idx !== 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setAsPrimary(url);
                            }}
                            className="flex-1 px-2 py-1.5 bg-sb-orange-500 text-white rounded-lg text-xs font-medium hover:bg-sb-orange-600 transition flex items-center justify-center gap-1"
                            title="Set as primary image"
                          >
                            <Star className="w-3 h-3" />
                            Set Primary
                          </button>
                        )}
                        {idx > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveImage(idx, idx - 1);
                            }}
                            className="px-2 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition"
                            title="Move up"
                          >
                            ↑
                          </button>
                        )}
                        {idx < safeImageUrls.length - 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveImage(idx, idx + 1);
                            }}
                            className="px-2 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition"
                            title="Move down"
                          >
                            ↓
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(url);
                          }}
                          className="px-2 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <p className="text-xs text-stone-500 mt-3">
            The first image is used as the primary image. Images rotate in the route builder.
          </p>
        </div>
      )}
    </div>
  );
}

