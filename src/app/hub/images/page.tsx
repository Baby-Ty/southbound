'use client';

import { useEffect, useState } from 'react';
import { Heading } from '@/components/ui/Heading';
import { Card } from '@/components/ui/Card';
import { 
  Image as ImageIcon, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Search, 
  Filter,
  Download,
  Zap,
  FileImage,
  ImageOff,
  CheckSquare,
  Square
} from 'lucide-react';
import { apiUrl } from '@/lib/api';

interface ImageInfo {
  url: string;
  filename: string;
  size: number;
  format: string;
  uploadDate?: string;
  category: string;
  isCompressed: boolean;
  container: string;
}

interface ImageStats {
  totalImages: number;
  totalSize: number;
  compressedCount: number;
  uncompressedCount: number;
  uncompressedSize: number;
  averageSize: number;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function formatDate(dateString?: string): string {
  if (!dateString) return 'Unknown';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Unknown';
  }
}

export default function ImagesPage() {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [stats, setStats] = useState<ImageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [compressing, setCompressing] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const categories = ['all', 'cities', 'highlights', 'activities', 'accommodations'];

  useEffect(() => {
    loadImages();
  }, [page, categoryFilter]);

  async function loadImages() {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '50',
      });
      
      if (categoryFilter !== 'all') {
        params.append('category', categoryFilter);
      }

      const response = await fetch(apiUrl(`list-images?${params.toString()}`));
      if (!response.ok) {
        throw new Error('Failed to load images');
      }

      const data = await response.json();
      setImages(data.images || []);
      setStats(data.stats || null);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      console.error('Error loading images:', err);
      setError(err.message || 'Failed to load images');
    } finally {
      setLoading(false);
    }
  }

  async function compressImage(imageUrl: string) {
    setCompressing(prev => new Set(prev).add(imageUrl));

    try {
      const response = await fetch(apiUrl('compress-image'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blobUrl: imageUrl,
          quality: 80,
          replaceOriginal: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to compress image');
      }

      // Reload images to get updated stats
      await loadImages();
      
      // Remove from selected if it was selected
      setSelectedImages(prev => {
        const updated = new Set(prev);
        updated.delete(imageUrl);
        return updated;
      });
    } catch (err: any) {
      console.error('Error compressing image:', err);
      alert(`Failed to compress image: ${err.message}`);
    } finally {
      setCompressing(prev => {
        const updated = new Set(prev);
        updated.delete(imageUrl);
        return updated;
      });
    }
  }

  async function compressSelected() {
    if (selectedImages.size === 0) return;

    const imagesToCompress = Array.from(selectedImages);
    setCompressing(new Set(imagesToCompress));

    try {
      // Compress images sequentially to avoid overwhelming the server
      for (const imageUrl of imagesToCompress) {
        try {
          await compressImage(imageUrl);
        } catch (err) {
          console.error(`Failed to compress ${imageUrl}:`, err);
          // Continue with next image
        }
      }

      // Clear selection and reload
      setSelectedImages(new Set());
      await loadImages();
    } catch (err: any) {
      console.error('Error compressing images:', err);
      alert(`Failed to compress some images: ${err.message}`);
    } finally {
      setCompressing(new Set());
    }
  }

  function toggleSelection(imageUrl: string) {
    setSelectedImages(prev => {
      const updated = new Set(prev);
      if (updated.has(imageUrl)) {
        updated.delete(imageUrl);
      } else {
        updated.add(imageUrl);
      }
      return updated;
    });
  }

  function toggleSelectAll() {
    const filteredImages = getFilteredImages();
    if (selectedImages.size === filteredImages.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(filteredImages.map(img => img.url)));
    }
  }

  function getFilteredImages(): ImageInfo[] {
    return images.filter(img => {
      const matchesSearch = searchTerm === '' || 
        img.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }

  const filteredImages = getFilteredImages();
  const uncompressedImages = filteredImages.filter(img => !img.isCompressed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Heading level={1} className="!text-3xl md:!text-4xl">Image Manager</Heading>
          <p className="text-stone-600 mt-2">Manage and compress images in Azure Blob Storage</p>
        </div>
        {selectedImages.size > 0 && (
          <button
            onClick={compressSelected}
            disabled={compressing.size > 0}
            className="px-4 py-2 bg-[#E86B32] text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {compressing.size > 0 ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Compressing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Compress Selected ({selectedImages.size})
              </>
            )}
          </button>
        )}
      </div>

      {/* Stats Dashboard */}
      {stats && (
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="p-5 bg-white border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-500 text-sm font-medium mb-1">Total Images</p>
                <h3 className="text-2xl font-bold text-stone-900">{stats.totalImages}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <ImageIcon className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-white border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-500 text-sm font-medium mb-1">Total Size</p>
                <h3 className="text-2xl font-bold text-stone-900">{formatBytes(stats.totalSize)}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                <Download className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-white border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-500 text-sm font-medium mb-1">Compressed</p>
                <h3 className="text-2xl font-bold text-green-600">{stats.compressedCount}</h3>
                <p className="text-xs text-stone-500 mt-1">
                  {stats.totalImages > 0 
                    ? Math.round((stats.compressedCount / stats.totalImages) * 100) 
                    : 0}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-white border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-500 text-sm font-medium mb-1">Uncompressed</p>
                <h3 className="text-2xl font-bold text-orange-600">{stats.uncompressedCount}</h3>
                <p className="text-xs text-stone-500 mt-1">
                  {formatBytes(stats.uncompressedSize)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                <ImageOff className="w-6 h-6" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4 bg-white border-stone-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by filename or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E86B32] focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-400" />
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E86B32] focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-2 text-red-800">
            <XCircle className="w-5 h-5" />
            <p>{error}</p>
            <button
              onClick={loadImages}
              className="ml-auto text-sm font-medium hover:underline"
            >
              Retry
            </button>
          </div>
        </Card>
      )}

      {/* Images Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#E86B32]" />
        </div>
      ) : filteredImages.length === 0 ? (
        <Card className="p-12 text-center bg-white border-stone-200">
          <ImageOff className="w-12 h-12 text-stone-400 mx-auto mb-4" />
          <p className="text-stone-600">No images found</p>
        </Card>
      ) : (
        <>
          {/* Select All */}
          {uncompressedImages.length > 0 && (
            <div className="flex items-center gap-2 px-2">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900"
              >
                {selectedImages.size === filteredImages.length ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                <span>Select All Uncompressed ({uncompressedImages.length})</span>
              </button>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredImages.map((image) => {
              const isSelected = selectedImages.has(image.url);
              const isCompressing = compressing.has(image.url);

              return (
                <Card
                  key={image.url}
                  className={`p-4 bg-white border-stone-200 hover:border-orange-200 transition-all ${
                    isSelected ? 'ring-2 ring-[#E86B32]' : ''
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video mb-3 bg-stone-100 rounded-lg overflow-hidden group">
                    <img
                      src={image.url}
                      alt={image.filename}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <button
                        onClick={() => toggleSelection(image.url)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white/90 rounded-full"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-[#E86B32]" />
                        ) : (
                          <Square className="w-5 h-5 text-stone-600" />
                        )}
                      </button>
                    </div>
                    {image.isCompressed && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        WebP
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-900 truncate" title={image.filename}>
                          {image.filename}
                        </p>
                        <p className="text-xs text-stone-500">{image.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span>{formatBytes(image.size)}</span>
                      <span>{formatDate(image.uploadDate)}</span>
                    </div>

                    {/* Actions */}
                    {!image.isCompressed && (
                      <button
                        onClick={() => compressImage(image.url)}
                        disabled={isCompressing}
                        className="w-full mt-2 px-3 py-1.5 bg-[#E86B32] text-white text-sm rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isCompressing ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Compressing...
                          </>
                        ) : (
                          <>
                            <Zap className="w-3 h-3" />
                            Compress
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-stone-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-stone-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-stone-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
