'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Sparkles, Check, X, Upload, Link as LinkIcon, Save, Loader2, Eye, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import { TripTemplate } from '@/lib/tripTemplates';

const REGION_NAMES = {
  'europe': 'Europe',
  'latin-america': 'Latin America',
  'southeast-asia': 'Southeast Asia',
};

type RegionKey = keyof typeof REGION_NAMES;

interface TemplateUpdate {
  id: string;
  region: RegionKey;
  name?: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  story?: string;
  tags?: string[];
  presetCities?: string[];
  isCurated?: boolean;
  curatedOrder?: number;
  curatedImageUrl?: string;
  price?: string;
  vibe?: string;
  internetSpeed?: string;
  safetyRating?: string;
  avgWeather?: string;
  bestFor?: string;
}

export default function HubTemplatesPage() {
  const [templates, setTemplates] = useState<TripTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<RegionKey | 'all'>('all');
  const [pendingUpdates, setPendingUpdates] = useState<Map<string, TemplateUpdate>>(new Map());
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    try {
      setLoading(true);
      setError(null);
      const { apiUrl } = await import('@/lib/api');
      const url = apiUrl('trip-templates?enabled=true');
      
      console.log('[Hub] Loading templates from:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error('[Hub] Failed to load templates:', response.status);
        throw new Error('Failed to load templates');
      }
      
      const data = await response.json();
      console.log('[Hub] Loaded templates:', data.templates?.length || 0, 'templates');
      
      // Debug: Check which templates have isCurated
      const curated = data.templates?.filter((t: any) => t.isCurated) || [];
      console.log('[Hub] Curated templates:', curated.length);
      curated.forEach((t: any) => {
        console.log(`[Hub]   - ${t.name} (${t.id}): isCurated=${t.isCurated}, order=${t.curatedOrder}`);
      });
      
      setTemplates(data.templates || []);
    } catch (err: any) {
      console.error('[Hub] Load error:', err);
      setError(err.message || 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  }

  const filteredTemplates = templates.filter(t => 
    selectedRegion === 'all' || t.region === selectedRegion
  );

  const curatedTemplates = templates
    .filter(t => {
      const pending = pendingUpdates.get(t.id);
      return pending?.isCurated !== undefined ? pending.isCurated : t.isCurated;
    })
    .map(t => {
      const pending = pendingUpdates.get(t.id);
      return {
        ...t,
        ...pending,
        curatedOrder: pending?.curatedOrder ?? t.curatedOrder ?? 999,
      };
    })
    .sort((a, b) => (a.curatedOrder || 999) - (b.curatedOrder || 999))
    .slice(0, 4);

  function updateTemplate(template: TripTemplate, updates: Partial<TemplateUpdate>) {
    const current = pendingUpdates.get(template.id);
    const effective = getEffectiveValues(template);
    
    // When setting isCurated to true, ensure we also include curatedOrder
    if (updates.isCurated === true) {
      // If no order is being set and no order exists, assign the next available order
      if (!updates.curatedOrder && !effective.curatedOrder) {
        // Find the highest order among currently curated templates
        const curated = templates.filter(t => {
          const pending = pendingUpdates.get(t.id);
          return (pending?.isCurated ?? t.isCurated) && t.id !== template.id;
        });
        const maxOrder = Math.max(0, ...curated.map(t => {
          const pending = pendingUpdates.get(t.id);
          return pending?.curatedOrder ?? t.curatedOrder ?? 0;
        }));
        updates.curatedOrder = maxOrder + 1;
      } else if (!updates.curatedOrder) {
        // Preserve existing order
        updates.curatedOrder = effective.curatedOrder;
      }
    }
    
    // When setting isCurated to false, explicitly set curatedOrder to null (not undefined)
    // so it gets sent in the JSON payload and clears the field in the database
    if (updates.isCurated === false) {
      updates.curatedOrder = null as any; // null will be sent, undefined gets stripped by JSON.stringify
    }
    
    const newUpdates = new Map(pendingUpdates);
    newUpdates.set(template.id, {
      id: template.id,
      region: template.region as RegionKey,
      ...current,
      ...updates,
    });
    setPendingUpdates(newUpdates);
  }

  async function saveChanges() {
    if (pendingUpdates.size === 0) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const { apiUrl } = await import('@/lib/api');

      const updates = Array.from(pendingUpdates.values());
      
      console.log('[Hub] Saving updates:', updates);
      
      const results = await Promise.all(
        updates.map(async (update) => {
          console.log(`[Hub] Updating ${update.id} in region ${update.region}`);
          console.log('[Hub] Update payload:', update);
          
          const url = apiUrl(`trip-templates/${update.id}?region=${update.region}`);
          console.log('[Hub] PATCH URL:', url);
          console.log('[Hub] Request payload:', JSON.stringify(update, null, 2));
          
          const response = await fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(update),
          });

          console.log('[Hub] Response status:', response.status, response.statusText);
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`[Hub] Failed to update ${update.id}:`, response.status, errorData);
            throw new Error(`Failed to update ${update.id}: ${errorData.error || response.statusText}`);
          }
          
          const result = await response.json();
          console.log(`[Hub] Successfully updated ${update.id}:`, result);
          console.log(`[Hub] Template in response:`, JSON.stringify(result.template, null, 2));
          
          // Verify the update actually worked
          if (result.template) {
            console.log(`[Hub] Verification - isCurated: ${result.template.isCurated}, curatedOrder: ${result.template.curatedOrder}`);
          } else {
            console.warn(`[Hub] WARNING: Response missing template object!`, result);
          }
          
          return result;
        })
      );

      console.log('[Hub] All updates completed:', results);

      setSuccess(`Successfully updated ${updates.length} template(s)`);
      setPendingUpdates(new Map());
      
      console.log('[Hub] Reloading templates...');
      await loadTemplates();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('[Hub] Save error:', err);
      setError(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  }

  function getEffectiveValues(template: TripTemplate) {
    const pending = pendingUpdates.get(template.id);
    return {
      name: pending?.name ?? template.name,
      description: pending?.description ?? template.description,
      icon: pending?.icon ?? template.icon,
      imageUrl: pending?.imageUrl ?? template.imageUrl,
      story: pending?.story ?? template.story,
      tags: pending?.tags ?? template.tags ?? [],
      presetCities: pending?.presetCities ?? template.presetCities ?? [],
      isCurated: pending?.isCurated ?? template.isCurated ?? false,
      curatedOrder: pending?.curatedOrder ?? template.curatedOrder,
      curatedImageUrl: pending?.curatedImageUrl ?? template.curatedImageUrl,
      price: pending?.price ?? template.price ?? '',
      vibe: pending?.vibe ?? template.vibe ?? '',
      internetSpeed: pending?.internetSpeed ?? template.internetSpeed ?? '',
      safetyRating: pending?.safetyRating ?? template.safetyRating ?? '',
      avgWeather: pending?.avgWeather ?? template.avgWeather ?? '',
      bestFor: pending?.bestFor ?? template.bestFor ?? '',
    };
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#E86B32]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Trip Templates</h1>
          <p className="text-stone-600">
            Mark templates as curated to display them on the homepage
          </p>
        </div>
        {pendingUpdates.size > 0 && (
          <button
            onClick={saveChanges}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-[#E86B32] text-white font-semibold rounded-lg hover:bg-[#d55a24] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save {pendingUpdates.size} Change{pendingUpdates.size !== 1 ? 's' : ''}
              </>
            )}
          </button>
        )}
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Homepage Preview */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-[#E86B32]" />
          <h3 className="font-semibold text-stone-900">Homepage Preview</h3>
          <span className="text-sm text-stone-600">(Top 4 curated templates)</span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {curatedTemplates.map((template, idx) => {
            const effective = getEffectiveValues(template);
            return (
              <div key={template.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={effective.curatedImageUrl || effective.imageUrl}
                    alt={effective.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-[#E86B32] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {idx + 1}
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm text-stone-900 line-clamp-1">{effective.name}</p>
                  <p className="text-xs text-stone-500">{REGION_NAMES[template.region as RegionKey]}</p>
                  <div className="mt-2 text-xs text-stone-600">
                    <div className="flex items-center justify-between">
                      <span>{effective.price || 'No price'}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {curatedTemplates.length < 4 && Array.from({ length: 4 - curatedTemplates.length }).map((_, idx) => (
            <div key={`empty-${idx}`} className="bg-white rounded-lg border-2 border-dashed border-stone-300 aspect-[4/3] flex items-center justify-center">
              <p className="text-stone-400 text-sm">Empty Slot</p>
            </div>
          ))}
        </div>
      </div>

      {/* Region Filter */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-stone-700">Filter by Region:</span>
        <div className="flex gap-2">
          {['all', 'southeast-asia', 'latin-america', 'europe'].map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region as RegionKey | 'all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedRegion === region
                  ? 'bg-[#E86B32] text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {region === 'all' ? 'All Regions' : REGION_NAMES[region as RegionKey]}
            </button>
          ))}
        </div>
      </div>

      {/* Templates List */}
      <div className="space-y-4">
        {filteredTemplates.map((template) => {
          const effective = getEffectiveValues(template);
          const hasChanges = pendingUpdates.has(template.id);
          const isExpanded = expandedTemplate === template.id;

          return (
            <div
              key={template.id}
              className={`bg-white rounded-xl border-2 p-6 transition-all ${
                hasChanges ? 'border-orange-300 shadow-lg' : 'border-stone-200'
              }`}
            >
              <div className="flex gap-6 mb-4">
                {/* Template Image */}
                <div className="relative w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={effective.curatedImageUrl || effective.imageUrl}
                    alt={effective.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Template Basic Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={effective.name}
                        onChange={(e) => updateTemplate(template, { name: e.target.value })}
                        className="text-xl font-bold text-stone-900 w-full px-2 py-1 border border-transparent hover:border-stone-300 focus:border-[#E86B32] rounded outline-none transition-colors"
                      />
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-stone-100 text-stone-600 text-xs rounded-full">
                          {REGION_NAMES[template.region as RegionKey]}
                        </span>
                        <input
                          type="text"
                          value={effective.icon}
                          onChange={(e) => updateTemplate(template, { icon: e.target.value })}
                          placeholder="Icon (emoji)"
                          className="px-2 py-1 text-xs border border-stone-300 rounded focus:ring-2 focus:ring-[#E86B32] focus:border-transparent w-16"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedTemplate(isExpanded ? null : template.id)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  <textarea
                    value={effective.description}
                    onChange={(e) => updateTemplate(template, { description: e.target.value })}
                    rows={2}
                    className="text-stone-600 text-sm w-full px-2 py-1 border border-transparent hover:border-stone-300 focus:border-[#E86B32] rounded outline-none transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Curated Controls - Always Visible */}
              <div className="grid grid-cols-4 gap-4 pb-4 border-b border-stone-200">
                {/* Curated Toggle */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Curated Status</label>
                  <button
                    onClick={() => updateTemplate(template, { isCurated: !effective.isCurated })}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      effective.isCurated
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {effective.isCurated ? (
                      <>
                        <Check className="w-4 h-4" />
                        Curated
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4" />
                        Not Curated
                      </>
                    )}
                  </button>
                </div>

                {/* Display Order */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={effective.curatedOrder ?? ''}
                    onChange={(e) => updateTemplate(template, { curatedOrder: parseInt(e.target.value) || undefined })}
                    placeholder="e.g., 1"
                    disabled={!effective.isCurated}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#E86B32] focus:border-transparent disabled:bg-stone-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Price</label>
                  <input
                    type="text"
                    value={effective.price}
                    onChange={(e) => updateTemplate(template, { price: e.target.value })}
                    placeholder="e.g., R25,000/mo"
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#E86B32] focus:border-transparent"
                  />
                </div>

                {/* Vibe */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Vibe</label>
                  <input
                    type="text"
                    value={effective.vibe}
                    onChange={(e) => updateTemplate(template, { vibe: e.target.value })}
                    placeholder="e.g., Beach & Relaxation"
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#E86B32] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="mt-4 space-y-6 pt-4">
                  {/* Homepage Card Stats */}
                  <div>
                    <h4 className="font-semibold text-stone-900 mb-3">Homepage Card Stats</h4>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-700">Internet Speed</label>
                        <input
                          type="text"
                          value={effective.internetSpeed}
                          onChange={(e) => updateTemplate(template, { internetSpeed: e.target.value })}
                          placeholder="e.g., 50 Mbps"
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#E86B32] focus:border-transparent"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-700">Safety Rating</label>
                        <input
                          type="text"
                          value={effective.safetyRating}
                          onChange={(e) => updateTemplate(template, { safetyRating: e.target.value })}
                          placeholder="e.g., 4.5/5"
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#E86B32] focus:border-transparent"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-700">Avg Weather</label>
                        <input
                          type="text"
                          value={effective.avgWeather}
                          onChange={(e) => updateTemplate(template, { avgWeather: e.target.value })}
                          placeholder="e.g., 27°C"
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#E86B32] focus:border-transparent"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-700">Best For</label>
                        <input
                          type="text"
                          value={effective.bestFor}
                          onChange={(e) => updateTemplate(template, { bestFor: e.target.value })}
                          placeholder="e.g., Surfing & Cafes"
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#E86B32] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Images */}
                  <div>
                    <h4 className="font-semibold text-stone-900 mb-3">Images</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-700">Default Image URL</label>
                        <input
                          type="url"
                          value={effective.imageUrl}
                          onChange={(e) => updateTemplate(template, { imageUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#E86B32] focus:border-transparent"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-700">Homepage Image URL (Optional)</label>
                        <input
                          type="url"
                          value={effective.curatedImageUrl ?? ''}
                          onChange={(e) => updateTemplate(template, { curatedImageUrl: e.target.value })}
                          placeholder="https://... (optional custom image)"
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#E86B32] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Story */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Story / Journey Description</label>
                    <textarea
                      value={effective.story ?? ''}
                      onChange={(e) => updateTemplate(template, { story: e.target.value })}
                      rows={4}
                      placeholder="Narrative overview of the route..."
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#E86B32] focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Cities */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Preset Cities (comma-separated)</label>
                    <input
                      type="text"
                      value={effective.presetCities.join(', ')}
                      onChange={(e) => updateTemplate(template, { presetCities: e.target.value.split(',').map(c => c.trim()) })}
                      placeholder="e.g., Bali, Chiang Mai, Da Nang"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#E86B32] focus:border-transparent"
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={effective.tags.join(', ')}
                      onChange={(e) => updateTemplate(template, { tags: e.target.value.split(',').map(t => t.trim()) })}
                      placeholder="e.g., beach, nomad, affordable"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#E86B32] focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-600">No templates found</p>
        </div>
      )}
    </div>
  );
}
