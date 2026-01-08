'use client';

import { useState } from 'react';
import { Plus, X, GripVertical, ImageIcon } from 'lucide-react';
import ImageSearch from './ImageSearch';

export interface ExperienceGalleryItem {
  url: string;
  caption?: string;
  source?: 'tripadvisor' | 'unsplash' | 'custom';
}

interface ExperienceGalleryManagerProps {
  gallery: ExperienceGalleryItem[];
  onChange: (gallery: ExperienceGalleryItem[]) => void;
  cityName?: string;
}

export default function ExperienceGalleryManager({
  gallery = [],
  onChange,
  cityName = '',
}: ExperienceGalleryManagerProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const addImage = (imageUrl: string) => {
    onChange([
      ...gallery,
      {
        url: imageUrl,
        caption: '',
        source: 'custom',
      },
    ]);
  };

  const removeImage = (index: number) => {
    onChange(gallery.filter((_, i) => i !== index));
  };

  const updateImage = (index: number, updates: Partial<ExperienceGalleryItem>) => {
    const updated = [...gallery];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex === null || dragOverIndex === null || draggedIndex === dragOverIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...gallery];
    const [removed] = updated.splice(draggedIndex, 1);
    updated.splice(dragOverIndex, 0, removed);
    onChange(updated);

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    handleDragEnd();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-stone-900">City Experience Gallery</h3>
          <p className="text-sm text-stone-500">Curated photos showcasing the city's vibe and experiences</p>
        </div>
      </div>

      {/* Preview Grid */}
      {gallery.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {gallery.map((item, index) => (
            <div
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              onDrop={(e) => handleDrop(e, index)}
              className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all cursor-move ${
                draggedIndex === index
                  ? 'border-sb-orange-500 opacity-50'
                  : dragOverIndex === index
                  ? 'border-sb-teal-500 scale-105'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt={item.caption || `Gallery image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  {item.caption && (
                    <p className="text-white text-xs font-medium truncate">{item.caption}</p>
                  )}
                  {item.source && (
                    <p className="text-white/70 text-[10px] mt-0.5">{item.source}</p>
                  )}
                </div>
              </div>
              <div className="absolute top-2 left-2 p-1 bg-black/50 backdrop-blur-sm rounded text-white">
                <GripVertical className="w-3 h-3" />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 hover:opacity-100 transition"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Image List with Captions */}
      <div className="space-y-2">
        {gallery.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200"
          >
            <div className="flex items-center gap-2 text-stone-500">
              <GripVertical className="w-4 h-4" />
              <span className="text-xs font-medium">{index + 1}</span>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={item.url}
                  onChange={(e) => updateImage(index, { url: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-sb-orange-400 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Caption (optional)</label>
                <input
                  type="text"
                  value={item.caption || ''}
                  onChange={(e) => updateImage(index, { caption: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-sb-orange-400 focus:border-transparent"
                  placeholder="Describe this image..."
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Source</label>
              <select
                value={item.source || 'custom'}
                onChange={(e) => updateImage(index, { source: e.target.value as any })}
                className="px-2 py-1 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-sb-orange-400 focus:border-transparent"
              >
                <option value="custom">Custom</option>
                <option value="tripadvisor">TripAdvisor</option>
                <option value="unsplash">Unsplash</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Image */}
      <div className="border-2 border-dashed border-stone-300 rounded-lg p-6">
        <ImageSearch
          currentImage={undefined}
          onSelect={addImage}
          cityName={cityName}
        />
      </div>

      {gallery.length === 0 && (
        <div className="text-center py-8 text-stone-500">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No images in gallery yet</p>
          <p className="text-xs mt-1">Use the image search above to add photos</p>
        </div>
      )}
    </div>
  );
}

