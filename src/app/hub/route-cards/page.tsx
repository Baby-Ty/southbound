'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  X,
  Save,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { apiUrl } from '@/lib/api';
import { RegionKey } from '@/lib/cityPresets';
import { RouteCard } from '@/types/routeCard';

const REGIONS: { key: RegionKey; label: string }[] = [
  { key: 'europe', label: 'Europe' },
  { key: 'latin-america', label: 'Latin America' },
  { key: 'southeast-asia', label: 'Southeast Asia' },
];

export default function RouteCardsPage() {
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>('europe');
  const [routeCards, setRouteCards] = useState<RouteCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCard, setEditingCard] = useState<RouteCard | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [cities, setCities] = useState<{ city: string; country: string }[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadRouteCards();
    loadCities();
  }, [selectedRegion]);

  async function loadRouteCards() {
    try {
      setLoading(true);
      const url = apiUrl(`route-cards?region=${selectedRegion}&enabled=true`);
      console.log('[RouteCards] Fetching from:', url);
      
      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      console.log('[RouteCards] Response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 404 || response.status === 500) {
          console.warn('[RouteCards] Endpoint not available (may not be deployed yet)');
          setRouteCards([]);
          return;
        }
        
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error('[RouteCards] Error response:', errorText);
        setRouteCards([]);
        return;
      }
      
      const data = await response.json().catch((err) => {
        console.error('[RouteCards] Failed to parse JSON:', err);
        return { routeCards: [] };
      });
      
      console.log('[RouteCards] Received data:', data);
      
      if (data.routeCards && Array.isArray(data.routeCards)) {
        setRouteCards(data.routeCards);
      } else {
        console.warn('[RouteCards] Unexpected data format:', data);
        setRouteCards([]);
      }
    } catch (error: any) {
      console.error('[RouteCards] Error loading cards:', error);
      setRouteCards([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadCities() {
    try {
      const url = apiUrl(`cities?region=${selectedRegion}`);
      const response = await fetch(url);
      if (!response.ok) return;
      const data = await response.json();
      setCities(
        (data.cities || []).map((c: any) => ({
          city: c.city,
          country: c.country,
        }))
      );
    } catch (error) {
      console.error('Error loading cities:', error);
    }
  }

  async function handleSave(card: Partial<RouteCard>) {
    try {
      if (editingCard) {
        // Update existing
        const url = apiUrl(`route-cards/${editingCard.id}?region=${selectedRegion}`);
        const response = await fetch(url, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...card, region: selectedRegion }),
        });
        if (!response.ok) throw new Error('Failed to update route card');
      } else {
        // Create new
        const url = apiUrl('route-cards');
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...card, region: selectedRegion }),
        });
        if (!response.ok) throw new Error('Failed to create route card');
      }
      setEditingCard(null);
      setIsCreating(false);
      loadRouteCards();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this route card?')) return;
    try {
      const url = apiUrl(`route-cards/${id}?region=${selectedRegion}`);
      const response = await fetch(url, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete route card');
      loadRouteCards();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  }

  async function handleImageUpload(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          setUploadingImage(true);
          const base64 = reader.result as string;
          const url = apiUrl('images/upload');
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageData: base64,
              category: 'route-cards',
              filename: `route-card-${Date.now()}.jpg`,
            }),
          });
          if (!response.ok) throw new Error('Failed to upload image');
          const data = await response.json();
          resolve(data.blobUrl);
        } catch (error) {
          reject(error);
        } finally {
          setUploadingImage(false);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Route Cards</h1>
          <p className="text-stone-600 mt-1">
            Manage region cards shown on the /discover page.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-sb-orange-500 text-white rounded-lg font-medium hover:bg-sb-orange-600 transition"
        >
          <Plus className="w-4 h-4" />
          New Card
        </button>
      </div>

      {/* Region Tabs */}
      <div className="bg-white border border-stone-200 rounded-xl p-4">
        <div className="flex gap-2">
          {REGIONS.map((r) => (
            <button
              key={r.key}
              onClick={() => setSelectedRegion(r.key)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedRegion === r.key
                  ? 'bg-sb-orange-100 text-sb-orange-700 border-2 border-sb-orange-300'
                  : 'bg-stone-50 text-stone-700 border-2 border-transparent hover:bg-stone-100'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Route Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-sb-orange-500" />
        </div>
      ) : routeCards.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-xl p-12 text-center">
          <p className="text-stone-600 mb-2">No route cards found for this region.</p>
          <p className="text-sm text-stone-500 mb-4">
            Cards may not be seeded yet, or CosmosDB may not be configured.
          </p>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-sb-orange-500 text-white rounded-lg font-medium hover:bg-sb-orange-600 transition"
          >
            Create First Card
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {routeCards.map((card) => (
            <RouteCardCard
              key={card.id}
              card={card}
              onEdit={() => setEditingCard(card)}
              onDelete={() => handleDelete(card.id)}
              onToggleEnabled={async () => {
                await handleSave({ ...card, enabled: !card.enabled });
              }}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(isCreating || editingCard) && (
        <RouteCardModal
          card={editingCard}
          region={selectedRegion}
          cities={cities}
          onClose={() => {
            setEditingCard(null);
            setIsCreating(false);
          }}
          onSave={handleSave}
          onImageUpload={handleImageUpload}
          uploadingImage={uploadingImage}
        />
      )}
    </div>
  );
}

function RouteCardCard({
  card,
  onEdit,
  onDelete,
  onToggleEnabled,
}: {
  card: RouteCard;
  onEdit: () => void;
  onDelete: () => void;
  onToggleEnabled: () => void;
}) {
  return (
    <div
      className={`bg-white border-2 rounded-xl overflow-hidden transition ${
        card.enabled
          ? 'border-stone-200 hover:border-sb-orange-300'
          : 'border-stone-100 opacity-60'
      }`}
    >
      <div className="relative aspect-[4/5]">
        <img
          src={card.imageUrl}
          alt={card.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={onToggleEnabled}
            className={`px-2 py-1 rounded text-xs font-bold ${
              card.enabled
                ? 'bg-green-500 text-white'
                : 'bg-stone-400 text-white'
            }`}
          >
            {card.enabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-stone-900">{card.name}</h3>
          <div className="flex gap-1">
            <button
              onClick={onEdit}
              className="p-1.5 hover:bg-stone-100 rounded transition"
            >
              <Edit className="w-4 h-4 text-stone-600" />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 hover:bg-red-50 rounded transition"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
        <p className="text-sm text-stone-600 mb-3 line-clamp-2">{card.tagline}</p>
        <div className="text-xs text-stone-500 mb-2">
          {card.budget} • {card.timezone}
        </div>
        <div className="text-xs text-stone-500">
          {card.featuredCities?.length || 0} featured cities
        </div>
      </div>
    </div>
  );
}

function RouteCardModal({
  card,
  region,
  cities,
  onClose,
  onSave,
  onImageUpload,
  uploadingImage,
}: {
  card: RouteCard | null;
  region: RegionKey;
  cities: { city: string; country: string }[];
  onClose: () => void;
  onSave: (card: Partial<RouteCard>) => void;
  onImageUpload: (file: File) => Promise<string>;
  uploadingImage: boolean;
}) {
  const [formData, setFormData] = useState<Partial<RouteCard>>({
    name: card?.name || '',
    tagline: card?.tagline || '',
    icon: card?.icon || '🌍',
    imageUrl: card?.imageUrl || '',
    budget: card?.budget || '$$',
    budgetLabel: card?.budgetLabel || 'Value',
    timezone: card?.timezone || '',
    vibe: card?.vibe || '',
    overview: card?.overview || '',
    featuredCities: card?.featuredCities || [],
    enabled: card?.enabled ?? true,
    order: card?.order || 0,
  });

  const [selectedCity, setSelectedCity] = useState('');

  function handleAddCity() {
    if (!selectedCity.trim()) return;
    if (formData.featuredCities?.includes(selectedCity)) return;
    setFormData({
      ...formData,
      featuredCities: [...(formData.featuredCities || []), selectedCity],
    });
    setSelectedCity('');
  }

  function handleRemoveCity(city: string) {
    setFormData({
      ...formData,
      featuredCities: formData.featuredCities?.filter((c) => c !== city) || [],
    });
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await onImageUpload(file);
      setFormData({ ...formData, imageUrl: url });
    } catch (error: any) {
      alert(`Failed to upload image: ${error.message}`);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-stone-200">
          <h2 className="text-xl font-bold text-stone-900">
            {card ? 'Edit Route Card' : 'New Route Card'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400"
              placeholder="e.g., Latin America"
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Tagline *
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) =>
                setFormData({ ...formData, tagline: e.target.value })
              }
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400"
              placeholder="e.g., Rhythm, culture, and endless adventure."
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Icon (emoji)
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400"
              placeholder="🌍"
              maxLength={2}
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Image URL *
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400"
                placeholder="/SouthAmerica.png"
              />
              <label className="px-4 py-2 bg-stone-100 border border-stone-300 rounded-lg cursor-pointer hover:bg-stone-200 transition flex items-center gap-2">
                <Upload className="w-4 h-4" />
                {uploadingImage ? 'Uploading...' : 'Upload'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
            </div>
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="mt-2 w-full h-32 object-cover rounded-lg border border-stone-200"
              />
            )}
          </div>

          {/* Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Budget *
              </label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400"
                placeholder="$$"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Budget Label *
              </label>
              <input
                type="text"
                value={formData.budgetLabel}
                onChange={(e) => setFormData({ ...formData, budgetLabel: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400"
                placeholder="Value"
              />
            </div>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Timezone *
            </label>
            <input
              type="text"
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400"
              placeholder="-2h to -5h"
            />
          </div>

          {/* Vibe */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Vibe *
            </label>
            <input
              type="text"
              value={formData.vibe}
              onChange={(e) => setFormData({ ...formData, vibe: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400"
              placeholder="Social & Adventurous"
            />
          </div>

          {/* Overview */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Overview *
            </label>
            <textarea
              value={formData.overview}
              onChange={(e) =>
                setFormData({ ...formData, overview: e.target.value })
              }
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400"
              rows={3}
              placeholder="Description of the region..."
            />
          </div>

          {/* Featured Cities */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Featured Cities
            </label>
            <div className="flex gap-2 mb-2">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400"
              >
                <option value="">Select a city...</option>
                {cities.map((c) => (
                  <option key={c.city} value={c.city}>
                    {c.city} {c.country ? `(${c.country})` : ''}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddCity}
                disabled={!selectedCity}
                className="px-4 py-2 bg-sb-orange-500 text-white rounded-lg font-medium hover:bg-sb-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.featuredCities?.map((city) => (
                <span
                  key={city}
                  className="px-3 py-1 bg-stone-100 text-stone-700 rounded-lg text-sm flex items-center gap-2"
                >
                  {city}
                  <button
                    onClick={() => handleRemoveCity(city)}
                    className="hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Enabled */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enabled"
              checked={formData.enabled}
              onChange={(e) =>
                setFormData({ ...formData, enabled: e.target.checked })
              }
              className="w-4 h-4 text-sb-orange-500 rounded"
            />
            <label htmlFor="enabled" className="text-sm font-medium text-stone-700">
              Enabled
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-stone-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-stone-300 rounded-lg font-medium hover:bg-stone-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            disabled={!formData.name || !formData.tagline || !formData.imageUrl}
            className="px-4 py-2 bg-sb-orange-500 text-white rounded-lg font-medium hover:bg-sb-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {card ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
