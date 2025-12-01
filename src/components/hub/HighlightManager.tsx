'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Plus,
  X,
  Edit3,
  Image as ImageIcon,
  Star,
  Search,
  Loader2,
  CheckCircle,
  Upload,
} from 'lucide-react';
import { HighlightPlace } from '@/lib/cosmos-cities';
import { apiUrl } from '@/lib/api';

interface HighlightManagerProps {
  highlights: (string | HighlightPlace)[];
  onUpdate: (highlights: (string | HighlightPlace)[]) => void;
  cityName: string;
}

export default function HighlightManager({
  highlights,
  onUpdate,
  cityName,
}: HighlightManagerProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Convert string highlights to HighlightPlace objects
  const normalizedHighlights: HighlightPlace[] = highlights.map((h, idx) => {
    if (typeof h === 'string') {
      return { title: h, imageUrl: undefined, imageLibrary: [], isDefault: true };
    }
    return h;
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(apiUrl(`images/search?query=${encodeURIComponent(searchQuery)}`));
      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleImageSelect = async (imageUrl: string) => {
    setNewImageUrl(imageUrl);
    setShowImagePicker(false);
    // Auto-upload to blob storage
    await uploadImageToBlob(imageUrl);
  };

  const uploadImageToBlob = async (imageUrl: string) => {
    if (!imageUrl) return;
    
    setUploading(true);
    try {
      const response = await fetch(apiUrl('upload-image'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          category: 'highlights',
          filename: `${cityName}-${Date.now()}.jpg`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.blobUrl) {
          setNewImageUrl(data.blobUrl);
        }
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    if (!newTitle.trim()) return;

    const newHighlight: HighlightPlace = {
      title: newTitle.trim(),
      imageUrl: newImageUrl || undefined,
      imageLibrary: newImageUrl ? [newImageUrl] : [],
      isDefault: true,
    };

    if (editingIndex !== null) {
      const updated = [...normalizedHighlights];
      updated[editingIndex] = newHighlight;
      onUpdate(updated);
    } else {
      onUpdate([...normalizedHighlights, newTitle.trim()]);
    }

    setNewTitle('');
    setNewImageUrl('');
    setEditingIndex(null);
    setShowImagePicker(false);
  };

  const handleEdit = (index: number) => {
    const highlight = normalizedHighlights[index];
    setNewTitle(highlight.title);
    setNewImageUrl(highlight.imageUrl || '');
    setEditingIndex(index);
  };

  const handleRemove = (index: number) => {
    const updated = normalizedHighlights.filter((_, i) => i !== index);
    onUpdate(updated);
  };

  const handleAddImageToLibrary = async (imageUrl: string, highlightIndex: number) => {
    // Upload to blob
    setUploading(true);
    try {
      const response = await fetch(apiUrl('upload-image'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          category: 'highlights',
          filename: `${cityName}-${Date.now()}.jpg`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.blobUrl) {
          const updated = [...normalizedHighlights];
          const highlight = updated[highlightIndex];
          updated[highlightIndex] = {
            ...highlight,
            imageLibrary: [...(highlight.imageLibrary || []), data.blobUrl],
          };
          onUpdate(updated);
        }
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setUploading(false);
    }
  };

  const setPrimaryImage = (highlightIndex: number, imageUrl: string) => {
    const updated = [...normalizedHighlights];
    const highlight = updated[highlightIndex];
    updated[highlightIndex] = {
      ...highlight,
      imageUrl,
    };
    onUpdate(updated);
  };

  return (
    <div className="space-y-4">
      {/* Existing Highlights */}
      {normalizedHighlights.map((highlight, index) => (
        <div
          key={index}
          className="bg-stone-50 rounded-lg border border-stone-200 p-4"
        >
          <div className="flex items-start gap-4">
            {/* Image Preview */}
            <div className="flex-shrink-0">
              {highlight.imageUrl ? (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-stone-300">
                  <Image
                    src={highlight.imageUrl}
                    alt={highlight.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-1 left-1 bg-green-500 text-white text-[10px] px-1 rounded">
                    Primary
                  </div>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-lg border-2 border-dashed border-stone-300 flex items-center justify-center bg-white">
                  <ImageIcon className="w-6 h-6 text-stone-400" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-bold text-stone-900">{highlight.title}</h4>
                {highlight.isDefault && (
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                    Admin Default
                  </span>
                )}
              </div>

              {/* Image Library */}
              {highlight.imageLibrary && highlight.imageLibrary.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-stone-600 mb-1">Image Library:</p>
                  <div className="flex gap-2 flex-wrap">
                    {highlight.imageLibrary.map((url, imgIdx) => (
                      <button
                        key={imgIdx}
                        onClick={() => setPrimaryImage(index, url)}
                        className={`relative w-12 h-12 rounded border-2 overflow-hidden ${
                          url === highlight.imageUrl
                            ? 'border-green-500'
                            : 'border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        <Image src={url} alt="" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    setShowImagePicker(true);
                    setSearchQuery(highlight.title);
                  }}
                  className="text-xs px-2 py-1 bg-stone-100 text-stone-700 rounded hover:bg-stone-200 flex items-center gap-1"
                >
                  <ImageIcon className="w-3 h-3" />
                  Add Image
                </button>
                <button
                  onClick={() => handleEdit(index)}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={() => handleRemove(index)}
                  className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Add/Edit Form */}
      {(editingIndex !== null || normalizedHighlights.length === 0) && (
        <div className="bg-white rounded-lg border-2 border-dashed border-stone-300 p-4">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Highlight title (e.g., Ipanema Beach)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400"
              autoFocus
            />

            {newImageUrl && (
              <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-green-500">
                <Image src={newImageUrl} alt="Selected" fill className="object-cover" />
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  Selected
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowImagePicker(true);
                  if (newTitle.trim()) setSearchQuery(newTitle.trim());
                }}
                className="flex-1 px-3 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 flex items-center justify-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                {newImageUrl ? 'Change Image' : 'Select Image'}
              </button>
              <button
                onClick={handleSave}
                disabled={!newTitle.trim() || uploading}
                className="px-4 py-2 bg-sb-orange-500 text-white rounded-lg hover:bg-sb-orange-600 disabled:opacity-50 flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    {editingIndex !== null ? 'Update' : 'Add'} Highlight
                  </>
                )}
              </button>
              {editingIndex !== null && (
                <button
                  onClick={() => {
                    setEditingIndex(null);
                    setNewTitle('');
                    setNewImageUrl('');
                  }}
                  className="px-4 py-2 text-stone-600 rounded-lg hover:bg-stone-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add New Button */}
      {editingIndex === null && normalizedHighlights.length > 0 && (
        <button
          onClick={() => {
            setNewTitle('');
            setNewImageUrl('');
            setEditingIndex(-1);
          }}
          className="w-full py-3 border-2 border-dashed border-stone-300 rounded-lg text-stone-600 hover:border-sb-orange-400 hover:text-sb-orange-600 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Highlight
        </button>
      )}

      {/* Image Picker Modal */}
      {showImagePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-stone-900">Select Image</h3>
              <button
                onClick={() => setShowImagePicker(false)}
                className="p-1 hover:bg-stone-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Search Unsplash..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 px-3 py-2 border border-stone-300 rounded-lg"
                />
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="px-4 py-2 bg-stone-100 rounded-lg hover:bg-stone-200"
                >
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {searchResults.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => handleImageSelect(img.url)}
                    className="relative aspect-square rounded-lg overflow-hidden border-2 border-stone-200 hover:border-sb-orange-500"
                  >
                    <Image src={img.thumb} alt={img.alt} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

