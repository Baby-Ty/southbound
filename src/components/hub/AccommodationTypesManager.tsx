'use client';

import { useState } from 'react';
import { Plus, X, Bed, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import ImageSearch from './ImageSearch';

export interface AccommodationType {
  name: string;
  description: string;
  images: string[];
  amenities: string[];
}

interface AccommodationTypesManagerProps {
  accommodationTypes: { [key: string]: AccommodationType };
  onChange: (types: { [key: string]: AccommodationType }) => void;
}

const DEFAULT_AMENITIES = [
  'WiFi',
  'High-speed WiFi',
  'Shared kitchen',
  'Private kitchen',
  'Common areas',
  'Coworking space',
  'Laundry facilities',
  'Washing machine',
  'Workspace',
  'Daily cleaning',
  'Room service',
  'Gym access',
  'Concierge',
  'Social events',
  'Community events',
  'Networking',
  'Full privacy',
];

export default function AccommodationTypesManager({
  accommodationTypes = {},
  onChange,
}: AccommodationTypesManagerProps) {
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set(Object.keys(accommodationTypes)));

  const toggleExpanded = (type: string) => {
    setExpandedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const addType = () => {
    const newTypeName = `New Type ${Object.keys(accommodationTypes).length + 1}`;
    onChange({
      ...accommodationTypes,
      [newTypeName.toLowerCase().replace(/\s+/g, '-')]: {
        name: newTypeName,
        description: '',
        images: [],
        amenities: [],
      },
    });
    setExpandedTypes((prev) => new Set([...prev, newTypeName.toLowerCase().replace(/\s+/g, '-')]));
  };

  const removeType = (typeKey: string) => {
    if (!confirm(`Are you sure you want to remove ${accommodationTypes[typeKey]?.name}?`)) {
      return;
    }
    const updated = { ...accommodationTypes };
    delete updated[typeKey];
    onChange(updated);
  };

  const updateType = (typeKey: string, updates: Partial<AccommodationType>) => {
    onChange({
      ...accommodationTypes,
      [typeKey]: {
        ...accommodationTypes[typeKey],
        ...updates,
      },
    });
  };

  const addImage = (typeKey: string, imageUrl: string) => {
    const type = accommodationTypes[typeKey];
    if (!type) return;
    updateType(typeKey, {
      images: [...type.images, imageUrl],
    });
  };

  const removeImage = (typeKey: string, imageIndex: number) => {
    const type = accommodationTypes[typeKey];
    if (!type) return;
    updateType(typeKey, {
      images: type.images.filter((_, i) => i !== imageIndex),
    });
  };

  const toggleAmenity = (typeKey: string, amenity: string) => {
    const type = accommodationTypes[typeKey];
    if (!type) return;
    const amenities = type.amenities.includes(amenity)
      ? type.amenities.filter((a) => a !== amenity)
      : [...type.amenities, amenity];
    updateType(typeKey, { amenities });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-stone-900">Accommodation Types</h3>
          <p className="text-sm text-stone-500">Configure accommodation options for this city</p>
        </div>
        <button
          type="button"
          onClick={addType}
          className="flex items-center gap-2 px-4 py-2 bg-sb-orange-500 text-white rounded-lg hover:bg-sb-orange-600 transition"
        >
          <Plus className="w-4 h-4" />
          Add Type
        </button>
      </div>

      {Object.keys(accommodationTypes).length === 0 ? (
        <div className="text-center py-12 bg-stone-50 rounded-lg border border-stone-200">
          <Bed className="w-12 h-12 mx-auto mb-3 text-stone-400" />
          <p className="text-stone-500 mb-4">No accommodation types configured</p>
          <button
            type="button"
            onClick={addType}
            className="px-4 py-2 bg-sb-orange-500 text-white rounded-lg hover:bg-sb-orange-600 transition"
          >
            Add First Type
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(accommodationTypes).map(([typeKey, type]) => (
            <div key={typeKey} className="border border-stone-200 rounded-xl overflow-hidden">
              {/* Header */}
              <div className="bg-stone-50 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bed className="w-5 h-5 text-sb-orange-500" />
                  <input
                    type="text"
                    value={type.name}
                    onChange={(e) => updateType(typeKey, { name: e.target.value })}
                    className="text-lg font-bold text-stone-900 bg-transparent border-none focus:ring-0 p-0"
                    placeholder="Accommodation type name"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleExpanded(typeKey)}
                    className="p-2 hover:bg-stone-200 rounded-lg transition"
                  >
                    {expandedTypes.has(typeKey) ? (
                      <ChevronUp className="w-4 h-4 text-stone-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-600" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeType(typeKey)}
                    className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedTypes.has(typeKey) && (
                <div className="p-4 space-y-4">
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                    <textarea
                      value={type.description}
                      onChange={(e) => updateType(typeKey, { description: e.target.value })}
                      placeholder="Describe what travelers can expect from this accommodation type..."
                      rows={3}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent"
                    />
                  </div>

                  {/* Images */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Images</label>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      {type.images.map((imageUrl, idx) => (
                        <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-stone-200 group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imageUrl}
                            alt={`${type.name} ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(typeKey, idx)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <ImageSearch
                      currentImage={undefined}
                      onSelect={(url) => addImage(typeKey, url)}
                      cityName={type.name}
                    />
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Amenities</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {DEFAULT_AMENITIES.map((amenity) => (
                        <label
                          key={amenity}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-stone-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={type.amenities.includes(amenity)}
                            onChange={() => toggleAmenity(typeKey, amenity)}
                            className="w-4 h-4 text-sb-orange-500 rounded"
                          />
                          <span className="text-sm text-stone-700">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

