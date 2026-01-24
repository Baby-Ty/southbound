'use client';

import { useState } from 'react';
import { 
  Sparkles, 
  Loader2, 
  Download, 
  X, 
  ImageIcon,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageCategory, PromptContext } from '@/lib/dallePrompts';

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  uploaded?: boolean;
  blobUrl?: string;
}

interface ImageGeneratorProps {
  category: ImageCategory;
  context?: PromptContext;
  onImageSaved?: (imageUrl: string, category: ImageCategory) => void;
  maxImages?: number;
}

export default function ImageGenerator({
  category,
  context = {},
  onImageSaved,
  maxImages = 4,
}: ImageGeneratorProps) {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [useCustomPrompt, setUseCustomPrompt] = useState(false);

  const categoryLabels: Record<ImageCategory, string> = {
    city: 'City Hero Image',
    region: 'Region Landscape',
    activity: 'Activity',
    accommodation: 'Accommodation',
    culture: 'Culture & History',
    highlight: 'Highlight/Place',
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const { apiUrl } = await import('@/lib/api');
      const response = await fetch(apiUrl('images-generate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          context,
          customPrompt: useCustomPrompt ? customPrompt : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: data.imageUrl,
        prompt: data.prompt,
      };

      setGeneratedImages(prev => {
        const updated = [newImage, ...prev];
        // Keep only the most recent images up to maxImages
        return updated.slice(0, maxImages);
      });
    } catch (err: any) {
      console.error('Error generating image:', err);
      setError(err.message || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (image: GeneratedImage) => {
    setUploading(prev => new Set(prev).add(image.id));

    try {
      // Map category to blob category
      const blobCategoryMap: Record<ImageCategory, 'cities' | 'highlights' | 'activities' | 'accommodations'> = {
        city: 'cities',
        region: 'cities',
        activity: 'activities',
        accommodation: 'accommodations',
        culture: 'highlights',
        highlight: 'highlights',
      };

      const blobCategory = blobCategoryMap[category];

      const { apiUrl } = await import('@/lib/api');
      const response = await fetch(apiUrl('images/upload'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: image.url,
          category: blobCategory,
          filename: `${category}-${Date.now()}.png`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = await response.json();

      // Update image with blob URL
      setGeneratedImages(prev =>
        prev.map(img =>
          img.id === image.id
            ? { ...img, uploaded: true, blobUrl: data.blobUrl }
            : img
        )
      );

      // Call callback with the blob URL
      if (onImageSaved && data.blobUrl) {
        onImageSaved(data.blobUrl, category);
      }
    } catch (err: any) {
      console.error('Error saving image:', err);
      setError(err.message || 'Failed to save image');
    } finally {
      setUploading(prev => {
        const updated = new Set(prev);
        updated.delete(image.id);
        return updated;
      });
    }
  };

  const handleRemove = (imageId: string) => {
    setGeneratedImages(prev => prev.filter(img => img.id !== imageId));
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-sb-orange-500" />
          <h3 className="text-lg font-bold text-stone-900">
            AI Image Generator - {categoryLabels[category]}
          </h3>
        </div>

        {/* Custom Prompt Toggle */}
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useCustomPrompt}
              onChange={(e) => setUseCustomPrompt(e.target.checked)}
              className="w-4 h-4 rounded border-stone-300 text-sb-orange-500 focus:ring-sb-orange-400"
            />
            <span className="text-sm text-stone-700">Use custom prompt</span>
          </label>
        </div>

        {/* Custom Prompt Input */}
        {useCustomPrompt && (
          <div className="mb-4">
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Enter your custom prompt..."
              rows={3}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent text-sm"
            />
            <p className="text-xs text-stone-500 mt-1">
              The style guidelines will be automatically added to your prompt
            </p>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading || (useCustomPrompt && !customPrompt.trim())}
          className="w-full px-4 py-3 bg-sb-orange-500 text-white rounded-lg font-medium hover:bg-sb-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Image
            </>
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-700 font-medium">Error</p>
              <p className="text-xs text-red-600 mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Generated Images Grid */}
      {generatedImages.length > 0 && (
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h4 className="text-sm font-bold text-stone-700 mb-4">
            Generated Images ({generatedImages.length}/{maxImages})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence>
              {generatedImages.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group relative aspect-video rounded-lg overflow-hidden bg-stone-100 border border-stone-200"
                >
                  {/* Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt="Generated"
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(image)}
                          disabled={uploading.has(image.id) || image.uploaded}
                          className="flex-1 px-3 py-2 bg-white text-stone-900 rounded-lg text-sm font-medium hover:bg-stone-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {uploading.has(image.id) ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Uploading...
                            </>
                          ) : image.uploaded ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              Saved
                            </>
                          ) : (
                            <>
                              <Download className="w-3 h-3" />
                              Save to Azure
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleRemove(image.id)}
                          className="px-3 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Prompt Preview */}
                      <div className="text-xs text-white/80 line-clamp-2">
                        {image.prompt.substring(0, 100)}...
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Badge */}
                  {image.uploaded && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Saved
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {generatedImages.length >= maxImages && (
            <p className="text-xs text-stone-500 mt-4 text-center">
              Maximum {maxImages} images. Remove one to generate more.
            </p>
          )}
        </div>
      )}

      {/* Empty State */}
      {generatedImages.length === 0 && !loading && (
        <div className="bg-stone-50 rounded-xl border-2 border-dashed border-stone-300 p-8 text-center">
          <ImageIcon className="w-12 h-12 text-stone-400 mx-auto mb-3" />
          <p className="text-stone-600 font-medium mb-1">No images generated yet</p>
          <p className="text-sm text-stone-500">
            Click &quot;Generate Image&quot; to create AI images for this {category}
          </p>
        </div>
      )}
    </div>
  );
}


